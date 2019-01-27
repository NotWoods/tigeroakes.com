---
title: Mastering the Javascript event system
description: How to simplify your listener code.
date: 2019-01-24
author: tiger
editor: daphne
---

Events are an important part of any interactive web app. Events are used to
respond when a user clicks somewhere, focuses on a link with their keyboard, and
changes the text in a form. When I first started learning Javascript, I wrote
complicated event listeners. More recently I've learned how to reduce both the
amount of code I write and the number of listeners I need.

Let's start with a simple example - a list of links. We want to change the
`preview` element to show where a hyperlink goes when the user focuses on it.

```html
<nav>
    <a href="#first"><strong>First link</strong>.</a>
    <a href="#second">Second link.</a> <a href="#third">Third link.</a>
</nav>

<div id="preview">TODO</div>
```

### The intuitive way

When I first started learning about Javascript events, I wrote separate event
listener functions for each element. I see this as a common pattern because it's
the simplest way to start - we want specific behavior for each link, so we can
use specific code for each.

```js
document.querySelector('a[href="#first"]').addEventListener('focus', evt => {
    const element = document.getElementById('preview');
    element.textContent = '#first';
});

document.querySelector('a[href="#second"]').addEventListener('focus', evt => {
    const element = document.getElementById('preview');
    element.textContent = '#second';
});

document.querySelector('a[href="#third"]').addEventListener('focus', evt => {
    const element = document.getElementById('preview');
    element.textContent = '#third';
});
```

### Reducing duplicate code

The above event listeners are all very similar. Each function changes the
`preview` element to show some text. This duplicate code can be collapsed into a
helper function.

```js
function preview(text) {
    const element = document.getElementById('preview');
    element.textContent = text;
}

document
    .querySelector('a[href="#first"]')
    .addEventListener('focus', evt => preview('#first'));
document
    .querySelector('a[href="#second"]')
    .addEventListener('focus', evt => preview('#second'));
document
    .querySelector('a[href="#third"]')
    .addEventListener('focus', evt => preview('#third'));
```

### Taking advantage of the `Event` object

The key to simplifying your listeners is the [`Event` object](https://developer.mozilla.org/en-US/docs/Web/API/Event).


When an event listener is called, it also sends an `Event` object as the first
argument. This object has some data to describe the event that occurred, such as
the time the event occurred. For simplifying our code, we can use the
`evt.currentTarget` property. `currentTarget` refers to the element that the
event listener is attached to. In our example, it will be one of the 3 links.

```js
const preview = evt => {
    const text = evt.currentTarget.href;
    const element = document.getElementById('preview');
    element.textContent = text;
};

document.querySelector('a[href="#first"]').addEventListener('focus', preview);
document.querySelector('a[href="#second"]').addEventListener('focus', preview);
document.querySelector('a[href="#third"]').addEventListener('focus', preview);
```

Now there is only 1 function instead of 4.

### Using bubbling

One final change can be made to reduce the number of lines in our code. Rather
than attaching an event listener to each link, we can just attach a single event
listener to the list that contains all the links.

When an event is fired, it starts off at the element where the event originated
(one of the links). However, it won't stop there. The browser goes to each
parent of the starting element, calling any event listeners on those parents.
This will continue until the root document is reached. This process is called
"bubbling", as the event rises through the document tree like a bubble.

By attaching an event listener to the list, the focus event will bubble from the
link that was focused up to the parent list. We can also take advantage of the
`evt.target` property, which contains the starting element of the event.

```js
const preview = evt => {
    const text = evt.target.href;
    const element = document.getElementById('preview');
    element.textContent = text;
};

document.querySelector('nav').addEventListener('focus', preview);
```

Now we just have 1 listener! The 14 lines of code from above have been reduced
to 8. With more complicated code, the effect will be greater.

## What about click events?

`evt.target` works great with events like `focus` and `change`, where there are
only a small number of elements that can receive focus or have input changed.

However, usually you want to listen for `click` events so you can respond to a
user clicking on a button in your application. `click` events fire for _any_
element in your document, from large `<div>`s to small `<span>`s.

Let's change the above code to respond to clicks rather than keyboard focus.

```js
const preview = evt => {
    const text = evt.target.href;
    const element = document.getElementById('preview');
    element.textContent = text;
};

document.querySelector('nav').addEventListener('focus', preview);
```

When you test this code, you may notice that when you click on the first link,
`preview` sometimes shows `undefined` instead of `#first` when you click on the
first link.

The reason that it doesn't work is that the first link contains a `<strong>`
element which can be clicked instead of the `<a>` element.

_As a reminder, the first link looks like:_

```html
<a href="#first"><strong>First link</strong>.</a>
```

Since `<strong>` is not a link, the `evt.target.href` property is `undefined`.

We only care about the link elements for our code. If we click somewhere inside
a link element, we need to find the parent link. We can use `element.closest()`
to find the parent closest to the clicked element.

```js
function preview(evt) {
    let element = evt.target.closest('a');
    if (element != null) {
        const text = element.href;
        const element = document.getElementById('preview');
        element.textContent = text;
    }
}
```

Now we can use a single listener for `click` events.

## Extra examples addendum:

### Lists

### Forms

### React
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE4MjMxODE1OV19
-->