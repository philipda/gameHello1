// Camera controls setup
// This file will handle camera and input controls

// Export controls for use in main.js
let controls;

function initControls(camera, rendererDom) {
    controls = new THREE.OrbitControls(camera, rendererDom);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 40;
    controls.maxDistance = 300;
    controls.maxPolarAngle = Math.PI / 2.1;
    
    return controls;
}

// Keyboard input handler
const keyboard = {
    keys: {},
    
    init: function() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    },
    
    isDown: function(key) {
        return this.keys[key] || false;
    }
};

// Touch input handler
const touch = {
    startX: 0,
    startY: 0,
    isDragging: false,
    
    init: function(canvas) {
        canvas.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.isDragging = true;
        }, { passive: true });
        
        canvas.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                const dx = e.touches[0].clientX - this.startX;
                const dy = e.touches[0].clientY - this.startY;
                // Handle touch movement
            }
        }, { passive: true });
        
        canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
};

// Mouse input handler
const mouse = {
    position: { x: 0, y: 0 },
    isDown: false,
    
    init: function(canvas) {
        canvas.addEventListener('mousemove', (e) => {
            this.position.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.position.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });
        
        canvas.addEventListener('mousedown', () => {
            this.isDown = true;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.isDown = false;
        });
    }
};

// Raycaster for grid selection
let raycaster;

function initRaycaster(camera) {
    raycaster = new THREE.Raycaster();
    return raycaster;
}

// Get grid position from mouse/touch
function getGridPosition(mousePos, camera, objects) {
    if (!raycaster) {
        raycaster = new THREE.Raycaster();
    }
    
    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.intersectObjects(objects);
    
    if (intersects.length > 0) {
        const point = intersects[0].point;
        // Convert world position to grid coordinates
        const gridX = Math.floor(point.x / 4);
        const gridZ = Math.floor(point.z / 4);
        return { x: gridX, z: gridZ };
    }
    
    return null;
}

// Export for module pattern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initControls, keyboard, touch, mouse, initRaycaster, getGridPosition };
}
