---
feature: true
sortorder: 1
title: Big Island Buses
subtitle: Bus Schedule Software
color: {r: 77, g: 116, b: 171}
fallbackcolor: '#313d3f'
hd: true
links:
  Details: /projects/big-island-buses
  View_site: https://notwoods.github.io/big-island-buses/
  Code: https://github.com/NotWoods/big-island-buses
ogp:
  al.web.url: https://notwoods.github.io/big-island-buses/
tech:
  - JavaScript
  - AppCache
  - Node.js
  - IndexedDB
  - Google Maps
  - GTFS
summary: >
  Bus rider web app to replace Hawai’i paper bus schedules.
  Uses JavaScript geolocation API to find nearby bus stops,
  and the AppCache API to run offline.
  Won Grand Prize in Congressional App Challenge 2014, Hawaii’s 2nd Congressional District.
---
A web app created for bus riders in the Big Island of Hawai'i'.
The app was created to offer an alternative the county's [paper-only bus schedules](http://www.heleonbus.org/schedules-and-maps).
I built the [initial version](https://github.com/NotWoods/big-island-buses/tree/app-challenge) during my 11th grade in high school,
where it won [**Grade Prize in Congressional App Challenge 2014, Hawaii’s 2nd Congressional District**](http://gabbard.house.gov/index.php/press-releases/339-rep-tulsi-gabbard-presents-congressional-awards-to-young-leaders-from-hawai-i-s-second-district).

For my senior project, I redesigned the app and began to work directly with the County of Hawai'i.
The app was updated with an enhanced map interface along with server rendering.
The program went on to be featured in [West Hawaii Today](http://westhawaiitoday.com/news/local-news/hele-schedule-be-available-app),
[Hawaii Public Radio](http://www.bytemarkscafe.org/2015/04/29/episode-348-sounding-rockets-apr-29-2015/),
and [Hawaii](https://www.youtube.com/watch?v=MHPlJsosHDc) [TechWorks](https://www.youtube.com/watch?v=yl_3d7PSKMY).

The app implements the AppCache API to allow it to run offline,
and uses the JavaScript geolocation API to locate nearby bus stops and routes for the user.
Updates to the UI don't use a library and are instead hand-coded.

In addition to the app, I worked to manually port all the paper schedules into
the standard General Transit Feed Specification (GTFS) format.
This file format is used by Google Maps and other transit systems and allows the
schedule data to be consumed by other programs.

I worked to publish the schedule onto Google Maps where it would be more
accessible, but due to a lack of interest from the County of Hawai'i, it was
never released in the end.

Big Island Buses was fairly popular in Hawai'i when it was first released, and had
over a hundred visits each week, despite the limited target audience.

___

![Big Island Buses on different devices](/images/big-island-buses/multi-screen.png)
