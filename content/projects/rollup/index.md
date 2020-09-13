---
title: Rollup
subtitle: JavaScript module bundler
weight: 6
color: '#ff3333'
fallbackcolor: '#372008'
links:
  - title: Details
  - title: Code
    github: rollup/plugins
tech:
  - TypeScript
  - JavaScript
  - ES Modules
---

I currently work on the Rollup team as a plugin maintainer. Rollup is an ES module bundler for JavaScript and is often recommended over Webpack due to its speed and optimized results.

I helped with an effort in 2019 to migrate all official Rollup plugins into a new monorepo infrastructure. Now I primarily maintain the Typescript plugin. I've added new features such as typechecking support, project-wide typing, and type declaration file generation. The plugin is downloaded over 50,000 times per week.

In addition, I've helped move all plugins from JavaScript to TypeScript. Plugins with typings are easier to use as developers can quickly check documentation inside their editor, along with ensuring all options have been configured properly. Various plugins are downloaded around half a million times each week.
