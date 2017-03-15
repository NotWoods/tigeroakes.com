---
feature: true
sortorder: 4
title: OML Contracting Co
subtitle: Construction Portfolio
slug: oml-contracting
color: {r: 220, g: 184, b: 105}
fallbackcolor: '#372008'
svg_logo: true
links:
  Details: /projects/oml-contracting
  View_site: http://omlhawaii.com
  Code: https://github.com/omlhawaii/omlhawaii.github.io
tech:
  - CSS 3D
  - JavaScript
description: >
  I worked with OML Contracting to redesign their portfolio. The site
  is designed to hide loading times by quickly downloading enough code to
  display the basic site, then running in the background to add on additional
  functionality and design.
---
I worked with OML Contracting to redesign their portfolio and showcase their
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

___

![Screenshot of OML Contracting Co. Website](/images/oml-contracting/screenshot.png)
