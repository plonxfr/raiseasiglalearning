// ---------------------------
// Scene setup
// ---------------------------
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

// ---------------------------
// Lighting
// ---------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// ---------------------------
// Floor
// ---------------------------
const floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.1, 10),
    new THREE.MeshBasicMaterial({ color: 0x888888 })
);
floor.position.y = -0.5;
scene.add(floor);

// ---------------------------
// Player (invisible)
// ---------------------------
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.2, 0.4), // rectangle shape
    new THREE.MeshBasicMaterial({ color: 0x0000ff }) // blue player
);

player.position.y = 0.5; // lift it so it sits on the floor
scene.add(player);
);
scene.add(player);

// ---------------------------
// Sigla
// ---------------------------
const sigla = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
sigla.position.set(0, 0, -2);
scene.add(sigla);

// Face
const loader = new THREE.TextureLoader();
loader.load('asset/image.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    const face = new THREE.Mesh(
        new THREE.SphereGeometry(0.51, 32, 32),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        })
    );

    sigla.add(face);
});

// ---------------------------
// Controls
// ---------------------------
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// ---------------------------
// Mouse look (Pointer Lock)
// ---------------------------
let yaw = 0;
let pitch = 0;

document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * 0.002;
        pitch -= e.movementY * 0.002;

        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    }
});

// ---------------------------
// Movement
// ---------------------------
function movePlayer() {
    const speed = 0.05;

    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    if (keys['w']) player.position.add(forward.clone().multiplyScalar(-speed));
    if (keys['s']) player.position.add(forward.clone().multiplyScalar(speed));
    if (keys['a']) player.position.add(right.clone().multiplyScalar(-speed));
    if (keys['d']) player.position.add(right.clone().multiplyScalar(speed));
}

// ---------------------------
// Third person camera
// ---------------------------
function updateCamera() {
    const distance = 3;

    const offsetX = Math.sin(yaw) * distance;
    const offsetZ = Math.cos(yaw) * distance;

    camera.position.x = player.position.x + offsetX;
    camera.position.z = player.position.z + offsetZ;
    camera.position.y = player.position.y + 2 + pitch * 2;

    camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
}

// ---------------------------
// Coins
// ---------------------------
let coins = 0;
const coinsDisplay = document.getElementById('coins');

document.getElementById('feedButton').onclick = () => {
    coins++;
    coinsDisplay.textContent = coins;
};

// ---------------------------
// Resize
// ---------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------
// Loop
// ---------------------------
function animate() {
    requestAnimationFrame(animate);

    movePlayer();
    updateCamera();

    sigla.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
