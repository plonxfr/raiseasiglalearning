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
// Base Sigla ball (ALWAYS visible)
// ---------------------------
const baseGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sigla = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(sigla);

// ---------------------------
// Face texture (layered on top)
// ---------------------------
const loader = new THREE.TextureLoader();

loader.load(
    'asset/image.png', // your file

    function (texture) {
        console.log("Face loaded!");

        const faceMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        // Slightly bigger so it sits on top of the ball
        const faceGeometry = new THREE.SphereGeometry(0.51, 32, 32);
        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);

        sigla.add(faceMesh); // attach to ball
    },

    undefined,

    function (err) {
        console.error("Face failed to load:", err);
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
// Animation
// ---------------------------
function animate() {
    requestAnimationFrame(animate);

    sigla.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
