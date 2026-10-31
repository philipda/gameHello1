// Main game initialization
// Use DOMContentLoaded to ensure everything is ready

document.addEventListener('DOMContentLoaded', function() {
    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        const errorEl = document.getElementById('error');
        const loadingEl = document.getElementById('loading');
        if (errorEl && loadingEl) {
            errorEl.innerText = 'Three.js failed to load. Please check your internet connection.';
            errorEl.style.display = 'block';
            loadingEl.style.display = 'none';
        }
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 100, 500);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 120, 100);
    camera.lookAt(50, 0, 50);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 40;
    controls.maxDistance = 300;
    controls.maxPolarAngle = Math.PI / 2.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Initialize map
    const map = createMap(50, 50, 4);
    scene.add(map);

    // Create tanks
    const tank1 = createTank(
        { body: 0x5a6d5a, turret: 0x4a7ba7, cannon: 0x3a3a3a, tracks: 0x4a4a4a, details: 0x3a4a3a },
        { x: 10, z: 10 },
        0
    );
    scene.add(tank1);

    const tank2 = createTank(
        { body: 0x874a2e, turret: 0xa76b4a, cannon: 0x3a3a3a, tracks: 0x6b4a2e, details: 0x6b3a2e },
        { x: 90, z: 90 },
        Math.PI
    );
    scene.add(tank2);

    // Create flag
    const flag = createFlag({ x: 50, z: 50 });
    scene.add(flag);

    // Add buildings
    const building1 = createBuilding({ x: 20, z: 20 }, 1.5);
    scene.add(building1);

    const building2 = createBuilding({ x: 80, z: 20 }, 1);
    scene.add(building2);

    const building3 = createBuilding({ x: 20, z: 80 }, 2);
    scene.add(building3);

    // Add trees
    const treePositions = [
        { x: 30, z: 30 },
        { x: 70, z: 70 },
        { x: 15, z: 60 },
        { x: 85, z: 15 },
        { x: 50, z: 10 },
        { x: 10, z: 50 },
        { x: 90, z: 50 },
        { x: 50, z: 90 }
    ];

    treePositions.forEach(pos => {
        const tree = createTree(pos);
        scene.add(tree);
    });

    // Add roads
    const road1 = createRoad({ x: 0, z: 50 }, { x: 100, z: 50 });
    scene.add(road1);

    const road2 = createRoad({ x: 50, z: 0 }, { x: 50, z: 100 });
    scene.add(road2);

    const road3 = createRoad({ x: 0, z: 0 }, { x: 50, z: 0 });
    scene.add(road3);

    const road4 = createRoad({ x: 50, z: 100 }, { x: 100, z: 100 });
    scene.add(road4);

    // Add water
    const water1 = createWater({ x: 80, z: 80 }, 8);
    scene.add(water1);

    // Remove loading screen
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }

    // Animation loop
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        // Simple flag waving animation
        if (flag && flag.children[1]) {
            flag.children[1].rotation.z = Math.sin(time * 2) * 0.1;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();
});
