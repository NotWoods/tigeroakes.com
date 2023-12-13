---
title: Takeaways from React Day Berlin & TestJS Summit 2023
description: What I learned from a conference double feature.
date: 2023-12-13
tags:
  - Takeaways
  - Web
categories:
  - Planet Mozilla
toc: true
---

I attended a conference double feature: [TestJS Summit](https://www.testjssummit.com/) on December 7, 2023 followed by [React Day Berlin](https://reactday.berlin/) the next day on December 8. I was speaking during the remote day for React Day Berlin on December 12 about how to hack an e-reader to show a tea menu with React.

I spoke to a lot of people and watched a lot of talks during the conference, here are some things I learned!

## Chromatic Story Modes & Media features

At Microsoft I've been wanting to improve our Storybook tests to cover Right-to-Left layouts for internationalization and high contrast styles for accessibility. I visited Chromatic's booth and learned that [corresponding features were recently added](https://www.chromatic.com/blog/introducing-story-modes/)!

- **[Story Modes](https://www.chromatic.com/docs/modes/)** let us write a story once, then automatically take screenshots with different parameters set. We could quickly configure Chromatic to use different locales with each story and test languages which are read right-to-left. You can also set viewport size as a mode to quickly test responsive design.
- **[Media features](https://bbc.chromatic.com/docs/media-features/)** let us set browser/OS level settings for a story. We can turn on `forcedColors` to run stories in high contrast mode. You can also pair media features and story modes to automatically take high contrast mode screenshots for all stories.

## Tests should focus on hooks or DOM, not both

I met up with fellow Microsoftie [Maya Shavin](https://portal.gitnation.org/person/maya_shavin) and watched her talk on "Component Testing with Vitest". One React testing practice she recommended was to split apart tests focused on hooks (testing your logic) from tests focused on the returned React & HTML elements (testing your views).

[Hooks can be encapsulated](https://kyleshevlin.com/use-encapsulation) and exported independent of the component, even if they're tightly coupled to the component. You can then test the hook's logic without worrying what's done with it in the component later. Components might use suspense or render other components, and that unrelated behaviour will make your tests more complicated.

The component and the elements it returns can then be tested separately. Maya recommended using [module mocks](https://vitest.dev/guide/mocking.html#modules) to mock the hooks, then just test how the component responds to different values the hook can return.

## Vitest has better documentation and helpers than Jest

Maya's talk also showcased [Vitest](https://vitest.dev/), which has the same API as Jest but supports some additional features. It has a fast watch mode and parallel testing support. There's also a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer) to make it easier to run and debug tests.

I looked into Vitest's docs and found that they explain mocking much better than Jest does. `jest.mock` has very confusing behaviour where it sometimes will hoist your mock (move your code to the top of the file so it runs before imports), and sometimes will not. It's not documented and I've made unsuccessful attempts to figure it out from the source code.

In contrast, [Vitest has detailed documentation](https://vitest.dev/api/vi#vi-mock) indicating that you cannot use variables defined outside the factory, or else hoisting won't work. Vitest also offers a helper to make it easy to work around this: [the `vi.hoisted` function](https://vitest.dev/api/vi#vi-hoisted).

Vitest has other nice helpers like [`vi.stubGlobal`](https://vitest.dev/api/vi#vi-stubglobal) that I wish were in Jest. Perhaps they can be contributed to Jest in the future.

## Code quality characteristics

Turns out there's a standard for "code quality" characteristics named ISO-25010.

Júlio de Lima researched PR reviews in popular GitHub repositories to see what types of code quality feedback were most common and how they were enforced. Many repositories established coding guidelines and used bots to enforce them.

For performance, the most common suggestion was to add caching to reduce how much work needed to be done by the function.

The health of a test suite can be measured by the number of tests (not counting skipped tests) over time. The number of tests and number of developers contributing to tests should both rise over time. Otherwise it's a sign of a flaky app and flaky tests.

## Replay makes e2e test debugging easier

I was very impressed with demos for [Replay](https://www.replay.io/), which lets you record your actions while you interact with a web browser then later replay them exactly (which is done by capturing and later mocking OS functions). Replay has two components: a browser for recording (as an extension wasn't powerful enough) and a web app for replaying and debugging.

The team showed how you can configure end-to-end tests to use Replay's browser and then just upload recordings from failing tests. Then, you can step both forwards and backwards through the test run later on, and even insert logpoints. This removes the need to reproduce flaky tests - you can just use the recording. You could also have teammates or customers record themselves and then debug their issues later in the recording.

## Astro updates

[Astro](https://astro.build/) is a framework for building websites with light client-side JavaScript (unlike Next.js which has a minimum download size of nearly 100kb). Elian Van Cutsem spoke about some updates to the project in 2023. It's had 3 major updates just this year!

Speakers were praising Astro's CLI for being easy to use and for having delightful touches for user experience, like greeting the user by name. Astro has extracted it's [CLI helpers](https://github.com/withastro/cli-kit) to a separate package so other libraries can use them too.

Astro also now supports rendering HTML without wrappers like `<!doctype>`, so you could potentially use it to generate HTML partials and maybe XML files.

## Nanostores as an alternative to Svelte Stores

I've been using [Svelte Stores](https://svelte.dev/docs/svelte-store) in some React code I've written as a way to update state while only rendering leaf nodes in the React tree, not the branch nodes. They're also super tiny, just 1.3kb to import.

I prefer them to signals as you can set callbacks for when non-zero subscribers are listening, and when the subscriber count drops back to zero. This lets me wrap other classes while cleaning up once there are no more listeners.

Astro recommends a similar package named [Nano Stores](https://github.com/nanostores/nanostores). It offers a very similar API and is also super tiny, but is designed to be framework agnostic. As a result, it has more batteries included. With Svelte Stores, I need to write a custom hook to pull the value out. With Nano Stores, that hook is already offered. Nano Stores currently just supports React 18 but I'll see if I can get a React 17 version too.

## Turbopack/Webpack early tree shaking for build perf

Tobias Koppers talked about improvements coming to Turbopack (and I think Webpack too? It was implied but unclear). Notably, the bundlers will soon skip evaluating unused files.

If you import from a barrel file like this:

```jsx
import { helper } from '../index.js';
```

and that barrel file has multiple named sub-exports:

```jsx
export { helper } from './helper.js';
export { SomeClass } from './some-class.js';
```

then tree-shaking will be performed early, and the unused file ('some-class.js') will get skipped entirely. This only works if the exports are named, star exports (`export * from ‘…'`) can't be skipped.

## Network caching

For network requests, there are two useful methods for caching: [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) and [Cache-Control: immutable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). ETag will use a cached response but needs to first revalidate it with the server, while immutable needs a content hash in the URL but perform network requests at all.

The issue with content hashes in the URL is that they need to show up in import statements too, which then changes the hash of the module using an import, which then changes other modules…

Turbopack/Webpack solve this by using a manifest file of module names to content hashes, so only 1 resource needs to change. But the manifest can't use a hash, or you'd need to invalidate every HTML file that depends on it. Instead, the manifest uses ETag caching.

## Performance trick

Using bound functions (`object.func.bind(object)`) take up less memory than equivalent arrow functions (`() ⇒ object.func()`).

## JSX doesn't need to be used for HTML

Multiple talks (including my own) showcased how React and JSX can be used to generate other outputs.

- My talk showcased rendering SVG images using the default renderer.
- Maya Nedeljković Batić showed how to render 3D games using the [react-three-fiber](https://github.com/pmndrs/react-three-fiber) renderer.
- Felix Wotschofsky showed how to render Minecraft builds using a custom renderer.
