// This version of EarthGlobe demonstrates how to load and render geoJSON data to draw country outlines on the globe.
// The code uses react-three-fiber, three.js, and a simple lat/lon to 3D coordinate conversion to place lines on the globe surface.
//
// Note: For this to work, add a world geoJSON file such as 'world.json' in public/geo/ directory, and update the fetch path.
// Example: /public/geo/world.json (containing polygons or MultiPolygons of the world's land boundaries)
// Also install relevant packages if not present, e.g. 'npm install d3-geo'
//
// Steps to adapt:
// 1) Place a valid geoJSON file in /public/geo/world.json
// 2) Confirm that the coordinates are in [longitude, latitude] format
// 3) Adjust your latLonToVector3 to match your sphere radius (in this example it's 2)

import React, { useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { geoPath, geoMercator } from 'd3-geo';

interface GlobeProps {
    dataPoints: {
        id: string;
        country: string;
        coordinates: {
            lat: number;
            long: number;
        };
        classification: string;
        timestamp: string;
    }[];
}

const RADIUS = 2;

// Convert latitude and longitude to 3D position on sphere
// lat, lon in degrees
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
}

const EarthGlobe: React.FC<GlobeProps> = ({ dataPoints }) => {
    const globeRef = useRef<THREE.Group>(null);

    // Attempt to load a globe texture
    // Always call the hook unconditionally
    const mapTexture: THREE.Texture | null = useLoader(
        THREE.TextureLoader,
        '/images/globe-night.jpeg',
    );
    // If the file is missing, it will log an error in the console. You could also handle it via onError if desired.

    // This group will hold the rotating Earth and any additional overlays (lines, markers, etc.)
    useFrame(() => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.0025;
        }
    });

    useEffect(() => {
        // If you have a world geoJSON file in /public/geo/world.json, you can fetch and parse it here:
        // Then create line segments for each country's border polygons.
        // This is a simple demonstration of how you might do that.

        fetch('/geo/world.json')
            .then((res) => {
                if (!res.ok) throw new Error('Failed fetching geoJSON');
                return res.json();
            })
            .then((worldData) => {
                // The approach below uses d3-geo for projection calculations, but we actually need 3D sphere coords
                // We'll iterate over each polygon or MultiPolygon. For each ring, we'll convert each lat/lon to 3D space
                // and then create BufferGeometry to form a line or lines.

                if (!globeRef.current) return;

                // Create a group to hold border lines
                const bordersGroup = new THREE.Group();

                // For each feature (country), we might have geometry of type Polygon or MultiPolygon
                worldData.features.forEach((feature: any) => {
                    const geometryType = feature.geometry.type;
                    const coords = feature.geometry.coordinates;

                    if (geometryType === 'Polygon') {
                        drawPolygon(coords, bordersGroup);
                    } else if (geometryType === 'MultiPolygon') {
                        coords.forEach((polygonCoords: any) => {
                            drawPolygon(polygonCoords, bordersGroup);
                        });
                    }
                });

                // Add the group of lines to the globeRef
                globeRef.current.add(bordersGroup);
            })
            .catch(() => {
                // If no geoJSON is found, that's fine; just skip border rendering.
                console.warn('No /geo/world.json found, skipping country borders.');
            });
    }, []);

    // Helper function to draw a single polygon's rings
    function drawPolygon(polygonCoords: any, parentGroup: THREE.Group) {
        // polygonCoords is an array of "rings"
        // The first ring is the outer border, subsequent rings (if any) are holes
        polygonCoords.forEach((ring: number[][]) => {
            const points: THREE.Vector3[] = [];

            ring.forEach(([lon, lat]) => {
                // Convert from lat/lon to 3D on sphere
                const vertex = latLonToVector3(lat, lon, RADIUS + 0.001); // a bit above surface
                points.push(vertex);
            });

            // Create a line geometry from our ring points
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            // Close the loop by linking last to first
            // (Using a trick: re-inject the first point at the end)
            lineGeometry.setDrawRange(0, points.length);

            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
            const line = new THREE.LineLoop(lineGeometry, lineMaterial);
            parentGroup.add(line);
        });
    }

    return (
        <group ref={globeRef}>
            <mesh>
                <sphereGeometry args={[RADIUS, 32, 32]} />
                {mapTexture ? (
                    <meshBasicMaterial map={mapTexture} />
                ) : (
                    <meshBasicMaterial color="#888888" />
                )}
            </mesh>
            {/* You could also place marker meshes or lines for each dataPoint here */}
        </group>
    );
};

export default EarthGlobe;
