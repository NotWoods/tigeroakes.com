---
title: Oakes Management LLC
subtitle: Construction portfolio
weight: 8
color: "#d4a745"
fallbackcolor: "#372008"
links:
  - title: Details
  - title: View site
    link: https://omlhawaii.com/
  - title: Code
    github: omlhawaii/omlhawaii.github.io
tech:
  - CSS 3D
  - JavaScript
description: >
  I worked with Oakes Management to redesign their portfolio. The site
  is designed to hide loading times by quickly downloading enough code to
  display the basic site, then running in the background to add on additional
  functionality and design.
---

Oakes Management, also known as OML Contracting, is a construction management company that was selected as
the [best custom home builder in Hawai'i](https://www.homebuilderdigest.com/the-best-custom-home-builders-in-hawaii/).
I worked with Oakes Management to redesign their portfolio and showcase their
completed residences. Using **3D CSS transformations**, the site has a depth effect
that does not affect scrolling performance or rely on JavaScript, unlike other
parallax websites.

The site loads quickly despite the large images by **lazy-loading CSS**.
Enough code is downloaded initially to render the basic site. In the background,
the remaining code loads and is activated once complete.

Other tricks are used to mask loading times. When a portfolio item is opened,
the first few images shown are the same as those shown on the homepage. This
provided a buffer for the remaining images to load in the background as the user
views the first few in the page.

---

{{<img src="screenshot.*" alt="Screenshot">}}
