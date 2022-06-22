---
layout: ../../../layouts/PostLayout.astro
title: 'Make advanced React animation easy using finite state machines'
description: Sync state changes with animations while keeping code readable.
date: 2022-05-17
tags:
  - Web
  - React
  - Animation
  - CSS
categories:
  - Planet Mozilla
banner: banner.png
banner_alt: Finite State Machine diagram with circular paths and states for Open, Closing, Closed, Opening. In the background a sidebar and content layout is visible.
toc: true
setup: |
  import { SidebarAnimationDemo, SidebarLayoutDemo, SidebarNaiveDemo, SidebarTranslateSliderDemo } from './SidebarDemo.tsx';
---

Advanced web animation can be tricky - you want to mount and unmount elements, reduce layout, and keep the whole thing looking smooth. While working on [Microsoft Loop](https://www.microsoft.com/en-us/microsoft-loop), I recently added an animation that plays when you open or close the sidebar. I found that using a finite state machine and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) made the animation performant and easy to read, with no need for a library or package. Here’s some examples of how it works!

## Breaking down the animation

<SidebarAnimationDemo client:visible />

This simple sidebar and content layout requires a few different moving parts:

- The sidebar must take up 160 pixels when its open, but 0 pixels when its closed.
- We can’t animate the sidebar width since [animating width and layout is slow](https://web.dev/animations-overview/).
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

The diagram makes it pretty clear how many states we need to represent the animation and the possible paths. All the animation logic will be driven by the current state of the state machine. Setting up the animation in this way makes it easier to keep React rendering in sync, since the state can be accessed synchronously.

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
  /* Using 1fr makes the column take up the remaining space in the grid */
  grid-template-columns: 160px 1fr;
}
```

Intuitively you probably want to animate the sidebar column’s width from 0px to 160px. However, [this will hurt your website’s performance](https://web.dev/animations-overview/). Each “in-between” width needs to be calculated by the browser during the animation: 1px, 2px, ... 319px, 160px. When the browser is running the animation, it has to re-layout the page for each of those in-between values. As a result, your site will attempt to figure out how every element is laid out around 160 times in a mere third of a second.

The more performant way to build animations is to use the [`transform` property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform). Transformations are purely visual and don’t effect layout. As a result, it can be animated cheaply. When animating, we can translate the content section to cover and uncover the sidebar.

```ts
// Start animating the main content section using the Web Animations API.
const animation = mainContent.animate(
  [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
  { easing: 'ease-in-out', duration: 300 }
);
```

<SidebarTranslateSliderDemo client:visible />

## Changing layout

However, we still want to change layout eventually, since the content needs to fill the screen once the sidebar closes. So, once the animation is done, we change the width. The difference is this layout change happens once rather than many times.

```ts
animation.addEventListener('finish', () => {
  // When the animation is finished, add the "closed" CSS class.
  container.classList.add('closed');
});
```

We also need to change the layout once when the animation is running. In the demo above, you'll notice that the area behind the content is visible when its being translated. Since the content only takes up part of the screen, it leaves a gap once it starts moving. The trick is to first make the content take up the entire screen width, then start moving it.

```css
.container.animating {
  /* Using 100% makes the column take up the entire grid's width */
  grid-template-columns: 0px 100%;
}
```

<SidebarLayoutDemo client:visible />

Now our code for the closing animation looks like this:

```ts
// Add the "animating" CSS class.
container.classList.add('animating');
// Start the animation.
const animation = mainContent.animate(
  [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
  { easing: 'ease-in-out', duration: 300 }
);
animation.addEventListener('finish', () => {
  // When the animation is finished, add the "closed" CSS class.
  container.classList.replace('animating', 'closed');
});
```

## Managing the layout and animation in React

So far we've been working with vanilla JS for the animation. However, if we're working with a React component, we probably want to use React to manage the CSS classes and layout (in case your component does other things).

```tsx
function SidebarLayout(props: { open: boolean }) {
  const contentRef = useRef<HTMLElement>(null);
  const [containerClassName, setContainerClassName] = useState('open');

  useLayoutEffect(() => {
    const mainContent = contentRef.current;
    if (!props.open) {
      // Add the "animating" CSS class.
      setContainerClassName('animating');
      // Start the animation.
      const animation = mainContent.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
        { easing: 'ease-in-out', duration: 300 }
      );
      animation.addEventListener('finish', () => {
        // When the animation is finished, add the "closed" CSS class.
        setContainerClassName('animating', 'closed');
      });
    } else {
      // Reverse the direction for the opening animation.
      ...
    }
  }, [props.open]);

  return (
    <div className={`container ${containerClassName}`}>
      <aside className="sidebar">Sidebar</aside>
      <section ref={contentRef} className="content">
        Main content
      </section>
    </div>
  );
}
```

<SidebarNaiveDemo client:visible />

If you toggle `open` rapidly in the above demo, you'll notice that the background is sometimes visible again. This is because state updates with `setContainerClassName` are asynchronous. React doesn't update the container's CSS class until the animation has already started.

This is where the state machine starts to come in. We can store the current state of the animation and use that to trigger the animation, rather than having the animation effect manage state.

```tsx
type AnimationState = 'open' | 'opening' | 'closed' | 'closing';

function useAnimationStateMachine(props: {
  open: boolean;
}): [AnimationState, (state: 'open' | 'closed') => void] {
  const [animationState, setAnimationState] = useState<AnimationState>('open');

  useEffect(() => {
    // React to the "open" prop changing
    setAnimationState((lastState) => {
      const finalState = finalAnimationState(props.open);
      if (lastState === finalState) {
        // Don't animate if the state is already correct
        return lastState;
      } else {
        // Start animating
        if (props.open) {
          return 'opening';
        } else {
          return 'closing';
        }
      }
    });
  }, [props.open]);

  return [animationState, setAnimationState];
}
```

The possible animation states here correspond to the state diagram above. Now that the animate state is stored in React state, it can be used to change the CSS class name when rendering.

Later on we'll use the setter to mark when the animation is finished. Since we only want to set the `'open'` and `'closed'` states to indicate the animation is finished, we can restrict the possible parameter types with TypeScript. This helps enforce the paths in the state diagram.

```tsx
function SidebarLayout(props: { open: boolean }) {
  const contentRef = useRef<HTMLElement>(null);
  const [animationState, setAnimationFinished] =
    useAnimationStateMachine(props);

  useLayoutEffect(() => {
    const mainContent = contentRef.current;

    let animation: Animation | undefined;
    const options: KeyframeAnimationOptions = {
      easing: 'ease-in-out',
      duration,
    };

    switch (animationState) {
      case 'closing':
        // Start the animation when the animate state changes to closing
        animation = mainContent.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
          options
        );
        animation.addEventListener('finish', () => {
          // Mark when the animation is done
          setAnimationFinished('closed');
        });
        break;
      case 'opening':
        // Reverse the direction for the opening animation.
        animation = mainContent.animate(
          [{ transform: 'translateX(-160px)' }, { transform: 'translateX(0)' }],
          options
        );
        animation.addEventListener('finish', () => {
          setAnimationFinished('open');
        });
        break;
    }
  }, [animationState]);

  // Map animation state to the container CSS class name
  const containerClassName = {
    opening: 'animating',
    closing: 'animating',
    open: 'open',
    closed: 'closed',
  }[animationState];

  return (
    <div className={`container ${containerClassName}`}>
      <aside className="sidebar">Sidebar</aside>
      <section ref={contentRef} className="content">
        Main content
      </section>
    </div>
  );
}
```

With this change, the animation now starts at the same time as the CSS class name change! The state machine is now driving the layout (via React) and the animation (via `useLayoutEffect` and the Web Animations API).

It's also now possible to unmount the sidebar using React. Just like changing the class name, we can use the animation state to alter what items are rendered in sync with the animation.

```tsx
function SidebarLayout(props: { open: boolean }) {
  ...

  return (
    <div className={`container ${containerClassName}`}>
      {/* If the current state is "closed", unmount the sidebar */}
      {animationState !== 'closed' && (
        <aside className="sidebar">
          Sidebar
        </aside>
      )}
      <section ref={contentRef} className="content">
        Main content
      </section>
    </div>
  );
}
```

With that, you have a complete and performant animation without the need for tools like react-spring or React Transition Group. You can check out the complete demo again here, and keep an eye out for this animation in Microsoft Loop.

<SidebarAnimationDemo client:visible />
