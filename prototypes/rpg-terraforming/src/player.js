import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { findNearestPlateTo } from './plates.js';

export function createPlayer() {
  const player = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xff5533 });

  // body parts scaled down for chibi look
  const torsoHeight = 0.6;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, torsoHeight), mat);
  torso.position.y = torsoHeight / 2;
  player.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat);
  head.position.y = 0.8;
  player.add(head);

  const legHeight = 0.5;
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, legHeight), mat);
  leftLeg.position.set(-0.15, legHeight / 2, 0);
  player.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, legHeight), mat);
  rightLeg.position.set(0.15, legHeight / 2, 0);
  player.add(rightLeg);

  const armLength = 0.4;
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.35, torsoHeight, 0);
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, armLength), mat);
  leftArm.position.y = -armLength / 2;
  leftArmGroup.add(leftArm);
  player.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.35, torsoHeight, 0);
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, armLength), mat);
  rightArm.position.y = -armLength / 2;
  rightArmGroup.add(rightArm);

  const shovel = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, armLength * 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
  handle.position.y = -armLength * 0.45;
  const spade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
  spade.position.y = -armLength * 0.9 - 0.1;
  shovel.add(handle);
  shovel.add(spade);
  shovel.position.y = -armLength / 2;
  rightArmGroup.add(shovel);
  player.add(rightArmGroup);

  player.position.set(0, 2.5, 0);
  player.userData = {
    action: 'idle',
    animTime: 0,
    arm: rightArmGroup,
    head,
    blocks: 0,
    blockMeshes: []
  };
  return player;
}

export function updatePlayer(player, delta, camera, keys, plates) {
  const speed = 5 * delta;
  const camForward = new THREE.Vector3();
  camera.getWorldDirection(camForward);
  camForward.y = 0;
  camForward.normalize();
  const camRight = new THREE.Vector3();
  camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();
  const move = new THREE.Vector3();

  const digging = player.userData.action === 'digging' || player.userData.action === 'throwing';
  if (!digging) {
    if (keys['w']) move.add(camForward);
    if (keys['s']) move.sub(camForward);
    if (keys['d']) move.add(camRight);
    if (keys['a']) move.sub(camRight);
  }

  move.normalize().multiplyScalar(speed);
  player.position.add(move);
  if (move.lengthSq() > 0) {
    player.rotation.y = Math.atan2(move.x, move.z);
  }

  let targetY = player.position.y;
  const nearest = findNearestPlateTo(plates, player.position);
  player.userData.nearestPlate = nearest;
  if (nearest) {
    const dx = nearest.mesh.position.x - player.position.x;
    const dz = nearest.mesh.position.z - player.position.z;
    const distSq = dx * dx + dz * dz;
    if (distSq < nearest.size * nearest.size) {
      let level = nearest.level;
      if (level < 0) level = 0;
      targetY = 2.5 + level * 1;
    }
  }
  player.position.y += (targetY - player.position.y) * 0.2;

  animatePlayer(player, delta);
}

export function setPlayerAction(player, action) {
  if (!player.userData) return;
  if (player.userData.action === action) return;
  player.userData.action = action;
  player.userData.animTime = 0;
}

function animatePlayer(player, delta) {
  const data = player.userData;
  if (!data || !data.arm) return;
  data.animTime += delta;
  if (data.action === 'digging') {
    data.arm.rotation.x = -Math.PI / 2 + Math.sin(data.animTime * 10) * 0.5;
  } else if (data.action === 'throwing') {
    data.arm.rotation.x = 0.5 + Math.sin(data.animTime * 10) * 0.5;
  } else {
    data.arm.rotation.x = -0.2;
  }
}

export function addBlock(player) {
  const data = player.userData;
  if (!data) return;
  const geom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geom, mat);
  const base = data.head.position.y + 0.4;
  mesh.position.y = base + data.blocks * 0.35;
  player.add(mesh);
  data.blockMeshes.push(mesh);
  data.blocks += 1;
}

export function removeBlock(player) {
  const data = player.userData;
  if (!data || data.blocks === 0) return;
  const mesh = data.blockMeshes.pop();
  player.remove(mesh);
  data.blocks -= 1;
}
