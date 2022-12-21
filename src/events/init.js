import {
  AmbientLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  ShaderChunk,
  TextureLoader,
} from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { camera, render, renderer, scene } from "../core";
import navigate from "./navigate";
import resize from "./resize";

export default async function init(event) {
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);
  {
    let color = 0x404040;
    scene.add(new AmbientLight(color, 1));
  }
  {
    let sky = 0xffffff;
    let ground = 0xddd2cb;
    scene.add(new HemisphereLight(sky, ground, 1));
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  let controls = new MapControls(camera, renderer.domElement);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  await loadModel(event.detail);

  document.body.style.margin = 0;
  document.body.appendChild(renderer.domElement);

  controls.addEventListener("change", render);
  window.addEventListener("resize", resize);
  window.addEventListener("navigate", navigate);
}

async function loadModel(data) {
  let gltfLoader = new GLTFLoader();

  let model = await gltfLoader.loadAsync(data.model, (xhr) =>
    console.log((xhr.loaded / xhr.total) * 100, "% loaded")
  );

  model.scene.traverse(async (object) => {
    if (object.type == "Mesh") {
      let geometry = object.geometry;
      let material;

      if (object.name.match(/navmesh|layout|floor/gi)) {
        if (object.name == "navmesh") {
          material = new MeshPhongMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0,
          });
        } else {
          material = new MeshPhongMaterial({
            color: 0xbbbbbb,
            side: DoubleSide,
          });
        }
      } else {
        material = new MeshPhongMaterial({
          color: 0x999999,
          map: await loadStoreImage(data.images[object.name]),
          transparent: true,
        });
        material.onBeforeCompile = function (shader) {
          let custom_map_fragment = ShaderChunk.map_fragment.replace(
            `diffuseColor *= sampledDiffuseColor;`,
            `diffuseColor = vec4( mix( diffuse, sampledDiffuseColor.rgb, sampledDiffuseColor.a ), opacity );`
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            custom_map_fragment
          );
        };
      }

      let mesh = new Mesh(geometry, material);

      mesh.name = object.name;
      mesh.position.copy(object.position);

      scene.add(mesh);
      render();
    }
  });
}

async function loadStoreImage(url) {
  if (url) {
    let textureLoader = new TextureLoader();

    let texture = await textureLoader.loadAsync(url, (xhr) =>
      console.log((xhr.loaded / xhr.total) * 100, "% loaded")
    );
    texture.flipY = false;

    return texture;
  }
  return null;
}
