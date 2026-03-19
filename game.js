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
// Lighting (so things aren't black)
// ---------------------------
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// ---------------------------
// Floor (house base)
// ---------------------------
const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
scene.add(floor);

// ---------------------------
// Player (invisible cube)
// ---------------------------
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshBasicMaterial({ visible: false })
);
player.position.y = 0;
scene.add(player);

// ---------------------------
// Sigla ball (pet)
// ---------------------------
const sigla = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
sigla.position.set(0, 0, -2);
scene.add(sigla);

// Face layer
const loader = new THREE.TextureLoader();
loader.load('asset/image.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    const faceMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const faceMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.51, 32, 32),
        faceMaterial
    );

    sigla.add(faceMesh);
});

// ---------------------------
// Movement controls
// ---------------------------
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ---------------------------
// Coins system
// ---------------------------
let coins = 0;
const coinsDisplay = document.getElementById('coins');

document.getElementById('feedButton').onclick = () => {
    coins++;
    coinsDisplay.textContent = coins;
};

// ---------------------------
// Camera follow
// ---------------------------
function updateCamera() {
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 5;
    camera.position.y = player.position.y + 3;

    camera.lookAt(player.position);
}

// ---------------------------
// Movement logic
// ---------------------------
function movePlayer() {
    const speed = 0.05;

    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;
}

// ---------------------------
// Resize
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

    movePlayer();
    updateCamera();

    sigla.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
