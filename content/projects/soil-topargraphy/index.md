---
title: Soil TopARgraphy
subtitle: Educational AR application
color: "#4db6ac"
fallbackcolor: "#1c3455"
links:
  - title: Details
tech:
  - C#
  - Unity
  - AR
  - Vuforia
  - Mapbox
---

Soil TopARgraphy allows UBC students, enrolled in the _APBI 200 – Introduction to Soil Science_ course,
to view topographical distribution of different soil types.
Using Augmented Reality, this app shows terrain inside the classroom so students
can learn about the effects of topography on formation of different soil types.

For this application, I added integration with Mapbox to use their satellite data to display a 3D
terrain model in Unity.
I also created the colorful terrain model shown below, which mirrors the terrain shape.
I created the model by downloading heightmaps from the Mapbox API,
then [converting their format into a standard grayscale heightmap](https://github.com/NotWoods/mapbox-elevation).
From there, I was able to import the processed heightmap to Blender and reduce detail in the model.

---

{{<img src="heightmap.*" alt="Terrain heightmap model I created for the application">}}
