#!/usr/bin/env bun
/**
 * Add (or refresh) one oracle's plugin — kept for existing docs and habits. It is exactly
 * `bun run add-plugin --kind oracle …` (see scripts/add-plugin.ts), with the same flags:
 *
 *   bun run add-oracle --name ixo-swiftdrop-devnet --title "SwiftDrop Express (devnet)" \
 *     --url https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp \
 *     --description "Proof of delivery for SwiftDrop couriers — devnet"
 */
import { main } from "./add-plugin.ts";

main(process.argv.slice(2), { fixedKind: "oracle", command: "bun run add-oracle" });
