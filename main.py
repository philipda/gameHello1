"""
2D Isometric Tank Game with 3D Bird's Eye View
Controls: Arrow keys to move tank from bottom-left to top-right target
"""

import pygame
import sys
import math
from pygame.locals import *

# Initialize pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
GRAY = (100, 100, 100)
DARK_GREEN = (0, 100, 0)

# Tank properties
TANK_SIZE = 30
TANK_SPEED = 3

# Target properties
TARGET_SIZE = 20

# Isometric projection settings
ISO_ANGLE = 30  # degrees
ISO_SCALE = 1.0

class IsometricProjection:
    """Handle isometric projection for 3D bird's eye view"""
    
    def __init__(self, angle=30, scale=1.0):
        self.angle = math.radians(angle)
        self.scale = scale
        
    def project(self, x, y, z=0):
        """Convert 3D coordinates to 2D isometric screen coordinates"""
        iso_x = (x - z) * math.cos(self.angle)
        iso_y = (x + z) * math.sin(self.angle) - y
        return iso_x * self.scale, iso_y * self.scale

class Tank:
    """Player tank with isometric movement"""
    
    def __init__(self, x, y, z, projection):
        self.x = x
        self.y = y
        self.z = z
        self.projection = projection
        self.size = TANK_SIZE
        self.speed = TANK_SPEED
        self.direction = 0
        self.color = BLUE
        
    def move(self, dx=0, dy=0, dz=0):
        """Move tank in 3D space"""
        self.x += dx * self.speed
        self.y += dy * self.speed
        self.z += dz * self.speed
        
        if dx != 0 or dz != 0:
            self.direction = math.degrees(math.atan2(dz, dx))
    
    def get_screen_position(self):
        """Get tank position in screen coordinates"""
        return self.projection.project(self.x, self.y, self.z)
    
    def draw(self, screen, camera_offset):
        """Draw tank in isometric view"""
        screen_x, screen_y = self.get_screen_position()
        screen_x += camera_offset[0]
        screen_y += camera_offset[1]
        
        points = []
        for i in range(4):
            angle = self.direction + i * 90
            rad = math.radians(angle)
            px = screen_x + math.cos(rad) * self.size
            py = screen_y + math.sin(rad) * self.size
            points.append((px, py))
        
        pygame.draw.polygon(screen, self.color, points)
        
        turret_size = self.size * 0.6
        turret_points = []
        for i in range(4):
            angle = self.direction + i * 90 + 45
            rad = math.radians(angle)
            px = screen_x + math.cos(rad) * turret_size
            py = screen_y + math.sin(rad) * turret_size - 5
            turret_points.append((px, py))
        
        pygame.draw.polygon(screen, (50, 50, 150), turret_points)
        
        base_points = []
        for i in range(4):
            angle = self.direction + i * 90
            rad = math.radians(angle)
            px = screen_x + math.cos(rad) * (self.size * 0.8)
            py = screen_y + math.sin(rad) * (self.size * 0.8) + 5
            base_points.append((px, py))
        
        pygame.draw.polygon(screen, (30, 30, 30), base_points)

class Target:
    """Target at top-right corner"""
    
    def __init__(self, x, y, z, projection):
        self.x = x
        self.y = y
        self.z = z
        self.projection = projection
        self.size = TARGET_SIZE
        self.color = RED
        
    def get_screen_position(self):
        """Get target position in screen coordinates"""
        return self.projection.project(self.x, self.y, self.z)
    
    def draw(self, screen, camera_offset):
        """Draw target"""
        screen_x, screen_y = self.get_screen_position()
        screen_x += camera_offset[0]
        screen_y += camera_offset[1]
        
        pygame.draw.circle(screen, self.color, (int(screen_x), int(screen_y)), self.size)
        pygame.draw.circle(screen, WHITE, (int(screen_x), int(screen_y)), self.size - 5)
        pygame.draw.circle(screen, self.color, (int(screen_x), int(screen_y)), self.size - 10)

class Ground:
    """Game ground/terrain"""
    
    def __init__(self, width, depth, projection):
        self.width = width
        self.depth = depth
        self.projection = projection
        self.color = DARK_GREEN
        
    def draw(self, screen, camera_offset):
        """Draw ground grid in isometric view"""
        grid_size = 50
        
        for x in range(0, self.width, grid_size):
            for z in range(0, self.depth, grid_size):
                x1, y1 = self.projection.project(x, 0, z)
                x2, y2 = self.projection.project(x + grid_size, 0, z)
                x3, y3 = self.projection.project(x, 0, z + grid_size)
                
                x1 += camera_offset[0]
                y1 += camera_offset[1]
                x2 += camera_offset[0]
                y2 += camera_offset[1]
                x3 += camera_offset[0]
                y3 += camera_offset[1]
                
                pygame.draw.line(screen, (80, 80, 80), (x1, y1), (x2, y2), 1)
                pygame.draw.line(screen, (80, 80, 80), (x1, y1), (x3, y3), 1)

class Game:
    """Main game class"""
    
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("2D Isometric Tank Game - Bird's Eye View")
        self.clock = pygame.time.Clock()
        self.running = True
        self.font = pygame.font.SysFont('Arial', 24)
        self.projection = IsometricProjection(ISO_ANGLE, ISO_SCALE)
        self.ground = Ground(1000, 1000, self.projection)
        self.tank = Tank(100, 0, 800, self.projection)
        self.target = Target(800, 0, 100, self.projection)
        self.camera_offset = [SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2]
        self.game_over = False
        self.victory = False
    
    def handle_events(self):
        """Handle user input"""
        for event in pygame.event.get():
            if event.type == QUIT:
                self.running = False
            elif event.type == KEYDOWN:
                if event.key == K_ESCAPE:
                    self.running = False
                elif event.key == K_r and self.game_over:
                    self.tank = Tank(100, 0, 800, self.projection)
                    self.game_over = False
                    self.victory = False
        
        keys = pygame.key.get_pressed()
        if keys[K_LEFT] or keys[K_a]:
            self.tank.move(dx=-1, dz=0)
        if keys[K_RIGHT] or keys[K_d]:
            self.tank.move(dx=1, dz=0)
        if keys[K_UP] or keys[K_w]:
            self.tank.move(dx=0, dz=-1)
        if keys[K_DOWN] or keys[K_s]:
            self.tank.move(dx=0, dz=1)
        
        tank_pos = self.tank.get_screen_position()
        target_pos = self.target.get_screen_position()
        distance = math.sqrt((tank_pos[0] - target_pos[0])**2 + (tank_pos[1] - target_pos[1])**2)
        
        if distance < 30:
            self.game_over = True
            self.victory = True
    
    def update_camera(self):
        """Update camera to follow tank"""
        tank_screen_x, tank_screen_y = self.tank.get_screen_position()
        self.camera_offset[0] = SCREEN_WIDTH // 2 - tank_screen_x
        self.camera_offset[1] = SCREEN_HEIGHT // 2 - tank_screen_y
    
    def draw(self):
        """Draw game elements"""
        self.screen.fill(BLACK)
        self.ground.draw(self.screen, self.camera_offset)
        self.target.draw(self.screen, self.camera_offset)
        self.tank.draw(self.screen, self.camera_offset)
        
        if not self.game_over:
            instructions = "Arrow Keys/WASD: Move Tank | Reach Red Target"
            text = self.font.render(instructions, True, WHITE)
            self.screen.blit(text, (10, 10))
        else:
            if self.victory:
                message = "VICTORY! Press R to restart"
            else:
                message = "GAME OVER! Press R to restart"
            text = self.font.render(message, True, GREEN if self.victory else RED)
            text_rect = text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2))
            self.screen.blit(text, text_rect)
        
        tank_pos = self.tank.get_screen_position()
        target_pos = self.target.get_screen_position()
        distance = math.sqrt((tank_pos[0] - target_pos[0])**2 + (tank_pos[1] - target_pos[1])**2)
        distance_text = f"Distance to Target: {int(distance)}"
        text = self.font.render(distance_text, True, WHITE)
        self.screen.blit(text, (10, 50))
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        while self.running:
            self.handle_events()
            if not self.game_over:
                self.update_camera()
            self.draw()
            self.clock.tick(60)
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
