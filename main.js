import {
  MeshLambertMaterial,
  ShaderChunk,
  DirectionalLight,
  TextureLoader,
  AmbientLight,
  BoxGeometry,
  HemisphereLight,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { DirectionalLightHelper } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let scene;
let camera;
let renderer;
let controls;

// const defaultColor = 0xdeb887;
const defaultColor = 0x949494;

window.addEventListener("load", () => {
  console.time("loaded in");
  initialize();
  // render();
  window.dispatchEvent(new CustomEvent("download", {}));
  console.timeEnd("loaded in");
});

const initialize = () => {
  setupCamera();
  setupRenderer();
  setupControls();
  setupScene();

  controls.addEventListener("change", render);
  window.addEventListener("resize", onResize);
  window.addEventListener("navigate", onNavigate);
  window.addEventListener("download", onDownload);
};

// SETUP

const setupCamera = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  camera = new PerspectiveCamera(40, width / height);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);
};

const setupRenderer = () => {
  renderer = new WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.style.margin = 0;
  document.body.style.backgroundColor = "#282828";
  // document.body.style.backgroundColor = "#ffffff";
  document.body.appendChild(renderer.domElement);
};

const setupControls = () => {
  controls = new MapControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 50;
  // controls.minPolarAngle = 0.25 * Math.PI;
  controls.maxPolarAngle = 0.4 * Math.PI;
};

const setupScene = () => {
  scene = new Scene();

  scene.add(new HemisphereLight(0xffffff, 0xa1a1a1, 0.4));

  let primaryLight = new DirectionalLight(0xffffff, 1);
  primaryLight.position.set(-10, 10, 20);
  scene.add(primaryLight);

  let secondaryLight = new DirectionalLight(0xffffff, 0.7);
  secondaryLight.position.set(20, 10, -10);
  scene.add(secondaryLight);

  scene.add(new DirectionalLightHelper(primaryLight, 1));
  scene.add(new DirectionalLightHelper(secondaryLight, 1));

  let geometry = new BoxGeometry(40, 0.2, 40);
  let material = new MeshLambertMaterial({ color: 0xaeaeae });

  let floor = new Mesh(geometry, material);
  floor.position.set(0, -0.1, 0);
  scene.add(floor);
};

// EVENTS
const render = () => renderer.render(scene, camera);

const onResize = (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
};

const onDownload = async (event) => {
  // let model = await loadModel(event.detail.modelUrl);
  let model = await loadModel("./sample_layout.glb");
  // let model = await loadModel(
  //   "https://firebasestorage.googleapis.com/v0/b/wayo-254.appspot.com/o/samples%2Fsample_layout.glb?alt=media&token=ecbf4b7b-8124-431b-bb97-319d4f5b6ad6"
  // );

  model.scene.traverse(async (object) => {
    if (object.type == "Mesh") {
      let geometry = object.geometry;
      let material;

      if (object.name == "navmesh") {
        material = new MeshLambertMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0,
        });
      } else if (object.name == "perimeter") {
        material = new MeshLambertMaterial({
          color: 0x6b6b6b,
        });
      } else if (object.name == "stairs") {
        material = new MeshLambertMaterial({
          color: 0x56b04d,
        });
      } else {
        material = new MeshLambertMaterial({
          color: defaultColor,
        });
      }

      // if (object.name.match(/navmesh|layout|floor/gi)) {

      // } else {
      //   material = new MeshLambertMaterial({
      //     color: defaultColor,
      //     // map: await loadTextureMap(data.images[object.name]),
      //     transparent: true,
      //   });
      //   material.onBeforeCompile = function (shader) {
      //     let custom_map_fragment = ShaderChunk.map_fragment.replace(
      //       `diffuseColor *= sampledDiffuseColor;`,
      //       `diffuseColor = vec4( mix( diffuse, sampledDiffuseColor.rgb, sampledDiffuseColor.a ), opacity );`
      //     );

      //     shader.fragmentShader = shader.fragmentShader.replace(
      //       "#include <map_fragment>",
      //       custom_map_fragment
      //     );
      //   };
      // }

      let mesh = new Mesh(geometry, material);

      mesh.name = object.name;
      mesh.position.copy(object.position);

      scene.add(mesh);
      render();
    }
  });
};

const onNavigate = (event) => {
  const pathfinding = new Pathfinding();
  const helper = new PathfindingHelper();
  const zoneId = "level";

  let navmesh = scene.getObjectByName("navmesh");

  pathfinding.setZoneData(zoneId, Pathfinding.createZone(navmesh.geometry));

  let startPos = scene.getObjectByName(event.detail.startObjectName).position;
  let endPos = scene.getObjectByName(event.detail.endObjectName).position;

  let startGroupId = pathfinding.getGroup(zoneId, startPos);
  let startNode = pathfinding.getClosestNode(startPos, zoneId, startGroupId);

  let endGroupId = pathfinding.getGroup(zoneId, endPos);
  let endNode = pathfinding.getClosestNode(endPos, zoneId, endGroupId);

  let path = pathfinding.findPath(
    startNode.centroid,
    endNode.centroid,
    zoneId,
    startGroupId
  );

  scene.add(helper);

  helper.setPlayerPosition(startNode.centroid);
  helper.setTargetPosition(endNode.centroid);
  helper.setPath(path);

  render();
};

// HELPERS

const loadModel = async (url) => {
  let gltfLoader = new GLTFLoader();

  let model = await gltfLoader.loadAsync(url, (xhr) =>
    console.log((xhr.loaded / xhr.total) * 100, "% loaded")
  );

  return model;
};

const loadTextureMap = async (url) => {
  if (url) {
    let textureLoader = new TextureLoader();

    let texture = await textureLoader.loadAsync(url, (xhr) =>
      console.log((xhr.loaded / xhr.total) * 100, "% loaded")
    );
    texture.flipY = false;

    return texture;
  }
  return null;
};

const setup = () => {};

const update = () => {};
