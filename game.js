// ---------------------------
// GLOBAL
// ---------------------------
let selectedColor = 0x00ff00; // default

// ---------------------------
// MENU PREVIEW SCENE
// ---------------------------
const previewScene = new THREE.Scene();
const previewCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const previewRenderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('previewCanvas'),
  alpha: true
});
previewRenderer.setSize(200, 200);

previewCamera.position.z = 2;

const previewSigla = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: selectedColor })
);
previewScene.add(previewSigla);

// spin preview
function animatePreview() {
  requestAnimationFrame(animatePreview);
  previewSigla.rotation.y += 0.02;
  previewRenderer.render(previewScene, previewCamera);
}
animatePreview();

// ---------------------------
// COLOR PICKER
// ---------------------------
document.querySelectorAll('#colors button').forEach(btn => {
  btn.onclick = () => {
    selectedColor = Number(btn.dataset.color);
    previewSigla.material.color.set(selectedColor);
  };
});

// ---------------------------
// PLAY BUTTON
// ---------------------------
document.getElementById('playBtn').onclick = () => {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  startGame();
};

// ---------------------------
// MAIN GAME
// ---------------------------
function startGame() {

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0d8f0);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas')
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  // floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.1, 10),
    new THREE.MeshBasicMaterial({ color: 0x888888 })
  );
  scene.add(floor);

  // player
  const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.2, 0.4),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  player.position.y = 0.6;
  scene.add(player);

  // Sigla with selected color
  const sigla = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: selectedColor })
  );
  sigla.position.set(0, 0.5, -2);
  scene.add(sigla);

  // wandering
  let target = sigla.position.clone();
  let moving = false;

  function pickTarget() {
    const x = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    target.set(x, 0.5, z);
    moving = true;

    setTimeout(pickTarget, 1000 + Math.random() * 2000);
  }
  pickTarget();

  // controls
  const keys = {};
  document.addEventListener('keydown', e => keys[e.key] = true);
  document.addEventListener('keyup', e => keys[e.key] = false);

  let yaw = 0;
  let pitch = 0;

  document.body.onclick = () => document.body.requestPointerLock();

  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement === document.body) {
      yaw -= e.movementX * 0.002;
      pitch += e.movementY * 0.002;

      pitch = Math.max(-Math.PI/2+0.01, Math.min(Math.PI/2-0.01, pitch));
    }
  });

  function movePlayer() {
    const speed = 0.05;
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    if (keys['w']) player.position.add(forward.clone().multiplyScalar(-speed));
    if (keys['s']) player.position.add(forward.clone().multiplyScalar(speed));
    if (keys['a']) player.position.add(right.clone().multiplyScalar(-speed));
    if (keys['d']) player.position.add(right.clone().multiplyScalar(speed));
  }

  function updateCamera() {
    camera.position.x = player.position.x + Math.sin(yaw) * 3;
    camera.position.z = player.position.z + Math.cos(yaw) * 3;
    camera.position.y = player.position.y + 1.5 + pitch;

    camera.lookAt(player.position);
  }

  function animate() {
    requestAnimationFrame(animate);

    movePlayer();
    updateCamera();

    // Sigla movement
    if (moving) {
      const dir = new THREE.Vector3().subVectors(target, sigla.position);
      if (dir.length() > 0.02) {
        dir.normalize();
        sigla.position.add(dir.multiplyScalar(0.02));
      } else {
        moving = false;
      }
    }

    renderer.render(scene, camera);
  }

  animate();
}
