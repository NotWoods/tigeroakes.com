---
title: Resume editor
date: 2018-10-27
author: tiger
editor: daphne
draft: true
---

After writing my resume in Microsoft Word for years, I recently transitioned to generating it from plain HTML and CSS.
For me, this works much better because I can separate the resume content (my work experience and descriptions) from its layout (the colors and positions of text and number of columns).
I added additional features so that I can edit the resume on-the-fly with JavaScript and quickly save a new copy, in case I don't have access to my main machine and I need to make some small adjustments.
Here's how I did it.

## Layout with CSS

When I first redesigned my website, I wanted to include my resume without just using an embedded PDF. Instead, I recreated my resume in HTML and CSS, so that it showed up as elements in the browser. I used some rarer CSS features like inch and centimeter units so the virtual "page" was still an 8.5"x11" sheet.

```css
.resume {
    max-width: 8.5in;
    min-height: 11in;
}
```

Obviously this isn't optimal because now I have two copies of my resume: a Microsoft Word document, and the online version. Word was also becoming annoying to use because I have the small blocks to the left of headers that need to be realigned, and often an extra blank page is created because of the two-column layout.

## Generating a PDF from the site

I next set out find a way to output a PDF from the online version of my site, so I could get rid of the Word version. The way most people make PDFs from some website is to just print it out
