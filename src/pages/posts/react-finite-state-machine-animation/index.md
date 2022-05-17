---
layout: ../../../layouts/PostLayout.astro
title: 'Make advanced React animation easy using finite state machines'
description: Sync state changes with animations while keeping code readable.
draft: true
date: 2022-05-13
tags:
  - Web
  - React
  - Web Animation API
  - CSS
categories:
  - Planet Mozilla
toc: true
setup: |
  import { SidebarAnimationDemo, SidebarTranslateSliderDemo } from './SidebarDemo';
---

Advanced web animation can be tricky - you want to mount and unmount elements, reduce layout, and keep the whole thing looking smooth. While working on [Microsoft Loop](https://www.microsoft.com/en-us/microsoft-loop), I recently added an animation that plays when you open or close the sidebar. I found that using a finite state machine and the Web Animation API made the animation performant and easy to read. Here’s how it works!

## Breaking down the animation

<SidebarAnimationDemo client:visible />

This simple sidebar and content layout requires a few different moving parts:

- The sidebar must take up 320 pixels when its open, but 0 pixels when its closed.
- We can’t animate the sidebar width since [animating size is slow](https://web.dev/animations-overview/).
- We want the main content to cover the sidebar, rather than just slide the sidebar away.
- When closed, we should remove the `<Sidebar />` React component - but only once the animation is completed.

## Representing the animation in CSS

Let’s start with the CSS used to represent the sidebar and content layout.

```css
.container {
  display: grid;
  grid-template-areas: 'sidebar content';
}
.container.closed {
  grid-template-columns: 0px 1fr;
}
.container.open {
  grid-template-columns: 320px 1fr;
}
```

![state-machine-diagram.svg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/98f281e4-b992-4b5f-83e3-1b8273be9369/state-machine-diagram.svg)

Intuitively you probably want to animate the sidebar column’s width from 0px to 320px. However, this will hurt your website’s performance. Each “in-between” width needs to be calculated by the browser during the animation: 1px, 2px, ... 319px, 320px. When the browser is running the animation, it has to re-layout the page for each of those in-between values. As a result, your site will attempt to figure out how every element is laid out around 320 times in a mere third of a second.

The faster way to build animations is to use the `[transform` property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform). Transformations are purely visual and don’t effect layout. As a result, it can be animated cheaply. When animating, we can translate the content section to cover and uncover the sidebar.

```css
@keyframes slideOpen {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(320px);
  }
}
```

<SidebarTranslateSliderDemo client:visible />

However, we still want to change layout eventually, since the content needs to fill the screen once the sidebar closes. So, once the animation is done,
