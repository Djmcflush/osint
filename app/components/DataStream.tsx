// app/components/DataStream.tsx
'use client';

import { Classification, DataPoint } from '../hooks/useDataPoints';

const CLASSIFICATION_COLORS: Record<Classification, string> = {
  cui: '#FFB800',
  secret: '#FF4444',
  topsecret: '#FF0000',
  unclassified: '#44FF44',
};

interface DataStreamProps {
  dataPoints: DataPoint[];
}

export default function DataStream({ dataPoints }: DataStreamProps) {
  return (
    <div className="bg-[#111827] rounded-lg p-4 max-h-[600px] overflow-y-auto">
      <h2 className="text-sm font-semibold mb-4">Data Stream</h2>
      <div className="space-y-2">
        {dataPoints
          .slice()
          .reverse()
          .map((point) => (
            <div
              key={point.id}
              className="text-xs font-mono p-2 rounded bg-black/30"
            >
              <span className="opacity-50">
                {point.timestamp.slice(11, 19)}
              </span>{' '}
              <span
                className="px-1.5 py-0.5 rounded text-black"
                style={{
                  backgroundColor: CLASSIFICATION_COLORS[point.classification],
                }}
              >
                {point.classification.toUpperCase()}
              </span>{' '}
              <span className="text-cyan-400">{point.country}</span>{' '}
              <span className="opacity-50">
                [{point.coordinates.lat.toFixed(4)}, {point.coordinates.long.toFixed(4)}]
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
