import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
camera.position.set(0, 3, 15);    // Move the camera back 5 units so we can see the scene

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});  // For Smooth Edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);  // Set the background color of the scene
document.body.appendChild(renderer.domElement);  // Add the renderer to the body element

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xfffffff, 1);
// ambientLight.position.copy(camera.position);  //Light follows the camera position
scene.add(ambientLight);

// Directional Light
// const sunLight = new THREE.DirectionalLight(0xdddddd, 1);  // color, intensity
// sunLight.position.y = 80;
// scene.add(sunLight);

// // Helper for the light
// const helper = new THREE.DirectionalLightHelper(sunLight, 1);
// scene.add(helper);


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
const floorTexture = textureLoader.load('/img/ground.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10,10);


//Create the floor plane
const planeGeometry = new THREE.PlaneGeometry(50,50);
const planeMaterial = new THREE.MeshStandardMaterial({map: floorTexture, side: THREE.DoubleSide});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = 0.5 * Math.PI;
floorPlane.position.y = - Math.PI;
scene.add(floorPlane);

// Creating the walls
const wallGroup = new THREE.Group();
scene.add(wallGroup);

// Create a wall in the middle of the floor
const rightRightWallTexture = new THREE.TextureLoader().load('/img/wall.jpg');
const rightRightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 20, 30), new THREE.MeshBasicMaterial({map: rightRightWallTexture}));
rightRightWall.position.x = 15;
rightRightWall.position.z = -5;

// Create the bounding box for the wall
rightRightWall.BBox = new THREE.Box3().setFromObject(rightRightWall);


//left Front 
const leftFrontDoorTexture = new THREE.TextureLoader().load('/img/wall.jpg');
const leftFrontDoor = new THREE.Mesh(new THREE.BoxGeometry(10,20,0.001), new THREE.MeshBasicMaterial({map: leftFrontDoorTexture}));
leftFrontDoor.position.x = 20;
leftFrontDoor.position.z = 10;

// Front wall
const frontWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({map: frontWallTexture}));
frontWall.position.z = -25;

// Left wall
const leftWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 20, 50), new THREE.MeshBasicMaterial({map: leftWallTexture}));
leftWall.position.x = -25;

// Right wall
const rightWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 20, 50), new THREE.MeshBasicMaterial({map: rightWallTexture}));
rightWall.position.x = 25;

// Back wall
const backWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const backWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, -0.001), new THREE.MeshBasicMaterial({map: backWallTexture}));
backWall.position.z = 25;


wallGroup.add(frontWall, leftWall, rightWall, backWall,  rightRightWall);

// Loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
   wallGroup.children[i].BBox = new THREE.Box3().setFromObject(wallGroup.children[i]); 
}
 
// Add a table model in front of the front wall
const tableTexture = new THREE.TextureLoader().load('/img/table.jpg');
const tableGeometry = new THREE.BoxGeometry(10, 2, 5);
const tableMaterial = new THREE.MeshStandardMaterial({map: tableTexture});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 1, -15);
// scene.add(table);

// const wallTexture = new THREE.TextureLoader().load('/img/table.jpg');

// const wall1Geometry = new THREE.BoxGeometry(5, 15, 0.01);
// const wall1Material = new THREE.MeshBasicMaterial({map: wallTexture});
// const wall1 = new THREE.Mesh(wall1Geometry, wall1Material);
// wall1.position.set(6, -5, 2);

// scene.add(wall1);

// Stairs Model
const stairs = () => {
  // const textureLoader1 = new THREE.TextureLoader();
  // const texture = textureLoader1.load( '/img/Floor.jpg' );
  const loader = new GLTFLoader().setPath('new/');
  loader.load('scene.gltf', (gltf) => {
    // console.log(gltf);

    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material.map = texture;
      }
    });

    mesh.position.set(-3.8, -3, -25);
    mesh.scale.set(2.8, 3.2, 4);

    // Add the mesh to the scene
    scene.add(mesh);

    // Light on the backside of the stairs
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(20,6,-25);
    scene.add(light);

    // Helper for the light
    const helper = new THREE.DirectionalLightHelper(light, 1);
    scene.add(helper);

    // Camera Movement for Stairs
   // Camera Movement for Stairs
let step = 0;
const stepSize = 0.09;
let direction = 'up'; // Direction can be 'up' or 'down'

function animate() {
  requestAnimationFrame(animate);

  // Check if the camera is on the stairs
  if (camera.position.z >= mesh.position.z && camera.position.z <= mesh.position.z + 5 && camera.position.y <= mesh.position.y + 25) {
    if (direction === 'up') {
      // Simulate stepping up the stairs
      camera.position.y += stepSize;
      camera.position.z += stepSize;
    } else {
      // Simulate stepping down the stairs
      camera.position.y -= stepSize;
      camera.position.z -= stepSize;
    }

    // Adjust the step count
    step++;

    // Change direction after 150 steps
    if (step > 150) {
      step = 0;
      direction = direction === 'up' ? 'down' : 'up';
    }
  }

  controls.update(0.01);
  renderer.render(scene, camera);
}

animate();

  }, (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}
stairs();





// First Floor Stairs
// const firstFloorstairs = () => {
//   // const textureLoader1 = new THREE.TextureLoader();
//   // const texture = textureLoader1.load( '/img/Floor.jpg' );
//   const loader = new GLTFLoader().setPath('new/');
//   loader.load('scene.gltf', (gltf) => {
//     // console.log(gltf);

//     const mesh = gltf.scene;
//     mesh.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         // child.material.map = texture;
//       }
//     });

//     mesh.position.set(3.8, 10, 5);
//     mesh.scale.set(2.8, 3.2, 4);

//     // Add the mesh to the scene
//     scene.add(mesh);

//     // Light on the backside of the stairs
//     const light = new THREE.DirectionalLight(0xffffff, 3);
//     light.position.set(20,6,-25);
//     scene.add(light);

//     // Helper for the light
//     const helper = new THREE.DirectionalLightHelper(light, 1);
//     scene.add(helper);

//     // Camera Movement for Stairs
//     let step = 0;
//     const stepSize = 0.09;

//     function animate() {
//       requestAnimationFrame(animate);

//       // Check if the camera is on the stairs
//       if (camera.position.z >= mesh.position.z && camera.position.z <= mesh.position.z + 5  && camera.position.y <= mesh.position.y + 25) {
//         // Simulate stepping up the stairs
//         camera.position.y += stepSize;
//         // camera.position.z += stepSize;
        
//         // Adjust the step count
//         step++;

//         // Stop the animation after 100 steps
//         if (step > 180) {
//           step = 0;
//           camera.position.y -= stepSize * 100;
//           // camera.position.z -= stepSize * 100;
//         }
//       }

//       controls.update();
//       renderer.render(scene, camera);
//     }

//     animate();
//   }, (xhr) => {
//     console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
//   }, (error) => {
//     console.error(error);
//   });
// }
// firstFloorstairs();

// Light on the backside of the stairs
const FrontLight = new THREE.DirectionalLight(0xffffff, 2);
FrontLight.position.set(2,2,10);
scene.add(FrontLight);

// Helper for the light
const FrontLightHelper = new THREE.DirectionalLightHelper(FrontLight, 1); 
scene.add(FrontLightHelper);

// Door Model
const doorModel = () => {
  const textureLoader1 = new THREE.TextureLoader();
  const texture = textureLoader1.load( '/img/Floor.jpg' );
  const loader = new GLTFLoader().setPath('doorWall/');
  loader.load('scene.gltf', (gltf) => {
    // console.log(gltf);

    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.map = texture;
      }
    });

    mesh.position.set(19.6, -2, 10); // x, y, z
    mesh.scale.set(0.2, 1.1, 1.12); // Depth, Height, Width
    mesh.rotation.y = 0.5 * Math.PI;
    // Add the mesh to the scene
    scene.add(mesh);

    mesh.rotation.y = 0.5 * Math.PI;

  
  }, (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}
doorModel();

//Pillar
const pillarModel = () => {
  // const textureLoader1 = new THREE.TextureLoader();
  // const texture = textureLoader1.load( '/img/Floor.jpg' );
  const loader = new GLTFLoader().setPath('greek_pillar/');
  loader.load('scene.gltf', (gltf) => {
    console.log(gltf);

    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material.map = texture;
      }
    });

    mesh.position.set(-6,-7,-20); // x, y, z
    mesh.scale.set(2, 3.8, 2); // Depth, Height, Width
    
    // Add the mesh to the scene
    scene.add(mesh);


  
  }, (xhr) => {
    console.log(`loading pillar ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}
pillarModel();

const pillarModel1 = () => {
  // const textureLoader1 = new THREE.TextureLoader();
  // const texture = textureLoader1.load( '/img/Floor.jpg' );
  const loader = new GLTFLoader().setPath('greek_pillar/');
  loader.load('scene.gltf', (gltf) => {
    console.log(gltf);

    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material.map = texture;
      }
    });

    mesh.position.set(-6,-7,-5); // x, y, z
    mesh.scale.set(2, 3.8, 2); // Depth, Height, Width
    
    // Add the mesh to the scene
    scene.add(mesh);


  
  }, (xhr) => {
    console.log(`loading pillar ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}
pillarModel1();

const pillarModel2 = () => {
  // const textureLoader1 = new THREE.TextureLoader();
  // const texture = textureLoader1.load( '/img/Floor.jpg' );
  const loader = new GLTFLoader().setPath('greek_pillar/');
  loader.load('scene.gltf', (gltf) => {
    console.log(gltf);

    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material.map = texture;
      }
    });

    mesh.position.set(-6,-7,10); // x, y, z
    mesh.scale.set(2, 3.8, 2); // Depth, Height, Width
    
    // Add the mesh to the scene
    scene.add(mesh);


  
  }, (xhr) => {
    console.log(`loading pillar ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}
pillarModel2();

// const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 22, 1);
// spotLight.position.set(0, 25, 0);
// spotLight.castShadow = true;
// spotLight.shadow.bias = -0.0001;
// scene.add(spotLight);



// Light on the backside of the stairs
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-25,5,0);
scene.add(light);

// Helper for the light
const helper = new THREE.DirectionalLightHelper(light, 1);
scene.add(helper);

// Ceiling
const ceilingTexture = new THREE.TextureLoader().load('/img/ceiling.jpg');
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshBasicMaterial({map: ceilingTexture, side: THREE.DoubleSide});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
// ceilingTexture.wrapS = THREE.RepeatWrapping;
// ceilingTexture.wrapT = THREE.RepeatWrapping;
// ceilingTexture.repeat.set(10,10);
ceilingPlane.rotation.x = -0.5 * Math.PI;
ceilingPlane.position.y = 10;
scene.add(ceilingPlane);

// First Floor
const firstFloor = new THREE.PlaneGeometry(50,50);
const firstFloorTexture = new THREE.TextureLoader().load('/img/ground.jpg');
const firstFloorMaterial = new THREE.MeshBasicMaterial({map: firstFloorTexture, side: THREE.DoubleSide});
const firstFloorPlane = new THREE.Mesh(firstFloor, firstFloorMaterial);
firstFloorTexture.wrapS = THREE.RepeatWrapping;
firstFloorTexture.wrapT = THREE.RepeatWrapping;
firstFloorTexture.repeat.set(10,10);
firstFloorPlane.rotation.x = -0.5 * Math.PI;
firstFloorPlane.position.y = 10.2;
scene.add(firstFloorPlane);

// First Floor Back Wall
const firstFloorBackWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const firstFloorBackWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({map: firstFloorBackWallTexture}));
firstFloorBackWall.position.z = 25;
firstFloorBackWall.position.y = 10;
scene.add(firstFloorBackWall);

// First Floor left Wall
const firstFloorLeftWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const firstFloorLeftWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 9.7, 50), new THREE.MeshBasicMaterial({map: firstFloorLeftWallTexture}));
firstFloorLeftWall.position.x = -25;
firstFloorLeftWall.position.y = 15;
scene.add(firstFloorLeftWall);

// First Floor Right Wall
const firstFloorRightWallTexture = new THREE.TextureLoader().load('/img/rightWall.jpg');
const firstFloorRightWall = new THREE.Mesh(new THREE.BoxGeometry(0.001, 20, 50), new THREE.MeshBasicMaterial({map: firstFloorRightWallTexture}));
firstFloorRightWall.position.x = 25;
firstFloorRightWall.position.y = 10;
scene.add(firstFloorRightWall);

// First Floor Front Wall
const firstFloorFrontWallTexture = new THREE.TextureLoader().load('/img/leftWall.jpg');
const firstFloorFrontWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({map: firstFloorFrontWallTexture}));
firstFloorFrontWall.position.z = -25;
firstFloorFrontWall.position.y = 10;
scene.add(firstFloorFrontWall);


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
        controls.moveRight(0.3);
    }
    // Left Arrow Key
    else if (keycode === 37 || keycode === 65) {
        controls.moveRight(-0.3);
    }
    // Up Arrow Key
    else if (keycode === 38 || keycode === 87) {
        controls.moveForward(0.3);
    }
    // Down Arrow Key
    else if (keycode === 40 || keycode === 83) {
        controls.moveForward(-0.3);
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

// Animation
const render = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();