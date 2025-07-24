import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export const elevationColors = [
  '#04c8b8', '#05fae5', '#37fbeb', '#69fcf0', '#a5fdf6',
  '#f5f5e5', '#d0ea46', '#739f45', '#d0ea46', '#739f45'
];

function createBlobShape(radius = 3) {
  const shape = new THREE.Shape();
  const segments = 7 + Math.floor(Math.random() * 6);
  const angleStep = (Math.PI * 2) / segments;
  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    const r = radius * (0.7 + Math.random() * 0.6);
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  return shape;
}

export class Plate {
  constructor(x, z, size = 3 + Math.random() * 2) {
    this.size = size;
    const shape = createBlobShape(size);
    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.level = 3 + Math.floor(Math.random() * 2);
    this.material = new THREE.MeshStandardMaterial({
      color: elevationColors[this.level],
      roughness: 0.8,
      emissive: 0x000000
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    const scale = 1 + this.level;
    this.mesh.scale.set(1, 1, scale);
    this.mesh.position.set(x, 0, z);
  }

  setLevel(level) {
    this.level = Math.max(0, Math.min(elevationColors.length - 1, level));
    this.material.color.set(elevationColors[this.level]);
  }

  highlight(flag) {
    this.material.emissive.set(flag ? 0xffff00 : 0x000000);
  }
}

export function generatePlates(scene, gridSize = 10, gridSpacing = 4.5, jitter = 0.3) {
  const plates = [];
  for (let gx = -gridSize / 2; gx < gridSize / 2; gx++) {
    for (let gz = -gridSize / 2; gz < gridSize / 2; gz++) {
      const offset = (gx % 2) * (gridSpacing / 2);
      const x = gx * gridSpacing + (Math.random() - 0.5) * jitter;
      const z = gz * gridSpacing * Math.sqrt(3) / 2 + offset + (Math.random() - 0.5) * jitter;
      const plate = new Plate(x, z);
      scene.add(plate.mesh);
      plates.push(plate);
    }
  }
  // Create a small island at the center made of sand surrounded by grass
  const inner = gridSpacing * 1.5;
  const outer = gridSpacing * 2.5;
  for (const plate of plates) {
    const { x, z } = plate.mesh.position;
    const dist = Math.sqrt(x * x + z * z);
    if (dist < inner) {
      plate.setLevel(6 + Math.floor(Math.random() * 2));
      plate.mesh.scale.z = 1 + plate.level;
    } else if (dist < outer) {
      plate.setLevel(5);
      plate.mesh.scale.z = 1 + plate.level;
    }
  }
  return plates;
}

export function findNearestPlateTo(plates, position) {
  let nearest = null;
  let minDist = Infinity;
  for (const plate of plates) {
    const dist = plate.mesh.position.distanceTo(position);
    if (dist < minDist) {
      minDist = dist;
      nearest = plate;
    }
  }
  return nearest;
}
