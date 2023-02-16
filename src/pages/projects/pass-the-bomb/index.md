---
layout: ../../../layouts/ProjectLayout.astro
title: Pass the Bomb
subtitle: Hackathon multiplayer word game
weight: 9
path: pass-the-bomb
color: '#c79a6a'
fallbackcolor: '#3c4438'
links:
  - title: Details
  - title: Open app
    link: https://pass-the-bomb.glitch.me
  - title: Code
    github: NotWoods/pass-the-bomb
tech:
  - Node.js
  - WebSockets
  - Hammer.js
categories:
  - Games
description: >
  Online multiplayer word game created in a hackathon within 12 hours. Socket.io is used to sync the client devices and the server, which runs Node.js.
---

A multiplayer word game based on the board game [Pass the Bomb](https://en.wikipedia.org/wiki/Pass_the_Bomb). Pass the Bomb was created for the UBC Local Hack 12-hour hackathon. **Socket.io** is used to sync the clients between the player's devices and the server running **Node.js**.

I worked on the client-side aspect of the game, along with helping guide some of the other team members. The game includes **CSS animations** to indicate the remaining time with a fuse, and **Hammer.js** to let players submit their entry by swiping or "passing" the bomb away.

---

![Playing a round of Pass the Bomb in two windows](demo.gif)
