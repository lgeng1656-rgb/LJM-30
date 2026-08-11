# Intro Video Experience

## Goal

Show a full-stage intro video before the existing birthday home screen. Attempt to play it automatically with sound, require the video to finish before entry, then let the visitor click anywhere on the finished frame to enter the current home screen.

## Video asset and security

- Use the user-provided video downloaded from the temporary signed COS URL.
- Store the stable site asset at `public/media/intro/tom-and-jerry.mp4`.
- Never store the signed query string, temporary access key, security token, or signature in source code, documentation, Git history, or frontend output.
- The source file is approximately 2.05 MB, so retain its current quality unless compatibility inspection reveals an unsupported codec.

## Playback behavior

- A fresh page load starts on the intro screen.
- The intro attempts unmuted autoplay with `playsInline`.
- If the browser allows autoplay, the video starts immediately with sound.
- If autoplay is rejected, show a clear `点击播放` overlay. Clicking it starts the video with sound.
- Normal clicks while the video is still playing do not skip the intro.
- When playback ends, keep the final video frame visible and show `点击任意位置进入`.
- Clicking or pressing Enter/Space after the video ends opens the existing home screen.
- Refreshing, closing, or reopening the site shows the intro again. Internal navigation after entry does not show it again.

## Layout

- Add an `IntroVideo` component inside the existing 16:9 experience stage.
- Fill the stage with a dark background and center the video without cropping important content.
- Hide native controls during the intended flow.
- Use a subtle cream-paper prompt treatment so the intro still belongs to the existing scrapbook visual language.

## Failure handling

- If the video fails to load or play for a reason other than autoplay policy, show a short error message and a `直接进入` button.
- The failure state must never trap the visitor outside the birthday site.

## State architecture

- Extend the existing `Screen` union with `intro` and make it the initial screen.
- `IntroVideo` owns media-only state: autoplay blocked, playback ended, and media failure.
- `App` owns the screen transition from `intro` to the existing `home` screen.
- Cheese collection state remains session-only and is unaffected by the intro.

## Validation

- Component tests cover autoplay rejection, click-to-play fallback, ended gating, keyboard entry, and media failure fallback.
- App tests prove the existing home screen appears only after the intro completes and the visitor enters.
- Browser QA covers desktop playback, autoplay fallback behavior, final-frame entry, reload replay, console health, and asset loading.
- Run the full Vitest suite, production build, and Sites packaging tests before deployment.
