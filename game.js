// ---------------------------
// Three.js scene setup
// ---------------------------
const scene = new THREE.Scene();
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
// Sigla ball with face texture
// ---------------------------
const loader = new THREE.TextureLoader();
const faceTexture = loader.load('asset/image.png'); // path must match your folder/image

const geometry = new THREE.SphereGeometry(0.5, 16, 16);
const material = new THREE.MeshBasicMaterial({ map: faceTexture });
const sigla = new THREE.Mesh(geometry, material);
scene.add(sigla);

camera.position.z = 5;

// ---------------------------
// Coins & UI
// ---------------------------
let coins = 0;
const coinsDisplay = document.getElementById('coins');

const feedButton = document.getElementById('feedButton');
feedButton.addEventListener('click', () => {
    coins += 1;
    coinsDisplay.textContent = coins;
});

// ---------------------------
// Save / Load functions
// ---------------------------
function exportSave(data) {
    return btoa(JSON.stringify(data));
}

function importSave(encrypted) {
    return JSON.parse(atob(encrypted));
}

function saveGame() {
    const saveData = { coins: parseInt(coinsDisplay.textContent) };
    const exported = exportSave(saveData);
    alert("Copy this string to save your game:\n" + exported);
}

function loadGame() {
    const importedStr = prompt("Paste your save string:");
    if (!importedStr) return;
    const imported = importSave(importedStr);
    coins = imported.coins || 0;
    coinsDisplay.textContent = coins;
}

// Attach save/load buttons
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
});

// ---------------------------
// Window resize
// ---------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------
// Animate Sigla
// ---------------------------
function animate() {
    requestAnimationFrame(animate);
    sigla.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
