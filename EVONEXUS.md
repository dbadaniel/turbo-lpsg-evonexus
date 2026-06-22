# Turbo LPSG for EvoNexus

This fork packages the Turbo Academy LPSG method as an EvoNexus plugin.

## Install

Install from the EvoNexus Plugins page using:

```text
github:dbadaniel/turbo-lpsg-evonexus@feat/evonexus-plugin
```

The first release installs knowledge resources only: namespaced agents and
skills. It does not configure MCP servers or external credentials.

## Rebuild from upstream artifacts

After updating the ZIPs under `artifacts/`, run:

```bash
python scripts/build_evonexus_plugin.py
```

The build normalizes agent frontmatter, retains only bundled skill references,
and rewrites those references to the namespace used by EvoNexus.

## Licensing

Code is MIT. Method content remains CC BY-NC-SA 4.0 and requires attribution.
Commercial redistribution requires permission from Turbo Academy.
