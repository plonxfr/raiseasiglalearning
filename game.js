// ---------------------------
// Scene setup
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

camera.position.z = 5;

// ---------------------------
// Create Sigla ball (ALWAYS visible)
// ---------------------------
const geometry = new THREE.SphereGeometry(0.5, 32, 32);

// Start with a fallback green material
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sigla = new THREE.Mesh(geometry, material);
scene.add(sigla);

// ---------------------------
// Load face texture (optional overlay)
// ---------------------------
const loader = new THREE.TextureLoader();

loader.load(
    'asset/siglaFace.png', // CHANGE if your folder is "assets"
    
    function (texture) {
        console.log("Texture loaded successfully!");
        sigla.material = new THREE.MeshBasicMaterial({ map: texture });
    },

    undefined,

    function (error) {
        console.error("Texture failed to load:", error);
    }
);

// ---------------------------
// Coins system
// ---------------------------
let coins = 0;
const coinsDisplay = document.getElementById('coins');

document.getElementById('feedButton').addEventListener('click', () => {
    coins += 1;
    coinsDisplay.textContent = coins;
});

// ---------------------------
// Save / Load system
// ---------------------------
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
// Resize handling
// ---------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------
// Animation loop
// ---------------------------
function animate() {
    requestAnimationFrame(animate);
    sigla.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
