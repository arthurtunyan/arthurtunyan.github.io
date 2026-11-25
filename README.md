# arthurtunyan.github.io

My site: research, projects, and a business card you can flip.

**Live:** https://arthurtunyan.github.io

Built with React, Vite and the [Astryx](https://www.npmjs.com/package/@astryxdesign/core) design system (custom dark theme `mono`). The ASCII field, the text decode, the cursor and the card are plain canvas and CSS.

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

- Copy lives in `src/content.ts`
- Layout is in `src/App.tsx`
- Effects are in `src/fx.tsx` and `src/motion.css`
