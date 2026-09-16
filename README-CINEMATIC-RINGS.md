# LLeveLL Cinematic Ring Services

This project contains four scroll-controlled service slides.

1. UI & UX Design — the ring is split into a live wireframe design half and a polished metallic half. Scroll draws the design lines and brings the finished surface forward.
2. Product Development — the ring is split into metallic modules that assemble, compile and settle into place.
3. Branding — the ring becomes a coordinated identity spectrum.
4. Marketing — the ring becomes an animated search/radar system.

## Run

```powershell
npm install
npm run dev -- --host 0.0.0.0
```

The service section files are:

- `src/sections/RingLab.jsx`
- `src/sections/RingLab.css`
- `src/components/ServiceRingCanvas.jsx`
- `src/components/ServiceRing3D.jsx`
- `src/components/ToolLogo.jsx`

The 3D animation uses Three.js through `@react-three/fiber`.
