
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

## Permanent branch policy

- `main` is permanently frozen after P2.
- All future development, documentation and workflow changes
  happen exclusively on `nds-development`.
- Before modifying any files, verify the active branch with
  `git branch --show-current`. Stop if it is not `nds-development`.
- Never push, merge, rebase, cherry-pick or synchronize changes
  into `main`. Never create a pull request targeting `main`.
- Commit checkpoints and pushes go only to `nds-development`.
- Keep production publishing conditions unchanged during workflow
  preparation. Release-policy coordination belongs to the existing
  P9 scope and requires owner review.

## Phase gates

- Work on only one approved scope at a time.
- Never start a phase before its predecessor is
  explicitly marked Approved by the owner.
- A passing CI run is not owner approval.
- Do not infer phase completion from the presence of code.
- Preserve all previously approved functionality.
- Do not mark a phase Approved on the owner's behalf.

## Four-wave workflow

- Divide each implementation phase into exactly four ordered waves
  before implementation. For P3, map every row and named variant
  in `docs/components.md` under Inputs and every acceptance criterion
  in `docs/phases/P3.md` to a wave.
- Preserve the original phase scope, requirements, architecture and
  visual language. External API documentation informs implementation,
  not the component inventory or product requirements.
- Each wave plan lists scope, dependencies, deliverables, component
  and API requirements, documentation, tests, visual verification,
  a commit checkpoint and an owner review gate.
- Obtain owner approval of the plan before Wave 1. Work on only the
  approved wave; do not start the next wave before owner review and
  explicit approval to proceed.
- Complete the repository's component Definition of Done within each
  wave. Record actual test results, changed files and public APIs,
  screenshots, visual differences and unresolved limitations at its
  checkpoint commit on `nds-development`.
- Keep completed components in `review` until explicitly approved.
  Record approval dates only from owner confirmation. Passing CI or
  completing all four waves does not itself approve the phase.

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
- Do not introduce new dependencies without justification and
  explicit owner approval; pin approved additions exactly.
- Before third-party API implementation, query Context7 for the
  pinned version. If exact-version documentation is unavailable,
  report that limitation and verify against installed package
  documentation and types; do not claim current docs are version-pinned.
- Do not alter approved design tokens or visual references
  without explicit owner approval.

## Execution workflow

Before writing code:
1. Inspect the branch, working tree and existing code.
2. Compare implementation with phase acceptance criteria.
3. Identify dependencies, open questions and risks.
4. Propose small, independently reviewable commits within the approved wave.
   If a PR is requested, its target must be `nds-development`.
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
