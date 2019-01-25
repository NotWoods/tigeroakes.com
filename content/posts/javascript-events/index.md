---
title: Mastering the Javascript event system
description: How to simplify your listener code.
date: 2019-01-24
author: tiger
editor: daphne
---

How to use event handlers with the framework.

-   Bubbling
-   `target` and `currentTarget`
-   `.closest`

Let's start with a simple example - a list of links. We want to change the `preview` element to show where a hyperlink goes when the user focuses on it.

```html
<ul>
    <li>
        <a href="#first"><strong>First link</strong>.</a>
    </li>
    <li><a href="#second">Second link.</a></li>
    <li><a href="#third">Third link.</a></li>
</ul>

<div id="preview">Waiting for focus...</div>
```

## The intuitive way

> How many people (including past me) do events, with seperate functions for each element

When I first started learning about Javascript events, I wrote seperate event listener functions for each element.
I see this as a common pattern because its the simplest way to start - we want specific behavior for each link, so we can use specific code for each.

```js
document
    .querySelector('a[href="#first"]')
    .addEventListener('focus', function previewFirst(evt) {
        document.getElementById('preview').textContent = '#first';
    });

document
    .querySelector('a[href="#second"]')
    .addEventListener('focus', function previewSecond(evt) {
        document.getElementById('preview').textContent = '#second';
    });

document
    .querySelector('a[href="#third"]')
    .addEventListener('focus', function previewThird(evt) {
        document.getElementById('preview').textContent = '#third';
    });
```

## Reducing duplicate code

> How to reduce duplicate code (one function with a parameter, but still seperate listeners)

The above event listeners `previewFirst`, `previewSecond` and `previewThird` are all very similar.
Each function changes the `preview` element to show some text.

## How to use currentTarget to use the same function, but still seperate listeners.

## How to use a single listener with target

## How to use closest for click events

## Extra examples addmendum:

Forms

React
