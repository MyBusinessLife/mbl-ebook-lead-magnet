# Public website refresh

The public design is layered through `public-refresh.css`. Existing form handlers,
Supabase configuration, user permissions and `crm-ads.html` are unchanged by this
refresh. Keep the Ads CRM outside any bulk stylesheet or script migration.

The homepage uses `home-laptop.js` and a pinned, locally hosted Three.js 0.160.0
module. It renders on interaction and while scroll interpolation settles; it stops
outside the viewport. Reduced-motion preferences, a pause button and a photographic
fallback keep the page usable without motion or WebGL. All navigation and primary
content remain in HTML.

The graphite, silver and cyan visual direction is shared by the public chrome.
The homepage now holds its native sticky scene until the lid is completely open,
then releases scrolling to the following sections. No wheel/touch events are
intercepted. The model is fitted to its complete opening envelope, keeping it away
from the copy and bottom controls on desktop, tablet and mobile. Short viewports
and reduced-motion preferences use the fully open, unpinned model. WebGL startup
failure or context loss removes the sticky sequence and restores the photo.

## Preview

Run a static HTTP server from the repository root, for example:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Open `http://127.0.0.1:4176/`. ES modules require HTTP serving for the 3D scene.

## Verification

The test scripts use Playwright installed in the local Node environment:

```sh
node tests/public-design.cjs
node tests/public-interactions.cjs
node tests/laptop-resilience.cjs
```

Visual checks accept `MBL_TEST_PAGES` (comma-separated relative HTML paths),
`MBL_TEST_WIDTHS`, `MBL_TEST_OUTPUT` and `MBL_TEST_URL` environment variables.
The tests block Supabase requests and substitute local form responses, avoiding
production leads and analytics. They do not test real email delivery or authentication.

On 2026-09-09, 23 representative public pages were checked in 66 page/viewport
combinations across widths from 320 to 1920 pixels, with no detected horizontal
overflow or JavaScript exceptions. Canvas screenshots and pixel comparisons
confirmed a visible model and scroll-driven movement at 390 and 1440 pixels.
Mobile menus and login/signup switching passed interaction checks.

The subsequent futuristic iteration was checked on six public pages in 30
page/viewport combinations. Homepage checks additionally cover 844px and 1024px
tablets. Tests assert that the canvas stays pinned throughout opening and reaches
its fully open state before release. Clean canvas captures allow pixel checks of
visible geometry, movement and frame boundaries.

The completed interaction suite passes: mobile navigation, login/signup switching,
contact and full diagnostic journeys with simulated submissions, cookie refusal,
pause, reduced-motion and import-failure fallback. The resilience suite also passes
short-screen rendering (320x568 and 844x390), WebGL context loss/restoration, and
direct anchor navigation past the sequence. Real authentication, email delivery
and production services are outside these frontend tests. No production deployment
was performed.

## Assets

- `assets/vendor/three-0.160.0.module.min.js`: Three.js, MIT license in `THREE-LICENSE.txt`.
- `assets/public/manrope-latin.woff2`: Manrope variable font, license in `MANROPE-LICENSE.txt`.
- `assets/public/workspace.jpg`: Unsplash photo `photo-1497366754035-f200968a6e72`.
- `assets/public/laptop-detail.jpg`: Unsplash photo `photo-1517336714731-489689fd1ca8`.

Publish these local assets with the updated HTML, `public-refresh.css`,
`home-laptop.js` and `premium-site.js`. Preserve other uncommitted work and do not
publish the entire dirty working tree without checking its unrelated changes.
