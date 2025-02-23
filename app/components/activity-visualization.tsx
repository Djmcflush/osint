"use client"

import { useEffect, useState, useRef } from "react"
import { Settings } from "lucide-react"

const LANES = 8
const MAX_SEGMENTS = 200
const SEGMENT_CHANCE = 0.2 // Increased chance for more activity

interface Segment {
  x: number
  y: number // Changed to absolute y position
  height: number
  intensity: number
  baseColor: string
  fadeSpeed: number // Added for varying fade speeds
}

const LANE_COLORS = [
  { r: 0,   g: 242, b: 255 },  // bright aqua
  { r: 255, g: 107, b: 153 },  // bright pink
  { r: 255, g: 140, b: 0 },    // bright orange
  { r: 255, g: 93,  b: 226 },  // bright magenta
  { r: 255, g: 196, b: 0 },    // bright yellow
  { r: 126, g: 255, b: 0 },    // bright green
  { r: 183, g: 107, b: 255 },  // bright purple
  { r: 98,  g: 182, b: 255 },  // bright blue
]

function interpolateColor(baseColor: (typeof LANE_COLORS)[0], intensity: number) {
  const r = Math.round(255 - (255 - baseColor.r) * intensity)
  const g = Math.round(255 - (255 - baseColor.g) * intensity)
  const b = Math.round(255 - (255 - baseColor.b) * intensity)
  return `rgb(${r}, ${g}, ${b})`
}

interface ActivityVisualizationProps {
  dataPoints?: number[];
}

export default function ActivityVisualization({ dataPoints }: ActivityVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lanes, setLanes] = useState<Segment[][]>(Array(LANES).fill([]))
  const [speed, setSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const laneWidth = canvas.offsetWidth / LANES
    const segmentWidth = laneWidth * 0.4

    const animate = () => {
      ctx.fillStyle = "#060809"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      setLanes((prevLanes) =>
        prevLanes.map((lane, laneIndex) => {
          // Add new segments randomly along the height
          if (Math.random() < SEGMENT_CHANCE && lane.length < MAX_SEGMENTS) {
            lane.push({
              x: laneIndex * laneWidth + (laneWidth - segmentWidth) / 2,
              y: Math.random() * canvas.offsetHeight, // Random vertical position
              height: Math.random() * 15 + 5,
              intensity: Math.random() * 0.3 + 0.7,
              baseColor: interpolateColor(LANE_COLORS[laneIndex], Math.random()),
              fadeSpeed: Math.random() * 0.03 + 0.02, // Random fade speed
            })
          }

          // Update existing segments
          return lane
            .map((segment) => ({
              ...segment,
              y: (segment.y + speed) % canvas.offsetHeight, // Move vertically based on speed
              intensity: segment.intensity - segment.fadeSpeed * speed,
            }))
            .filter((segment) => segment.intensity > 0.1)
        }),
      )

      // Draw lanes
      lanes.forEach((lane, laneIndex) => {
        const laneX = laneIndex * laneWidth + (laneWidth - segmentWidth) / 2

        // Draw active segments
        lane.forEach((segment) => {
          const color = interpolateColor(LANE_COLORS[laneIndex], segment.intensity)

          ctx.shadowColor = color
          ctx.shadowBlur = 15
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0

          ctx.fillStyle = color
          ctx.fillRect(segment.x, segment.y, segmentWidth, segment.height)
        })
      })

      requestAnimationFrame(animate)
    }

    const animation = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animation)
  }, [lanes, speed])

  const setSpeedOption = (newSpeed: number) => {
    setSpeed(newSpeed)
    setShowSpeedMenu(false)
  }

  return (
    <div className="relative w-full h-[600px]">
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "#060809" }} />
      <div className="absolute bottom-2 left-2">
        <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="p-2 bg-gray-800 text-white rounded-full">
          <Settings size={20} />
        </button>
        {showSpeedMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded shadow-lg">
            <button onClick={() => setSpeedOption(0.5)} className="block w-full px-4 py-2 text-left hover:bg-gray-700">
              0.5x
            </button>
            <button onClick={() => setSpeedOption(1)} className="block w-full px-4 py-2 text-left hover:bg-gray-700">
              1x
            </button>
            <button onClick={() => setSpeedOption(2)} className="block w-full px-4 py-2 text-left hover:bg-gray-700">
              2x
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
