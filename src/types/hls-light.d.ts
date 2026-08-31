// hls.js only publishes a declaration file for its main entry
// (dist/hls.d.ts) — the `light` build variant we dynamically import in
// useSeamlessVideo.ts (to keep the excluded alt-audio/subtitles/EME/CMCD
// code out of our bundle) has no sibling .d.ts. The light build is a
// strict runtime feature subset of the same `Hls` class, so re-exporting
// the main package's types here is accurate, not a guess.
declare module 'hls.js/dist/hls.light.mjs' {
  export * from 'hls.js';
  export { default } from 'hls.js';
}
