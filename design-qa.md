# Design QA — DexRoam title option 2

## Comparison target

- Source visual truth: `C:\Users\29491\.codex\generated_images\01a09653-5394-7df2-a5bf-b9d40915bf0c\exec-d19d4094-8134-4054-afde-538c6c557248.png`
- Implementation URL: `http://127.0.0.1:8000/#top`
- Light implementation screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-light.png`
- Dark implementation screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-dark.png`
- Rounded-Dex verification screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-rounded-dex.png`
- Final Fredoka verification screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-fredoka-light.png`
- Balanced-weight light screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-balanced-light.png`
- Balanced-weight dark screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-balanced-dark.png`
- Larger author and affiliation screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-larger-authors.png`
- Numbered affiliation verification screenshot: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-numbered-affiliations-fresh.png`
- Mobile title check: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\implementation-mobile-dark.png`
- Viewport: 1440 × 900 desktop; 390 × 844 focused mobile check
- State: top of page, navigation closed, light and dark themes

## Full-view comparison evidence

- Combined comparison: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\comparison-full.png`
- The implementation preserves the existing hero structure and exact paper content while matching the selected concept's rounded `Dex` plus flowing cobalt `Roam` hierarchy.
- The title remains the dominant hero element without displacing authors, actions, navigation, or the first-screen blue horizon.

## Focused region comparison evidence

- Focused title comparison: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\comparison-title.png`
- Final focused comparison: `E:\Project\ProjectWebsite\dexroam.github.io.git\qa\title-option-2\comparison-fredoka.png`
- `Dex` uses the explicitly rounded Fredoka family and `Roam` uses a restrained Courgette script. Their baseline, optical height, color transition, and apparent stroke mass read as one wordmark.
- A focused crop is sufficient because this change affects typography only and introduces no new image asset or control.

## Findings

- No actionable P0, P1, or P2 mismatches remain in the title treatment.
- The live page intentionally retains its existing subtitle wrap, real author block, buttons, navigation, and hero proportions instead of copying the concept image's placeholder content.

## Required fidelity surfaces

- Fonts and typography: Fredoka 600 gives `Dex` visibly rounded terminals without overpowering Courgette 400 `Roam`. Responsive sizing keeps the wordmark inside the mobile viewport.
- Spacing and layout rhythm: the two spans share a baseline with a small negative handoff gap; the existing hero rhythm remains unchanged.
- Colors and visual tokens: light mode uses black plus the selected concept's saturated cobalt `#1262f3`; dark mode uses the existing near-white foreground plus `#6f9eff` for contrast.
- Image quality and asset fidelity: no rasterized title, placeholder, SVG approximation, or generated asset is used in production; the wordmark remains selectable HTML text.
- Copy and content: `DexRoam`, the exact paper title, author list, affiliations, and actions are unchanged.

## Patches made

- Loaded the free Courgette and Fredoka web fonts.
- Replaced Nunito with Fredoka 700 after the user's rendered screenshot showed that Nunito remained too conventional and angular relative to the selected concept.
- Reduced Fredoka from 700 to 600 and relaxed its tracking so `Dex` and `Roam` have closer visual weight.
- Corrected the light-theme `Roam` color from deep navy to the brighter cobalt used by the selected concept.
- Increased the desktop author line from 15px to 17px and affiliations from 12px to 14px; mobile uses 14px and 11px respectively. The smaller contribution note retains its supporting hierarchy.
- Replaced the abbreviated institution string with the paper's five numbered affiliations, added the corresponding affiliation indices to every author, and matched the contribution-note size to the affiliation size at desktop and mobile breakpoints.
- Rebuilt the two-part title styling around the selected rounded-sans/script direction.
- Replaced the former artificial italic/skew treatment with the natural Courgette letterforms and a restrained hover shift.
- Added a brighter dark-theme `Roam` color.
- Reduced and constrained the mobile wordmark so it does not overflow the viewport.

## Implementation checklist

- Desktop light theme checked.
- Desktop dark theme checked.
- Mobile title containment checked.
- HTML/CSS diff validation passed.

## Follow-up polish

- P3: after viewing in the user's normal browser, the `Roam` size can be moved by roughly ±3% if a slightly calmer or more expressive script balance is preferred.

final result: passed
