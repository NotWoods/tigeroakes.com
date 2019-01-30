---
title: Mastering the Javascript event system (Part 2)
description: What about click events?
date: 2019-01-30 01:00:00
author: tiger
editor: daphne
---

This is the second post in a series about working with Javascript events and
using just one event listener to handle related elements. **Be sure to read
through [Part 1](/posts/javascript-events-part-1/) first.**

---

[`evt.target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
works great with events like `focusin` and `change`, where there are only a
small number of elements that can receive focus or have input changed.

However, usually you want to listen for `click` events so you can respond to a
user clicking on a button in your application. `click` events fire for _any_
element in your document, from large `<div>`s to small `<span>`s.

As a reminder, we're making a navigation element with a few interactive links.
Let's make a variant where parts of the links are bold.

```html
<nav>
    <a href="#first"><strong>First</strong> link.</a>
    <a href="#second"><strong>Second</strong> link.</a>
    <a href="#third"><strong>Third</strong> link.</a>
</nav>
```

Let's change our Javascript code from before to respond to clicks rather than
keyboard focus.

```js
const print = evt => {
    const text = evt.target.href;
    console.log(text);
};

document.querySelector('nav').addEventListener('click', print);
```

When you test this code, you may notice that when you click on a link,
`undefined` is printed instead of a `#first`, `#second` or `#third`.

The reason that it doesn't work is that each link contains a `<strong>` element
which can be clicked instead of the `<a>` element. Since `<strong>` is not a
link, the `evt.target.href` property is `undefined`.

We only care about the link elements for our code. If we click somewhere inside
a link element, we need to find the parent link. We can use
[`element.closest()` to find the parent closest to the clicked element](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest).

```js
const print = evt => {
    let element = evt.target.closest('a');
    if (element != null) {
        const text = element.href;
        console.log(text);
    }
};
```

Now we can use a single listener for `click` events! If `element.closest()`
returns null, that means the user clicked somewhere outside of a link and we
should ignore the event.

---

Now that you've seen how to handle a variety of events with a single event
listener, check out some additional examples of using a single event listener in
the next post.

**Next in the series:
[Extra examples addendum](/posts/javascript-events-part-3/)**
