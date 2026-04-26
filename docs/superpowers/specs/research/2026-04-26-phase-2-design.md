# Phase 2 (Design) Tooling Research

Research date: 2026-04-26. Audience: solo PM, Next.js 16 + React 19 + Tailwind v4 + shadcn portfolio. Inclusion filter: >=100 stars OR endorsed author OR active in last 90 days.

## Summary table

| Tool | Type | Sub-section | Source |
| --- | --- | --- | --- |
| frontend-design (Anthropic) | Plugin | 2.1 | claude-plugins-official |
| 21st.dev Magic MCP | MCP server | 2.1 | github.com/21st-dev/magic-mcp |
| shadcn/ui Registry MCP (Jpisnice) | MCP server | 2.1 | github.com/Jpisnice/shadcn-ui-mcp-server |
| Figma Dev Mode MCP | MCP server | 2.1 | figma.com (official) |
| Magic Patterns MCP | MCP server | 2.1 | claude.com/connectors/magic-patterns |
| Owl-Listener designer-skills | Skills bundle | 2.1 + 2.2 | github.com/Owl-Listener/designer-skills |
| wshobson/agents (c4-architecture, technical-designer, ui-spec-designer, conductor) | Plugin marketplace | 2.2 (and 2.1) | github.com/wshobson/agents |
| Magic UI MCP | MCP server | 2.1 | github.com/magicuidesign/magicui |

---

## 2.1 UI/UX & Prototyping

### frontend-design (already in user's marketplace)
- Source: `anthropics/claude-plugins-official` -> `plugins/frontend-design`
- Type: Plugin (skill)
- Why it fits: Authored by Anthropic (Prithvi Rajasekaran, Alexander Bricken). Reportedly 277k+ installs. Forces distinctive aesthetic choices, typography, palettes, animations - antidote to "generic AI look" for a portfolio.
- Install: `/plugin install frontend-design@claude-plugins-official`

### 21st.dev Magic MCP
- Source: https://github.com/21st-dev/magic-mcp (4,791 stars, active Feb 2026)
- Type: MCP server
- Why it fits: "v0 in your IDE" - generates production React/Tailwind components inline via `/ui ...`, refines existing components, fetches logos. Clean fit with shadcn + Tailwind v4 stack.
- Install: `npx @21st-dev/cli@latest install claude --api-key <KEY>`

### shadcn/ui Registry MCP (Jpisnice)
- Source: https://github.com/Jpisnice/shadcn-ui-mcp-server (2,752 stars, active Mar 2026)
- Type: MCP server
- Why it fits: Live, authoritative shadcn v4 component/blocks/demos context so Claude stops hallucinating component APIs. Direct match for the user's shadcn-style component goal.
- Install: `claude mcp add shadcn -- bunx -y @jpisnice/shadcn-ui-mcp-server --github-api-key <GH_TOKEN>`

### Figma Dev Mode MCP (official)
- Source: https://github.com/figma/mcp-server-guide (1,255 stars, active Apr 2026); docs at developers.figma.com/docs/figma-mcp-server/
- Type: MCP server (remote + desktop variants)
- Why it fits: Bidirectional - turn Figma frames into Next.js code, push live web UI back to Figma as editable layers. Worth installing only if the PM actually mocks in Figma; otherwise skip.
- Install: Remote URL `https://mcp.figma.com/mcp` via `claude mcp add --transport http figma https://mcp.figma.com/mcp`

### Magic Patterns MCP
- Source: https://claude.com/connectors/magic-patterns ; docs https://www.magicpatterns.com/docs/documentation/features/mcp-server/overview
- Type: MCP server (hosted connector)
- Why it fits: Visual prototyping tool that emits React/Tailwind. Claude Code can read prototypes via MCP, diff vs codebase, and apply changes - good rapid wireframe-to-code loop without leaving CC.
- Install: Add as Claude.ai connector; or `claude mcp add` with the hosted URL from Magic Patterns dashboard.

### Magic UI MCP
- Source: https://github.com/magicuidesign/magicui (20,808 stars, active Apr 2026)
- Type: MCP server (component library exposed over MCP)
- Why it fits: 150+ animated React + Tailwind components (marquees, blur fades, beams). Adds polish primitives a portfolio benefits from; complements shadcn rather than competing.
- Install: Per Magic UI docs - `npx magicui-cli@latest mcp install claude`

---

## 2.2 Architecture, Technical Requirements & Specs

### wshobson/agents
- Source: https://github.com/wshobson/agents (34,309 stars, active Apr 2026)
- Type: Plugin marketplace (78 plugins, 184 agents, 150 skills)
- Why it fits: Includes `c4-architecture` plugin (C4 context/container/component diagrams in Mermaid), `backend-architect`, `technical-designer` (testable specs with acceptance criteria), `ui-spec-designer`, `conductor` (planner -> executor -> reviewer phases). Direct complement to `superpowers:brainstorming` - brainstorming surfaces intent, these author the spec artifacts.
- Install: `/plugin marketplace add wshobson/agents` then `/plugin install c4-architecture` (and `technical-designer`, `conductor` as desired).

### Owl-Listener designer-skills (cross-cuts 2.1 and 2.2)
- Source: https://github.com/Owl-Listener/designer-skills (808 stars, active Mar 2026)
- Type: Skills bundle (63 skills, 27 commands, 8 plugins) by MC Dean
- Why it fits: Covers full design cycle - design-research, ux-strategy, design-systems, ui-design, interaction-design, prototyping-testing, design-ops. Useful for both wireframing/IA (2.1) and design-spec/handoff artifacts (2.2).
- Install: Clone repo or `/plugin marketplace add Owl-Listener/designer-skills` then install desired sub-plugin(s).

### Gaps
- No standout, individually packaged ADR-only plugin meets the inclusion filter as a standalone (the available ADR skills are mostly inside larger bundles like wshobson/agents or the ar-claude-skills collection). Recommend using wshobson's `technical-designer` + a manual ADR template rather than chasing a dedicated ADR plugin.
- v0.dev official MCP exists (https://mcp.v0.dev) but the third-party `hellolucky/v0-mcp` wrapper has only 17 stars and was last touched in 2025; if v0 is desired, point Claude Code at the official v0 MCP endpoint directly with a Vercel API key rather than the wrapper.
