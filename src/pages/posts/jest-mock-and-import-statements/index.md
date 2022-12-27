---
layout: ../../../layouts/PostLayout.astro
title: 'When is it safe to use import statements in Jest tests?'
description: Slightly confusion conditions around Jest module mocks.
date: 2022-12-27
tags:
  - Web
  - Jest
  - Tests
categories:
  - Planet Mozilla
banner: banner.jpg
banner_alt: Construction cranes
toc: true
---

When I first started working with our existing tests in [Microsoft Loop](https://www.microsoft.com/en-us/microsoft-loop)’s codebase, I saw this require pattern that confused me.

```tsx
function getMocksForTest(): typeof import('./module-to-test') {
  // We can't simply import this at the top level of the module since the necessary jest mocks won't have been applied yet.
  return require('./module-to-test');
}

it('passes simple test', () => {
  const { functionToTest } = getMocksForTest();
  expect(functionToTest()).toEqual('foo');
});
```

I’ve never had to switch to require statements before when using Jest, so I was surprised to see this. Normally I would just import the module directly.

```tsx
import { functionToTest } from './module-to-test';

it('passes simple test', () => {
  expect(functionToTest()).toEqual('foo');
});
```

Using import statements is much more succinct. So why was a different pattern used? I left it alone when I first joined, but now I’ve done some research and software archaeology to better understand where this pattern arose, when its needed, and when it can be removed.

## This pattern is only useful when using `jest.mock`

The first thing that threw me off is the name `getMocksForTest`. There’s no mocking involved, so the name didn’t seem appropriate. But I later found test files with a more complicated setup.

```tsx
function getMocksForTest() {
  const mockCreatePage = jest.fn();

  jest.mock('../pages', () => ({
    ...jest.requireActual('../pages'),
    createPage: mockCreatePage,
  }));

  // We can't simply import this at the top level of the module since the necessary jest mocks won't have been applied yet.
  const { functionToTest } =
    require('./module-to-test') as typeof import('./module-to-test');

  return {
    functionToTest,
    mockCreatePage,
  };
}

it('passes complex test', () => {
  const { functionToTest, mockCreatePage } = getMocksForTest();
  mockCreatePage.mockReturnValue('dependency');
  expect(functionToTest()).toEqual('foo+dependency');
});
```

Here, we use [`jest.mock()`](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options) to mock a module in the file `../pages.ts`. The module we’re testing, `./module-to-test.ts`, depends on `../pages.ts` and imports it.

If we had imported the module to test prior to running `jest.mock()`, then our mock would not have been set up in time. Instead, the original version of `../pages.ts` would have been imported.

```tsx
import { functionToTest } from './module-to-test';

function getMocksForTest() {
  const mockCreatePage = jest.fn();

  // Too late! `../pages` already got imported by this point.
  jest.mock('../pages', () => ({
    ...jest.requireActual('../pages'),
    createPage: mockCreatePage,
  }));

  return {
    mockCreatePage,
  };
}
```

Now that I’ve encountered a function that actually creates mocks, the name makes more sense. Later on, developers would copy-paste tests and just remove what they didn’t need. That’s how we ended up with functions with the name “get mocks” that never did any mocking.

But **if a test file never uses `jest.mock()`, then this pattern is totally unnecessary**. It can be cleaned up and the module can be imported directly instead.

## Isn’t `jest.mock()` always run after import statements?

Now we know that this pattern is needed when `jest.mock()` runs after the module is imported. But lots of test files do use `jest.mock()` and I’ve never seen this require pattern used before. So how does `jest.mock()` normally work?

It turns out Jest runs some special transformations on your test files before running them. It doesn’t just transform TypeScript to JavaScript, it also hoists (aka moves) `jest.mock()` [calls to the top of the file](https://jestjs.io/docs/jest-object#jestdomockmodulename-factory-options), before any import statements. This is done using the [`babel-jest` plugin](https://github.com/facebook/jest/tree/main/packages/babel-jest), which is enabled by default.

As a result, a test file like this:

```tsx
// example.test.ts
import { functionToTest } from './module-to-test';

jest.mock('../pages', () => {
  const mockCreatePage: jest.MockedFn<() => string> = jest.fn();
  return {
    ...jest.requireActual('../pages'),
    createPage: mockCreatePage,
  };
});

it('passes complex test', () => {
  const { functionToTest, mockCreatePage } = getMocksForTest();
  mockCreatePage.mockReturnValue('dependency');
  expect(functionToTest()).toEqual('foo+dependency');
});
```

will get transformed into a Node.js-compatible file like below:

```jsx
// compliled.test.js
// hoisted to top of file
jest.mock('../pages', () => {
  // TypeScript types removed
  const mockCreatePage = jest.fn();
  return {
    ...jest.requireActual('../pages'),
    createPage: mockCreatePage,
  };
});

// import statements transformed to CommonJS
const { functionToTest } = require('./module-to-test');

it('passes complex test', () => {
  const { functionToTest, mockCreatePage } = getMocksForTest();
  mockCreatePage.mockReturnValue('dependency');
  expect(functionToTest()).toEqual('foo+dependency');
});
```

## Does `jest.mock` always get hoisted?

Nope! There are particular conditions necessary for a module mock to be hoisted. Here’s the checks I found from digging through [the source code of Jest’s babel plugin](https://github.com/facebook/jest/blob/main/packages/babel-plugin-jest-hoist/src/index.ts#L124).

- The first argument to `jest.mock()` should be a literal value.
- The second argument, if provided, should be an inline function.
- That function shouldn’t reference any variables defined outside the function.
- `jest.mock()` must be called at the top-level, and not inside another function.
  - Otherwise, it gets moved to the top of the function it’s called in.

Essentially, if you can’t just cut-and-paste your `jest.mock()` code to the top of the file, it won’t get automatically moved. Referring to other variables defined earlier will stop the function from being hoisted.

```tsx
// none of these will be hoisted
const moduleName = './module';
jest.mock(moduleName);

function factory() {
  return jest.fn();
}
jest.mock('./module', factory);

jest.mock('./module', () => {
  // variable defined outside scope
  return jest.fn().mockReturnValue(moduleName);
});
```

If you do need to refer to variables defined outside the mock function, you can either import them separately or use [`jest.doMock`](https://jestjs.io/docs/jest-object#jestdomockmodulename-factory-options) to explicitly avoid hoisting.

```tsx
import { createPage } from '../pages';

jest.mock('../pages', () => ({
  createPage: jest.fn(),
}));

const mockCreatePage = createPage as jest.Mocked<typeof createPage>;
```

**As long as all your module mocks can be hoisted, it’s safe to import your code to test using an import statement**.
