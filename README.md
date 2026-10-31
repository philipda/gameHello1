# 3D Tank Game

A web-based 3D tank game using Three.js with isometric view and grid-based movement.

## 🎮 Game Design

- **Grid System**: 50×50 grid, 4m × 4m per cell (200m × 200m total map)
- **Players**: 2 tanks (Player 1: Blue, Player 2: Brown)
- **Objective**: First to reach the yellow flag wins
- **Style**: Clean realistic tanks with 3D models
- **Technology**: Three.js for 3D rendering

## 🚀 Preview

Open `index.html` in a browser to see the 3D preview:
- **Mouse drag**: Rotate camera
- **Mouse scroll**: Zoom in/out
- **Controls**: None yet (preview only)

## 📁 Files

- `index.html` - Main game preview with Three.js
- `main.py` - Previous Python prototype (deprecated)

## 🎨 Design Specifications

### Tank Design
- **Size**: Fits in single 4m × 4m grid cell
- **Components**: Body, turret, cannon, tracks
- **Colors**:
  - Player 1: Olive green body, blue accents
  - Player 2: Brown body, rust accents

### Map Elements
- **Terrain**: Grass, dirt, roads, water
- **Obstacles**: Trees, buildings (small, large), destructible objects
- **Target**: Yellow flag at map center

### Grid System
- **50 × 50 cells** = 200m × 200m
- **Each cell**: 4m × 4m
- **Tank occupies**: 1 cell (centered)

## 📦 Dependencies

- Three.js (loaded from CDN)
- OrbitControls (for camera)

## 🎯 Next Steps

1. Review the 3D preview in `index.html`
2. Confirm tank and map designs
3. Implement movement mechanics
4. Add AI opponent
5. Add collision detection

## 📝 Notes

- Current preview has no controls - just visual design
- Tanks are positioned at (10,10) and (90,90)
- Flag is at center (50,50)
- Buildings and trees are decorative (no collision yet)
