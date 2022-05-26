---
layout: ../../../layouts/PostLayout.astro
title: How to use Segoe UI Variable in a website
description: Loading this font locally is a bit tricky.
date: 2022-05-25
tags:
  - TIL
  - Web
banner: banner.svg
toc: true
---

### Why use Segoe UI Variable?

Windows 11 introduced a new system font called [Segoe UI Variable](https://docs.microsoft.com/en-us/windows/apps/design/signature-experiences/typography). This new font is a [variable font](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide) that replaces the older Segoe UI font in Windows 10 and below.

Many sites use the system font when rendering sans-serif text, since it's quick to load (already installed in your device) and looks like other apps on your device. You might see a CSS rule like this:

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}
```

This is used often enough that browsers introduced the [`system-ui` font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#system-ui) to replicate the same behaviour. However, even though Segoe UI Variable is the new system font in Windows 11, it's not used if you set the font-family to `system-ui`. So how do you use it?

### How to load it with CSS

The intuitive way doesn't work.

```css
body {
  /* Doesn't work in any browser as of May 2022 */
  font-family: 'Segoe UI Variable';
}
```

Segoe UI Variable isn't available, even though you can see it in the system font list. The browser will just fall back to another font like Times New Roman. The only way to use it with this name is to download a webfont, which adds to your site's download size.

![Screenshot of Windows 11 font settings, showing entries for "Segoe UI" and "Segoe UI Variable"](font-settings-windows-11.png)

So how do you use Segoe UI Variable? I spent a few days asking around at Microsoft trying to find out. [Ian Prest](https://www.linkedin.com/in/ian-prest-5a93061/), who's working on fonts in Microsoft Edge, let me know that you need to use one of the following 3 names:

```css
body {
  font-family: 'Segoe UI Variable Text';
  font-family: 'Segoe UI Variable Small';
  font-family: 'Segoe UI Variable Display';
}
```

### Why the different names?

Segoe UI Variable has two different axes of variation: font weight and optical size. Font weight corresponds to the [`font-weight` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight): regular, bold, etc. Optical size corresponds roughly to the [`font-size` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size). It lets the font change its shape depending on the size of the text.

| Small | Text | Display |
| --- | --- | --- |
| ![Preview of Segoe UI Variable Small](typography_caption.svg) | ![Preview of Segoe UI Variable Text](typography_body.svg) | ![Preview of Segoe UI Variable Display](typography_title.svg) |

However, the version of Segoe UI Variable that comes with Windows 11 doesn't have optical size variation (or it doesn't work in web browsers). So you have to specify the version you want separately. (Hopefully this is fixed in a future version of Windows.)

```css
.small-text {
  font-family: 'Segoe UI Variable Small';
  font-size: 10px;
}
.medium-text {
  font-family: 'Segoe UI Variable Text';
  font-size: 16px;
}
.big-text {
  font-family: 'Segoe UI Variable Display';
  font-size: 36px;
}
```

### How to use this with a web font fallback

What if you wanted every user to see Segoe UI Variable? Windows 11 users should use the local copy, and other users should automatically download a copy of the font from the web. This is what I'm currently working on for [Microsoft Loop](https://www.microsoft.com/en-us/microsoft-loop).

_(Note: Segoe UI is copyrighted by Microsoft, so you should only do this when working on a Microsoft site.)_

The [downloadable version of Segoe UI Variable](https://aka.ms/SegoeUIVariable) has all 3 optical size axis bundled into one file. So how do you use that with 3 different font names? The final CSS looks like this.

```css
@font-face {
  font-family: 'Segoe UI Variable Small';
  src: local('Segoe UI Variable Small'),
    url('/fonts/SegoeUIVF-all.tff') format('truetype-variations');
  font-variation-settings: 'opsz' 1;
  font-weight: 300 700;
  font-style: normal;
}
@font-face {
  font-family: 'Segoe UI Variable Text';
  src: local('Segoe UI Variable Text'),
    url('/fonts/SegoeUIVF-all.tff') format('truetype-variations');
  font-variation-settings: 'opsz' 10.5;
  font-weight: 300 700;
  font-style: normal;
}
@font-face {
  font-family: 'Segoe UI Variable Display';
  src: local('Segoe UI Variable Display'),
    url('/fonts/SegoeUIVF-all.tff') format('truetype-variations');
  font-variation-settings: 'opsz' 36;
  font-weight: 300 700;
  font-style: normal;
}
```

The [`font-variation-settings` property](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variation-settings) is the key here and lets you specify the optical size of the variable font. While `SegoeUIVF-all.ttf` is loaded for every font family, it uses a different axis of variation depending on the name.

The other properties [`font-weight`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight) and [`font-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-style) list the range of supported weights and styles for the font. It's important to place these properties after the `font-variation-settings` property, otherwise they'll be overriden by `font-variation-settings`.
