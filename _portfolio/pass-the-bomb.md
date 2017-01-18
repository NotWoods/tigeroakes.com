---
sortorder: 7
title: Pass the Bomb
subtitle: Hackathon Multiplayer Word Game
path: pass-the-bomb
color: {r: 199, g: 154, b: 106}
fallbackcolor: '#3c4438'
images:
  logo: logo.svg
links:
  Details: /projects/pass-the-bomb
  Devpost: https://devpost.com/software/passthebomb
  Code: https://github.com/NotWoods/local-hack-day
tech:
  - Node.js
  - Socket.io
  - Hammer.js
---
A multiplayer word game based on the board game [Pass the Bomb](https://en.wikipedia.org/wiki/Pass_the_Bomb).
Pass the Bomb was created for the UBC Local Hack 12-hour hackathon.
**Socket.io** is used to sync the clients between the player's devices and
the server running **Node.js**.

I worked on the client-side aspect of the game, along with helping guide some
of the other team members. The game includes **CSS animations** to indicate the
remaining time with a fuse, and **Hammer.js** to let players submit their entry
by swiping or "passing" the bomb away.

___

![Playing a round of Pass the Bomb in two windows](/images/pass-the-bomb/demo.gif)
