import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const scene = new Scene();

const camera = new PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
);

const renderer = new WebGLRenderer({ alpha: true });

const render = () => renderer.render(scene, camera);

export { scene, camera, renderer, render };
