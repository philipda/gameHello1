// Map creation and management

// Create the complete map
function createMap(width, height, cellSize) {
    const group = new THREE.Group();
    
    // Ground plane with patterned texture
    const groundGeometry = new THREE.PlaneGeometry(width * cellSize, height * cellSize);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a5f0b,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    group.add(ground);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(width * cellSize, width, 0x555555, 0x333333);
    gridHelper.position.y = -0.1;
    group.add(gridHelper);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(20);
    group.add(axesHelper);
    
    group.userData = {
        type: 'map',
        width: width,
        height: height,
        cellSize: cellSize
    };
    
    return group;
}

// Create flag/target
function createFlag(position) {
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    group.userData = { type: 'flag', position: position };

    // Flag pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6b4a,
        roughness: 0.5,
        metalness: 0.2
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 2;
    pole.castShadow = true;
    pole.name = 'pole';
    group.add(pole);

    // Flag
    const flagGeometry = new THREE.PlaneGeometry(1.5, 1.2);
    const flagMaterial = new THREE.MeshStandardMaterial({
        color: 0xf3d16b,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(0, 3.2, 0);
    flag.rotation.x = Math.PI / 4;
    flag.castShadow = false;
    flag.name = 'flag';
    group.add(flag);

    // Flag base
    const baseGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b6b6b,
        roughness: 0.6,
        metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.15;
    base.castShadow = true;
    base.name = 'base';
    group.add(base);

    return group;
}

// Create building
function createBuilding(position, size = 1) {
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    group.userData = { 
        type: 'building', 
        position: position,
        size: size,
        destructible: true,
        health: size * 100
    };

    const width = size * 4;
    const height = size * 4;
    const depth = size * 4;

    // Walls
    const wallGeometry = new THREE.BoxGeometry(width, height, 0.3);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xa0a0a0,
        roughness: 0.7,
        metalness: 0.1
    });

    // 4 walls
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, height / 2, depth / 2);
    wall1.castShadow = true;
    wall1.name = 'wall_front';
    group.add(wall1);

    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(0, height / 2, -depth / 2);
    wall2.castShadow = true;
    wall2.name = 'wall_back';
    group.add(wall2);

    const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall3.rotation.y = Math.PI / 2;
    wall3.position.set(width / 2, height / 2, 0);
    wall3.castShadow = true;
    wall3.name = 'wall_right';
    group.add(wall3);

    const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall4.rotation.y = Math.PI / 2;
    wall4.position.set(-width / 2, height / 2, 0);
    wall4.castShadow = true;
    wall4.name = 'wall_left';
    group.add(wall4);

    // Roof
    const roofGeometry = new THREE.BoxGeometry(width * 0.9, 0.2, depth * 0.9);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6b4a,
        roughness: 0.5,
        metalness: 0.2
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height;
    roof.castShadow = true;
    roof.name = 'roof';
    group.add(roof);

    return group;
}

// Create tree
function createTree(position) {
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    group.userData = { 
        type: 'tree', 
        position: position,
        destructible: true,
        health: 100
    };

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 4, 16);
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6b4a,
        roughness: 0.8,
        metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    trunk.name = 'trunk';
    group.add(trunk);

    // Leaves (conical)
    const leavesGeometry = new THREE.ConeGeometry(1.5, 4, 32);
    const leavesMaterial = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        roughness: 0.9,
        metalness: 0
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 4.5;
    leaves.rotation.y = Math.PI / 4;
    leaves.castShadow = true;
    leaves.name = 'leaves';
    group.add(leaves);

    return group;
}

// Create road
function createRoad(start, end, width = 4) {
    const group = new THREE.Group();
    
    // Calculate direction and length
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);

    // Road segment
    const roadGeometry = new THREE.BoxGeometry(length, 0.2, width);
    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b6b6b,
        roughness: 0.9,
        metalness: 0.1
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(start.x + dx / 2, 0.1, start.z + dz / 2);
    road.rotation.y = angle;
    road.castShadow = false;
    road.receiveShadow = true;
    road.name = 'road';
    group.add(road);

    group.userData = { type: 'road', start: start, end: end, width: width };

    return group;
}

// Create water
function createWater(position, size) {
    const geometry = new THREE.PlaneGeometry(size * 4, size * 4);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4a87b8,
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const water = new THREE.Mesh(geometry, material);
    water.position.set(position.x, -0.1, position.z);
    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;
    water.name = 'water';
    water.userData = { type: 'water', position: position, size: size };
    
    return water;
}

// Terrain types
const TERRAIN = {
    grass: { color: 0x8fb869, walkable: true, speed: 1.0 },
    dirt: { color: 0x8b6b4a, walkable: true, speed: 0.8 },
    road: { color: 0x6b6b6b, walkable: true, speed: 1.2 },
    water: { color: 0x4a87b8, walkable: false, speed: 0 },
    wall: { color: 0xa0a0a0, walkable: false, speed: 0 }
};

// Generate random map
function generateRandomMap(width, height, cellSize) {
    const group = new THREE.Group();
    
    // Add base map
    group.add(createMap(width, height, cellSize));
    
    // Random terrain variations
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const random = Math.random();
            const x = col * cellSize + cellSize / 2;
            const z = row * cellSize + cellSize / 2;
            
            if (random < 0.05) {
                // Tree
                group.add(createTree({ x: x, z: z }));
            } else if (random < 0.1) {
                // Small building
                group.add(createBuilding({ x: x, z: z }, 0.5));
            }
        }
    }
    
    return group;
}

// Export for module pattern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        createMap, createFlag, createBuilding, createTree, 
        createRoad, createWater, TERRAIN, generateRandomMap
    };
}
