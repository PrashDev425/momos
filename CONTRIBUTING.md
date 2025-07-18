# Contributing Guide

This project follows a consistent Git workflow and commit message convention to ensure clean history and easy collaboration.

---

## Table of Contents

- [Git Workflow](#git-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Integration Branches (Optional)](#integration-branches-optional)
- [Commit Message Convention](#commit-message-convention)
  - [Format](#format)
  - [Commit Types](#commit-types)
    - [Recommendations](#recommendations)
  - [Scope (optional)](#scope-optional)
  - [Description](#description)
  - [Body (optional)](#body-optional)
  - [Footers (optional)](#footers-optional)
    - [Breaking Changes](#breaking-changes)
    - [Issue References](#issue-references)
  - [Example Commits](#example-commits)
  - [Why Use Conventional Commits?](#why-use-conventional-commits)
- [Contribution Workflow](#contribution-workflow)
- [Best Practices](#best-practices)


> Use this guide to understand how to contribute with Git branching and commit message conventions.

---

## Git Workflow

We follow a **Trunk-Based Development** strategy with **short-lived branches**.

### Branching Strategy

- `main` (or `trunk`): The stable, production-ready branch. Never commit directly to it.

- Create a new branch from `main` for **each task**, then merge it back via PR or direct merge.

#### Branch Naming Conventions

| Branch Type     | Format                  | Description                                |
|-----------------|-------------------------|--------------------------------------------|
| Feature         | `feat/feature-name`     | New features or major enhancements         |
| Bug Fix         | `fix/bug-name`          | Fixing bugs or issues                      |
| Refactor        | `refactor/code-area`    | Code improvements without behavior change  |
| Chore           | `chore/task-name`       | Tooling, dependencies, or non-code updates |
| Documentation   | `docs/page-name`        | Documentation changes                      |

> Use lowercase and hyphens (`-`) for readability.

### Integration Branches (Optional)

For larger features or complex tasks involving multiple sub-tasks or collaborators, you can introduce **integration branches**. These act as temporary branches to aggregate related task branches before merging into `main`.

#### How it works:

- Create an integration branch from `main` for the large feature or area, e.g., `feat/shopping-cart`.
- Create smaller task branches off the integration branch, e.g., `feat/cart-ui`, `feat/cart-api`.
- Merge these task branches into the integration branch as they complete.
- When stable and complete, merge the integration branch into `main` and delete it.

#### Example:

```
main
├── feat/shopping-cart ← integration branch
│ ├── feat/cart-ui ← task branch
│ └── feat/cart-api ← task branch
├── fix/navbar-bug
└── chore/update-dependencies
```
#### Benefits:

- Enables incremental development of large features.
- Simplifies coordination of multiple related tasks.
- Keeps `main` clean by merging only stable integrated work.

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

Conventional Commits is a convention for writing meaningful commit messages that streamline automation and improve collaboration.

### Format

```
<type>[optional-scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types


| Type       | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| `feat`     | A new feature                                                           |
| `fix`      | A bug fix                                                               |
| `docs`     | Documentation-only changes                                              |
| `style`    | Code style changes (formatting, indentation, whitespace, etc.)          |
| `refactor` | Code changes that neither fix a bug nor add a feature                   |
| `perf`     | Code changes that improve performance                                   |
| `test`     | Adding or updating tests                                                |
| `build`    | Changes that affect the build system or external dependencies           |
| `ci`       | Changes to CI configuration files and scripts                           |
| `chore`    | Other changes that don’t modify src or test files (e.g., tooling)       |
| `revert`   | Reverts a previous commit                                               |
| `security` | Changes that improve security (optional type, not in official spec)     |
| `merge`    | Merges a branch (if included manually in history, not recommended)      |
| `wip`      | Work-in-progress commits (used temporarily, then squashed)              |

#### Recommendations

- Stick to the **standard types** (`feat`, `fix`, `docs`, etc.) for compatibility with tools like:
  - Semantic Release
  - Commitizen
  - Conventional Changelog

- You can also **extend types** (like `security`, `wip`) to fit your team's needs, but document them clearly.

### Scope (optional)

- A noun describing the section of the codebase affected.
- Use lowercase and hyphenated names (if needed).

**Examples:**
- `feat(auth): add login form`
- `fix(api): prevent crash on invalid token`

### Description

- Should be concise and written in the **imperative mood**.
- Start with a **verb**: "add", "fix", "change", etc.
- Keep under 50-72 characters.

### Body (optional)

Use the body to explain *what* and *why*, not *how*.

Example:
```
feat(api): add getUserProfile function

This function retrieves user details from the backend and will be
used in the profile page for display.
```

### Footers (optional)

#### Breaking Changes

If your commit introduces a breaking change:

- Add ``!`` after the type or scope:

  ```
  feat(auth)!: change login flow
  ```
- Or include a ``BREAKING CHANGE`` in the footer:

  ```
  BREAKING CHANGE: change method `getUser()` to `fetchUser()`
  ```


#### Issue References

Link related issues:

```
Closes #123
Refs #45
```

### Example Commits

```bash
feat(login): add login page and validation

fix(counter): prevent negative values on decrement

refactor(ui): remove redundant button styles

style(navbar): fix alignment in mobile view

docs: update contributing guidelines

test(api): add test for getUserData()

chore: update dependencies and scripts

ci: add GitHub Actions config

revert: revert "feat(login): add login page"
```

---

### Why Use Conventional Commits?

- Clean Git history
- Automated changelogs
- Easy semantic versioning (e.g., `1.2.3`)
- Better collaboration and tooling integration

---

## Contribution Workflow

1. **Fork the repository** (if applicable)
2. **Clone the repository**
3. **Create a branch**
   ```bash
   git checkout -b feat/my-feature
   ```
4. **Write code & commit changes**
   ```bash
   git commit -m "feat: add feature description"
   ```
5. **Push the branch**
   ```bash
   git push origin feat/my-feature
   ```
6. **Open a pull request** to `main`

---

## Best Practices

- Keep commits small and focused.
- Use clear and descriptive commit messages.
- Rebase or squash if needed before merging.

---
