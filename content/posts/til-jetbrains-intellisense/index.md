---
title: "TIL Android Studio can show KDocs on hover"
description: My favorite Visual Studio Code feature is hidden behind a setting in Android Studio.
date: 2020-07-06
author: tiger
tags:
  - TIL
  - Android
  - Android Studio
images:
  - /posts/til-jetbrains-intellisense/settings.png
  - /posts/til-jetbrains-intellisense/preview.png
---

I like easy access to documentation written in comments. In Android Studio, and other JetBrains editors, you can display function types and docs on hover when you turn on a simple setting.

In Android Studio's settings window, go to "Editor" > "General" and check "Show quick documentation on mouse move". You can leave the delay at the default value.

{{<img src="settings.png" alt="Android Studio settings with Show quick documentation on mouse move highlighted">}}

When editing code, you can quickly check documentation by just hovering over code.

{{<img src="preview.png" alt="Android Studio displaying function type and documentation on hover">}}
