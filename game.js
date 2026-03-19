// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gameCanvas')});
renderer.setSize(window.innerWidth, window.innerHeight);

// Sigla ball (sphere)
const geometry = new THREE.SphereGeometry(0.5, 16, 16);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const sigla = new THREE.Mesh(geometry, material);
scene.add(sigla);

camera.position.z = 5;

// Coins
let coins = 0;
const coinsDisplay = document.getElementById('coins');

// Feed button
const feedButton = document.getElementById('feedButton');
feedButton.addEventListener('click', () => {
    coins += 1;
    coinsDisplay.textContent = coins;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate Sigla
function animate() {
    requestAnimationFrame(animate);
    sigla.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
