---
sortorder: 7
title: Polygon2D Editor
subtitle: Level-building tool for Unity
slug: unity-polygon
color: '#4d4d4d'
fallbackcolor: '#1a1a1a'
links:
  Details: /projects/unity-polygon2d-editor
  Code: https://github.com/NotWoods/unity-polygon-2d-editor
tech:
  - C#
  - Unity
description: >
  Uses the PolygonCollider2D collider to generate a mesh for a gameobject,
  letting you draw polygonal platforms in the Unity editor via the Edit Collider button.
  Just drag the script onto your platform GameObject and you're good to go.
---
I created this tool to help me build levels in [one of my games](./latch-on).
The script generates a freeform 2D mesh for level layout.
Since the mesh follows the shape of the collider, it can be easily manipulated
using Unity's PolygonCollider2D component.

___

![Demonstration of the Unity Polygon2D Editor](/images/unity-polygon/example.gif)
