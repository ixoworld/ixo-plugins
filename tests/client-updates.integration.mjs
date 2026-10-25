// Optional smoke test against real installed client CLIs. All homes and Git sources are temporary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const script = fileURLToPath(new URL("../plugins/ixo-plugin-updates/scripts/update.mjs", import.meta.url));

async function skillContents(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await skillContents(path));
    else if (entry.name === "SKILL.md") found.push(await readFile(path, "utf8"));
  }
  return found;
}

for (const client of ["claude", "codex"]) {
  test(`${client}: native update replaces installed skills and preserves enablement`, { timeout: 90_000 }, async (t) => {
    const root = await mkdtemp(join(tmpdir(), `ixo-${client}-smoke-`));
    t.after(() => rm(root, { recursive: true, force: true }));
    const repo = join(root, "source.git");
    const cwd = join(root, "work");
    await mkdir(repo);
    await mkdir(cwd);
    const env = {
      ...process.env,
      CODEX_HOME: join(root, "codex"),
      CLAUDE_CONFIG_DIR: join(root, "claude"),
      IXO_PLUGIN_AUTO_UPDATE: "1",
      DISABLE_AUTOUPDATER: "0",
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
      GIT_TERMINAL_PROMPT: "0",
    };
    await mkdir(env.CODEX_HOME);
    await mkdir(env.CLAUDE_CONFIG_DIR);
    const run = (program, args, work = cwd) => exec(program, args, { cwd: work, env, timeout: 45_000 });
    const git = (...args) => run("git", args, repo);
    const put = async (path, data) => {
      const target = join(repo, path);
      await mkdir(resolve(target, ".."), { recursive: true });
      await writeFile(target, typeof data === "string" ? data : JSON.stringify(data));
    };
    await git("init", "--initial-branch=main");
    await git("config", "user.name", "IXO updater test");
    await git("config", "user.email", "updater-test@example.invalid");
    const plugins = ["fixture", "foreign", "uninstalled"].map(name => ({ name, source: `./plugins/${name}` }));
    await put(".claude-plugin/marketplace.json", { name: "ixo-plugins", owner: { name: "IXO test" }, plugins });
    await put(".agents/plugins/marketplace.json", {
      name: "ixo-plugins", plugins: plugins.map(p => ({ ...p, policy: { installation: "AVAILABLE", authentication: "ON_USE" }, category: "Productivity" })),
    });
    const release = async (version) => {
      for (const { name } of plugins) {
        const manifest = { name, version, description: "Temporary updater fixture" };
        await put(`plugins/${name}/.claude-plugin/plugin.json`, manifest);
        await put(`plugins/${name}/plugin.json`, { $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", ...manifest });
        await put(`plugins/${name}/skills/example/SKILL.md`, `---\nname: example\ndescription: Temporary fixture\n---\n\n${name} release ${version}\n`);
      }
      await git("add", ".");
      await git("commit", "-m", `Fixture ${version}`);
      await git("update-server-info");
    };
    await release("0.1.0");
    // Real smart Git HTTP transport, including Claude's shallow clone, entirely on localhost.
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, "http://localhost");
      const requestPath = url.pathname;
      if (!requestPath.startsWith("/source.git/")) { res.writeHead(404).end(); return; }
      const child = spawn("git", ["http-backend"], { env: {
        ...env,
        GIT_PROJECT_ROOT: root,
        GIT_HTTP_EXPORT_ALL: "1",
        PATH_INFO: `/source.git/.git${requestPath.slice("/source.git".length)}`,
        QUERY_STRING: url.search.slice(1),
        REQUEST_METHOD: req.method,
        CONTENT_TYPE: req.headers["content-type"] || "",
        CONTENT_LENGTH: req.headers["content-length"] || "",
      } });
      req.pipe(child.stdin);
      child.stderr.resume();
      const chunks = [];
      child.stdout.on("data", chunk => chunks.push(chunk));
      child.on("error", () => res.writeHead(500).end());
      child.on("close", () => {
        const output = Buffer.concat(chunks);
        const end = output.indexOf("\r\n\r\n");
        if (end < 0) { res.writeHead(500).end(); return; }
        for (const line of output.subarray(0, end).toString().split("\r\n")) {
          const index = line.indexOf(":");
          const key = line.slice(0, index), value = line.slice(index + 1).trim();
          if (key.toLowerCase() === "status") res.statusCode = Number(value.split(" ")[0]);
          else res.setHeader(key, value);
        }
        res.end(output.subarray(end + 4));
      });
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const source = `http://127.0.0.1:${server.address().port}/source.git`;
    await run(client, ["plugin", "marketplace", "add", source]);
    await run(client, ["plugin", client === "claude" ? "install" : "add", "fixture@ixo-plugins"]);
    if (client === "claude") {
      await run(client, ["plugin", "install", "fixture@ixo-plugins", "--scope", "project"]);
      const otherProject = join(root, "other-project");
      await mkdir(otherProject);
      await run(client, ["plugin", "install", "foreign@ixo-plugins", "--scope", "project"], otherProject);
    }
    const home = client === "codex" ? env.CODEX_HOME : env.CLAUDE_CONFIG_DIR;
    const cache = join(home, "plugins", "cache", "ixo-plugins");
    assert.ok((await skillContents(cache)).some(s => s.includes("fixture release 0.1.0")));
    if (client === "claude") await run(client, ["plugin", "disable", "fixture@ixo-plugins", "--scope", "user"]);
    else {
      const config = join(home, "config.toml");
      await writeFile(config, (await readFile(config, "utf8")).replace("enabled = true", "enabled = false"));
    }
    const configPath = join(home, client === "claude" ? "settings.json" : "config.toml");
    const before = await readFile(configPath, "utf8");
    const projectBefore = client === "claude" ? await readFile(join(cwd, ".claude", "settings.json"), "utf8") : null;
    await release("0.2.0");
    const result = await run(process.execPath, [script, "--client", client, "--now"]);
    assert.equal(JSON.parse(result.stdout).status, "checked");
    const skills = await skillContents(cache);
    assert.ok(skills.some(s => s.includes("fixture release 0.2.0")), `installed plugin must get the new skill: ${client === "claude" ? (await run(client, ["plugin", "list", "--json"])).stdout : skills}`);
    assert.ok(skills.every(s => !s.includes("uninstalled release")), "available plugins must remain uninstalled");
    const after = await readFile(configPath, "utf8");
    if (client === "claude") {
      assert.deepEqual(JSON.parse(after).enabledPlugins, JSON.parse(before).enabledPlugins);
      assert.equal(await readFile(join(cwd, ".claude", "settings.json"), "utf8"), projectBefore);
      const listing = JSON.parse((await run(client, ["plugin", "list", "--json"])).stdout);
      assert.ok(listing.every(p => p.version === "0.2.0"), "all installed scopes should get the release");
      assert.equal(listing.length, 3, "must preserve the exact set of installed scopes");
    }
    else assert.ok(after.includes("enabled = false"), `${before}\n->\n${after}`);
  });
}
