"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../data/globe.json"; // Adjust path as needed

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export function Globe({ globeConfig, data }) {
  const [globeReady, setGlobeReady] = useState(false);
  const globeRef = useRef();

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current) {
      const globeInstance = new ThreeGlobe();

      const globeMaterial = globeInstance.globeMaterial();
      globeMaterial.color = new Color(defaultProps.globeColor);
      globeMaterial.emissive = new Color(defaultProps.emissive);
      globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
      globeMaterial.shininess = defaultProps.shininess;

      globeInstance
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);

      const validData = data.filter(
        d =>
          isFinite(d.startLat) &&
          isFinite(d.startLng) &&
          isFinite(d.endLat) &&
          isFinite(d.endLng) &&
          typeof d.color === "string" &&
          /^#?[a-fA-F0-9]{6}$/.test(d.color.trim())
      );

      const rgbData = validData.map(d => {
        const trimmedColor = d.color.trim();
        const rgb = hexToRgb(trimmedColor);
        return { ...d, rgb, color: trimmedColor };
      });

      const uniquePoints = [];
      const seen = new Set();
      for (const arc of rgbData) {
        const keys = [`${arc.startLat},${arc.startLng}`, `${arc.endLat},${arc.endLng}`];
        keys.forEach((key, idx) => {
          if (!seen.has(key)) {
            seen.add(key);
            uniquePoints.push({
              lat: idx === 0 ? arc.startLat : arc.endLat,
              lng: idx === 0 ? arc.startLng : arc.endLng,
              size: defaultProps.pointSize,
              color: t => `rgba(${arc.rgb.r}, ${arc.rgb.g}, ${arc.rgb.b}, ${1 - t})`,
              order: arc.order,
            });
          }
        });
      }

      globeInstance
        .arcsData(validData)
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(d => d.color)
        .arcAltitude(d => d.arcAlt || 0.1)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap(d => d.order)
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      globeInstance
        .pointsData(uniquePoints)
        .pointColor(p => p.color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      globeInstance
        .ringsData([])
        .ringColor(d => t => d.color(t))
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);

      globeRef.current = globeInstance;
      setGlobeReady(true);

      const interval = setInterval(() => {
        const selected = genRandomNumbers(0, uniquePoints.length, Math.floor((uniquePoints.length * 4) / 5));
        globeInstance.ringsData(selected.map(i => uniquePoints[i]));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  return globeReady && globeRef.current ? (
    <primitive object={globeRef.current} />
  ) : null;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size]);

  return null;
}

export function World(props) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }

  return arr;
}
