# Development Guide

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage git hooks that ensure code quality.

### Pre-commit Hook

Runs automatically before each commit:

- **ESLint**: Lints JavaScript/TypeScript/Astro files and auto-fixes issues
- **Prettier**: Formats all code files
- **CSpell**: Checks for typos in code and documentation

Files are only linted/formatted if they're staged for commit.

### Commit Message Hook

Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject>

[optional body]

[optional footer]
```

**Allowed types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Revert a previous commit

**Examples:**

```bash
git commit -m "feat: add vim editor page"
git commit -m "fix: resolve mobile code block alignment"
git commit -m "docs: update README with setup instructions"
git commit -m "chore: update dependencies"
```

### Pre-push Hook

Runs before pushing to remote:

- **Build**: Ensures the project builds successfully

This prevents pushing broken code to the repository.

## Available Scripts

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run preview          # Preview production build

# Linting & Formatting
bun run lint             # Check linting and formatting
bun run lint:fix         # Fix linting and formatting issues

# Spell Checking
bun run spell            # Check for typos
bun run spell:fix        # Show unique unknown words

# Validation
bun run validate         # Run all checks (lint + spell + build)

# Commit Message
bun run commitlint       # Manually validate commit message
```

## Editor Setup

### EditorConfig

This project uses [EditorConfig](https://editorconfig.org/) to maintain consistent coding styles.

Supported editors will automatically:

- Use 2 spaces for indentation
- Use LF line endings
- Insert final newline
- Trim trailing whitespace

### VS Code

Recommended extensions (see `.vscode/extensions.json`):

- ESLint
- Prettier
- EditorConfig
- Astro

### Other Editors

Install EditorConfig plugin for your editor:

- JetBrains IDEs: Built-in support
- Vim/Neovim: [editorconfig-vim](https://github.com/editorconfig/editorconfig-vim)
- Sublime Text: [EditorConfig](https://packagecontrol.io/packages/EditorConfig)

## Custom Dictionary

Technical terms are added to `cspell.json`. If you see false positives:

1. Verify it's not a typo
2. Add the word to the `words` array in `cspell.json` (alphabetically)
3. Commit the change

## Bypassing Hooks (Not Recommended)

In rare cases, you can skip hooks:

```bash
# Skip pre-commit (linting/formatting)
git commit --no-verify -m "message"

# Skip pre-push (build)
git push --no-verify
```

⚠️ **Warning**: Only use when absolutely necessary. CI will still validate your code.

## Continuous Integration

GitHub Actions runs on every push and pull request:

- ✅ Linting (ESLint + Prettier)
- ✅ Spell checking (CSpell)
- ✅ Build validation
- ✅ Commit message validation (PRs only)

See `.github/workflows/ci.yml` for details.

## Troubleshooting

### Hook not running

```bash
# Reinstall hooks
bun run prepare
```

### Commit message rejected

Make sure your message follows the format:

```bash
# ❌ Bad
git commit -m "Updated stuff"
git commit -m "Fix bug"

# ✅ Good
git commit -m "chore: update dependencies"
git commit -m "fix: resolve navigation issue on mobile"
```

### Linting errors

```bash
# Auto-fix most issues
bun run lint:fix

# Check what's wrong
bun run lint
```

### Build fails on pre-push

```bash
# Run build locally to see errors
bun run build

# Fix errors, then try again
git push
```
