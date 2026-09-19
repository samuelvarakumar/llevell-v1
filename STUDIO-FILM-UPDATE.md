# LLeveLL studio film

The new film sits immediately after the hero and before “One studio. Your entire digital presence.” The hero's scroll link now leads into it.

On desktop, scrolling opens a narrow aperture into a cinematic view. The reel plays silently when visible and pauses when it leaves the viewport, the tab is hidden, or an app panel opens. Manual pause is remembered during scrolling. Reduced-motion and data-saving preferences disable automatic playback. Mobile uses a simple inline layout. Controls support play/pause, seeking, replay and cinema view where the browser allows it.

## Included sample

The silent sample reel was assembled from the four project preview GIFs already included in this project. These are small source previews, so the sample is suitable for reviewing the interaction; use a high-resolution studio film for final publication. No external footage or audio is loaded.

## Use your own video

1. Replace `public/media/studio-reel.mp4` with a browser-compatible H.264 MP4, or update `src` in `src/studioFilmConfig.js` to your file's public URL.
2. Replace `public/media/studio-reel-poster.jpg` with a matching cover frame and update the title and description in the same config file.
3. For audio, set `hasAudio: true`; the film still starts muted and visitors can enable sound. For speech, supply WebVTT captions using the `captions` and `captionsLanguage` settings. This enables the custom captions control.
4. Run the project's usual `npm run build` command.

The ready-made MP4 is included. Regeneration is optional: `node scripts/build-studio-reel.mjs` requires FFmpeg and a local font (set `LLEVELL_REEL_FONT` where needed). It is independent of the site's build and hosting.
