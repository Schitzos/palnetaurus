# Planetaurus — Master Task List (by Phase)

**Managed by:** @PM  
**Velocity:** 15–20 SP/sprint (solo dev, 1-week sprints)  
**Epic priority:** INFRA → BATTLE → CATCH → DISCOVER → TRAIN → BOND → RIDE → CREATE → MULTI

---

## Phase 1: Project Foundation

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| INFRA-001 | Create monorepo structure (apps/mobile, apps/server, packages/shared) | @SA, @FE | 3 | Todo |
| INFRA-002 | Initialize React Native + TypeScript project (apps/mobile) | @FE | 3 | Todo |
| INFRA-003 | Initialize Node.js + Express + Socket.IO project (apps/server) | @BE | 3 | Todo |
| INFRA-004 | Set up shared types package (packages/shared) | @SA | 2 | Todo |
| INFRA-005 | Configure ESLint + Prettier for monorepo | @SA | 2 | Todo |
| INFRA-006 | Set up Zustand store boilerplate (mobile) | @FE | 2 | Todo |
| INFRA-007 | Set up MMKV local storage utility (mobile) | @FE | 2 | Todo |
| INFRA-008 | Set up React Navigation skeleton (15 screens) | @FE | 3 | Todo |
| INFRA-009 | Create asset folder structure per GDD §15.3 | @FE | 1 | Todo |
| INFRA-010 | Create ATTRIBUTION.md and LICENSE_NOTES.md | @FE | 1 | Todo |
| INFRA-011 | Create develop branch and push | @PM | 1 | Todo |
| INFRA-012 | Create GitHub Project board (Todo/InProgress/Review/Done) | @PM | 1 | Todo |

**Phase 1 total: 24 SP | ~1.5 sprints**

---

## Phase 2: Starter Selection

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| START-001 | Build TitleScreen (New Game / Continue) | @FE | 2 | Todo |
| START-002 | Build StarterSelectScreen (3 dinos with stats preview) | @FE | 3 | Todo |
| START-003 | Implement starter dino data (Raptiny, Tricub, Rexlet) | @GD | 1 | Todo |

**Phase 2 total: 6 SP | ~0.5 sprint**

---

## Phase 3: Local Save

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| SAVE-001 | Implement local save/load with MMKV (GameSave type) | @FE | 3 | Todo |
| SAVE-002 | Auto-save on map transition and key events | @FE | 2 | Todo |
| SAVE-003 | Continue game flow (load save → restore position) | @FE | 2 | Todo |

**Phase 3 total: 7 SP | ~0.5 sprint**

---

## Phase 4: World Map & Terrain

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| MAP-001 | Create Starter Valley map data | @GD | 2 | Todo |
| MAP-002 | Implement tile-based map renderer | @FE | 5 | Todo |
| MAP-003 | Implement D-pad movement + collision checking | @FE | 3 | Todo |
| MAP-004 | Implement terrain config (walkability, encounter rules) | @FE | 2 | Todo |
| MAP-005 | Implement portal/map transitions | @FE | 3 | Todo |
| MAP-006 | Build WorldMapScreen with HUD | @FE | 3 | Todo |

**Phase 4 total: 18 SP | ~1 sprint**

---

## Phase 5: Wild Encounter System

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| DISCOVER-001 | Implement encounter trigger (shouldTriggerEncounter) | @FE | 2 | Todo |
| DISCOVER-002 | Implement weighted encounter picker (pickWeightedEncounter) | @FE | 2 | Todo |
| DISCOVER-003 | Create encounter tables data (starter_valley_grass) | @GD | 2 | Todo |
| DISCOVER-004 | Wild dino instance generation (level, stats scaling) | @FE | 3 | Todo |
| DISCOVER-005 | Transition from map to battle on encounter | @FE | 2 | Todo |

**Phase 5 total: 11 SP | ~0.5 sprint**

---

## Phase 6: Battle HP/SP System

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| BATTLE-001 | Define battle state machine (spec) | @SYS | 3 | Todo |
| BATTLE-002 | Implement damage formula (calculateDamage) | @FE | 2 | Todo |
| BATTLE-003 | Implement SP system (gain on attack/defend/damage, reset on special) | @FE | 3 | Todo |
| BATTLE-004 | Implement battle actions: Attack, Defend, Run | @FE | 5 | Todo |
| BATTLE-005 | Implement Special Move (available at full SP, resets to 0) | @FE | 3 | Todo |
| BATTLE-006 | Implement wild dino AI (random action selection) | @FE | 3 | Todo |
| BATTLE-007 | Build BattleScreen UI (HP/SP bars, action buttons, dino sprites) | @FE | 5 | Todo |
| BATTLE-008 | Battle win/lose flow (EXP gain, return to map, faint handling) | @FE | 3 | Todo |
| BATTLE-009 | Unit tests for battle formulas | @QA | 2 | Todo |

**Phase 6 total: 29 SP | ~2 sprints**

---

## Phase 7: Dino Ball Catch

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| CATCH-001 | Implement catch chance formula (calculateCatchChance) | @FE | 2 | Todo |
| CATCH-002 | Add Dino Ball action to battle (consumes inventory) | @FE | 3 | Todo |
| CATCH-003 | Catch success/fail flow (add to collection, update Dinopedia) | @FE | 3 | Todo |
| CATCH-004 | Catch animation/feedback UI | @FE | 3 | Todo |
| CATCH-005 | Unit tests for catch formula | @QA | 1 | Todo |

**Phase 7 total: 12 SP | ~1 sprint**

---

## Phase 8: Dinopedia

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| DINO-001 | Build DinopediaScreen (silhouette/seen/caught/created states) | @FE | 5 | Todo |
| DINO-002 | Dinopedia state updates on see/catch/create events | @FE | 2 | Todo |
| DINO-003 | Build TeamScreen (view owned dinos, stats, moves) | @FE | 3 | Todo |

**Phase 8 total: 10 SP | ~0.5 sprint**

---

## Phase 9: Training & Play

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| TRAIN-001 | Define training mechanics spec (energy, stat EXP, limits) | @SYS | 2 | Todo |
| TRAIN-002 | Implement training logic (5 types → stat gains) | @FE | 3 | Todo |
| TRAIN-003 | Build TrainingScreen UI | @FE | 3 | Todo |
| BOND-001 | Define bond progression spec (Shy→Friendly→Loyal→Best Partner) | @SYS | 2 | Todo |
| BOND-002 | Implement play interactions (feed, pet, play ball, clean, rest) | @FE | 3 | Todo |
| BOND-003 | Build PlayWithDinoScreen UI | @FE | 3 | Todo |
| BOND-004 | Bond level effects (training bonus, ride unlock, SP bonus) | @FE | 3 | Todo |
| BOND-005 | Unit tests for training + bond | @QA | 2 | Todo |

**Phase 9 total: 21 SP | ~1.5 sprints**

---

## Phase 10: Ride System

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| RIDE-001 | Implement canRideDino logic (height, bond, HP checks) | @FE | 2 | Todo |
| RIDE-002 | Ride state in world map (faster movement, mounted sprite) | @FE | 3 | Todo |
| RIDE-003 | Ride UI (mount/dismount, eligible dino list) | @FE | 3 | Todo |
| RIDE-004 | Unit tests for ride eligibility | @QA | 1 | Todo |

**Phase 10 total: 9 SP | ~0.5 sprint**

---

## Phase 11: Item Drop System

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| CREATE-001 | Implement item drop system (post-battle rolls, drop tables) | @FE | 3 | Todo |
| CREATE-002 | Build InventoryScreen UI | @FE | 3 | Todo |
| CREATE-003 | Inventory state management (add/remove/use items) | @FE | 2 | Todo |

**Phase 11 total: 8 SP | ~0.5 sprint**

---

## Phase 12: Dino Lab

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| CREATE-004 | Define gene combination rules spec | @SYS | 2 | Todo |
| CREATE-005 | Implement Dino Lab creation logic (blueprint + genes → dino) | @FE | 5 | Todo |
| CREATE-006 | Build DinoLabScreen UI (gene selection, preview, naming) | @FE | 5 | Todo |
| CREATE-007 | Register created dino in collection + Dinopedia | @FE | 2 | Todo |
| CREATE-008 | Unit tests for creation logic | @QA | 2 | Todo |

**Phase 12 total: 16 SP | ~1 sprint**

---

## Phase 13: Asset Manifest & Attribution

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| ART-001 | Define pixel art style guide (palette, resolution, tile size) | @ART | 2 | Todo |
| ART-002 | Spec starter dino sprites (3 dinos × 5 states) | @ART | 3 | Todo |
| ART-003 | Spec world map tiles (8 terrain types) | @ART | 2 | Todo |
| ART-004 | Spec player character sprites (6 states) | @ART | 2 | Todo |
| ART-005 | Spec UI elements (buttons, panels, bars) | @ART | 2 | Todo |
| ART-006 | Create assetManifest.ts | @FE | 2 | Todo |

**Phase 13 total: 13 SP | ~1 sprint**

---

## Phase 14: Prototype Asset Import

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| ART-007 | Import prototype assets from CC0/CC-BY sources | @FE | 3 | Todo |
| ART-008 | Verify all assets have attribution entries | @QA | 1 | Todo |

**Phase 14 total: 4 SP | ~0.25 sprint**

---

## Phase 15: Multiplayer Server

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| MULTI-001 | Implement room create/join/leave (server) | @BE | 5 | Todo |
| MULTI-002 | Implement movement validation (server) | @BE | 3 | Todo |
| MULTI-003 | Implement player:move broadcast (server) | @BE | 3 | Todo |

**Phase 15 total: 11 SP | ~0.5 sprint**

---

## Phase 16: Multiplayer Movement Sync

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| MULTI-004 | Socket.IO client integration (mobile) | @FE | 3 | Todo |
| MULTI-005 | Build MultiplayerLobbyScreen + RoomScreen UI | @FE | 5 | Todo |
| MULTI-006 | Render other player on world map | @FE | 3 | Todo |

**Phase 16 total: 11 SP | ~0.5 sprint**

---

## Phase 17: PvP Request

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| MULTI-007 | Implement PvP battle request/accept/reject (server) | @BE | 3 | Todo |
| MULTI-008 | PvP battle request modal (mobile) | @FE | 2 | Todo |
| MULTI-009 | PvP battle sync (server + client) | @BE, @FE | 5 | Todo |
| MULTI-010 | Integration tests for multiplayer flow | @QA | 3 | Todo |

**Phase 17 total: 13 SP | ~1 sprint**

---

## Phase 18: UI/Audio Polish

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| POLISH-001 | UI polish pass (animations, transitions, feedback) | @FE | 5 | Todo |
| POLISH-002 | Add SFX placeholders | @FE | 2 | Todo |
| POLISH-003 | Add BGM placeholders | @FE | 2 | Todo |
| POLISH-004 | Settings screen (volume, save management) | @FE | 3 | Todo |

**Phase 18 total: 12 SP | ~1 sprint**

---

## Phase 19: QA

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| QA-001 | Full regression test on Android emulator | @QA | 5 | Todo |
| QA-002 | Multiplayer integration test (2 devices) | @QA | 3 | Todo |
| QA-003 | Bug fix sprint | @FE, @BE | 5 | Todo |
| QA-004 | Release readiness checklist | @PM, @QA | 1 | Todo |

**Phase 19 total: 14 SP | ~1 sprint**

---

## Phase 20: Future 3D Battle Prototype (Post-MVP)

| ID | Task | Owner | SP | Status |
|---|---|---|---|---|
| FUTURE-001 | Research 3D asset pipeline (Blender → RN or Unity) | @SA | — | Later |
| FUTURE-002 | Prototype one 3D battle scene | @FE | — | Later |

**Phase 20: Post-MVP — not estimated**

---

## Summary by Phase

| Phase | Name | SP | Sprints |
|---|---|---|---|
| 1 | Project Foundation | 24 | 1.5 |
| 2 | Starter Selection | 6 | 0.5 |
| 3 | Local Save | 7 | 0.5 |
| 4 | World Map & Terrain | 18 | 1 |
| 5 | Wild Encounter | 11 | 0.5 |
| 6 | Battle HP/SP | 29 | 2 |
| 7 | Dino Ball Catch | 12 | 1 |
| 8 | Dinopedia | 10 | 0.5 |
| 9 | Training & Play | 21 | 1.5 |
| 10 | Ride System | 9 | 0.5 |
| 11 | Item Drop | 8 | 0.5 |
| 12 | Dino Lab | 16 | 1 |
| 13 | Asset Manifest | 13 | 1 |
| 14 | Asset Import | 4 | 0.25 |
| 15 | Multiplayer Server | 11 | 0.5 |
| 16 | Multiplayer Sync | 11 | 0.5 |
| 17 | PvP Request | 13 | 1 |
| 18 | UI/Audio Polish | 12 | 1 |
| 19 | QA | 14 | 1 |
| 20 | 3D Prototype | — | Post-MVP |
| **TOTAL** | | **249 SP** | **~16 sprints (~4 months)** |
