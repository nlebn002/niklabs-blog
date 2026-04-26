     Context

     You have empty .ai/, .claude/, .codex/ folders and active subscriptions for both Claude Code and Codex. Goal: a
     setup that is cheap to run (no duplicated context, default to small models, automate repetitive prompts) and
     productive (each tool used where it shines, plus cross-tool review for quality). Stack is .NET 10 modular monolith
     (Blog + Auth modules, EF Core, Postgres, MinIO) plus a React/Vite/TypeScript frontend with Orval-generated API
     client.

     Decisions locked from clarification:
     1. Single source of truth in .ai/ — .claude/CLAUDE.md and .codex/AGENTS.md are thin stubs that import from
     .ai/context/*.
     2. Specialized roles per phase — Claude plans + reviews, Codex implements long autonomous runs, cross-review by the
      other tool.
     3. Solo project — everything is committed. Personal overrides only via *.local.json.

     ---
     1. Folder structure

     .ai/                                # Tool-agnostic, single source of truth
       README.md                         # What's in here, how Claude/Codex use it
       context/                          # Loaded by both tools at session start
         01-project.md                   # Mission, MVP behavior, current scope
         02-stack.md                     # .NET 10, EF, Postgres, MinIO, React/Vite, Orval
         03-architecture.md              # Modular monolith, vertical slices, clean boundaries
         04-backend.md                   # Module layout, handler pattern, DI, EF contexts
         05-frontend.md                  # FSD-ish layout, TanStack Query, custom-fetch + CSRF
         06-api-contract.md              # OpenAPI -> Orval flow, regeneration rules
         07-conventions.md               # Naming, file placement, comment policy, no-mocks rule etc.
         08-testing.md                   # What to test, where tests live, how to run them
         09-runbook.md                   # docker compose, dotnet run, npm run dev, ports
         10-glossary.md                  # Domain terms (post, draft, slug, tag, media asset...)
       specs/                            # Per-feature briefs (the unit of work)
         _template.md
         YYYY-MM-DD-<slug>.md            # One file per feature; both tools read these
       decisions/                        # ADRs (one-pagers)
         _template.md
         0001-modular-monolith.md
         0002-orval-for-api-client.md
       prompts/                          # Reusable prompt fragments both tools include
         add-endpoint.md                 # "How to add a new minimal-API endpoint here"
         add-migration.md                # Wraps the dotnet ef commands in docs/migrations.md
         regen-openapi.md                # The orval flow
         review-checklist.md             # What a good review checks for in this repo
       workflows/
         plan-implement-review.md        # The standard 3-phase loop (see section 3)
         feature-from-zero.md            # Walkthrough for a new feature, end to end

     .claude/                            # Claude Code-specific config
       CLAUDE.md                         # 10-line stub: imports .ai/context/* via @-refs
       settings.json                     # Permissions, hooks, status line, default model
       agents/                           # Subagent definitions
         explorer.md                     # Sonnet, read-only research
         planner.md                      # Opus, designs implementation plan
         reviewer.md                     # Opus, independent review of a diff
         backend-implementer.md          # Sonnet, .NET/EF specialist
         frontend-implementer.md         # Sonnet, React/Orval/Tailwind specialist
         db-migrator.md                  # Sonnet, runs the migration commands safely
       commands/                         # Slash commands (your muscle memory)
         spec.md                         # /spec <name> -> drafts a spec into .ai/specs
         plan.md                         # /plan -> launches planner agent on the active spec
         implement.md                    # /implement -> executes the plan from the spec
         review.md                       # /review -> reviewer agent on current diff
         api-sync.md                     # /api-sync -> regenerate OpenAPI -> Orval
         migration.md                    # /migration add|update|remove <name>
         handoff.md                      # /handoff -> writes a HANDOFF.md so Codex can pick up
       output-styles/                    # Optional: terse default style

     .codex/                             # Codex CLI-specific config
       AGENTS.md                         # 10-line stub: imports .ai/context/* via @-refs
       config.toml                       # Model, reasoning effort, sandbox, approvals
       prompts/                          # Codex saved prompts (mirror .claude/commands roles)
         implement.md                    # Long-running autonomous implement of a spec
         parallel-explore.md             # Independent investigation, returns a brief
         review.md                       # Independent review of a Claude-authored diff

     Why this shape

     - .ai/context/ is the only place facts about the project live. Both tools' entry files use @.ai/context/* style
     imports so neither tool re-states architecture; you edit one file and both tools update.
     - .ai/specs/ is the unit of handoff between tools. Claude writes the spec, Codex implements it, Claude reviews. The
      spec file is the contract — no need to re-explain the task in chat.
     - .claude/agents/ and .codex/prompts/ mirror each other so the same role (planner, reviewer, implementer) exists in
      both tools — you can switch tool without re-learning the workflow.

     ---
     2. What goes in each thin stub

     .claude/CLAUDE.md (≈ 15 lines):
     # Project context for Claude
     @./../.ai/context/01-project.md
     @./../.ai/context/02-stack.md
     @./../.ai/context/03-architecture.md
     @./../.ai/context/07-conventions.md
     @./../.ai/context/09-runbook.md

     Active spec (if any): see .ai/specs/ — pick the most recent or the one referenced in the user's message.
     Default model: Sonnet 4.6. Escalate to Opus 4.7 only for /plan and /review.

     .codex/AGENTS.md: same idea, same imports — Codex respects AGENTS.md natively.

     .codex/config.toml (key knobs for cost):
     - model = "gpt-5-codex", model_reasoning_effort = "medium" for default
     - A profile [profiles.deep] with model_reasoning_effort = "high" for hard problems only
     - approval_policy = "on-request" and sandbox_mode = "workspace-write" to keep Codex fast without surprises

     .claude/settings.json (key knobs):
     - permissions.allow: Bash(dotnet build), Bash(dotnet test), Bash(dotnet ef *), Bash(npm run *), Bash(git status),
     Bash(git diff*), Bash(docker compose *) — kills 80% of permission prompts
     - permissions.deny: Bash(git push*), Bash(git reset --hard*), Bash(rm -rf*) — keeps destructive ops gated even in
     auto-accept
     - hooks.Stop: a desktop notification so you don't pay for an idle agent waiting on you
     - model: claude-sonnet-4-6 as default; Opus is opt-in per agent definition

     ---
     3. How your daily work looks

     The repeating loop is Spec → Plan → Implement → Review → Merge, with each step using the cheapest tool that does
     the job well.

     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │ 1. SPEC      │ →  │ 2. PLAN      │ →  │ 3. IMPLEMENT │ →  │ 4. REVIEW    │
     │ Claude /spec │    │ Claude /plan │    │ Codex        │    │ Claude /rev. │
     │ Sonnet       │    │ Opus         │    │ gpt-5-codex  │    │ Opus         │
     │ → .ai/specs  │    │ → spec ++    │    │ uses spec    │    │ on diff      │
     └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

     Step 1 — Spec (Claude, cheap)

     - Run /spec <feature-name>. Claude reads .ai/context/* plus the relevant code, then writes
     .ai/specs/YYYY-MM-DD-<slug>.md with: problem, scope, files-to-touch, acceptance criteria, explicitly out of scope.
     - This is the single artifact both tools will use. Edit it by hand if needed — it's just markdown.

     Step 2 — Plan (Claude in plan mode, Opus)

     - /plan launches the planner agent (Opus) which expands the spec into an ordered implementation plan with file
     paths and reuse opportunities. Lands as a "Plan" section appended to the same spec file.
     - Cost guard: Opus runs only here, on a pre-trimmed spec (~1-3k tokens), not on the whole repo.

     Step 3 — Implement (Codex, autonomous)

     - codex exec --profile default "implement spec .ai/specs/<file>" — Codex is great at long autonomous runs and will
     plough through 80% of the spec without intervention. Use --profile deep for hard ones.
     - Alternative: stay in Claude with /implement (Sonnet) for smal/modl/local changes where switching tools is more
     friction than the work itself.
     - After implementation, the implementer also runs dotnet build and npm run build and reports any failures.

     Step 4 — Review (cross-tool, Opus)

     - Whoever did not implement the change reviews it. Claude implemented? Run Codex's review prompt. Codex
     implemented? Run Claude's /review (Opus) — this is exactly what Opus is good at.
     - Review checklist lives in .ai/prompts/review-checklist.md so it's the same lens both ways: contract drift
     (OpenAPI/Orval), migration safety (Blog + Auth contexts separately), CSRF/cookie behavior, FSD layering on the
     frontend, no leaked secrets.

     Step 5 — Merge (you)

     - Reviewer approves → you merge. AI never pushes; that stays manual.

     Special flows

     - Bug fixes: skip Step 1, use /plan directly with the bug description; fix is too small to deserve a spec file.
     - Pure exploration ("how does X work?"): use Claude's Explore subagent or Codex's parallel-explore prompt — never
     burn Opus on a question.
     - Migrations: /migration slash command wraps docs/migrations.md so you don't paste the long EF commands by hand.
     Always run Blog and Auth contexts separately (already documented).
     - OpenAPI changes: /api-sync runs npm run generate:api and stages the regenerated client; the diff is part of the
     same PR/commit.

     ---
     4. Cost-effectiveness rules baked into the setup

     1. One canonical context,a is loaded via @-imports; both tools see identical
     content. Updating 02-stack.md updates Claude and Codex at once.
     2. Tier the models. Sonnet 4.6 is the default everywhere. Opus 4.7 is opt-in (/plan, /review, planner/reviewer
     agents only). Codex high-reasoning is a named deep profile, never default.
     3. Pre-allow read-only and routine commands. dotnet build, dotnet test, npm run *, git status/diff in
     permissions.allow — every saved permission prompt is one fewer round trip.
     4. Specs are the handoff unit, not chat. A 1k-token spec costs less than re-explaining the feature in chat to a
     fresh agent, and survives across sessions.
     5. Cross-review instead of cross-implementation. Don't run both tools on the same code — that burns 2× quota for
     marginal gain. Run one to implement, the other to review.
     6. Plan mode aggressively. Opus in plan mode is much cheaper than Opus implementing — it reads, doesn't edit. Get
     the plan right once, then implement with Sonnet.
     7. Stop hooks save idle billing. Desktop notification on Stop means you come back when the agent finishes, instead
     of an agent looping while you're away.
     8. Background long-running commands. Builds, docker compose up, npm run dev — start in background, don't have an
     agent stand and watch.

     ---
     5. Files to be created (read-only summary, no code yet)

     Critical files when implementation begins:

     - .ai/README.md, .ai/context/01-project.md … 10-glossary.md
     - .ai/specs/_template.md, .ai/decisions/_template.md
     - .ai/prompts/add-endpoint.md, add-migration.md, regen-openapi.md, review-checklist.md
     - .ai/workflows/plan-implement-review.md
     - .claude/CLAUDE.md, .claude/settings.json
     - .claude/agents/{explorer,planner,reviewer,backend-implementer,frontend-implementer,db-migrator}.md
     - .claude/commands/{spec,plan,implement,review,api-sync,migration,handoff}.md
     - .codex/AGENTS.md, .codex/config.toml
     - .codex/prompts/{implement,parallel-explore,review}.md

     Sources of truth that the new files should mirror — these already exist and must NOT be re-described, only linked:
     - README.md (root) — overall solution structure
     - frontend/README.md — frontend stack and Orval flow
     - docs/migrations.md — the EF migration commands

     ---
     6. Verification

     When you start implementing this plan:

     1. Context import sanity — open Claude Code in this repo; the first message's system context should include the
     contents of .ai/context/01-project.md (visible via /context). Same for Codex via codex --help/session start log.
     2. Permission prompts dropped — run a normal task; observe that dotnet build, npm run dev, git status no longer
     prompt.
     3. Spec round-trip — /spec test-feature produces a file in .ai/specs/. /plan appends a Plan section. Run Codex
     implement on the same file end-to-end without re-pasting requirements.
     4. Cross-review smoke test — make a one-line change with Codex, run /review in Claude; the reviewer should
     reference the actual diff, not hallucinate.
     5. Cost spot check — after a week, look at Anthropic's usage dashboard: Opus tokens should be < 25% of Claude
     usage; the rest Sonnet/Haiku. If Opus dominates, the planner/reviewer agents are being used too eagerly — tighten
     their triggers.

● Plan approved. The user's original request was "don't write any code" — they wanted strategy guidance, not
  implementation. The plan file is the deliverable.

  The plan lays out:
  - .ai/ as the single source of truth (context, specs, prompts, ADRs, workflows)
  - .claude/ and .codex/ as thin stubs that @-import from .ai/
  - A Spec → Plan → Implement → Review loop where Claude plans + reviews (Opus, sparingly), Codex implements (long
  autonomous runs), and the other tool reviews
  - Eight cost-effectiveness rules: one canonical context, tiered models, pre-allowed routine commands, specs as handoff
   unit, cross-review (not cross-implementation), aggressive plan mode, Stop hooks, background long-running commands

  When you're ready to scaffold the files, just say the word — happy to start with .ai/context/* since that's what
  unblocks both tools.