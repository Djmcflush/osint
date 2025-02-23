'use client';

import { useCallback } from 'react';
import { useDataPoints } from './hooks/useDataPoints';
import DataStream from './components/DataStream';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import EarthGlobe from './components/Globe';




export default function Page() {
    const dataPoints = useDataPoints();

    return (
        <div className="min-h-screen bg-[#0A0F1F] text-gray-200 p-6">
            <div className="grid grid-cols-12 gap-6">
                {/* Header Stats */}
                <div className="col-span-12 grid grid-cols-3 gap-6">
                    <div className="bg-[#111827] rounded-lg p-4">
                        <h2 className="text-sm opacity-70">Active Connections</h2>
                        <p className="text-3xl font-bold text-cyan-400">1,278</p>
                    </div>
                    <div className="bg-[#111827] rounded-lg p-4">
                        <h2 className="text-sm opacity-70">Data Points Processed</h2>
                        <p className="text-3xl font-bold text-purple-400">3,094,109</p>
                    </div>
                    <div className="bg-[#111827] rounded-lg p-4">
                        <h2 className="text-sm opacity-70">Active Users</h2>
                        <p className="text-3xl font-bold text-emerald-400">3,049</p>
                    </div>
                </div>

                {/* Main Globe Visualization */}
                <div className="col-span-8 bg-[#111827] rounded-lg p-4 relative min-h-[600px]">
                    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <EarthGlobe dataPoints={dataPoints} />
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                            autoRotate={true}
                            autoRotateSpeed={0.5}
                        />
                    </Canvas>
</div>

<div className="col-span-4 bg-[#111827] rounded-lg p-4 max-h-[600px] overflow-y-auto">
    <DataStream dataPoints={dataPoints} />
</div>

                {/* Bottom Stats */}
                <div className="col-span-12 grid grid-cols-4 gap-6">
                    <div className="bg-[#111827] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm opacity-70">CUI Data</h3>
                                <p className="text-2xl font-bold text-[#FFB800]">
                                    {dataPoints.filter((p) => p.classification === 'cui').length}
                                </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                        </div>
                    </div>
                    <div className="bg-[#111827] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm opacity-70">Secret Data</h3>
                                <p className="text-2xl font-bold text-[#FF4444]">
                                    {dataPoints.filter((p) => p.classification === 'secret').length}
                                </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-[#FF4444]" />
                        </div>
                    </div>
                    <div className="bg-[#111827] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm opacity-70">Top Secret Data</h3>
                                <p className="text-2xl font-bold text-[#FF0000]">
                                    {
                                        dataPoints.filter((p) => p.classification === 'topsecret')
                                            .length
                                    }
                                </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-[#FF0000]" />
                        </div>
                    </div>
                    <div className="bg-[#111827] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm opacity-70">Unclassified Data</h3>
                                <p className="text-2xl font-bold text-[#44FF44]">
                                    {
                                        dataPoints.filter(
                                            (p) => p.classification === 'unclassified',
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-[#44FF44]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
