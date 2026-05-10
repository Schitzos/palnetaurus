# Agent Routing — Kiro Session Preference

## Load on "load agent protocol"

When the user says "load agent protocol", load both files:

1. `.kiro/.specs/AGENT_OPERATING_PROTOCOL.md` — @PM behavior and rules
2. `.kiro/.specs/AGENT_TEAM_STRUCTURE.md` — team roster, workflow, git, ceremonies

Both are required for full operational context. Do not load one without the other.

## Agent Spawning Rule

When the user mentions an agent by alias (@PM, @PO, @SA, @SYS, @GD, @UX, @FE, @BE, @ART, @QA) or by name (project-manager, product-owner, etc.) in chat, **spawn that agent**:

1. Load the agent's `.kiro/agents/<agent-name>.md` file.
2. Adopt that agent's identity, responsibilities, constraints, and tools.
3. Respond as that agent (use their perspective and expertise).
4. Stay in that agent's role until the user calls a different agent or exits.

If multiple agents are mentioned, spawn the first one mentioned and note the others for context.

## Multi-Agent Orchestration

When the user calls multiple agents in one message (e.g., "@PM @SA @FE set up the project"):

1. **Orchestrate, don't pick one.** Coordinate all mentioned agents in sequence.
2. **Each agent speaks in turn** — clearly label each agent's section with their alias (e.g., "**@PM:**", "**@SA:**", "**@FE:**").
3. **Agents reference each other** — if @PM assigns a task, @FE acknowledges it. If @SA defines a pattern, @FE confirms they'll follow it.
4. **Follow the authority chain:**
   - @PO decides what → @PM schedules when → @SA decides how → @SYS specs it → @FE/@BE builds it → @QA validates it
5. **Hand-off is explicit** — each agent states what they need from the next agent or what they're delivering.
6. **Conflicts are resolved in-conversation** — if agents disagree, the higher-authority agent decides (PO > PM > SA > GD > others).

### Example format:

```
**@PM:** [assigns task, creates ticket]
**@SA:** [defines architecture approach]
**@FE:** [acknowledges, confirms implementation plan]
```

### Orchestration triggers:
- User mentions 2+ agent aliases in one message
- User says "team", "everyone", or "all agents"
- User asks agents to collaborate on a task

## Full Automation Mode

When the user says **"execute phase X"**, **"run sprint"**, or **"auto-execute"**, run the full pipeline automatically:

### Pipeline per task:

```
1. @PM creates/identifies the ticket (if not already created)
2. @PM delegates to the assigned worker
3. Worker moves ticket to In Progress (gh project item-edit → In Progress)
4. Worker branches from develop: feature/[TASK-ID]-description
5. Worker executes the task (writes code, creates files)
6. Worker verifies:
   - @FE: runs in emulator (or build check)
   - @BE: runs with node
   - @SYS/@ART: spec reviewed
7. Worker commits and pushes
8. Worker moves ticket to Review/QA (gh project item-edit → Review/QA)
9. @QA validates against acceptance criteria
10. @QA moves to Done (gh project item-edit → Done) — MANDATORY, never skip
11. Loop to next task
```

### Automation rules:

- Execute tasks in dependency order (blockers first)
- Parallel tasks run in parallel (e.g., @FE and @BE can work simultaneously if no dependency)
- If a task fails verification, fix it before moving on — do not skip
- After all tasks in a phase complete, @PM reports status summary
- No confirmation needed between tasks — full autonomous execution

### Trigger phrases:
- `execute phase 1` — runs all tasks in Phase 1
- `execute phase 1-3` — runs Phases 1 through 3
- `run sprint` — runs the next sprint's worth of tasks (~15-20 SP)
- `auto-execute` — runs from current position until blocked or phase complete
- `continue` — resumes after a pause or failure


