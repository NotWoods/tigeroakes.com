---
sortorder: 8
title: The Golden Quest
subtitle: Alexa Adventure Game
color: {r: 255, g: 200, b: 0}
links:
  Details: /projects/the-golden-quest
  Amazon: https://www.amazon.com/Janet-Chen-The-Golden-Quest/dp/B06XW5JXXX
  Devpost: https://devpost.com/software/nwhacks-2017-s2acyf
  Code: https://github.com/NotWoods/the-golden-quest
tech:
  - Alexa SDK
  - TypeScript
  - Node.js
description: >
  The Golden Quest is a voice-only, interactive Choose Your Own Adventure game.
  You play as the main character, a hackathon member embarking on a desperate
  search. Alexa reads out the story and choices to the player. Its intuitiveness
  and ease of use means anyone can play -- all you need to do is say
  "Alexa, open the Golden Quest".
---
The Golden Quest is a voice-only, interactive Choose Your Own Adventure game.
Created in 24 hours at the nwHacks 2017 hackathon,
using the Node.js **Amazon Alexa API**.

Nobody on our team had previous experience working with Alexa, so we all learned
during the short hackathon timespan. We also had to write a short story for the
game. To make this easier, I used **regular expressions** to create a simple
format for the [story file](https://github.com/NotWoods/the-golden-quest/blob/master/story.txt). Later on,
this parser was modified to auto-generate the schema files for Alexa.

In the game, you play as a hackathon member embarking on a desperate search.
Alexa reads out the story and choices to the player.
Its intuitiveness and ease of use means anyone can play -- all you need to
do is say "Alexa, open the Golden Quest".

Once we deployed the game on Echo, some of the story lines did not sound
natural when spoken by Alexa. We use the Amazon Alexa voice simulator to
repeat the lines and edit them. Through user feedback from asking students and
mentors to play test, we refined the user experience and game play options.
Some improvements based on feedback:
wording choices that allowed for more distributed game paths,
creating a generalizable character story,
expand user input beyond basic gameplay such as
"Cancel", "Repeat", "Start Over" etc.
