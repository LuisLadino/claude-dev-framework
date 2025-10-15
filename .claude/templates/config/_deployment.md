# Deployment Standards

**Template Version:** 1.0.0  
**Last Updated:** 2025-01-09

> **Note:** This is a template file. When you run `init-stack.sh`, it gets copied to `.claude/your-stack/config/deployment.md` where you can customize it for your specific deployment platform.

---

## Deployment Platforms by Framework

### Static Sites (SSG)

**Best for:** Astro (SSG mode), Next.js (SSG), Plain HTML/CSS/JS

**Recommended Platforms:**

- **Vercel** - Zero-config, global CDN, free tier
- **Netlify** - Similar to Vercel, great DX
- **Cloudflare Pages** - Fast, generous free tier
- **GitHub Pages** - Free for public repos

**Characteristics:**

- Pre-rendered at build time
- Served as static files
- No server required
- Very fast, very cheap

---

### Server-Side Rendering (SSR)

**Best for:** Next.js (App Router), Nuxt, SvelteKit, Astro (SSR mode)

**Recommended Platforms:**

- **Vercel** - Best for Next.js, auto-scaling
- **Netlify** - Good for all SSR frameworks
- **Railway** - Simple, full control
- **Render** - Free tier available
- **Fly.io** - Edge deployment

**Characteristics:**

- Renders pages on each request
- Requires Node.js server
- Dynamic content
- More expensive than static

---

### Single Page Applications (SPA)

**Best for:** React (CRA/Vite), Vue, Svelte (client-only)

**Recommended Platforms:**

- **Vercel** - Simple deployment
- **Netlify** - Client-side routing support
- **GitHub Pages** - Free hosting
- **Surge** - Quick deployments

**Characteristics:**

- Client-side only
- Needs routing configuration
- Fast hosting
- API calls to separate backend

---

## General Deployment Process

### Phase 1: Pre-Deployment Preparation

#### 1. Verify Build Works Locally

```bash
# Clean previous builds
rm -rf dist/ build/ .next/ .output/

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview  # or npm run start
```

#### 2. Run All Checks

```bash
# Format code
npm run format

# Lint
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Check bundle size (if applicable)
npm run analyze
```

#### 3. Review Changes

```bash
# What's being deployed?
git log --oneline origin/main..HEAD

# Any uncommitted changes?
git status

# Latest commit
git show HEAD
```

---

### Phase 2: Environment Configuration

#### Environment Variables

**Local Development** (`.env.local`):

```bash
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_API_URL=http://localhost:3000/api

# Feature flags
NEXT_PUBLIC_ANALYTICS_ENABLED=false

# Development keys (not real)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=dev_key_here
```

**Production** (Platform Dashboard):

```bash
# API URLs
NEXT_PUBLIC_API_URL=https://api.yoursite.com
PUBLIC_API_URL=https://api.yoursite.com

# Feature flags
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Real production keys
NEXT_PUBLIC_GOOGLE_MAPS_KEY=real_key_here
NEXT_PUBLIC_ANALYTICS_ID=real_id_here

# Secrets (not prefixed with PUBLIC)
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret_here
```

**Important:**

- `PUBLIC_` or `NEXT_PUBLIC_` = Available in browser
- Without prefix = Server-only (never exposed to client)
- Never commit real secrets to git
- Use platform's secrets management

---

### Phase 3: Platform-Specific Setup

#### Vercel

**Initial Setup:**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your Git repository
5. Vercel auto-detects framework
6. Configure if needed
7. Click "Deploy"

**Configuration (vercel.json):**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

**Environment Variables:**

1. Project Settings → Environment Variables
2. Add each variable
3. Select environment (Production/Preview/Development)
4. Save

**Custom Domain:**

1. Project Settings → Domains
2. Add domain
3. Configure DNS (Vercel provides instructions)
4. HTTPS automatic

---

#### Netlify

**Initial Setup:**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site"
4. Connect repository
5. Configure build settings
6. Click "Deploy site"

**Configuration (netlify.toml):**

```toml
[build]
  command = "npm run build"
  publish = "dist"  # or "build" or ".next"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables:**

1. Site Settings → Environment Variables
2. Add variables
3. Redeploy to apply

---

#### Cloudflare Pages

**Initial Setup:**

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect repository
3. Configure build settings
4. Deploy

**Configuration:**

```toml
# wrangler.toml
[build]
command = "npm run build"
directory = "dist"

[env.production]
NODE_VERSION = "20"
```

---

#### GitHub Pages

**Setup (Static Site):**

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Repository Settings → Pages
3. Source: `gh-pages` branch
4. Save

**Base Path** (if using `username.github.io/repo-name`):

```javascript
// vite.config.ts or next.config.js
base: '/repo-name/',
```

---

### Phase 4: Deployment Execution

#### Automatic Deployment (Recommended)

Connect git repository to platform:

```bash
# Every push to main = Production deployment
git push origin main

# Every PR = Preview deployment
git push origin feature/new-feature

# Each commit gets unique preview URL
```

#### Manual Deployment

```bash
# Vercel CLI
npx vercel
npx vercel --prod  # Production

# Netlify CLI
npx netlify-cli deploy
npx netlify-cli deploy --prod

# GitHub Pages (via Actions)
git push origin main  # Triggers workflow
```

---

### Phase 5: Post-Deployment Verification

#### Immediate Checks

```bash
# 1. Site loads
curl -I https://yoursite.com

# 2. Check specific pages
open https://yoursite.com
open https://yoursite.com/about
open https://yoursite.com/contact

# 3. Test functionality
# - Forms submit
# - Navigation works
# - Dynamic features work
# - Images load
```

#### Monitor Deployment

```bash
# Platform dashboards show:
- Build logs
- Deploy status
- Performance metrics
- Error tracking

# Common issues:
- Environment variables missing
- Build command wrong
- Output directory incorrect
- Node version mismatch
```

#### Production Testing Checklist

- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Images and assets load
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Analytics tracking (if enabled)
- [ ] SEO meta tags present
- [ ] Performance acceptable (Lighthouse)
- [ ] HTTPS enabled
- [ ] Custom domain works (if applicable)

---

## Continuous Deployment Workflow

### Branch Strategy

```
main branch
  ↓
  Automatic deploy to Production
  (yoursite.com)

develop branch
  ↓
  Automatic deploy to Staging
  (staging.yoursite.com or preview URL)

feature/* branches
  ↓
  Automatic deploy to Preview
  (unique preview URL per PR)
```

### Example Workflow

```bash
# 1. Develop feature
git checkout -b feature/new-gallery
# ... make changes ...
git commit -m "feat(gallery): add image filtering"
git push origin feature/new-gallery

# ✓ Platform creates preview deployment
# ✓ Preview URL: https://yoursite-git-feature-gallery-username.vercel.app

# 2. Review on preview URL
# - Test functionality
# - Share with team
# - Get feedback

# 3. Merge to main
git checkout main
git merge feature/new-gallery
git push origin main

# ✓ Platform deploys to production
# ✓ Production URL: https://yoursite.com
```

---

## Pre-Deployment Checklist

Before deploying to production:

### Code Quality

- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Build succeeds locally
- [ ] No console.log() statements
- [ ] No commented-out code
- [ ] No TODO/FIXME in critical paths

### Configuration

- [ ] Environment variables set
- [ ] API URLs point to production
- [ ] Feature flags configured
- [ ] Analytics configured
- [ ] Error tracking configured

### Content

- [ ] All content finalized
- [ ] Images optimized
- [ ] Metadata/SEO complete
- [ ] 404 page exists
- [ ] Favicons in place

### Security

- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] Content Security Policy (if needed)
- [ ] CORS configured properly
- [ ] Rate limiting (if API)

### Performance

- [ ] Images optimized/compressed
- [ ] Unused dependencies removed
- [ ] Code splitting (if applicable)
- [ ] Lazy loading implemented
- [ ] Fonts optimized

### Accessibility

- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader tested
- [ ] Focus states visible

---

## Rollback Procedure

If deployment has critical issues:

### Option 1: Platform Rollback

**Vercel:**

```bash
# Go to deployment in dashboard
# Click "..." → "Rollback to this deployment"
# Or via CLI:
vercel rollback [deployment-url]
```

**Netlify:**

```bash
# Go to Deploys tab
# Find previous working deploy
# Click "Publish deploy"
```

### Option 2: Git Revert

```bash
# Revert last commit
git revert HEAD
git push origin main

# Platform auto-deploys reverted code
```

### Option 3: Redeploy Previous Version

```bash
# Find last working commit
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>
git push origin main --force

# ⚠️ Force push is destructive!
# Only use in emergencies
```

---

## Monitoring and Maintenance

### Performance Monitoring

**Tools:**

- Vercel Analytics
- Lighthouse CI
- Google PageSpeed Insights
- WebPageTest

**Metrics to track:**

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### Error Tracking

**Services:**

- Sentry
- Rollbar
- Bugsnag
- LogRocket

**Setup:**

```bash
npm install @sentry/nextjs

# Configure in config file
```

### Uptime Monitoring

**Services:**

- UptimeRobot (free)
- Pingdom
- StatusCake

**What to monitor:**

- Homepage
- API endpoints
- Critical pages
- Forms

---

## Deployment Schedule

### Recommended Patterns

**Solo Developer:**

- Deploy whenever ready
- Use preview deployments to test
- Deploy to production after testing

**Small Team:**

- **Daily**: Merge features to develop → staging
- **Weekly**: Deploy develop to production
- **Hotfixes**: Deploy immediately as needed

**Larger Team:**

- **Sprint-based**: Deploy at end of sprint
- **Feature flags**: Deploy features disabled, enable later
- **Gradual rollout**: Deploy to % of users first

### Deployment Windows

**Low-risk deployments:**

- Anytime (documentation, content updates)

**Medium-risk deployments:**

- Business hours when team is available
- Avoid late Friday deployments

**High-risk deployments:**

- Early in work week (Monday/Tuesday)
- With full team available
- After thorough staging testing

---

## Cost Considerations

### Free Tiers

**Vercel:**

- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions (limited invocations)
- Team features require Pro plan

**Netlify:**

- 100 GB bandwidth/month
- 300 build minutes/month
- Serverless functions (limited invocations)

**Cloudflare Pages:**

- Unlimited bandwidth
- 500 builds/month
- Very generous free tier

**GitHub Pages:**

- Free for public repos
- 100 GB bandwidth/month
- Static sites only

### When to Upgrade

Consider paid tier when:

- Exceeding bandwidth limits
- Need team collaboration features
- Require priority support
- Need advanced analytics
- Want increased build minutes
- Need password protection
- Require custom build settings

---

## Security Best Practices

### Environment Variables

```bash
# ✅ GOOD: Use environment variables
const apiKey = process.env.API_KEY;

# ❌ BAD: Hard-coded secrets
const apiKey = "sk_live_abc123...";
```

### API Keys

- Use environment variables
- Never commit to git
- Rotate regularly
- Use different keys for dev/prod
- Restrict key permissions

### HTTPS

- Always use HTTPS (most platforms provide free)
- Redirect HTTP → HTTPS
- Enable HSTS headers

### Headers

```javascript
// next.config.js or server config
headers: [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

---

## Troubleshooting

### Build Fails

**Check:**

- Build command correct?
- Output directory correct?
- Node version matches local?
- All dependencies in package.json?
- Environment variables set?

**Debug:**

```bash
# Test build locally
npm run build

# Check build logs in platform dashboard
# Look for errors before failure
```

### Site Doesn't Load

**Check:**

- Deployment succeeded?
- DNS propagated? (can take 24-48 hours)
- Custom domain configured correctly?
- HTTPS certificate issued?

**Debug:**

```bash
# Check DNS
nslookup yoursite.com

# Check deployment status
vercel inspect [deployment-url]
```

### Environment Variables Not Working

**Check:**

- Variable name correct? (case-sensitive)
- Variable prefixed with `PUBLIC_` or `NEXT_PUBLIC_`?
- Redeploy after adding variables
- Variable available in correct environment (prod/preview/dev)

### 404 Errors on Refresh (SPA)

**Fix:** Configure redirects

**Netlify:**

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Astro Deployment](https://docs.astro.build/en/guides/deploy/)

---

**Customize this file for your specific deployment platform and workflow!**

Common customizations:

- Specific platform (Vercel, Netlify, etc.)
- Framework-specific settings
- Custom domain configuration
- CI/CD pipeline details
- Team deployment policies
