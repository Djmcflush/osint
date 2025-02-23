// useDataPoints.ts
'use client';

import { useState, useEffect } from 'react';

export type Classification = 'cui' | 'secret' | 'topsecret' | 'unclassified';

export interface DataPoint {
  id: string;
  country: string;
  coordinates: {
    lat: number;
    long: number;
  };
  classification: Classification;
  timestamp: string;
}

export function useDataPoints() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        id: Math.random().toString(36),
        country: ['USA', 'UK', 'France', 'Germany', 'Japan', 'Russia', 'Ukraine'][Math.floor(Math.random() * 5)],
        coordinates: {
          lat: Math.random() * 180 - 90,
          long: Math.random() * 360 - 180,
        },
        classification: ['cui', 'secret', 'topsecret', 'unclassified'][
          Math.floor(Math.random() * 4)
        ] as Classification,
        timestamp: new Date().toISOString(),
      };

      setDataPoints((prev) => [...prev.slice(-50), newDataPoint]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return dataPoints;
}
