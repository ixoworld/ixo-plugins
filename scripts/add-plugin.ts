#!/usr/bin/env bun
/** Add or refresh one explicit plugin spec, then publish the complete rendered snapshot. */
import { parseArgs } from "node:util";
import {
  listKinds, loadKind, loadSpecs, publishGenerated, render, renderAll, serializeSpecs,
  type PluginSpec,
} from "./plugin-generation.ts";

export type MainOptions = { fixedKind?: string; command?: string };

export function main(argv: string[], opts: MainOptions = {}): void {
  const command = opts.command ?? "bun run add-plugin";
  const kinds = listKinds();
  const usage = `usage: ${command} ${opts.fixedKind ? "" : `[--kind <${kinds.join("|")}>] `}--name <plugin-name> --title <title> [--url <endpoint> | --package <name> --major <version> --network <name>] [--server <name>] [--pinned true] [--description <text>] [--version x.y.z]`;
  try {
    const { values } = parseArgs({
      args: argv,
      options: {
        ...(opts.fixedKind ? {} : { kind: { type: "string" as const } }),
        name: { type: "string" }, title: { type: "string" }, url: { type: "string" },
        package: { type: "string" }, major: { type: "string" }, network: { type: "string" },
        server: { type: "string" }, pinned: { type: "string" },
        description: { type: "string" }, version: { type: "string" },
      },
    });
    if (!values.name || !values.title) throw new Error(`--name and --title are required\n${usage}`);
    if (values.pinned !== undefined && values.pinned !== "true") throw new Error("--pinned must be true");
    const current = loadSpecs();
    const previous = current.plugins.find((plugin) => plugin.name === values.name);
    const kindName = opts.fixedKind ?? values.kind ?? previous?.kind ?? "oracle";
    if (!kinds.includes(kindName)) throw new Error(`--kind must be one of ${kinds.join(", ")}`);
    if (previous && previous.kind !== kindName) throw new Error(`${values.name} is already kind ${previous.kind}; remove its spec first to change kind`);
    const kind = loadKind(kindName);
    const spec: PluginSpec = {
      ...(previous ?? {}), name: values.name, kind: kindName, title: values.title,
      version: values.version ?? previous?.version ?? "0.1.0",
      description: values.description ?? previous?.description ?? "",
    };
    for (const key of ["url", "package", "major", "network", "server"] as const) {
      if (values[key] !== undefined) spec[key] = values[key];
    }
    if (values.pinned !== undefined) spec.pinned = true;
    if (!spec.description) {
      const flags = Object.fromEntries(["url", "package", "major", "network"].filter((key) => spec[key as keyof PluginSpec] !== undefined).map((key) => [key.toUpperCase(), spec[key as keyof PluginSpec] as string]));
      spec.description = render(kind.description, { NAME: spec.name, TITLE: spec.title, SERVER: spec.server ?? spec.name, ...flags }, `template/${kind.name}/kind.json description`);
    }
    const next = {
      renames: current.renames,
      plugins: [...current.plugins.filter((plugin) => plugin.name !== spec.name), spec].sort((a, b) => a.name.localeCompare(b.name)),
    };
    const outputs = renderAll(next); // Validation and rendering have no writes.
    outputs.set("plugin-specs.json", Buffer.from(serializeSpecs(next)));
    publishGenerated(outputs);
    console.log(`✓ plugins/${spec.name} (${kind.name})`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (import.meta.main) main(process.argv.slice(2));
