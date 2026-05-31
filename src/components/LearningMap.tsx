import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { csAiTrack, awsMlaTrack, englishTrack, mandarinTrack, projectsTrack } from '../tracks'

type Node = {
  id: string
  label: string
  trackId: string
  trackColor: string
  completed: boolean
  x: number
  y: number
}

type Edge = {
  from: string
  to: string
}

// Simple Fruchterman-Reingold force-directed layout
function layoutGraph(nodes: Node[], edges: Edge[], width: number, height: number) {
  const area = width * height
  const k = Math.sqrt(area / nodes.length)
  const iterations = 50
  const dt = 0.1

  // Initialize positions in a circle
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length
    n.x = width / 2 + 200 * Math.cos(angle)
    n.y = height / 2 + 200 * Math.sin(angle)
  })

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion
    nodes.forEach((n1) => {
      nodes.forEach((n2) => {
        if (n1 === n2) return
        const dx = n1.x - n2.x
        const dy = n1.y - n2.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = k * k / dist
        n1.x += (dx / dist) * force * dt
        n1.y += (dy / dist) * force * dt
      })
    })

    // Attraction (edges)
    edges.forEach((e) => {
      const from = nodes.find((n) => n.id === e.from)
      const to = nodes.find((n) => n.id === e.to)
      if (!from || !to) return
      const dx = to.x - from.x
      const dy = to.y - from.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = (dist * dist) / k
      from.x += (dx / dist) * force * dt * 0.5
      from.y += (dy / dist) * force * dt * 0.5
      to.x -= (dx / dist) * force * dt * 0.5
      to.y -= (dy / dist) * force * dt * 0.5
    })

    // Keep in bounds
    nodes.forEach((n) => {
      n.x = Math.max(30, Math.min(width - 30, n.x))
      n.y = Math.max(30, Math.min(height - 30, n.y))
    })
  }
}

const TRACK_COLORS: Record<string, string> = {
  'cs-ai': '#818cf8',
  'aws-mla': '#f59e0b',
  'english': '#3b82f6',
  'mandarin': '#ef4444',
  'projects': '#10b981',
}

export default function LearningMap() {
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  const { nodes, edges } = useMemo(() => {
    const allTracks = [csAiTrack, awsMlaTrack, englishTrack, mandarinTrack, projectsTrack]
    const nodeList: Node[] = []
    const edgeList: Edge[] = []

    allTracks.forEach((track) => {
      track.phases.forEach((phase) => {
        phase.modules.forEach((mod) => {
          nodeList.push({
            id: mod.id,
            label: mod.title,
            trackId: track.id,
            trackColor: TRACK_COLORS[track.id] || '#6b7280',
            completed: false, // Would check progress
            x: 0,
            y: 0,
          })

          if (mod.requires) {
            mod.requires.forEach((reqId) => {
              edgeList.push({ from: reqId, to: mod.id })
            })
          }
        })
      })
    })

    return { nodes: nodeList, edges: edgeList }
  }, [])

  const layoutResult = useMemo(() => {
    const copy = nodes.map((n) => ({ ...n, x: 0, y: 0 }))
    layoutGraph(copy, edges, dimensions.width, dimensions.height)
    return copy
  }, [nodes, edges, dimensions])

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setDimensions({ width: rect.width || 1200, height: 600 })
    }
  }, [])

  const handleNodeClick = (nodeId: string) => {
    // Navigate to module if it's a cs-ai module (has MDX page)
    if (nodeId.includes('-')) {
      navigate(`/roadmap/${nodeId}`)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Learning Map
      </h3>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="min-w-[800px]"
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = layoutResult.find((n) => n.id === edge.from)
          const to = layoutResult.find((n) => n.id === edge.to)
          if (!from || !to) return null
          return (
            <line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray={to.completed ? undefined : '4 4'}
            />
          )
        })}

        {/* Nodes */}
        {layoutResult.map((node) => (
          <g
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className="cursor-pointer"
            transform={`translate(${node.x}, ${node.y})`}
          >
            <circle
              r="20"
              fill={node.completed ? node.trackColor : '#f1f5f9'}
              stroke={node.trackColor}
              strokeWidth="2"
              opacity={node.completed ? 1 : 0.6}
            />
            <text
              x="0"
              y="35"
              textAnchor="middle"
              fontSize="10"
              fill="#334155"
              className="dark:fill-slate-300"
            >
              {node.label.slice(0, 15)}
              {node.label.length > 15 ? '...' : ''}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        {Object.entries(TRACK_COLORS).map(([trackId, color]) => {
          const track = [csAiTrack, awsMlaTrack, englishTrack, mandarinTrack, projectsTrack].find(
            (t) => t.id === trackId
          )
          return (
            <div key={trackId} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-slate-600 dark:text-slate-400">{track?.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
