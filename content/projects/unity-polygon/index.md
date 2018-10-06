---
title: Polygon2D Editor
subtitle: Level-building tool for Unity
color: "#4d4d4d"
fallbackcolor: "#1a1a1a"
links:
  - title: Details
  - title: Code
    github: NotWoods/unity-polygon-2d-editor
tech:
  - C#
  - Unity
description: >
  Uses the PolygonCollider2D collider to generate a mesh for a gameobject,
  letting you draw polygonal platforms in the Unity editor via the Edit Collider button.
  Just drag the script onto your platform GameObject and you're good to go.
---

<a class="github-button" href="https://github.com/NotWoods/unity-polygon-2d-editor" data-size="large" data-show-count="true" aria-label="Star NotWoods/unity-polygon-2d-editor on GitHub">Star</a>

I created this tool to help me build levels in [one of my games](./latch-on).
The script generates a freeform 2D mesh for level layout.
Since the mesh follows the shape of the collider, it can be easily manipulated
using Unity's PolygonCollider2D component.

---

{{<img src="example.gif" alt="Demonstation of building a level using the tool">}}

<script async defer src="https://buttons.github.io/buttons.js"></script>
