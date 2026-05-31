---
type: community
cohesion: 0.14
members: 15
---

# Roadmap UI Components

**Cohesion:** 0.14 - loosely connected
**Members:** 15 nodes

## Members
- [[App.tsx]] - code - src/App.tsx
- [[DeliverableList.tsx]] - code - src/components/DeliverableList.tsx
- [[NotebooklmMapProvider()]] - code - src/App.tsx
- [[RoadmapTree.tsx]] - code - src/components/RoadmapTree.tsx
- [[SearchBar.tsx]] - code - src/components/SearchBar.tsx
- [[Skeleton()]] - code - src/App.tsx
- [[TrackSelector.tsx]] - code - src/components/TrackSelector.tsx
- [[buildRoadmapNodes()]] - code - src/App.tsx
- [[computeProgress()]] - code - src/components/RoadmapTree.tsx
- [[difficultyClass()]] - code - src/components/RoadmapTree.tsx
- [[formatPercent()]] - code - src/components/RoadmapTree.tsx
- [[handleToggle()]] - code - src/components/DeliverableList.tsx
- [[highlight()]] - code - src/components/SearchBar.tsx
- [[useDebouncedValue()]] - code - src/components/SearchBar.tsx
- [[useProgress.ts]] - code - src/lib/useProgress.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Roadmap_UI_Components
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Gamification Components]]
- 1 edge to [[_COMMUNITY_Dark Mode]]
- 1 edge to [[_COMMUNITY_NotebookLM Components]]

## Top bridge nodes
- [[App.tsx]] - degree 12, connects to 3 communities
- [[DeliverableList.tsx]] - degree 3, connects to 1 community