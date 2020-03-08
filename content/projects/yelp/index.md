---
feature: true
weight: 2
title: Yelp
subtitle: Describe Your Project
color: '#d32323'
fallbackcolor: '#594134'
links:
  - title: Case study
  - title: View site
    link: https://www.yelp.com/describe_your_project?category=movers
tech:
  - Python
  - React
  - Redux
  - SQL
  - jQuery
description: >
  For my intern project at Yelp, I helped create a new feature on the desktop
  website to make it easier for users to request quotes from home services
  businesses. Rather than search for a business and write a message to them from
  scratch, "Describe Your Project" lets users answer multiple-choice questions
  before they are presented with businesses to send their request to.
---

_Simplify searching and contacting local services_

## Background

In addition to restaurants, Yelp lets users search for local services such as
plumbers and electricians. However, users are discouraged from contacting a
local service online because it involves writing a long email. It is also
inconvenient for local services to request the same information from different
users over and over as they omit it in the initial contact information.
Searching for a local service should be more selective than searching for a
restaurant, since bad plumbing is much worse than a bad meal.

Yelp wanted to introduce a short series of questions to automatically search for
local services and connect them to users. This project is dubbed Describe Your
Project. A variation of the feature was released in the Android app, but did not
include searching assistance. For my intern project at Yelp, I helped to build
the desktop web page for the feature and created a unified backend for both the
web and Android versions.

## Challenge

My task was to support new features in the web page not yet in the Android
application, such as searching and branching paths for more questions. The
interface also had to support larger desktop screens, so the Android design
needed to be adapted to larger sizes.

Due to the branching paths, downloading questions must balance between two
extremes, which had their own tradeoffs. One option was to download all possible
questions in the entire database at the start and loaded from memory. The other
option was to download one question at a time when a user answers. Downloading
everything means a higher initial payload, and many questions will never be
used. Individual downloads means an annoying loading spinner is shown each time
the user answers, disrupting their flow.

Due to Yelp's microservice architecture, a custom Python package was needed to
share code between the web and Android versions. Our Python backend needed to
adapt to support both the mobile API (running on Python 2) and the desktop web
backend (running on Python 3).

## Solution

In order to display questions efficiently and effectively, complex business
logic was accounted for. Each question includes answers which can affect the
questions shown later on. My team considered factors such as which questions to
display, how the earlier responses could change results, and what requests to
send to the server. Redux was used to hold a tree structure from the server,
where nodes were added in place. The tree was flattened into an array to
represent the questions displayed. React iterated through the questions and
displayed the correct components for various question types. Many team members
were not familiar with React, so I helped mentor the team on best practices.

Since the questions changed infrequently, they were stored in a JSON file on the
server. Code to load the files was encapsulated in a Python package compatible
with both Python 2 and 3, then deployed to the mobile API and desktop backend
services. All of the separated boilerplate and implementation details for
loading the questions data were transformed into a clean developer interface.
Now, improvements to the question loading logic is easy to update across the
board.

## Results

I successfully built the Describe your Project with React, Redux, Python and
TypeScript, making it easy-to-use for users and scalable for future developers.
The features help users find and contact local services without having to
research terminology or write a long letter. This leads to convenience and
efficiency in tense situations such as a broken pipe spilling water.

## Benefits

The new feature has since grown to replace the original contact form for
connecting with local services. Since I left Yelp, the scope of the project
scaled tremendously. The team doubled and the package was expanded from a small
Python package to a full microservice! More question logic and more branching
paths were added. With improved React knowledge, the Local Services team can
apply React best practices to their entire code base, giving them the
opportunity to increase performance across the board.

## Conclusion

The new Describe your Project feature shows Yelp's commitment to helping users
connect with local businesses, even outside of food.

---

{{<video src="demo.mp4">}}
