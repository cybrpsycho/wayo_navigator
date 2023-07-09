import { Suspense, useEffect, useRef } from "react";
import { DirectionalLightHelper } from "three";
import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  GizmoHelper,
  GizmoViewport,
  Stats,
  MapControls,
  useGLTF,
  useProgress,
  Html,
  Sky,
  useHelper,
} from "@react-three/drei";

import "./App.css";

useGLTF.preload(modelUrl);

export default function App() {
  return (
    <Canvas frameloop="demand">
      <Stage showDebugOverlays />

      <Suspense fallback={<Progress />}>
        <Scene />
      </Suspense>

      <Stats />
    </Canvas>
  );
}

const Stage = (props: { showDebugOverlays?: boolean }) => {
  return (
    <>
      <Sky />

      <Lighting showHelpers={props.showDebugOverlays} />

      {props.showDebugOverlays ? (
        <GizmoHelper alignment="top-right" children={<GizmoViewport />} />
      ) : (
        <></>
      )}

      <MapControls
        makeDefault
        panSpeed={1.5}
        minDistance={50}
        maxDistance={300}
        screenSpacePanning={false}
      />

      <PerspectiveCamera makeDefault position={[100, 100, 100]} fov={20} />
    </>
  );
};

const Lighting = (props: { showHelpers?: boolean }) => {
  const lightARef = useRef<any>(null);
  const lightBRef = useRef<any>(null);

  useHelper(lightARef, DirectionalLightHelper);
  useHelper(lightBRef, DirectionalLightHelper);

  return (
    <>
      <directionalLight
        ref={props.showHelpers ? lightARef : null}
        position={[-10, 10, -10]}
        intensity={0.1}
      />
      <directionalLight
        ref={props.showHelpers ? lightBRef : null}
        position={[10, 10, 0]}
        intensity={0.2}
      />
      <ambientLight intensity={0.7} />
    </>
  );
};

const Progress = () => {
  const { progress } = useProgress();

  return <Html center>{progress} % loaded</Html>;
};

const Scene = () => {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    console.log(scene);
    // TODO
    /*  split scene into navmesh and other objects i.e rooms
        store data structures into a state variable
        use navmesh to do pathfinding (3-pathfinding) - find out how to obtain mesh id using custom events
         
    */
  });

  return (
    <scene>
      <primitive object={scene} />
    </scene>
  );
};
