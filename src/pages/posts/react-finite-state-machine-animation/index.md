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

- The sidebar must take up 160 pixels when its open, but 0 pixels when its closed.
- We can’t animate the sidebar width since [animating size and layout is slow](https://web.dev/animations-overview/).
- We want the main content to cover the sidebar, rather than just slide the sidebar away.
- When closed, we should remove the `<Sidebar />` React component - but only once the animation is completed.

## Why a finite state machine?

A finite state machine abstractly represents all the possible states of a system, along with the possible paths between states. They often have a corresponding state diagram that shows all this information at once.

The sidebar animation has two clear states: the sidebar is open and the sidebar is closed. We also want to include a state for when the sidebar is animating. The sidebar animation is different when its opening vs when its closing, so we need two different states to represent this.

<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 285 185">
  <title>Finite State Machine diagram with circular paths and states for Open, Closing, Closed, Opening.</title>
  <g fill="#032030" stroke="#ebeeef">
    <circle cx="37.5" cy="32.5" r="27.5"/>
    <circle cx="177.5" cy="32.5" r="27.5" stroke-dasharray="4"/>
    <circle cx="107.5" cy="152.5" r="27.5" stroke-dasharray="4"/>
    <circle cx="247.5" cy="152.5" r="27.5"/>
  </g>
  <g font-family="'Cascadia Mono', 'Cascadia Code', monospace" fill="#ebeeef" text-anchor="middle">
    <text x="37.5" y="35.6" font-size="12">Open</text>
    <text x="177.5" y="35.6" font-size="12">Opening</text>
    <text x="107.5" y="155.6" font-size="12">Closing</text>
    <text x="247.5" y="156.9" font-size="12">Closed</text>
  </g>
  <path fill="#e67237" d="m48.4 73 2.2-1.3 20.8 36 .9-3 2.4.7-2 7.2-7.2-1.9.7-2.5 3 .9L48.4 73ZM234.6 112l-2.2 1.3-20.8-36-.8 3-2.4-.7 1.9-7.2 7.2 1.9-.6 2.5-3-.9 20.7 36.1ZM142.8 153.8v-2.6h60.7l-2.2-2.2 1.8-1.8 5.3 5.3-5.3 5.3-1.8-1.8 2.2-2.2h-60.7ZM140.3 33.8v-2.6H79.6l2.2-2.2-1.8-1.8-5.3 5.3 5.3 5.3 1.8-1.8-2.2-2.2h60.7Z"/>
</svg>

The diagram makes it pretty clear how many states we need to represent the animation and the possible paths. We can use TypeScript to help enforce these paths.

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
  grid-template-columns: 160px 1fr;
}
```

Intuitively you probably want to animate the sidebar column’s width from 0px to 160px. However, this will hurt your website’s performance. Each “in-between” width needs to be calculated by the browser during the animation: 1px, 2px, ... 319px, 160px. When the browser is running the animation, it has to re-layout the page for each of those in-between values. As a result, your site will attempt to figure out how every element is laid out around 160 times in a mere third of a second.

The more performant way to build animations is to use the [`transform` property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform). Transformations are purely visual and don’t effect layout. As a result, it can be animated cheaply. When animating, we can translate the content section to cover and uncover the sidebar.

```css
@keyframes slideOpen {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(160px);
  }
}
```

<SidebarTranslateSliderDemo client:visible />

However, we still want to change layout eventually, since the content needs to fill the screen once the sidebar closes. So, once the animation is done,
