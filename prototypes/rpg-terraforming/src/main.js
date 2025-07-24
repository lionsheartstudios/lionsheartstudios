import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { generatePlates } from './plates.js';
import { createPlayer, updatePlayer, setPlayerAction } from './player.js';
import { Terraformer } from './terraform.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x84e8ea);

const baseFov = 30;
const actionFov = 50;
const camera = new THREE.PerspectiveCamera(baseFov, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 15, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x84e8ea })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const oceanSurface = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x3399ff, transparent: true, opacity: 0.3 })
);
oceanSurface.rotation.x = -Math.PI / 2;
oceanSurface.position.y = 5.5;
scene.add(oceanSurface);

const plates = generatePlates(scene);

const player = createPlayer();
scene.add(player);

const keys = {};
let highlighted = null;
const terraformer = new Terraformer(document.getElementById('terraformUI'), plates, scene);

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys[key]) return;
  keys[key] = true;
  terraformer.keyDown(key, player);
  if (key === 'j') setPlayerAction(player, 'digging');
  if (key === 'o') setPlayerAction(player, 'throwing');
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  keys[key] = false;
  terraformer.keyUp(key);
  if (key === 'j' || key === 'o') setPlayerAction(player, 'idle');
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const nearest = updatePlayer(player, delta, camera, keys, plates);
  if (highlighted && highlighted !== nearest) highlighted.highlight(false);
  if (nearest) nearest.highlight(true);
  highlighted = nearest;
  terraformer.update(player, delta);
  renderer.render(scene, camera);
  camera.position.lerp(
    new THREE.Vector3(
      player.position.x + 10,
      player.position.y + 15,
      player.position.z + 10
    ), 0.1
  );
  const targetFov = keys['j'] || keys['o'] ? actionFov : baseFov;
  camera.fov += (targetFov - camera.fov) * 0.1;
  camera.updateProjectionMatrix();
  camera.lookAt(player.position);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
