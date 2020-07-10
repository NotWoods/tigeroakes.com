---
title: Polygon2D Editor
subtitle: Level-building tool for Unity
weight: 4
color: '#4d4d4d'
fallbackcolor: '#1a1a1a'
links:
  - title: Details
  - title: Code
    github: NotWoods/unity-polygon-2d-editor
tech:
  - C#
  - Unity
description: >
  Uses the PolygonCollider2D collider to generate a mesh for a gameobject, letting you draw polygonal platforms in the Unity editor via the Edit Collider button. Just drag the script onto your platform GameObject and you're good to go.
---

[![](https://img.shields.io/github/stars/NotWoods/unity-polygon-2d-editor.svg?style=social)](https://github.com/NotWoods/unity-polygon-2d-editor)

I created this tool to help me build levels in [one of my games](./latch-on). The script generates a freeform 2D mesh for level layout. Since the mesh follows the shape of the collider, it can be easily manipulated using Unity's PolygonCollider2D component.

---

![Demonstration of building a level using the tool](example.gif)
