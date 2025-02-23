// app/feed/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useDataPoints } from "../hooks/useDataPoints";
import DataStream from "../components/DataStream";
import ActivityVisualization from "../components/activity-visualization";

// Mock stats generator
const generateMockStats = () => ({
  reportsLastHour: Math.floor(Math.random() * 1000) + 200,
  totalReports: Math.floor(Math.random() * 100000),
  activeAnalysts: Math.floor(Math.random() * 5000) + 1000,
});

const mockAnalysts = [
  { id: 1, name: "J. Smith", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "A. Johnson", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "R. Wilson", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "M. Davis", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "K. Brown", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 6, name: "L. Martinez", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 7, name: "S. Lee", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 8, name: "T. Anderson", avatar: "/placeholder.svg?height=40&width=40" },
];

export default function IntelDashboard() {
  // Mocked stats
  const [stats, setStats] = useState(generateMockStats());
  // Shared data points from the same "useDataPoints" hook used in app/page.tsx
  const dataPoints = useDataPoints();

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateMockStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060809] text-gray-300 p-4">
      <div className="grid grid-cols-[200px_1fr_300px] gap-4">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <div className="text-4xl font-bold text-gray-100">
              {stats.reportsLastHour}
            </div>
            <div className="text-sm text-gray-500">Reports Last Hour</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold">Trending Analysts</div>
            {mockAnalysts.map((analyst) => (
              <div key={analyst.id} className="flex items-center gap-2 text-sm">
                <img
                  src={analyst.avatar || "/placeholder.svg"}
                  className="w-6 h-6 rounded-full"
                  alt=""
                />
                <span>{analyst.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column - Activity Visualization */}
        <div>
          <div className="text-4xl font-bold text-gray-100 mb-4">
            {stats.totalReports}
          </div>
          <ActivityVisualization />
        </div>

        {/* Right Column - Unified Data Stream */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Data Stream</div>
          <DataStream dataPoints={dataPoints} />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div>
          <div className="text-4xl font-bold text-orange-400">
            {stats.activeAnalysts}
          </div>
          <div className="text-sm text-gray-500">Reports Verified</div>
        </div>
        <div className="col-span-2">
          <div className="h-8 bg-gray-900 rounded-md overflow-hidden">
            {/* Simplified activity graph */}
            <div className="h-full w-full flex gap-px">
              {Array(60)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-green-600"
                    style={{ opacity: Math.random() * 0.5 + 0.1 }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
