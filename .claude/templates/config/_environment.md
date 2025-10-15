# Development Environment Standards

**Template Version:** 1.0.0  
**Last Updated:** 2025-01-09

> **Note:** This is a template file. When you run `init-stack.sh`, it gets copied to `.claude/your-stack/config/environment.md` where you can customize it for your specific tech stack.

---

## Required Tools

### Node.js

**Version:** 18.x LTS or 20.x LTS (recommended)

**Check version:**

```bash
node --version
```

**Install/Update:**

- **Official**: [nodejs.org](https://nodejs.org)
- **nvm** (recommended for version management):

  ```bash
  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

  # Install Node LTS
  nvm install --lts
  nvm use --lts

  # Set default
  nvm alias default node
  ```

**Why LTS?**

- Stable, production-ready
- Long-term support
- Best compatibility with tools

---

### Package Manager

**Choose ONE:**

#### npm (comes with Node)

```bash
# Check version
npm --version

# Should be 9.x or higher
```

#### pnpm (faster, recommended)

```bash
# Install
npm install -g pnpm

# Check version
pnpm --version

# Use in project
pnpm install
pnpm run dev
```

**Why pnpm?**

- Faster than npm/yarn
- Saves disk space (shared cache)
- Strict dependency management

#### yarn (alternative)

```bash
# Install
npm install -g yarn

# Check version
yarn --version

# Use in project
yarn install
yarn dev
```

#### bun (newest, very fast)

```bash
# Install (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# Check version
bun --version

# Use in project
bun install
bun run dev
```

---

### Git

**Version:** 2.x or higher

**Check version:**

```bash
git --version
```

**Install:**

- **macOS**: Included with Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- **Windows**: [git-scm.com](https://git-scm.com)
- **Linux**:
  ```bash
  sudo apt-get install git  # Debian/Ubuntu
  sudo yum install git       # RHEL/CentOS
  ```

**Configuration:**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

---

### Code Editor

**Recommended: Visual Studio Code**

**Download:** [code.visualstudio.com](https://code.visualstudio.com)

**Alternatives:**

- WebStorm (JetBrains)
- Sublime Text
- Neovim
- Any editor with TypeScript support

---

## VS Code Setup (Recommended)

### Required Extensions

Install these extensions:

```bash
# Prettier (formatter)
code --install-extension esbenp.prettier-vscode

# ESLint (linter)
code --install-extension dbaeumer.vscode-eslint

# Tailwind CSS IntelliSense
code --install-extension bradlc.vscode-tailwindcss
```

### Framework-Specific Extensions

**Astro:**

```bash
code --install-extension astro-build.astro-vscode
```

**Vue:**

```bash
code --install-extension Vue.volar
```

**Svelte:**

```bash
code --install-extension svelte.svelte-vscode
```

**React (optional):**

```bash
code --install-extension dsznajder.es7-react-js-snippets
```

### Helpful Extensions

```bash
# Error Lens (inline errors)
code --install-extension usernamehm.errorlens

# Auto Rename Tag
code --install-extension formulahendry.auto-rename-tag

# Path Intellisense
code --install-extension christian-kohler.path-intellisense

# GitLens (advanced git)
code --install-extension eamodio.gitlens

# Better Comments
code --install-extension aaron-bond.better-comments

# Import Cost (shows package sizes)
code --install-extension wix.vscode-import-cost
```

---

### VS Code Settings

Create/update `.vscode/settings.json` in your project:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

### VS Code Tasks

Create `.vscode/tasks.json` for quick commands:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "problemMatcher": []
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "problemMatcher": []
    }
  ]
}
```

**Use:** `Cmd/Ctrl + Shift + P` → "Tasks: Run Task"

---

## Project Setup

### Initial Installation

```bash
# 1. Clone repository
git clone [repository-url]
cd [project-name]

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start development server
npm run dev
```

### Required Files Check

Verify these files exist:

- [ ] `package.json` - Dependencies and scripts
- [ ] `.gitignore` - Git ignore rules
- [ ] `.prettierrc` or `prettier.config.js` - Prettier config
- [ ] `.eslintrc` or `eslint.config.js` - ESLint config
- [ ] `tsconfig.json` - TypeScript config (if using TS)
- [ ] `.env.example` - Environment variables template

---

## Available Scripts

### Development

```bash
# Start dev server
npm run dev
# Usually runs on: http://localhost:4321 (or 3000, 5173, etc.)

# Start dev with type checking
npm run dev:check
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting errors
npm run lint:fix

# Type check
npm run type-check
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### All Checks

```bash
# Run all quality checks
npm run check

# Or manually:
npm run format && npm run lint && npm run type-check && npm run build
```

---

## Browser Setup

### Recommended Browsers

**Development:**

- Chrome/Edge (recommended) - Best DevTools
- Firefox - Great developer edition
- Safari - For macOS/iOS testing

**Testing:**

- Chrome
- Firefox
- Safari
- Edge

### Browser Extensions

**Chrome/Edge:**

- React DevTools (if using React)
- Vue DevTools (if using Vue)
- Redux DevTools (if using Redux/Zustand)
- Lighthouse - Performance auditing
- axe DevTools - Accessibility testing

**Firefox:**

- Same as above via Firefox Add-ons

---

## Development Server

### Default Ports

- **Astro**: 4321
- **Next.js**: 3000
- **Vite**: 5173
- **Create React App**: 3000
- **SvelteKit**: 5173
- **Nuxt**: 3000

### Port Already in Use

```bash
# Find process on port
lsof -ti:4321

# Kill process
kill -9 $(lsof -ti:4321)

# Or change port in config
npm run dev -- --port 3001
```

### Network Access

Access from other devices (phone, tablet):

```bash
# Find your IP
ipconfig getifaddr en0  # macOS
ip addr show            # Linux
ipconfig               # Windows

# Start server with network access
npm run dev -- --host

# Access from other device
http://[your-ip]:4321
```

---

## Environment Variables

### File Structure

```
.env                 # Defaults (committed)
.env.local           # Local overrides (gitignored)
.env.development     # Development mode
.env.production      # Production mode
```

### Example `.env.example`

```bash
# API Configuration
PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
PUBLIC_ANALYTICS_ENABLED=false

# External Services
PUBLIC_GOOGLE_MAPS_KEY=your_key_here

# Database (server-only, no PUBLIC prefix)
DATABASE_URL=postgresql://...

# Authentication (server-only)
AUTH_SECRET=generate_with_openssl
```

### Creating Your .env.local

```bash
# Copy example
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**Important:**

- `PUBLIC_` prefix = available in browser
- No prefix = server-only (never exposed)
- Never commit `.env.local` or real secrets

---

## Common Issues & Solutions

### Node Version Mismatch

**Problem:** Project requires specific Node version

**Solution:**

```bash
# Check required version
cat .nvmrc
# or
cat package.json  # Look for "engines"

# Install and use that version
nvm install 20
nvm use 20
```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use`

**Solution:**

```bash
# Kill process on port
kill -9 $(lsof -ti:4321)

# Or use different port
npm run dev -- --port 3001
```

### Module Not Found

**Problem:** `Cannot find module '@/components/Button'`

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.json paths are correct
# Restart TypeScript server in VS Code:
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Type Errors After Update

**Problem:** TypeScript errors after updating dependencies

**Solution:**

```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or close and reopen VS Code

# Check tsconfig.json is correct
# npm run type-check
```

### Permission Denied

**Problem:** `EACCES: permission denied`

**Solution:**

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
```

### Build Fails Locally

**Problem:** Build works in CI but not locally

**Solution:**

```bash
# Clean everything
rm -rf node_modules package-lock.json dist .next

# Reinstall
npm install

# Try build
npm run build

# Check Node version matches CI
node --version
```

---

## Performance Tools

### Lighthouse

**Built into Chrome DevTools**

```bash
# Or via CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:4321 --view
```

### Bundle Analyzers

**Next.js:**

```bash
npm install @next/bundle-analyzer

# Add to next.config.js
```

**Vite:**

```bash
npm install rollup-plugin-visualizer

# Analyze after build
npm run build
```

### Web Vitals Extension

**Chrome Extension:**

- Shows Core Web Vitals in real-time
- Monitors LCP, FID, CLS

---

## Keyboard Shortcuts

### VS Code

- `Cmd/Ctrl + P` - Quick file open
- `Cmd/Ctrl + Shift + P` - Command palette
- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + J` - Toggle terminal
- `Cmd/Ctrl + Shift + F` - Global search
- `Cmd/Ctrl + D` - Select next occurrence
- `Alt + Click` - Multi-cursor
- `Cmd/Ctrl + /` - Toggle comment

### Browser DevTools

- `Cmd/Ctrl + Shift + C` - Inspect element
- `Cmd/Ctrl + Shift + J` - Console
- `Cmd/Ctrl + Shift + M` - Device toolbar
- `F12` - Toggle DevTools

---

## Best Practices

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update to latest (careful!)
npx npm-check-updates -u
npm install
```

### Use .nvmrc

Create `.nvmrc` in project root:

```
20.10.0
```

Team members can then:

```bash
nvm use
```

### Document Setup

Keep `README.md` updated with:

- Node version required
- Installation steps
- Environment variables needed
- How to run locally
- Common issues

---

## Recommended Setup Checklist

- [ ] Node.js LTS installed
- [ ] Package manager installed (pnpm recommended)
- [ ] Git installed and configured
- [ ] VS Code installed
- [ ] Required VS Code extensions installed
- [ ] VS Code settings configured
- [ ] Browser DevTools extensions installed
- [ ] Project dependencies installed
- [ ] Environment variables configured
- [ ] Dev server starts successfully
- [ ] Build succeeds
- [ ] Tests run (if applicable)

---

## Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [npm Docs](https://docs.npmjs.com/)
- [pnpm Docs](https://pnpm.io/)
- [VS Code Docs](https://code.visualstudio.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Customize this file for your specific tech stack and tooling!**

Common customizations:

- Specific Node version
- Framework-specific tools
- Team VS Code extensions
- Project-specific environment variables
- Custom scripts and their usage
