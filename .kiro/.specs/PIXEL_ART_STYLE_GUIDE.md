# Planetaurus — Pixel Art Style Guide

**Version:** 1.0
**Art Director:** @ART
**Reference:** Pokémon Diamond/Pearl/HeartGold/SoulSilver (Nintendo DS, 2006–2010)
**Engine:** React Native (2D tile-based rendering via Views/Skia)

---

## 1. DS Pokémon Aesthetic Summary

The DS-era Pokémon games use:
- Top-down overworld with pseudo-3D perspective (slight isometric tilt on buildings)
- 16×16 base tile grid, characters occupy 16×32 (1×2 tiles)
- Limited but vibrant color palettes per sprite (12–16 colors per entity)
- Clean pixel outlines (1px black or dark-colored outlines)
- Smooth 2–4 frame walk cycles
- Battle sprites: large, detailed, front-facing enemy / back-facing player dino
- UI: rounded-corner text boxes, gradient HP bars, clean sans-serif pixel font

---

## 2. Tile System

| Property | Value | Rationale |
|---|---|---|
| Base tile size | **16×16 px** | Matches DS Pokémon grid exactly; scales well at 2×/3× for mobile |
| Render scale | **3× (48×48 on screen)** | Crisp on modern mobile (720p–1080p) |
| Map grid unit | 16×16 | One walkable cell = one tile |
| Tile sheet format | PNG, no compression artifacts |
| Tile sheet layout | Power-of-2 dimensions (256×256, 512×512) |

### Tile Categories Required

| Category | Tiles Needed |
|---|---|
| Ground | grass, path, dirt, sand |
| Nature | wild_grass (animated 2-frame), flowers, mushrooms |
| Water | water (animated 3-frame), shore edges, waterfall |
| Obstacles | tree (16×32), rock, boulder, fence |
| Structures | house walls, roofs, doors, windows, signs |
| Interior | floor, carpet, furniture, shelves |
| Special | portal, cave entrance, lab door |

---

## 3. Color Palette Constraints

| Rule | Specification |
|---|---|
| Global palette | **32 colors max** (shared across all assets for cohesion) |
| Per-sprite limit | **12–16 colors** (including outline and shadow) |
| Outline color | Near-black (#1a1a2e) or dark hue-shifted per entity |
| Shadow style | 1-shade darker of base color (no dithering for DS look) |
| Highlight style | 1-shade lighter, placed top-left (light source: top-left) |
| Transparency | Index 0 or PNG alpha channel |

### Recommended Base Palette (32 colors)

```
Blacks/Grays:  #1a1a2e, #3d3d56, #6b6b7f, #a8a8b8, #e8e8f0
Greens:        #2d5a27, #4a8c3f, #7bc96f, #b8e8a0
Blues:          #1a3a5c, #2e6ea6, #5eb8e8, #a0daf0
Browns:        #4a2c17, #7a4e2a, #b8834a, #e8c88a
Reds/Oranges:  #6b1a1a, #c83030, #e87040, #f0b060
Yellows:       #8a7a10, #d4c030, #f0e868
Purples:       #3a1a5c, #7030a0, #b060e0
Skin/Warm:     #f0c8a0, #e8a070, #c87048
White:         #f8f8ff
```

---

## 4. Character Sprites (Overworld)

### Player Character

| Property | Value |
|---|---|
| Sprite size | **16×32 px** (1 tile wide, 2 tiles tall) |
| Directions | 4 (down, up, left, right) |
| Idle frames | 1 per direction |
| Walk frames | 4 per direction (step-left, stand, step-right, stand) |
| Run frames | 4 per direction |
| Total frames | 4 idle + 16 walk + 16 run = **36 frames** |
| Animation FPS | Walk: 8 fps, Run: 10 fps |

### NPC Characters

| Property | Value |
|---|---|
| Sprite size | **16×32 px** |
| Directions | 4 |
| Idle frames | 1–2 per direction |
| Walk frames | 4 per direction (optional, only for moving NPCs) |

### Riding Sprite

| Property | Value |
|---|---|
| Sprite size | **32×32 px** (player mounted on dinosaur) |
| Directions | 4 |
| Walk frames | 4 per direction |

---

## 5. Battle Sprites (Dinosaurs)

### Front Sprite (Wild/Enemy — facing player)

| Property | Value |
|---|---|
| Canvas size | **96×96 px** |
| Actual sprite | Centered within canvas, ~80×80 px max |
| Idle animation | 2 frames (subtle breathing/bob), 3 fps |
| Intro animation | Slide-in from right or fade-in |

### Back Sprite (Player's Dino — facing away)

| Property | Value |
|---|---|
| Canvas size | **96×96 px** |
| Actual sprite | Centered, ~80×80 px max |
| Idle animation | 2 frames, 3 fps |
| Attack animation | 3–4 frames, 10 fps |
| Hurt animation | 2 frames (flash white + shake) |
| Faint animation | 3 frames (sink downward + fade) |

### Overworld Dino Sprite (Following/Wild Grass)

| Property | Value |
|---|---|
| Sprite size | **16×32 px** or **32×32 px** (depending on dino size) |
| Directions | 4 |
| Walk frames | 4 per direction |

### Dino Icon (Menu/Team/Dinopedia)

| Property | Value |
|---|---|
| Size | **32×32 px** |
| Style | Front-facing portrait, simplified |

---

## 6. UI Element Specifications

### Text Box / Dialog

| Property | Value |
|---|---|
| Style | Rounded-corner rectangle, 2px border |
| Background | Semi-transparent dark (#1a1a2e at 90% opacity) or white panel |
| Border color | Light gray or themed color |
| Text color | White on dark, black on light |
| Font | Pixel font, 8px height (e.g., "Press Start 2P" or custom) |
| Position | Bottom of screen, full-width |
| Height | 48–64 px (at 1× scale) |

### HP Bar

| Property | Value |
|---|---|
| Dimensions | 48×6 px (at 1× scale) |
| Background | Dark gray (#3d3d56) |
| Fill gradient | Green (#4a8c3f → #7bc96f) > 50%, Yellow (#d4c030) 25–50%, Red (#c83030) < 25% |
| Border | 1px dark outline |
| Label | "HP" text left-aligned, level number right-aligned |

### SP Bar

| Property | Value |
|---|---|
| Dimensions | 48×4 px |
| Fill color | Blue (#2e6ea6 → #5eb8e8) |
| Full indicator | Glow/pulse animation when SP = 100 |

### Battle Menu

| Property | Value |
|---|---|
| Layout | 2×2 grid (Attack, Defend, Special, Item/Run) |
| Button size | 64×24 px per option |
| Style | Rounded rectangle, white fill, dark border |
| Selected state | Highlighted with accent color fill |
| Position | Bottom-right quadrant of battle screen |

### Inventory / Menu Panels

| Property | Value |
|---|---|
| Style | DS-era dual-panel look |
| Background | Gradient blue or themed color |
| List items | 16px row height, icon + text |
| Scrolling | Arrow indicators top/bottom |

---

## 7. Battle Scene Layout

```
┌─────────────────────────────────────┐
│  [Enemy Name]  Lv.XX                │
│  [████████░░] HP                    │
│                                     │
│              ┌──────┐               │
│              │ENEMY │ ← 96×96       │
│              │FRONT │               │
│              └──────┘               │
│                                     │
│    ┌──────┐                         │
│    │PLAYER│ ← 96×96                 │
│    │ BACK │                         │
│    └──────┘                         │
│                                     │
│  [Dino Name]  Lv.XX                 │
│  [████████░░] HP  [████] SP         │
├─────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐          │
│  │ ATTACK  │  │ DEFEND  │          │
│  ├─────────┤  ├─────────┤          │
│  │ SPECIAL │  │BALL/RUN │          │
│  └─────────┘  └─────────┘          │
└─────────────────────────────────────┘
```

### Battle Background

| Property | Value |
|---|---|
| Size | 256×128 px (scales to full width) |
| Style | Flat-color ground plane + simple sky/environment |
| Variants | grass_field, cave, water_edge, volcano, forest, lab |
| Parallax | None (static, DS-style) |

---

## 8. Recommended Free Asset Packs

### 8.1 World Map Tileset

| Field | Value |
|---|---|
| **Name** | Another RPG Tileset (16×16) |
| **Author** | fikrydev |
| **URL** | https://fikrydev.itch.io/another-rpg-tileset |
| **License** | CC-BY 4.0 (attribution required) |
| **Covers** | Grass, tall grass, cliffs, water, trees, bushes, flowers, fences, signs, chests |
| **Format** | PNG tileset + Aseprite source |
| **Fit** | Directly inspired by Pokémon tilesets; 16×16 base; perfect match |

### 8.2 Extended World Tileset (32×32 option)

| Field | Value |
|---|---|
| **Name** | FREE RPG Tileset 32×32 |
| **Author** | Pipoya |
| **URL** | https://pipoya.itch.io/pipoya-rpg-tileset-32x32 |
| **License** | Free for commercial/personal use; no redistribution; no attribution required |
| **Covers** | Outdoors (grass, water, paths, trees, cliffs), indoors (floors, furniture, walls), items, doors |
| **Format** | PNG, Tiled Map Editor compatible |
| **Fit** | Excellent JRPG style; use if 32×32 tile size is chosen instead |

### 8.3 Character Sprites

| Field | Value |
|---|---|
| **Name** | 16×16 RPG Character Sprite Sheet |
| **Author** | @javikolog (route1rodent) |
| **URL** | https://route1rodent.itch.io/16x16-rpg-character-sprite-sheet |
| **License** | CC-BY-SA 4.0 |
| **Covers** | Multiple characters, 4-direction walk animations, layered Aseprite file for customization |
| **Format** | PNG sprite sheet + Aseprite |
| **Fit** | Pokémon GBC/DS-inspired proportions; 16×32 character on 16×16 grid |

### 8.4 Alternative Character Sprites (Pokémon GBC style)

| Field | Value |
|---|---|
| **Name** | New 16×16 RPG Character Sprite Sheet |
| **Author** | @javikolog (route1rodent) |
| **URL** | https://route1rodent.itch.io/new-16x16-rpg-character-sprite-sheet |
| **License** | CC-BY-SA 4.0 |
| **Covers** | Pokémon Gold/Silver-inspired character template, centered pixel-perfect |
| **Format** | PNG + Aseprite |
| **Fit** | Explicitly inspired by Pokémon GBC era; excellent base for DS-style upscale |

### 8.5 Monster/Creature Sprites (Battle — Front + Back)

| Field | Value |
|---|---|
| **Name** | Retromon Free Pack |
| **Author** | Willibab |
| **URL** | https://willibab.itch.io/free-retro-pixel-monsters-sample-pack-1 |
| **License** | Free for personal and commercial use; credit Willibab; no resale; no NFT |
| **Covers** | 53+ creature sprites with variants; 10 include back sprites; retro Game Boy monster-taming style |
| **Format** | PNG (1×, 2×, 3× sizes available) |
| **Fit** | Designed specifically for monster-taming games; front+back sprites match Pokémon battle layout |

### 8.6 Monster Illustrations (Battle Portraits)

| Field | Value |
|---|---|
| **Name** | FREE RPG Monster Pack |
| **Author** | Pipoya |
| **URL** | https://pipoya.itch.io/free-rpg-monster-pack |
| **License** | Free for commercial/personal use; no redistribution; no attribution required |
| **Covers** | 50 monsters + 4 bosses, 3 color variations each, 480×480 px |
| **Format** | PNG |
| **Fit** | High-quality JRPG monster art; can be downscaled/pixelated for battle sprites or used as Dinopedia illustrations |

### 8.7 UI Elements

| Field | Value |
|---|---|
| **Name** | Pixel UI Pack (750 assets) |
| **Author** | Kenney |
| **URL** | https://opengameart.org/content/pixel-ui-pack-750-assets |
| **License** | CC0 (public domain) |
| **Covers** | Panels, buttons, sliders, checkboxes, arrows, cursors, bars, icons |
| **Format** | PNG |
| **Fit** | Retro pixel UI; perfect for HP bars, menus, dialog boxes |

### 8.8 Roguelike/RPG Tiles + Icons

| Field | Value |
|---|---|
| **Name** | Roguelike/RPG Pack |
| **Author** | Kenney |
| **URL** | https://www.kenney.nl/assets/roguelike-rpg-pack |
| **License** | CC0 (public domain) |
| **Covers** | 1,700+ 16×16 tiles: terrain, characters, items, monsters, UI elements |
| **Format** | PNG |
| **Fit** | Massive CC0 tile library; useful for item icons, supplementary tiles, prototype map |

### 8.9 Battle Pack (CC0 Battlers)

| Field | Value |
|---|---|
| **Name** | Mighty Battle Pack Addon |
| **Author** | The Mighty Palm |
| **URL** | https://themightypalm.itch.io/mighty-battle-pack-addon |
| **License** | CC0 (free to use and edit without credit) |
| **Covers** | Side-view battler sprites, monster sprites, RPG Maker compatible |
| **Format** | PNG |
| **Fit** | CC0 monster battlers; can be adapted for front/back battle view |

---

## 9. Custom Dinosaur Sprite Sheet Specification

Each dinosaur in Planetaurus requires the following sprite sheet:

### 9.1 Overworld Sprite Sheet

```
File: src/assets/dinos/{dino_id}/overworld.png
Size: 128×128 px (8 columns × 4 rows of 16×32 frames)

Layout:
  Row 0 (Down):  idle, walk1, walk2, walk3, walk4, _, _, _
  Row 1 (Up):    idle, walk1, walk2, walk3, walk4, _, _, _
  Row 2 (Left):  idle, walk1, walk2, walk3, walk4, _, _, _
  Row 3 (Right): idle, walk1, walk2, walk3, walk4, _, _, _

Frame size: 16×32 px
```

### 9.2 Battle Sprite Sheet — Front

```
File: src/assets/dinos/{dino_id}/battle_front.png
Size: 288×96 px (3 columns × 1 row)

Layout:
  Frame 0: idle_1 (96×96)
  Frame 1: idle_2 (96×96) — subtle breathing
  Frame 2: hurt (96×96) — flash/recoil pose

Frame size: 96×96 px
```

### 9.3 Battle Sprite Sheet — Back

```
File: src/assets/dinos/{dino_id}/battle_back.png
Size: 576×96 px (6 columns × 1 row)

Layout:
  Frame 0: idle_1 (96×96)
  Frame 1: idle_2 (96×96)
  Frame 2: attack_1 (96×96) — wind-up
  Frame 3: attack_2 (96×96) — strike
  Frame 4: hurt (96×96)
  Frame 5: faint (96×96) — sinking/fallen

Frame size: 96×96 px
```

### 9.4 Icon

```
File: src/assets/dinos/{dino_id}/icon.png
Size: 32×32 px
Style: Front-facing portrait, simplified
```

### 9.5 Silhouette

```
File: src/assets/dinos/{dino_id}/silhouette.png
Size: 96×96 px
Style: Solid black fill of front battle sprite shape
```

### 9.6 Animation Config (per dino)

```ts
export const DINO_SPRITE_CONFIG = {
  overworld: {
    frameWidth: 16,
    frameHeight: 32,
    directions: ["down", "up", "left", "right"],
    idleFrames: 1,
    walkFrames: 4,
    fps: 8,
  },
  battleFront: {
    frameWidth: 96,
    frameHeight: 96,
    idleFrames: 2,
    hurtFrames: 1,
    idleFps: 3,
  },
  battleBack: {
    frameWidth: 96,
    frameHeight: 96,
    idleFrames: 2,
    attackFrames: 2,
    hurtFrames: 1,
    faintFrames: 1,
    idleFps: 3,
    attackFps: 10,
  },
  icon: { width: 32, height: 32 },
  silhouette: { width: 96, height: 96 },
};
```

### 9.7 Naming Convention

```
src/assets/dinos/
  raptiny/
    overworld.png
    battle_front.png
    battle_back.png
    icon.png
    silhouette.png
    config.ts
  tricub/
    ...
  rexlet/
    ...
```

---

## 10. Tileset Requirements for World Map

### 10.1 Base Terrain Tileset

```
File: src/assets/tiles/terrain.png
Tile size: 16×16 px
Sheet size: 256×256 px (16×16 grid = 256 tile slots)

Required tiles:
  - grass (base, 2 variants)
  - grass_dark (forest floor)
  - wild_grass (2 animation frames — separate sheet or horizontal strip)
  - path_dirt (center + 8 edge/corner autotile pieces)
  - path_stone (center + 8 edge/corner pieces)
  - sand (center + edges)
  - water (3 animation frames + 8 shore edge pieces)
  - cliff_face (top, middle, bottom)
  - cliff_top (walkable top surface)
```

### 10.2 Nature Objects Tileset

```
File: src/assets/tiles/nature.png
Tile size: 16×16 px (objects may span multiple tiles)

Required tiles:
  - tree_small (16×32, occupies 1×2 tiles)
  - tree_large (32×32, occupies 2×2 tiles)
  - bush (16×16)
  - flower_red (16×16)
  - flower_yellow (16×16)
  - rock_small (16×16)
  - rock_large (32×16)
  - stump (16×16)
  - mushroom (16×16)
```

### 10.3 Structure Tileset

```
File: src/assets/tiles/structures.png
Tile size: 16×16 px

Required tiles:
  - house_wall (multiple variants)
  - house_roof (top, middle, edge pieces)
  - door (16×32, 3 animation frames for open)
  - window (16×16)
  - fence_horizontal, fence_vertical, fence_corner
  - sign (16×16)
  - lab_building (multi-tile composite)
  - pokecenter-equivalent healing station
```

### 10.4 Interior Tileset

```
File: src/assets/tiles/interior.png
Tile size: 16×16 px

Required tiles:
  - floor_wood, floor_tile, floor_carpet
  - wall_interior (top edge)
  - table, chair, bookshelf
  - bed (16×32)
  - PC/save_machine (16×32)
  - counter (16×16)
  - healing_machine (32×32)
  - lab_equipment (various)
```

### 10.5 Animated Tiles

| Tile | Frames | FPS | Method |
|---|---|---|---|
| wild_grass | 2 | 4 | Horizontal strip (32×16) |
| water | 3 | 3 | Horizontal strip (48×16) |
| portal | 4 | 6 | Horizontal strip (64×16) |
| door_open | 3 | 8 | Triggered animation |
| flowers_sway | 2 | 2 | Horizontal strip (32×16) |

### 10.6 Autotile Format

For terrain edges (water, paths, cliffs), use a **47-tile blob autotile** or simplified **16-tile** format:

```
Simplified 16-tile layout (4×4 grid per terrain type):
┌────┬────┬────┬────┐
│ TL │ T  │ TR │FULL│
├────┼────┼────┼────┤
│ L  │ C  │ R  │ V  │
├────┼────┼────┼────┤
│ BL │ B  │ BR │ H  │
├────┼────┼────┼────┤
│ITL │ITR │IBL │IBR │
└────┴────┴────┴────┘

TL=top-left corner, T=top edge, TR=top-right corner
L=left edge, C=center, R=right edge
BL=bottom-left, B=bottom, BR=bottom-right
ITL/ITR/IBL/IBR = inner corners
FULL=isolated, V=vertical strip, H=horizontal strip
```

---

## 11. File Naming Convention

```
category/name_state_frame.png

Examples:
  tiles/grass_base_0.png
  tiles/water_anim_0.png
  tiles/water_anim_1.png
  tiles/water_anim_2.png
  dinos/raptiny/overworld.png
  dinos/raptiny/battle_front.png
  dinos/raptiny/battle_back.png
  dinos/raptiny/icon.png
  dinos/raptiny/silhouette.png
  player/overworld.png
  ui/hp_bar_fill.png
  ui/textbox_bg.9.png
  battle/bg_forest.png
```

---

## 12. Rendering Notes for React Native

| Concern | Solution |
|---|---|
| Pixel-perfect scaling | Use `resizeMode: "nearest"` (or equivalent) to avoid bilinear filtering |
| Sprite sheet animation | Use Reanimated + frame offset calculation, or react-native-skia `drawImageRect` |
| Tile map rendering | Render visible tiles only (viewport culling); use `Image` components or Skia canvas |
| Transparency | All sprites use PNG with alpha channel |
| Asset loading | Pre-load all visible assets via `Asset.loadAsync` or equivalent |
| Scale factor | Render at 3× native (16px tile → 48px on screen) |

---

## 13. Priority Order for Asset Creation

1. **Player overworld sprite** (needed for map movement MVP)
2. **Base terrain tileset** (grass, path, wild_grass, tree, rock, water)
3. **3 starter dino battle sprites** (front + back for Raptiny, Tricub, Rexlet)
4. **3 starter dino overworld sprites**
5. **3 starter dino icons + silhouettes**
6. **UI: HP bar, SP bar, text box, battle menu**
7. **Battle backgrounds** (grass_field first)
8. **Wild dino battle sprites** (tiny_stego, leafy_saur, baby_ankylo, mini_ptera)
9. **NPC sprites** (professor, trainers)
10. **Item icons** (dino_ball, genes, blueprint)
11. **Interior tileset** (lab, healing station)
12. **Additional map tiles** (sand, cave, snow — later)

---

## 14. Attribution Template

For every asset used, add to `ATTRIBUTION.md`:

```md
## [Asset Name]
- **Source:** [URL]
- **Creator:** [Author name]
- **License:** [CC0 / CC-BY 4.0 / Custom free license]
- **Commercial use:** Yes/No
- **Attribution required:** Yes/No
- **Changes made:** [Describe modifications]
- **Used for:** [What it covers in Planetaurus]
```

---

*End of Pixel Art Style Guide — @ART*
