import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { findNearestPlateTo, elevationColors } from './plates.js';
import { addBlock, removeBlock } from './player.js';

export class Terraformer {
  constructor(uiElement, plates, scene) {
    this.ui = uiElement;
    this.plates = plates;
    this.scene = scene;
    this.dir = 0;
    this.progress = 0;
    this.locked = false;
    this.currentPlate = null;
    this.startLevel = 0;
    this.acquireTarget = false;
    this.particles = [];
    this.updateUI(0);
  }

  jerkyCurve(t) {
    if (t < 0.25) return (t / 0.25) * 0.6;
    if (t < 0.5) return 0.6;
    return 0.6 + ((t - 0.5) / 0.5) * 0.4;
  }

  updateUI(progress) {
    const percent = Math.min(100, Math.floor(progress * 100));
    this.ui.style.background = `conic-gradient(#00ccff ${percent}%, transparent ${percent}%)`;
    this.ui.style.display = this.dir === 0 ? 'none' : 'block';
  }

  keyDown(key, player) {
    if (this.locked) return;
    if (key === 'j') {
      this.dir = -1; // dig down
      this.locked = true;
      this.acquireTarget = true;
    }
    if (key === 'o') {
      if (player.userData.blocks > 0) {
        this.dir = 1; // fill up
        this.locked = true;
        this.acquireTarget = true;
      }
    }
  }

  keyUp(key) {
    if (key === 'j' || key === 'o') {
      this.dir = 0;
      this.progress = 0;
      this.locked = false;
      this.currentPlate = null;
      this.acquireTarget = false;
      this.updateUI(0);
    }
  }

  updateParticles(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.t += delta;
      const t = Math.min(1, p.t / p.dur);
      p.mesh.position.lerpVectors(p.start, p.end, t);
      p.mesh.material.opacity = 1 - t;
      if (t >= 1) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  spawnParticles(start, end) {
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true })
      );
      mesh.position.copy(start);
      this.scene.add(mesh);
      this.particles.push({ mesh, start: start.clone(), end: end.clone(), t: 0, dur: 0.5 + Math.random() * 0.3 });
    }
  }

  update(player, delta) {
    this.updateParticles(delta);
    if (this.dir === 0) return;

    if (this.acquireTarget) {
      this.currentPlate = findNearestPlateTo(this.plates, player.position);
      if (this.currentPlate) {
        this.startLevel = this.currentPlate.level;
      }
      this.acquireTarget = false;
    }

    if (!this.currentPlate) return;

    this.progress += delta / 2; // hold for ~2 seconds to complete
    this.updateUI(this.progress);

    if (this.progress >= 1) {
      this.progress = 0;
      let level = this.startLevel + this.dir;
      level = Math.max(0, Math.min(elevationColors.length - 1, level));
      this.currentPlate.setLevel(level);
      this.currentPlate.mesh.scale.z = 1 + this.currentPlate.level;

      const platePos = this.currentPlate.mesh.position.clone();
      const playerPos = player.position.clone().add(new THREE.Vector3(0, 1, 0));
      if (this.dir === -1) {
        this.spawnParticles(platePos, playerPos);
        addBlock(player);
      } else {
        this.spawnParticles(playerPos, platePos);
        removeBlock(player);
      }

      this.locked = true;
      this.dir = 0;
      this.currentPlate = null;
      this.updateUI(0);
    } else {
      const effect = this.dir === -1 ? this.jerkyCurve(this.progress) : this.progress;
      const targetScale = 1 + this.startLevel + this.dir * effect;
      const currentScale = this.currentPlate.mesh.scale.z;
      const deltaScale = (targetScale - currentScale) * 0.1;
      this.currentPlate.mesh.scale.z += deltaScale;
    }

    for (const plate of this.plates) {
      if (plate === this.currentPlate) continue;
      const targetScale = 1 + plate.level;
      const currentScale = plate.mesh.scale.z;
      const deltaScale = (targetScale - currentScale) * 0.1;
      plate.mesh.scale.z += deltaScale;
    }
  }
}
