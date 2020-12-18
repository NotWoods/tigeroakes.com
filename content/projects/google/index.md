---
weight: 2
title: Google Chrome
subtitle: Chrome APK size breakdown
color: '#2a70ea'
fallbackcolor: '#9ba3ac'
links:
  - title: Case study
  - title: Open app
    link: https://storage.googleapis.com/chrome-supersize/index.html
  - title: Code
    link: https://chromium.googlesource.com/chromium/src.git/+/master/tools/binary_size/
tech:
  - Android
  - JavaScript
  - Python
  - Accessibility
  - Web Workers
  - Streams
  - Canvas API
categories:
  - Feature
description: >
  Working at Google, I built the user interface for an internal tools created by the Chrome for Android team. "Super Size" tracks details for every file and method in Chrome's APK executable, so I wrote the interface to display thousands of data entries quickly.
---

_Using web workers and native JavaScript for better visualizations, faster load times, and better user experience_

## Background

To build a web browser for devices in both established and emerging markets, Google Chrome built an internal tool with Python to analyze the byte size of the Chrome for Android app. The tool, called Super Size, collects data about every function and file in the Chrome APK then archives it so the data can be analyzed later. The tool was available through the command line and a rudimentary UI, but Google wanted a more user-friendly web application that offered more features and better performance. As an intern on the Google Chrome team, I created a performant app.

## Challenge

The ultimate goal was to build a web application that allowed users to filter and manipulate the size data without needing to re-run the command-line tool. The existing UI visualization could not handle some forms of data, such as comparing two different versions of Chrome. The app needed to be friendly to both internal Google developers and outside contributors to the open-source Chromium project. It also needed to load data quickly, but with so many functions in Chrome, full size breakdowns were over 160 MB.

## Solution

I worked with my mentor to decide on the best visualization for the new web application. We settled on a file explorer like tree view, which could display size information associated with each folder and file to the side. The app was planned to contain a tree view for size details and a options form to change filters. With the limited interactive elements, I decided to use native JavaScript code to directly manipulate the DOM rather than pulling in a larger library such as Polymer or React.

I began the process of rebuilding the UI into a web app by creating a prototype with basic tree view functionality. I chose to use Web Workers for multi-threading to increase UI performance. While the application was able to load a limited view of Chrome's files, it crashed when trying to load all 160 MB of data. I was able to address the crashing by streaming in the data rather than loading it all at once, which also meant partial information was loaded in under a second. On browsers that did not support streams, content was stored in a more compact binary format until it was parsed. Data was also cached in binary format so that changing filters didn't require downloading the data file from the network again.

To visualize the different types of files (C++ code, Java code, other data) I designed custom icons following the Google Material Theme. Folder icons were tinted with the same color as the files within to hint toward the most common types of data in the program. A more detailed breakdown is displayed when hovering over a folder, indicating the totals of each type of file and their ratio to the total folder size. I added a pie chart using the Canvas API to provide a visual indicator of percentages.

To improve accessibility of the tool, I fine-tuned how screen readers would read each file and added keyboard shortcuts following the ARIA standard. The shortcuts were also well received by users who were not impaired, and allowed them to quickly navigate the tree.

## Results

I was able to create a web application that could load 160 MB of data in under 7 seconds on first load. Parsing data from the cache only took a few seconds. The UI is fast and ultra responsive thanks to multi-threading. Thanks to streaming data, the application loads quickly even on 2G connections.

## Benefits

The new user interface allowed the Google Chrome team to discover size savings and reduce the overall size of the Google Chrome for Android APK file. Immediately after release, my manager discovered an unused library and removed it, saving 30 KB. Other developers were able to use it to search for and share size differences in their code. By helping trim down the storage taken up by Chrome, space is freed for the millions of Android users who have Google Chrome installed to their devices.

## Conclusion

Armed with a better tool for analyzing the Android app, the Google Chrome team is able to improve the app for all its users.

---

![Screenshot](screenshot.*)
