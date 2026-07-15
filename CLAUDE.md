## Deployment

`git push` to GitHub does **not** update the live site. Production is a separate
Hetzner VPS (`65.21.176.223`) with its own git checkout that builds and serves
`dist/` via Nginx; an auto-deploy cron job there polls `origin/main` every 2
minutes and only rebuilds/reloads when it sees a new commit. Read
[deploy/README.md](deploy/README.md) before touching anything deploy-related
(manual deploy steps, the auto-deploy mechanism, and known failure modes are
all documented there) - don't assume a push has shipped, and don't SSH in and
improvise a fix without checking it first.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Token-efficient knowledge workflow

- Use `graphify query "..." --budget 1200`, `graphify path`, or `graphify explain` before broad source reads.
- Read only bounded ranges and cited files. Do not load graph JSON, reports, generated files, or the entire vault wholesale.
- For the external Obsidian vault, read `wiki/hot.md` → `wiki/index.md` → 1–3 relevant pages.
- Use Obsidian for project decisions, research, requirements, and cross-project context. Use Graphify for code questions.
- During a multi-file edit, refresh Graphify once after the edit set stabilizes with `graphify update . --no-cluster`.
- See `docs/knowledge-workflow.md` for the bridge path and privacy boundaries.
