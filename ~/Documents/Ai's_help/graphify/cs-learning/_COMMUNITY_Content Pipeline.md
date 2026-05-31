---
type: community
cohesion: 0.20
members: 10
---

# Content Pipeline

**Cohesion:** 0.20 - loosely connected
**Members:** 10 nodes

## Members
- [[Content Pipeline]] - pipeline - CLAUDE.md
- [[MDX Processing Pipeline]] - pipeline - CLAUDE.md
- [[import.meta.glob]] - code-feature - CLAUDE.md
- [[parseFrontmatter]] - function - CLAUDE.md
- [[remarkFrontmatter]] - remark-plugin - CLAUDE.md
- [[remarkGfm]] - remark-plugin - CLAUDE.md
- [[remarkMdxFrontmatter]] - remark-plugin - CLAUDE.md
- [[remarkWikiLinks]] - remark-plugin - CLAUDE.md
- [[srccontentindex.ts]] - source-code - CLAUDE.md
- [[virtualmdx-raw]] - vite-plugin - CLAUDE.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Content_Pipeline
SORT file.name ASC
```
