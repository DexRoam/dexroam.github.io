# Design QA — natural paper-content flow

## Comparison target

- Source visual truth: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\paper-affiliation-notes-inline-final.png`
- User-directed changes: remove `Research paper · CoRL 2026`, stop treating the paper metadata as a vertically centered second screen, and let all following sections continue in normal document flow.
- Implementation URL: `http://127.0.0.1:4173/`
- Implementation screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\paper-natural-flow-final.png`
- Mobile screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\paper-natural-flow-mobile.png`
- Viewports: 1440 × 900 desktop and a fixed 390 × 844 mobile frame
- State: light theme, scrolled to the handoff from the hero into paper metadata

## Full-view comparison evidence

- Combined comparison: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\paper-natural-flow-comparison.png`
- The left panel shows the previous full-screen, centered metadata presentation with the kicker; the right panel shows the metadata entering as a left-aligned normal-flow section immediately after the hero transition.
- The source and implementation intentionally use different scroll crops to expose the requested structural change.

## Focused region comparison evidence

- No additional crop was needed: the combined view clearly shows removal of the kicker, the new top-aligned flow, and the retained content hierarchy.
- The mobile capture verifies the same natural flow without horizontal overflow.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The paper metadata section no longer has a viewport-height minimum, vertical centering, or negative overlap margin.
- The subsequent Highlight section follows the metadata section in ordinary document flow.

## Required fidelity surfaces

- Fonts and typography: the paper title, author list, affiliations, and buttons preserve their current typography; only the kicker is removed.
- Spacing and layout rhythm: paper metadata now uses regular section padding instead of a dedicated 100svh stage; desktop padding is 56–84 px above and 64–96 px below.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: the supplied hero video and background treatment remain unchanged.
- Copy and content: `Research paper · CoRL 2026` is removed; the complete title, authors, affiliations, resources, and venue remain.

## Patches made since the previous QA pass

- Removed the paper-intro kicker element and its styling.
- Changed the paper metadata section from `min-height: 100svh` and centered flex layout to a normal block section with no minimum height.
- Removed the negative top margin that made the metadata act as a separate overlapping screen.
- Shortened the sticky hero scroll runway from 150svh to 118svh so the natural-flow content follows promptly while keeping a smooth fade.
- Applied the same normal-flow behavior on mobile.

## Implementation checklist

- Desktop hero-to-content handoff checked at 1440 × 900.
- Mobile handoff checked at 390 × 844.
- No blank page, overlap, clipping, or horizontal overflow remains.
- JavaScript syntax, HTTP delivery, and whitespace validation checked.
- No P0/P1/P2 findings remain.

final result: passed
