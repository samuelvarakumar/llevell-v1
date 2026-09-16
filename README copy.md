# LLeveLL — 3D Logo Experience

A responsive React/Vite product website with a smooth-scroll Three.js hero built from the supplied LLeveLL logo mark.

## Run locally

```powershell
npm install
npm run dev -- --host 0.0.0.0
```

Open the URL Vite prints, normally `http://localhost:5173`.

## 3D logo hero

The hero smart ring has been replaced by a procedural 3D version of the supplied fourteen-cell logo:

- staggered assembly animation
- cursor-controlled depth and tilt
- ceramic faces with graphite extrusion
- illuminated acid-lime inner layer
- click-triggered scatter pulse
- scroll-driven separation, rotation and lift
- floating signal particles
- mobile and reduced-motion optimisation

Main files:

- `src/components/LogoMark3D.jsx`
- `src/components/LogoCanvas.jsx`
- `src/sections/Hero.jsx`
- `src/styles.css`
- `public/llevell-logo-mark.png`

The remaining product sections still use the 3D smart ring experience.

## Production build

```powershell
npm run build
npm run preview
```

## Notes

- The waitlist/shop form is visual-only until connected to a backend.
- The project uses `three`, `@react-three/fiber`, `@react-three/drei`, `motion` and `lenis`.
- The supplied logo image is included only as a local reference/fallback; the animated hero mark is generated as real 3D geometry.
