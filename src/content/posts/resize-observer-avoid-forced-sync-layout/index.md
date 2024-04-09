---
title: ResizeObserver is a safe place to read scrollWidth/clientWidth
description: Avoid forced synchronous layout and safely read an element's size.
date: 2024-04-09
tags:
  - TIL
  - Web
categories:
  - Planet Mozilla
---

A common performance issue in web apps is [forced synchronous layout](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing#avoid_forced_synchronous_layouts): reading the [size of an element](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) and forcing the browser to immediately and synchronously undergo layout and style calculations in order to figure out the size.

This can be worked around by using a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). This API lets you receive a callback whenever the browser changes the size of an observed element. [When the callback is invoked](https://drafts.csswg.org/resize-observer/#broadcast-resize-notifications-h), the size of the element has just been calculated. This means you can safely read properties like `.offsetWidth`, `.scrollWidth`, and `.clientWidth` in addition to the properties provided by the ResizeObserver callback like `.borderBoxSize`. (_As long as you don’t invalidate it by writing to those properties before reading them._)

```jsx
const resizeObserver = new ResizeObserver((entries) => {
  let width = entry.borderBoxSize[0].inlineSize; // safe and fast to read
  width = entry.target.offsetWidth; // also safe and fast to read!
});

resizeObserver.observe(document.querySelector("div"));
```

This is a useful alternative to other ways to avoid forced synchronous layout, such as [using `requestAnimationFrame`](https://developer.chrome.com/blog/using-requestidlecallback#using_requestidlecallback_to_make_dom_changes).
