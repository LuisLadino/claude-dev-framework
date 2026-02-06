# Environment

Project-specific development environment setup.

---

## Requirements

- Node.js: 20.x LTS
- Package manager: _npm/pnpm/yarn/bun_

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Start development server |
| `build` | Production build |
| `test` | Run tests |
| `lint` | Check code style |
| `format` | Format code |

---

## Environment Variables

Create `.env.local`:
```
DATABASE_URL=
API_KEY=
```

---

## Editor

Recommended: VS Code

Extensions:
- ESLint
- Prettier
- _framework-specific extension_

---

## Notes

_Add project-specific setup details here_
