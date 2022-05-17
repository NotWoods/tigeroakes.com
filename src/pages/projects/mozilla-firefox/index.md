---
layout: ../../../layouts/ProjectLayout.astro
weight: 1
title: Mozilla Firefox
subtitle: Firefox Preview PWA and TWA support
color: '#E22850'
fallbackcolor: '#3a525c'
links:
  - title: Details
  - title: Play Store
    link: https://play.google.com/store/apps/details?id=org.mozilla.fenix
  - title: Code
    link: https://github.com/mozilla-mobile/fenix
tech:
  - Android
  - Kotlin
  - PWA
  - Trusted Web Activities
categories:
  - Feature
aliases:
  - /projects/mozilla
description: >
  At Mozilla, I was trusted with bringing support for Progressive Web Apps to the new Firefox Preview browser for Android. I shipped support for maskable icons before other browsers and added many other features.


setup: |
  import YouTube from '../../../components/shortcodes/YouTube.astro';
---

Firefox Preview is a rewrite of Mozilla's Firefox browser for Android. On the Mozilla Android Components team, I work on many features for Firefox Preview and other Mozilla Android web browsers. We shipped the browser to over 100,000 users on the Google Play Store during my internship and I continue to work on new features for the app.

## Progressive Web Apps

My main project at Mozilla was to support installing and running Progressive Web Apps in Firefox Preview. Progressive Web Apps are websites using new features on the web platform, letting them be installed like regular native apps on your phone. I implemented an enhanced app-like experience for web apps, with themed system bars and customized entries in the recent app switcher. I acted as a feature lead on this project and implemented most of the core functionality.

Firefox Preview is the first browser to support ["maskable icons"](/projects/maskable), letting websites specify a full-bleed Android icon that takes up the entire icon area on Android. Previously, all web app icons were placed inside a white background when added to the device home screen. Maskable icons are a new API to specify an icon with a custom background to display. I implemented maskable icon support in Mozilla's Android web browsers and published an article about it on [CSS Tricks](https://css-tricks.com/maskable-icons-android-adaptive-icons-for-your-pwa/).

## Trusted Web Activities

I brought support for Trusted Web Activities to Firefox Preview. Trusted Web Activities are a new API to easily display web content on Android without the limitations of WebViews or Custom Tabs. Firefox Preview verifies that the website developer trusts the Android app developer, then renders the website content full screen.

## Animations

I added over 15 animations to Firefox Preview to polish the user experience. I [published a blog](/posts/android-animate-strike-thru/) about some of the work that went into the animations and I was invited to publish on the [official Mozilla Mobile Engineering blog](https://medium.com/firefox-mobile-engineering/animating-a-strike-through-on-android-with-animated-vector-drawable-and-animatedstatelistdrawable-a77e66f9790f).

## Uploads

I worked to enhance the UI for uploading a file to websites containing a file input element. I enhanced the upload dialog to allow for taking a picture with the camera or recording audio with the microphone depending on the data type requested by a website. I also coordinated with the Gecko team to add support for the `capture` attribute, so that websites could request to directly open the camera or microphone rather than open the file picker.

## Downloads

To have greater control over the file downloading experience, I modified our implementation to download resources through Mozilla's Gecko engine rather than the Android networking stack.

---

<YouTube id="zFNvFefOeaI" />
