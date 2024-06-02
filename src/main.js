import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';

// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
// camera.position.z = 5;
camera.position.set(0, 2, 15);    // Move the camera back 5 units so we can see the scene

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});  // For Smooth Edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);  // Set the background color of the scene
document.body.appendChild(renderer.domElement);  // Add the renderer to the body element

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x101010, 1);
// ambientLight.position.copy(camera.position);  //Light follows the camera position
scene.add(ambientLight);

// Directional Light
const sunLight = new THREE.DirectionalLight(0xdddddd, 1);  // color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

// Geometry
// const boxTexture = new THREE.ImageUtils.loadTexture('img/Floor.jpg');
// const boxTexture = new THREE.TextureLoader().load('/img/Floor.jpg');
const geometry = new THREE.BoxGeometry(1, 1, 1);  // Width, Height, Depth
// const material = new THREE.MeshBasicMaterial({map: boxTexture});  // Adding texture of the cube
const material = new THREE.MeshBasicMaterial({color: 'blue'});  // Adding color of the cube
const cube = new THREE.Mesh(geometry, material);    // Create the cube
scene.add(cube);    // Add the cube to the scene

//Texture of the Floor

const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/img/Floor.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10,10);


//Create the floor plane
const planeGeometry = new THREE.PlaneGeometry(50,50);
const planeMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = 0.5 * Math.PI;
floorPlane.position.y = - Math.PI;
scene.add(floorPlane);

// Creating the walls
const wallGroup = new THREE.Group();
scene.add(wallGroup);

// Front wall
const frontWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(80, 20, 0.001), new THREE.MeshBasicMaterial({map: frontWallTexture}));
frontWall.position.z = -20;

// Left wall
const leftWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 20, 80), new THREE.MeshBasicMaterial({map: leftWallTexture}));
leftWall.position.x = -25;

// Right wall
const rightWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 20, 80), new THREE.MeshBasicMaterial({map: rightWallTexture}));
rightWall.position.x = 25;

// Back wall
const backWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const backWall = new THREE.Mesh(new THREE.BoxGeometry(80, 20, 0.001), new THREE.MeshBasicMaterial({map: backWallTexture}));
backWall.position.z = 20;

wallGroup.add(frontWall, leftWall, rightWall, backWall);

// Loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
   wallGroup.children[i].BBox = new THREE.Box3().setFromObject(wallGroup.children[i]); 
}

// Ceiling
const ceilingTexture = new THREE.TextureLoader().load('/img/officeCeiling.jpg');
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshBasicMaterial({map: ceilingTexture, side: THREE.DoubleSide});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = -0.5 * Math.PI;
ceilingPlane.position.y = 10;
scene.add(ceilingPlane);

// Create Painting
function createPainting(imageUrl, width, height, position) {
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imageUrl);
    const paintingMaterial = new THREE.MeshBasicMaterial({map: paintingTexture});
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    painting.position.set(position.x, position.y, position.z);
    return painting;
}

const painting1 = createPainting('/artworks/0.jpg', 10, 5, new THREE.Vector3(10, 5, -19));
const painting2 = createPainting('/artworks/1.jpg', 10, 5, new THREE.Vector3(-10, 5, -19));

// const paintings = createPaintings(scene, textureLoader);


scene.add(painting1, painting2);

// Controls
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience() {
    controls.lock();
    hideMenu();
}

const playButton = document.getElementById('play_button');
playButton.addEventListener('click', startExperience);

// Hide Menu
function hideMenu() {
    const menu = document.getElementById('menu')
    menu.style.display = 'none';
}

// Show Menu
function showMenu() {
    const menu = document.getElementById('menu')
    menu.style.display = 'flex';
}
controls.addEventListener('unlock', showMenu);

// Event Listener for when we press the Keys
document.addEventListener('keydown', onKeyDown, false);

// Function for Movement when we press the keys
function onKeyDown(event) {
    let keycode = event.which;

    // Right Arrow Key
    if (keycode === 39 || keycode === 68) {
        controls.moveRight(0.08);
    }
    // Left Arrow Key
    else if (keycode === 37 || keycode === 65) {
        controls.moveRight(-0.08);
    }
    // Up Arrow Key
    else if (keycode === 38 || keycode === 87) {
        controls.moveForward(0.08);
    }
    // Down Arrow Key
    else if (keycode === 40 || keycode === 83) {
        controls.moveForward(-0.08);
    }
}

// Animation
const render = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();