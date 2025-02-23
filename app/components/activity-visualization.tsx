"use client"

import { useEffect, useState, useRef } from "react"
import { Settings } from "lucide-react"

const LANES = 4
const MAX_SEGMENTS = 200
const SEGMENT_CHANCE = 0.2 // Increased chance for more activity

interface Segment {
  x: number
  y: number // Changed to absolute y position
  height: number
  intensity: number
  baseColor: { r: number; g: number; b: number }
  fadeSpeed: number // Added for varying fade speeds
}

const CLASSIFICATION_COLORS = {
  cui: { r: 255, g: 184, b: 0 },
  secret: { r: 255, g: 68, b: 68 },
  topsecret: { r: 255, g: 0, b: 0 },
  unclassified: { r: 68, g: 255, b: 68 },
}

function parseHexColorToRgb(hex: string) {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);
  return { r, g, b };
}

function interpolateColor(baseColor: { r: number; g: number; b: number }, intensity: number) {
  const r = Math.round(255 - (255 - baseColor.r) * intensity)
  const g = Math.round(255 - (255 - baseColor.g) * intensity)
  const b = Math.round(255 - (255 - baseColor.b) * intensity)
  return `rgb(${r}, ${g}, ${b})`
}

import { DataPoint } from "../hooks/useDataPoints";

interface ActivityVisualizationProps {
  dataPoints?: DataPoint[];
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

    // Create a map from classification to lane index
    const classificationLaneMap: Record<string, number> = {
      cui: 0,
      secret: 1,
      topsecret: 2,
      unclassified: 3
    };

    const laneWidth = canvas.offsetWidth / LANES;
    const segmentWidth = laneWidth * 0.4;

    const animate = () => {
      ctx.fillStyle = "#060809";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setLanes(prevLanes =>
        prevLanes.map((lane, laneIndex) => {
          // Clear lane each frame
          lane = [];

          // If we have dataPoints, convert each dataPoint to a segment
          if (dataPoints && dataPoints.length > 0) {
            dataPoints.forEach(dp => {
              const classificationColor = CLASSIFICATION_COLORS[dp.classification];
              const mappedLane = classificationLaneMap[dp.classification] ?? 0; 
              if (classificationColor) {
                // Only push into current lane if it matches the mapped laneIndex
                if (mappedLane === laneIndex) {
                  lane.push({
                    x: laneIndex * laneWidth + (laneWidth - segmentWidth) / 2,
                    y: Math.random() * canvas.offsetHeight,
                    height: Math.random() * 15 + 5,
                    intensity: Math.random() * 0.5 + 0.5,
                    baseColor: classificationColor,
                    fadeSpeed: Math.random() * 0.03 + 0.02
                  });
                }
              }
            });
          }

          // Update existing segments
          return lane
            .map(segment => ({
              ...segment,
              y: (segment.y + speed) % canvas.offsetHeight, // Move vertically based on speed
              intensity: segment.intensity - segment.fadeSpeed * speed
            }))
            .filter(segment => segment.intensity > 0.1);
        })
      );

      // Draw lanes
      lanes.forEach((lane) => {
        // Draw active segments
        lane.forEach((segment) => {
          const color = interpolateColor(segment.baseColor, segment.intensity)

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
