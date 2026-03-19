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
floor.position.y = -0.05;
scene.add(floor);

// ---------------------------
// Player (visible rectangle)
// ---------------------------
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.2, 0.4),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
player.position.y = 0.6;
scene.add(player);

// ---------------------------
// Sigla pet
// ---------------------------
const sigla = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
sigla.position.set(0, 0.5, -2);
scene.add(sigla);

// Face layer
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
// Mouse look (pointer lock + inverted Y fixed)
let yaw = 0;
let pitch = 0;

document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * 0.002;
        pitch += e.movementY * 0.002; // inverted Y
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    }
});

// ---------------------------
// Movement
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
function updateCamera() {
    const distance = 3;
    const offsetX = Math.sin(yaw) * distance;
    const offsetZ = Math.cos(yaw) * distance;

    camera.position.x = player.position.x + offsetX;
    camera.position.z = player.position.z + offsetZ;
    camera.position.y = player.position.y + 1.5 + pitch;

    camera.lookAt(player.position.x, player.position.y + 0.6, player.position.z);
}

// ---------------------------
// Coins system
let coins = 0;
const coinsDisplay = document.getElementById('coins');

document.getElementById('feedButton').onclick = () => {
    coins++;
    coinsDisplay.textContent = coins;
};

// ---------------------------
// Save / Load
function exportSave(data) {
    return btoa(JSON.stringify(data));
}

function importSave(str) {
    return JSON.parse(atob(str));
}

function saveGame() {
    const saveData = { coins };
    const exported = exportSave(saveData);
    alert("Copy this save:\n" + exported);
}

function loadGame() {
    const input = prompt("Paste your save:");
    if (!input) return;
    const data = importSave(input);
    coins = data.coins || 0;
    coinsDisplay.textContent = coins;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveBtn').onclick = saveGame;
    document.getElementById('loadBtn').onclick = loadGame;
});

// ---------------------------
// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    updateCamera();

    sigla.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
