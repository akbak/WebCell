import * as THREE from 'three';

class WebGLRenderer {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;
  }

  init() {
    // Initial scene setup
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Animation loop
    const cube = this.scene.children[0];
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default WebGLRenderer;
