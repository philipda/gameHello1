// Tank creation and management

// Create a tank model
function createTank(color, position, rotationY = 0) {
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    group.rotation.y = rotationY;
    group.userData = {
        type: 'tank',
        player: color.body === 0x5a6d5a ? 1 : 2,
        position: { x: position.x, z: position.z },
        gridPosition: { row: Math.floor(position.z / 4), col: Math.floor(position.x / 4) },
        health: 100
    };
    
    // Tank body (main hull)
    const bodyGeometry = new THREE.BoxGeometry(3.8, 1.2, 2.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color.body,
        roughness: 0.4,
        metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    body.receiveShadow = true;
    body.name = 'body';
    group.add(body);

    // Tank turret
    const turretGeometry = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 32);
    const turretMaterial = new THREE.MeshStandardMaterial({
        color: color.turret,
        roughness: 0.3,
        metalness: 0.4
    });
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.set(0, 1.4, 0.2);
    turret.rotation.x = Math.PI / 2;
    turret.castShadow = true;
    turret.name = 'turret';
    group.add(turret);

    // Cannon
    const cannonGeometry = new THREE.CylinderGeometry(0.15, 0.2, 3.5, 16);
    const cannonMaterial = new THREE.MeshStandardMaterial({
        color: color.cannon,
        roughness: 0.2,
        metalness: 0.8
    });
    const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
    cannon.position.set(0, 1.8, 0.8);
    cannon.rotation.x = Math.PI / 6;
    cannon.castShadow = true;
    cannon.name = 'cannon';
    group.add(cannon);

    // Tracks (left)
    const trackGeometry = new THREE.BoxGeometry(0.3, 0.2, 2.4);
    const trackMaterial = new THREE.MeshStandardMaterial({
        color: color.tracks,
        roughness: 0.8,
        metalness: 0.1
    });
    const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
    leftTrack.position.set(-1.7, 0.3, 0);
    leftTrack.castShadow = true;
    leftTrack.name = 'track_left';
    group.add(leftTrack);

    // Tracks (right)
    const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
    rightTrack.position.set(1.7, 0.3, 0);
    rightTrack.castShadow = true;
    rightTrack.name = 'track_right';
    group.add(rightTrack);

    // Small details on body
    const detailGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const detailMaterial = new THREE.MeshStandardMaterial({
        color: color.details,
        roughness: 0.5,
        metalness: 0.3
    });
    
    const detail1 = new THREE.Mesh(detailGeometry, detailMaterial);
    detail1.position.set(-1.2, 1.1, 0.8);
    detail1.name = 'detail_1';
    group.add(detail1);

    const detail2 = new THREE.Mesh(detailGeometry, detailMaterial);
    detail2.position.set(1.2, 1.1, 0.8);
    detail2.name = 'detail_2';
    group.add(detail2);

    return group;
}

// Move tank to grid position with animation
function moveTank(tank, targetGrid, duration = 400, cellSize = 4) {
    const startPos = tank.position.clone();
    const targetPos = new THREE.Vector3(
        targetGrid.col * cellSize + cellSize / 2,
        0,
        targetGrid.row * cellSize + cellSize / 2
    );
    
    const startTime = Date.now();
    
    function animateMovement() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in out for smooth movement
        const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        
        tank.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
        tank.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
        
        // Update rotation to face movement direction
        const angle = Math.atan2(targetPos.z - startPos.z, targetPos.x - startPos.x);
        tank.rotation.y = angle;
        
        if (progress < 1) {
            requestAnimationFrame(animateMovement);
        } else {
            // Movement complete
            tank.position.copy(targetPos);
            tank.userData.gridPosition = { ...targetGrid };
        }
    }
    
    animateMovement();
}

// Rotate tank turret
function rotateTurret(tank, angle) {
    const turret = tank.getObjectByName('turret');
    if (turret) {
        turret.rotation.y = angle;
    }
}

// Tank color presets
const TANK_COLORS = {
    player1: {
        body: 0x5a6d5a,
        turret: 0x4a7ba7,
        cannon: 0x3a3a3a,
        tracks: 0x4a4a4a,
        details: 0x3a4a3a
    },
    player2: {
        body: 0x874a2e,
        turret: 0xa76b4a,
        cannon: 0x3a3a3a,
        tracks: 0x6b4a2e,
        details: 0x6b3a2e
    },
    ai: {
        body: 0x6b4a2e,
        turret: 0x876b4a,
        cannon: 0x3a3a3a,
        tracks: 0x5b4a2e,
        details: 0x5b3a2e
    }
};

// Export for module pattern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createTank, moveTank, rotateTurret, TANK_COLORS };
}
