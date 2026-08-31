#!/usr/bin/env bash
set -euo pipefail

# Builds the hero background video as HLS/fMP4 from the 9 pre-cut MP4
# segments in public/heros/segments/. Output lands in public/heros/hls/.
#
# Why this exists: 9 independent MP4 files (each with its own moov atom,
# SPS/PPS, GOP) cannot share a decode timeline. Switching a <video> element's
# `src` between them resets readyState to HAVE_NOTHING and destroys the
# compositor layer — that's the black frame at every segment boundary. HLS
# fMP4 over MSE gives every fragment a shared init segment and a single
# SourceBuffer, so the decoder configures once and never sees a boundary.
#
# Everything here is a lossless remux (-c copy): the elemental stream is
# never touched, so bitrate and quality stay bit-for-bit identical to the
# source footage. Re-encoding is NOT performed by this script — see the
# documented fallback path at the bottom for when (if ever) it becomes
# necessary, and why.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SEGMENTS_DIR="$REPO_ROOT/public/heros/segments"
OUT_DIR="$REPO_ROOT/public/heros/hls"
CONCAT_LIST="$(mktemp)"
TMP_DIR="$(mktemp -d)"
CONCAT_TMP="$TMP_DIR/hero-concat.mp4"

trap 'rm -f "$CONCAT_LIST"; rm -rf "$TMP_DIR"' EXIT

command -v ffmpeg >/dev/null || { echo "ffmpeg not found — brew install ffmpeg" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe not found — brew install ffmpeg" >&2; exit 1; }

mkdir -p "$OUT_DIR"

# ─── 1. Concat the 9 segments losslessly ───────────────────────────────────
# The concat DEMUXER (not the filter) requires all inputs to share codec
# parameters — true here since all 9 parts came from time-slicing the same
# source at the same encode settings. -c copy means no re-encode: this step
# only rewrites container-level bookkeeping (one moov instead of nine).
for i in 01 02 03 04 05 06 07 08 09; do
  f="$SEGMENTS_DIR/hero-part-$i.mp4"
  [ -f "$f" ] || { echo "Missing segment: $f" >&2; exit 1; }
  echo "file '$f'" >> "$CONCAT_LIST"
done

# -map 0:v:0 only: the source segments also carry an AAC track (silent per
# the client, but present in the container) and a camera timecode data
# stream (codec "unknown" to ffprobe — it's what triggers the harmless-but-
# noisy "Valid timecode frame rate must be specified" warning from the fmp4
# muxer downstream). The <video> element is always muted for autoplay policy
# regardless of audio content, and nothing here reads a timecode track, so
# both are dropped once at this step rather than carried through every
# downstream output for zero purpose.
ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" -map 0:v:0 -c copy "$CONCAT_TMP" -loglevel error
echo "✓ Concatenated 9 segments → $(du -h "$CONCAT_TMP" | cut -f1)"

# ─── 2. Print keyframe timestamps for the first 30s ────────────────────────
# HLS can only cut a segment at a keyframe — ffmpeg's HLS muxer rounds
# -hls_time up to the next one. If keyframes are sparse (e.g. every 8-10s,
# common for footage encoded for file-size rather than streaming), 4s
# segments become impossible without re-encoding. Read this output before
# trusting the fmp4 remux below.
echo ""
echo "── Keyframe timestamps, first 30s (for GOP verification) ──"
ffprobe -v error -select_streams v:0 -read_intervals '%+30' \
  -show_entries frame=pict_type,pts_time -of csv=p=0 "$CONCAT_TMP" \
  | grep ',I$' || echo "(no keyframes found in the first 30s — investigate before proceeding)"
echo "──────────────────────────────────────────────────────────"
echo ""

# ─── 3. Package as HLS fMP4 (lossless remux) ───────────────────────────────
# NOTE: ffmpeg prints "Valid timecode frame rate must be specified" here —
# a leftover from QuickTime timecode metadata on the source that the fmp4
# muxer tries and fails to carry over. It's cosmetic: verified init.mp4
# ends up with a single clean h264 video stream (no timecode track ever
# gets written) and the resulting segments/manifest play correctly. Not a
# build failure — don't "fix" it by chasing the warning.
#
# -hls_segment_type fmp4 (not the default MPEG-TS): fMP4 is what MSE
# consumes directly via SourceBuffer.appendBuffer — no transmuxing needed in
# the browser, which is what actually eliminates the black frame (a single
# init segment shared by every fragment, one continuous decode timeline).
# -hls_flags independent_segments: every segment starts with a keyframe, so
# hls.js/native HLS can start playback or seek into any segment cleanly.
ffmpeg -y -i "$CONCAT_TMP" \
  -c copy \
  -f hls \
  -hls_time 4 \
  -hls_playlist_type vod \
  -hls_segment_type fmp4 \
  -hls_flags independent_segments \
  -hls_fmp4_init_filename init.mp4 \
  -hls_segment_filename "$OUT_DIR/segment_%03d.m4s" \
  -hls_list_size 0 \
  "$OUT_DIR/hero.m3u8" \
  -loglevel error

echo "✓ HLS fMP4 package written to $OUT_DIR"
ls -la "$OUT_DIR"

# ─── 4. Progressive MP4 fallback ────────────────────────────────────────────
# For browsers/situations where MSE or hls.js fail outright (not just a
# recoverable Hls.js error — see useSeamlessVideo.ts's fatal-error path).
# +faststart moves the moov atom to the front so playback can start before
# the full file downloads, same as any other progressive MP4 on this site.
ffmpeg -y -i "$CONCAT_TMP" -c copy -movflags +faststart "$OUT_DIR/hero.mp4" -loglevel error
echo "✓ Progressive fallback → $OUT_DIR/hero.mp4 ($(du -h "$OUT_DIR/hero.mp4" | cut -f1))"

# ─── 5. Poster frame ─────────────────────────────────────────────────────────
# Generated for completeness (e.g. future OG/social use) even though the
# current HeroVideoBackground component intentionally has no static
# fallback image behind the video — that was removed at the client's
# explicit request. Do not wire this into the component without confirming
# that decision has changed.
ffmpeg -y -i "$CONCAT_TMP" -frames:v 1 -q:v 2 "$OUT_DIR/hero-poster.jpg" -loglevel error
echo "✓ Poster frame → $OUT_DIR/hero-poster.jpg"

echo ""
echo "Done. Total size: $(du -sh "$OUT_DIR" | cut -f1)"

# ─── Fallback path: re-encoding (NOT run by this script) ──────────────────
# Only needed if step 2's keyframe check shows intervals long enough that
# 4s HLS segments would force ffmpeg to silently produce longer segments
# (it rounds up to the next keyframe, it does not fail loudly). This
# project's source footage keyframes every ~1s, so this has not been
# necessary — but if different footage is ever substituted:
#
#   ffmpeg -i concat.mp4 -c:v libx264 -preset slower -crf 17 \
#     -g $((4 * FPS)) -keyint_min $((4 * FPS)) -sc_threshold 0 -an \
#     -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 \
#     -hls_flags independent_segments -hls_fmp4_init_filename init.mp4 \
#     -hls_segment_filename "$OUT_DIR/segment_%03d.m4s" -hls_list_size 0 \
#     "$OUT_DIR/hero.m3u8"
#
# -g/-keyint_min force a keyframe every exactly 4s*FPS frames;
# -sc_threshold 0 disables scene-cut-triggered extra keyframes so segment
# boundaries stay perfectly regular. CRF 17 is visually transparent — this
# re-encode is the one scenario in this pipeline where bits are NOT
# bit-identical to the source, so only take this path if step 2 proves the
# lossless remux can't hit 4s segments, and say so explicitly before running it.
