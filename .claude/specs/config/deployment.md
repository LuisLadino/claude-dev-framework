# Deployment

Project-specific deployment configuration.

---

## Platform

Platform: _e.g., Vercel, Netlify, Railway, AWS_

---

## Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Production  |     | main   |
| Staging     |     | develop |
| Preview     |     | PR branches |

---

## Deploy Process

```bash
# Build
npm run build

# Deploy (platform-specific)
```

---

## Environment Variables

Required in production:
- `DATABASE_URL`
- `API_KEY`
- _add your variables_

---

## CI/CD

- Runs on: push to main, PRs
- Steps: install, lint, test, build, deploy

---

## Rollback

```bash
# Platform-specific rollback command
```

---

## Notes

_Add deployment-specific details here_
