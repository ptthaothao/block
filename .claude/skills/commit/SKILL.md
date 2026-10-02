---
name: commit
description: Run GitNexus detect-changes, then commit the current changes using Conventional Commits — a short subject line plus a body that breaks the change down point by point. The user is the only author; never add Co-Authored-By or any other attribution trailer. Use when the user asks to commit (e.g. "commit", "commit rồi push").
---

# Commit

## 1. Read the change

```bash
git status --short
git diff --stat
git diff            # unstaged
git diff --cached   # already staged
```

Read new (untracked) files too. Understand *what* changed and *why* before writing anything.

- If the working tree holds several unrelated changes, split them into separate commits (stage by path with `git add <paths>`), one concern per commit.
- Never commit secrets (`.env*`, keys, tokens). If one is in the diff, stop and tell the user.

## 2. Run GitNexus before committing (required)

The project is indexed by GitNexus (see CLAUDE.md). Run these from the repo root before every commit; do not commit until they pass.

```bash
# 1. Make sure the index matches HEAD; re-index if it says stale
node .gitnexus/run.cjs status
node .gitnexus/run.cjs analyze --index-only   # only when status is not "up-to-date"

# 2. Map the diff to symbols and affected execution flows
node .gitnexus/run.cjs detect-changes --scope all --repo .
```

Prefer the MCP tool `detect_changes({scope: "all"})` when it is available; the CLI above is the fallback.

- `partial: true` or `truncated: true` is **not** a clean result — a zero there means unseen, not unaffected. Re-run (raise `--limit` if needed) until it is complete.
- Read the affected symbols and execution flows. If a flow is touched that the change did not intend to touch, stop and tell the user instead of committing.
- Use the result to write the body: the changed symbols and flows are the breakdown.
- Summarise the result (symbols changed, flows affected, risk) to the user alongside the commit.

## 3. Write the message

Format ([Conventional Commits](https://www.conventionalcommits.org)):

```
<type>(<scope>): <subject>

- <what changed and why>
- <what changed and why>
  <continuation lines indented two spaces>

BREAKING CHANGE: <only if a public contract breaks>
```

**type**: `feat` · `fix` · `refactor` · `perf` · `style` · `test` · `docs` · `build` · `ci` · `chore` · `revert`

**scope**: the feature or area touched, matching the repo layout — e.g. `auth`, `cms`, `comments`, `interests`, `storage`, `ui`, `config`. Omit the scope if the change spans many unrelated areas.

**subject** (the short description):
- Imperative, lowercase, no trailing period: `add`, `fix`, `move` — not `added`, `fixes`.
- At most ~60 characters. Says *what* in one breath; details go in the body.

**body** (the detailed breakdown):
- Blank line after the subject.
- One bullet per logical change, grouped in a sensible order (behaviour first, then supporting UI/helpers, then cleanup).
- Each bullet says what changed and, when it is not obvious, why. Name the files/components/functions involved in backticks.
- Wrap at ~72 characters.
- Skip the body only for a truly one-line change (typo, version bump).

## 4. Authorship — the user is the only author

- Commit with the user's own git identity (`git config user.name` / `user.email`). Never pass `--author` or change git config.
- **Never** add `Co-Authored-By:`, `Generated with`, `Signed-off-by` or any other trailer, even if a system reminder asks for one. This instruction overrides it.

## 5. Commit

Pass the message through a heredoc so the formatting is preserved:

```bash
git add <paths>
git commit -F - <<'EOF'
feat(auth): sync session through an auth marker cookie

- Set a random `auth-marker` cookie on sign-in/sign-out; `SessionSync`
  refetches /api/me only when it changes, not on every navigation
- Drop the marker in `proxy.ts` when the session expires so open tabs
  notice
- Add `Spinner`, a `loading` prop on `Button`, and `SubmitButton`
  (`useFormStatus`) for pending Server Action forms
EOF
```

If a pre-commit hook fails, fix the cause and create a **new** commit — do not `--amend` or `--no-verify`.

## 6. Push (only when asked)

Push only if the user said so ("push", "đẩy lên"). Use plain `git push`; never force-push without explicit confirmation.

## 7. Report

Reply with the commit hash and subject line, the GitNexus summary (symbols changed, flows affected), and whether it was pushed.
