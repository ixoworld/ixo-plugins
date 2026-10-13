# SwiftDrop Express (devnet)

Proof of delivery for SwiftDrop Express couriers, decided by IXO's independent engine — devnet (test network).

- MCP server: `ixo-shipment-delivery` → https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp
- Sign-in: IXO (no API key). Every charge needs your approval on IXO.
- Skills: `submit-claim`, `verify-decision`, `can-we-pay` (never pays).

## Install

Claude Code, one step:

```text
/plugin install ixo-swiftdrop-devnet --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install ixo-swiftdrop-devnet@ixo-plugins`.

For other clients, see the [repository README](../../README.md).
