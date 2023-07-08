import { useEffect, useRef, useState } from "react";
import {
  Group,
  MOUSE,
  Raycaster,
  TOUCH,
  Vector3,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Sphere,
  Stats,
  Image,
  Grid,
} from "@react-three/drei";

import "./App.css";

export default function App() {
  const mouseButtons = { LEFT: MOUSE.PAN, RIGHT: MOUSE.ROTATE };
  const touches = { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE };

  return (
    <Canvas frameloop="demand">
      <Grid
        args={[100, 100]}
        position={[0, 0, 0.1]}
        rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        sectionSize={5}
        sectionThickness={1.5}
        fadeDistance={400}
        infiniteGrid
      />
      <GizmoHelper alignment="top-right" children={<GizmoViewport />} />

      <OrbitControls
        makeDefault
        panSpeed={1.5}
        minDistance={50}
        maxDistance={300}
        enableRotate={false}
        touches={touches}
        mouseButtons={mouseButtons}
      />

      <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={20} />

      <Scene />

      <Stats />
    </Canvas>
  );
}

const Scene = () => {
  // TODO: Find the appropriate types and remove 'any' keyword
  const imagePlaneRef = useRef<Mesh>(null);
  const sphereGroupRef = useRef<Group>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCameraMoving, setIsCameraMoving] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Vector3>(new Vector3());

  const raycaster = new Raycaster();

  const { camera } = useThree();

  useFrame(({ mouse }) => {
    if (isHovered) {
      raycaster.setFromCamera(mouse, camera);

      if (imagePlaneRef.current) {
        let intersects = raycaster.intersectObject(imagePlaneRef.current);

        if (intersects.length > 0) {
          let point = intersects[0].point;
          setMousePosition(new Vector3(point.x, point.y, 0));
        }
      }
    }
  });

  // useEffect(() => {});

  const onDoubleMouseClick = () => {
    if (sphereGroupRef.current && !isCameraMoving) {
      let geometry = new BoxGeometry(0.5, 0.5, 0.5);
      let material = new MeshBasicMaterial();

      const cube = new Mesh(geometry, material);
      cube.position.copy(mousePosition);

      sphereGroupRef.current.add(cube);
    }
  };

  return (
    <scene>
      <Image
        url="./sarit_layout_01.svg"
        scale={100}
        ref={imagePlaneRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onDoubleClick={onDoubleMouseClick}
      />

      <group ref={sphereGroupRef} />

      <Sphere position={mousePosition} args={[0.3]} />
    </scene>
  );
};

class PathGraph {
  private nodes: [] = [];
  private edges: [] = [];

  constructor() {}

  addNode = () => {};

  getNode = (nodeId: string) => {};

  addEdge = () => {};

  getPath = (startId: string, destinationId: string) => {};
}

class Node {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
