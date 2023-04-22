---
layout: ../../../layouts/ProjectLayout.astro
title: Microsoft Loop
subtitle: Collaborate on ideas live across apps
weight: 1
color: '#987EFF'
links:
  - title: Details
  - title: Open app
    link: https://loop.microsoft.com
tech:
  - TypeScript
  - React
  - CSS
  - Accessibility
  - CI/CD
---

I was one of the first members of the Loop Workspaces team, creating the chrome and user experience for the recently released product [Microsoft Loop](https://loop.microsoft.com/). I've been involved with every part of Loop but focused on the app, separate to the editor experience.

## Mentorship and leadership

I serve as the web technologies subject-matter expert, and indirectly mentor over 50 engineers in React, TypeScript, CSS, and HTML. I work to significantly raise standards for performance, accessibility, and internationalization through mentorship, writing automated tools, giving tech talks, and writing articles.

I took the team's initial app made with Microsoft's Fluent UI 8 library and led migration to Fluent UI 9. We were one of the first apps to make this change, setting code standards for the rest of the company. I coordinated designers, product managers, and engineers in 3 orgs and multiple teams for the migration. We doubled rendering time by adopting a much faster theming engine and saved engineering time across all of Microsoft.

## User experience

My work can be seen across the entire user experience for the Loop App. I worked directly on several major features, such as the app's home page, the editor sidebar, and the draft ideas page. I also worked closely with engineers building other key features to improve performance and ship quicker.

Part of my work included inventing a novel virtualization system for displaying a live list of thousands of pages. I tied together newer web APIs such as CSS Containment, Intersection Observers, and Mutation Observers with React to build a virtualized list that didn't need full control over the window. This let us implement designs that would not be possible using react-window or similar existing virtualization tools. It also led to a smaller bundle size compared to those heavier libraries.

## Engineering pipeline

I work on our CI and engineering pipelines alongside other engineers on our feature team. I've introduced custom linter rules to catch hundreds of bugs across thousands of files, and prevent future regressions. I've also open-sourced many linter rules that could benefit other codebases, by contributing to [typescript-eslint](https://typescript-eslint.io/), [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest), [eslint-plugin-storybook](https://www.npmjs.com/package/eslint-plugin-storybook), and more.

I've also written special decorators and parameters for our [Storybook tooling](https://storybook.js.org/), which has saved engineers hours of time every week by letting them quickly check different themes, build UI components in isolation, and present implementations to designers.

![Screenshot](snapshot.jpg)
