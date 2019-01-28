---
title: Mastering the Javascript event system (Part 2)
description: What about click events?
date: 2019-01-27
author: tiger
editor: daphne
---

`evt.target` works great with events like `focusin` and `change`, where there
are only a small number of elements that can receive focus or have input
changed.

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

document.querySelector('nav').addEventListener('focusin', preview);
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
