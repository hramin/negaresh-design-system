
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

Then stop.
