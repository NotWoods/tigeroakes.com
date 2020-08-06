---
title: "How to make Android Studio show documentation on hover"
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

![Android Studio settings with Show quick documentation on mouse move highlighted](settings.png)

When editing code, you can quickly check documentation by just hovering over code. The documentation is pulled from the code's Javadoc, KDoc, or other similar comments.

![Android Studio displaying function type and documentation on hover](preview.png)
