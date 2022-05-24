---
layout: ../../../layouts/ProjectLayout.astro
title: PWABuilder
subtitle: Packaging PWAs for Android and Play Store
color: '#491576'
logo: logo.png
links:
  - title: Details
  - title: Code
    github: GoogleChromeLabs/bubblewrap
tech:
  - PWA
  - Android
  - JavaScript
---

I've contributed a few features to Microsoft's [PWABuilder](https://www.pwabuilder.com/) tool and [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap), Google's open source tool for packaging PWAs as Android apps for the Google Play Store. Bubblewrap is used by PWABuilder to generate Android APK files for publishing.

I worked on generating Android icons and assets from a Web App Manifest when [creating an Android package](https://blog.pwabuilder.com/docs/generating-your-android-package/). This included creating adaptive launcher icons from maskable icons, notification icons from monochrome icons, and shortcuts icons from maskable and monochrome shortcut assets. I also decreased Bubblewrap's download size by removing unused assets and updating its compilation code.
