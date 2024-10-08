---
logo: ./logo.png
background: ./background.jpg
title: Color Breakdown
subtitle: Color-identifying Progressive Web App
weight: 7
color: '#37474f'
fallbackcolor: '#6f3d10'
links:
  - title: Details
  - title: Open app
    link: https://notwoods.github.io/color-breakdown/
  - title: Code
    github: NotWoods/color-breakdown
tech:
  - JavaScript
  - Service Workers
  - Canvas API
  - PWA
description: >
  Color Breakdown is a wrapper around a JavaScript port of Android’s Palette API. In various projects I’ve worked on, I’ve wanted complementary colors to pair with images. The Palette API automatically extracts prominent colors from images for designs, but is only available in Android. The JavaScript port is for Node.js so it requires a script. I wanted a simple GUI to handle images for me, so I wrote a Progressive Web App for it.
---

Color Breakdown is a wrapper around a JavaScript port of [Android's Palette API](https://developer.android.com/training/material/palette-colors). In various projects I've worked on, I've wanted complementary colors to pair with images. The Palette API automatically extracts prominent colors from images for designs, but is only available in Android. The [JavaScript port](https://github.com/akfish/node-vibrant) is for Node.js so it requires a script. I wanted a simple GUI to handle images for me, so I wrote a Progressive Web App for it.

The app handles file uploads from the user, then extracts image colors inside a worker thread. Past entries are saved to storage using IndexedDB, so they can be quickly referenced later on.

---

![Screenshot](/projects/color-breakdown/screenshot.jpg)
