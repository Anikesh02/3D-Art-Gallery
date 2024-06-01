
// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
camera.position.z = 5;   // Move the camera back 5 units so we can see the scene

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});  // For Smooth Edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);  // Set the background color of the scene
document.body.appendChild(renderer.domElement);  // Add the renderer to the body element

// Lights

// Ambient Light
let ambientLight = new THREE.AmbientLight(0x101010, 1);
ambientLight.position.copy(camera.position);  //Light follows the camera position
scene.add(ambientLight);


// Directional Light
let sunLight = new THREE.DirectionalLight(0xdddddd, 1);  // color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);  // Width, Height, Depth
const material = new THREE.MeshBasicMaterial({color: 'blue'});  // Color of the cube
const cube = new THREE.Mesh(geometry, material);    // Create the cube
scene.add(cube);    // Add the cube to the scene


// Controls
// Event listener for when we press the keys
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            cube.position.y += 0.1;
            break;
        case 'ArrowDown':
            cube.position.y -= 0.1;
            break;
        case 'ArrowLeft':
            cube.position.x -= 0.1;
            break;
        case 'ArrowRight':
            cube.position.x += 0.1;
            break;
    }
});

// Animation
let render = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();