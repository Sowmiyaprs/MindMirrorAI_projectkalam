# Build Instructions - MindMirror AI

## Prerequisites

- Node.js 16+ and npm 7+
- Git (optional)

## Installation

```bash
# Install dependencies
npm install
```

## Development Build

```bash
# Start development server (port 3000)
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
# Build for production
npm run build
```

Output: `dist/index.html` (single file < 2 MB)

## Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## Build Verification

1. Check `dist/` folder exists
2. Verify `dist/index.html` size < 2 MB
3. Open `dist/index.html` in browser
4. Test all features work offline

## Troubleshooting

**Issue**: Dependencies fail to install
**Solution**: Clear npm cache: `npm cache clean --force`

**Issue**: Build fails
**Solution**: Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Issue**: Port 3000 already in use
**Solution**: Kill process or change port in `vite.config.js`
