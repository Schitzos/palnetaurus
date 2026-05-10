# Planetaurus — Agent Team Structure

**Managed by:** @PM (project-manager)  
**Project:** Planetaurus — Dinosaur-catching RPG  
**Goal:** Deliver MVP to production

---

## Team Roster

| Agent | Role | Responsibilities | Alias |
|---|---|---|---|
| product-owner | Product Owner | Product vision, backlog priority, acceptance criteria, scope decisions | `@PO` |
| project-manager | Senior Project Manager | Sprint planning, scope control, risk management, coordination | `@PM` |
| software-architect | Software Architect | Technical decisions, design patterns, folder structure, API contracts, scalability, tech debt | `@SA` |
| system-analyst | System Analyst | Requirements analysis, data models, state diagrams, sequence flows, integration specs | `@SYS` |
| game-designer | Game Designer | Game mechanics, balancing, dinosaur stats, encounter design, UX flow | `@GD` |
| ui-ux-designer | UI/UX Designer | User flows, wireframes, screen layouts, interaction patterns, accessibility | `@UX` |
| frontend-dev | Frontend Developer | React Native app, UI components, map rendering, battle UI, animations | `@FE` |
| backend-dev | Backend Developer | Node.js server, Socket.IO, multiplayer rooms, PvP sync, API | `@BE` |
| pixel-artist | Pixel Art Director | 2D sprite direction, tile assets, dinosaur sprites, UI art specs | `@ART` |
| qa-tester | QA Engineer | Test plans, bug tracking, acceptance testing, device compatibility | `@QA` |

---

## Agent Interaction Rules

1. **@PO** owns product vision and has final say on scope, priority, and acceptance criteria.
2. **@PM** assigns tasks and resolves priority conflicts. All agents report blockers to @PM.
3. **@SA** owns technical architecture — stack decisions, patterns, and API contracts require @SA sign-off.
4. **@SYS** translates @GD specs into technical requirements (data models, flows) for @FE and @BE.
5. **@GD** owns game design decisions — changes to mechanics require @GD sign-off and @PO approval.
6. **@UX** designs user flows and screen layouts — UX decisions require @PO approval.
7. **@FE** and **@BE** implement based on specs from @SYS and tasks from @PM.
8. **@ART** provides asset requirements and style guides; @FE integrates assets.
9. **@QA** validates acceptance criteria before any task is marked done.
10. No agent modifies another agent's domain without explicit approval.

---

## Communication Flow

```
@PO  → product decisions  → @PM, @GD, @UX
@PM  → assigns tasks      → all agents
@SA  → technical specs    → @FE, @BE, @SYS
@SYS → requirements docs  → @FE, @BE
@GD  → game design specs  → @SYS, @ART, @UX
@UX  → screen specs       → @FE, @ART
@FE  ↔ @BE               → API contracts, multiplayer integration
@QA  → validates          → all deliverables
@PM  ← status/blockers   ← all agents
```

---

## Epic Ownership

| Epic | Primary | Support |
|---|---|---|
| CATCH | @FE | @GD, @SYS, @BE |
| BATTLE | @FE | @GD, @SYS, @BE |
| TRAIN | @FE | @GD, @SYS |
| BOND | @FE | @GD, @SYS |
| RIDE | @FE | @GD, @SYS |
| DISCOVER | @FE | @GD, @SYS |
| CREATE | @FE | @GD, @SYS, @BE |
| MULTI | @BE | @SA, @FE |
| INFRA | @SA | @BE, @PM |
| ART | @ART | @GD |

---

## Git Branching Strategy

| Branch | Purpose | Who merges |
|---|---|---|
| `main` | Stable/release | @PM (after sprint completion) |
| `develop` | Integration branch | Workers via PR |
| `feature/[EPIC-ID]-description` | Worker feature branches | Worker creates, PR to `develop` |

### Rules
- Workers always branch from `develop`.
- Workers open PRs to `develop`, never directly to `main`.
- @SA reviews PR for architecture/pattern compliance.
- @QA validates functionality on `develop` before @PM merges to `main`.

---

## Definition of Ready (DoR)

Before @PM assigns a ticket to a worker, it must have:

- [ ] Acceptance criteria written in the issue body
- [ ] @SYS technical spec linked (for complex tasks)
- [ ] @SA architecture decision recorded (if introducing new pattern)
- [ ] @ART assets identified (if UI-facing)
- [ ] Epic label and priority assigned

---

## Sprint Ceremonies

| Checkpoint | When | Owner | Output |
|---|---|---|---|
| Sprint Planning | Sprint start | @PM | Published sprint backlog with assigned tickets |
| Mid-Sprint Check | Mid-sprint | @PM | Blocker report, re-prioritization if needed |
| Sprint Review | Sprint end | @QA, @PM | All Done tickets confirmed, CHANGELOG updated |

---

## Ticket Workflow (GitHub Projects Board)

### Lifecycle

```
@PM creates issue → Todo → @PM assigns to worker (@FE/@BE/@SYS/@ART)
Worker picks up   → In Progress (moved by worker)
Worker completes  → Review/QA (moved by worker)
@SA code review   → approved or request changes
@QA validates     → Done (moved by @QA if pass) or → In Progress (moved back if fail)
```

### Rules

1. **@PM** creates a GitHub issue for every task assigned to @FE, @BE, @SYS, or @ART. Issue must include:
   - Title: `[EPIC-ID] Task description`
   - Assignee: the worker agent
   - Labels: epic name, priority
   - Acceptance criteria in the issue body

2. **@PM** adds the issue to the GitHub Project board in **Todo** column, then delegates to the worker.

3. **Worker (@FE/@BE/@SYS/@ART)** moves the issue to **In Progress** when starting work.

4. **Worker** verifies before committing:
   - **@FE**: Run in Android emulator — zero red-screen errors, no console warnings from app code.
   - **@BE**: Run with `node` — server starts, all endpoints return expected status codes.
   - **@SYS**: Spec reviewed by @SA for technical accuracy.
   - **@ART**: Assets match style guide and are in correct format/resolution.
   - No commit is allowed until local verification passes.

5. **Worker** opens PR to `develop` and moves the issue to **Review/QA**.

6. **@SA** reviews PR for code quality, patterns, and architecture compliance.

7. **@QA** reviews against acceptance criteria:
   - ✅ Pass → moves issue to **Done**
   - ❌ Fail → adds comment with findings, moves issue back to **In Progress**

8. No issue is marked **Done** without @QA sign-off.

### Board Columns

| Column | Who moves here | Meaning |
|---|---|---|
| Todo | @PM | Created, not yet started |
| In Progress | @FE / @BE / @SYS / @ART | Actively being worked on |
| Review/QA | @FE / @BE / @SYS / @ART | Implementation complete, awaiting review |
| Done | @QA | Validated and accepted |

### GitHub CLI Commands Reference

```bash
# @PM creates issue
gh issue create --title "[EPIC-ID] Task" --body "AC: ..." --assignee <worker> --label <epic>,<priority>

# @PM adds to project board (Todo is default)
gh project item-add <PROJECT_NUMBER> --owner Schitzos --url <ISSUE_URL>

# Worker moves to In Progress
gh project item-edit --project-id <ID> --id <ITEM_ID> --field-id <STATUS_FIELD> --single-select-option-id <IN_PROGRESS_ID>

# Worker moves to Review/QA
gh project item-edit --project-id <ID> --id <ITEM_ID> --field-id <STATUS_FIELD> --single-select-option-id <REVIEW_ID>

# @QA moves to Done
gh project item-edit --project-id <ID> --id <ITEM_ID> --field-id <STATUS_FIELD> --single-select-option-id <DONE_ID>
```

---

## CHANGELOG

@PM maintains `CHANGELOG.md` at project root. Updated at the end of each sprint with:
- Features completed
- Bugs fixed
- Known issues

---



When you need a specific agent's perspective, use their alias:

- `@PO` — product vision, backlog priority, scope decisions, acceptance criteria
- `@PM` — planning, priorities, timelines, status
- `@SA` — architecture, design patterns, API contracts, tech decisions
- `@SYS` — data models, state diagrams, sequence flows, technical requirements
- `@GD` — game mechanics, balancing, design decisions
- `@UX` — user flows, wireframes, screen layouts, interaction patterns
- `@FE` — React Native implementation, UI, client-side logic
- `@BE` — server, multiplayer, API, infrastructure
- `@ART` — visual direction, sprite specs, asset pipeline
- `@QA` — test cases, bug reports, release readiness
