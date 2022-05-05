---
layout: ../../../layouts/PostLayout.astro
title: Deploy a site to GitHub Pages from multiple branches using GitHub Actions
description: CI/CD combining different branches.
date: 2020-12-26
tags:
  - TIL
  - Web
  - GitHub
categories:
  - Planet Mozilla
banner: banner.png
banner_svg: banner.svg
---

I've been moving many repositories over to GitHub Actions to automate deployment and testing. One of my projects uses GitHub Pages, but includes data from two different branches:

- The `main` branch contains the bulk of the website
- The `app-challenge` branch contains a second site that appears under a `/heleon/` path

Using GitHub Actions, I set up the site pull from both branches before deploying. The script looks like this:

```yaml
name: Deploy from two branches

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Checkout the `main` branch
      - uses: actions/checkout@v2
      # Install Node.js
      - uses: actions/setup-node@v2-beta
        with:
          node-version: '14'
      # Install npm dependencies
      # (similar to npm install)
      - run: npm ci
      # Run code to build the site files inside the `big-island-buses` folder
      - run: npm run build

      # Checkout the `app-challenge` branch
      - uses: actions/checkout@v2
        with:
          ref: app-challenge
          # Put the checked out files inside the `big-island-buses/heleon` folder
          path: big-island-buses/heleon
          clean: false
      # Delete the .git folder from `big-island-buses/heleon`
      # This turns the files into a plain folder instead of a git repository
      - run: rm -rf big-island-buses/heleon/.git
      # Deploy the `big-island-buses` folder to GitHub Pages
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: './big-island-buses'
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
```

The first sequence of steps checks out the `main` branch, installs Node.js and npm dependencies, then runs the build script. The files created by the build script end up in a folder named `big-island-buses`.

The second sequence checks out the `app-challenge` branch, and places the files inside a folder named `heleon`, which is a subfolder of `big-island-buses`. These files are static so they don't have a separate build script.

However, putting one git repository inside another like this creates problems for the GitHub Pages script. Deleting the `.git` folder turns the git repository into a plain folder.
