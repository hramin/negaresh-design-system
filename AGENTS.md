
# AGENTS.md — Negaresh Design System

## Source of truth

This repository was originally developed using Claude Code.

Read `CLAUDE.md` completely before doing any work.
All architectural, visual, accessibility, localization,
testing and component rules in that file are binding
for Codex as well.

Read these documents before proposing changes:

1. `docs/00-overview.md`
2. `docs/01-decisions.md`
3. `docs/02-requirements.md`
4. `docs/03-architecture.md`
5. `docs/04-stack.md`
6. `docs/quality.md`
7. `docs/phases/README.md`
8. The active `docs/phases/P*.md` file

Read the relevant foundation and component documents
for the task at hand.

Do not replace or reinterpret approved design decisions.
If requirements or code conflict with a decision,
report the conflict before implementing changes.

## Phase gates

- Work on only one approved scope at a time.
- Never start a phase before its predecessor is
  explicitly marked Approved by the owner.
- A passing CI run is not owner approval.
- Do not infer phase completion from the presence of code.
- Preserve all previously approved functionality.
- Do not mark a phase Approved on the owner's behalf.

## Implementation rules

- Use the existing architecture and pinned dependencies.
- Read current version-specific library documentation
  using Context7 when available.
- If Context7 is unavailable, inspect installed package
  docs and types, and disclose the limitation.
- Follow every non-negotiable rule in CLAUDE.md.
- Use semantic design tokens, CSS Modules, and
  CSS logical properties.
- Use React Aria Components for supported interactions.
- Preserve RTL, Persian localization, accessibility,
  SSR compatibility, and light/dark themes.
- Do not introduce new dependencies without justification.
- Do not change previously approved visual references
  without explicit owner approval.

## Execution workflow

Before writing code:
1. Inspect the branch, working tree and existing code.
2. Compare implementation with phase acceptance criteria.
3. Identify dependencies, open questions and risks.
4. Propose small, independently reviewable PRs.
5. Present the plan and obtain scope approval.

For each approved component family:
1. Tokens and semantic roles
2. CSS Modules
3. React component and public API
4. Documentation and states gallery
5. Unit and accessibility tests
6. SSR and RTL verification
7. Visual snapshots for light/dark and desktop/mobile

Validate using the repository's existing commands.
Report exact results; never claim tests passed
unless they were actually executed or verified.

Update documentation and component statuses accurately.
Use Conventional Commits and Changesets when applicable.

Do not merge PRs, deploy, publish packages, or start
the next phase without explicit owner approval.

At the end of a phase, report:
- Implemented scope
- Changed files and public APIs
- Test and CI evidence
- Screenshots and visual differences
- Open questions and known limitations
- Items requiring owner approval


## Owner-approved development workflow

This section defines the repository workflow from P3 onward.
It changes how work is delivered, not the scope or
acceptance criteria of any existing phase.

### Branch policy

- `main` is frozen after the approved P2 merge.
- The permanent development branch is `nds-development`.
- All future phase work must happen on `nds-development`.
- Never merge, push, rebase, cherry-pick, or sync
  development changes into `main`.
- Never create a pull request targeting `main`.
- Before changing code, verify the active Git branch.
- Stop if the active branch is not `nds-development`.
- Do not create additional persistent development branches.

### Four-wave phase workflow

Every remaining phase, P3 through P9, is executed
in exactly four waves.

- Follow the original phase file and its existing scope.
- The four waves are execution checkpoints,
  not new project phases.
- Each wave must produce at least one named
  checkpoint commit on `nds-development`.
- Push each completed wave to `nds-development`.
- Do not start the next wave before the owner
  has reviewed the current wave.
- Fix failed checks within the current wave.
- Additional fix commits are allowed when necessary.
- Owner approval is required to close the entire phase.
- Never mark a phase Approved automatically.

Because the owner requires only two permanent branches,
small reviewed wave commits replace the previous
per-component-family PR delivery workflow.
All original quality gates remain mandatory.

### Documentation authority

The GitHub repository is the authoritative source
for the project roadmap, design decisions and scope.

Follow:
- CLAUDE.md
- docs/01-decisions.md
- docs/02-requirements.md
- docs/03-architecture.md
- docs/04-stack.md
- docs/components.md
- docs/quality.md
- docs/phases/P*.md

External documents provided for background context
must not silently change the approved repository plan.

### Context7

Use Context7 before implementing code against
third-party libraries.

Look up documentation relevant to the exact
installed or pinned library version.

Do not silently upgrade dependencies.
If the exact version is unavailable in Context7,
inspect installed package documentation and types,
and report the limitation.

### Wave acceptance

Each completed wave must include:
- Implemented scope and changed files
- Commit SHA
- Executed tests and their results
- Accessibility and RTL verification
- SSR verification
- Visual screenshots in both themes and viewports
- Deviations or unresolved questions

Stop after each wave for owner review.

