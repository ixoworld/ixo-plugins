# LinkedIn → Openhands profiles

Ask your local agent: **“Create my Openhands profile from my LinkedIn connection through IXO.”**
The existing personal Openhands plugin (`ixo-openhands` or `ixo-openhands-test`) handles it;
the HQ variants include the same personal-profile skill. No extra MCP server or Composio key is
installed. Claude Code, Codex and other clients running the local MCP package use the same tools.

The agent connects your Openhands account, gives you a private browser link, and waits while you
sign in with that IXO account. Your browser reads your personal LinkedIn connection through IXO's
Composio worker. You choose which fields to share, then review the complete public page in your
chat before approving publication. Import approval and publication approval are separate.

Only a draft and a signature over that draft reach the local assistant. IXO's signing key,
Composio bearer, LinkedIn credentials, email address and upstream account identifiers stay out
of the assistant conversation. The handoff is held in memory for ten minutes and is consumed
once. Open the browser link on the computer running the assistant. A browser may ask permission
to reach the local assistant; allow that request for the Openhands site if you want to continue.

The browser uses the existing `ixo:composio:personal:<userDid>` scope. Domain connections and
connections owned by a different agent are separate tenants and are not silently reused. With
no personal LinkedIn connection, connect one in IXO Portal's personal integrations first.
Subscription, connection, permission and upstream failures are reported; they do not trigger
scraping or a fallback to a broader credential.

LinkedIn's basic profile response may contain only a name and photo. Work history, education,
skills and other missing fields come from you. Importing LinkedIn does not verify those claims.
The draft explicitly excludes email and private account information.

## Release dependency

This skill requires an Openhands MCP release exposing `import_linkedin_profile`, `my_page` and
`set_my_page`, plus the matching Openhands website import page, profiles API, worker, and database
migrations. Merge this plugin update after those changes are released to the corresponding
network. The manifests retain the existing package channels (`@1` on live; `@dev` on test).
Updating the skill alone does not deploy or publish any backend. An older server is handled as
an unavailable capability, with a user-supplied CV as the optional alternative.

Plain hosted web connectors remain read-only. Use a client that can run the local Openhands
MCP server for this workflow.
