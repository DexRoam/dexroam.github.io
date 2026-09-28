# Design QA — cover title spacing and vertical position

## Comparison target

- Source visual truth: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\video-overlay-final-hero.png`
- User-directed changes: halve the distance between the main title and subtitle, then move the full title group slightly downward.
- Implementation URL: `http://127.0.0.1:4173/`
- Implementation screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\cover-spacing-lower-final.png`
- Mobile screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\cover-spacing-lower-mobile.png`
- Viewports: 1440 × 900 desktop and a fixed 390 × 844 mobile frame
- State: light theme, hero at the top of the page

## Full-view comparison evidence

- Combined comparison: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\cover-spacing-lower-comparison.png`
- The left panel is the earlier hero state; the right panel shows the tighter title/subtitle spacing and the slightly lower title group.
- State mismatch note: the earlier source uses the prior narrower title measure and therefore wraps the subtitle to three lines. The implementation preserves the current 1600 px title measure and two-line wrap; that pre-existing change is outside this spacing adjustment.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The title group is still visually centered, readable over the video, and fully contained at both tested viewport sizes.
- The reduced gap is clear without making the two title lines feel crowded.

## Required fidelity surfaces

- Fonts and typography: unchanged; only the vertical gap between the existing title elements was adjusted.
- Desktop spacing: title gap changed from `clamp(30px, 4vh, 44px)` to `clamp(15px, 2vh, 22px)`; hero top padding changed from `clamp(142px, 16vh, 190px)` to `clamp(172px, 19vh, 220px)`.
- Mobile spacing: title gap changed from `24px` to `12px`; hero-copy top padding changed from `clamp(128px, 17vh, 156px)` to `clamp(148px, 19vh, 176px)`.
- Colors, video treatment, copy, and responsive title width: unchanged.

## Patches made

- Halved the desktop and mobile title/subtitle gaps.
- Shifted the complete title group downward with responsive desktop and mobile top padding.
- Updated the stylesheet cache key so browsers load the revised CSS immediately.

## Implementation checklist

- Desktop hero checked at 1440 × 900.
- Mobile hero checked at 390 × 844.
- No clipping, overlap, or horizontal overflow observed.
- JavaScript syntax, HTTP delivery, and whitespace validation checked.
- No P0/P1/P2 findings remain.

final result: passed
