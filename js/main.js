
// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0,1, 1000);
scene.add(camera);
camera.position.z = 5;   // Move the camera back 5 units so we can see the scene

const renderer = new THREE.WebGLRenderer({antialias: true});  // For Smooth Edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("0xfffff, 1");  // Set the background color of the scene
document.body.appendChild(renderer.domElement);  // Add the renderer to the body element


