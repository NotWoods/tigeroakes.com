---
title: Mastering the Javascript event system (Part 3)
description: Additional examples for handling events.
date: 2019-01-28
author: tiger
editor: daphne
---

# Extra examples addendum:

Here are some additional examples to demonstrate how to take advantage of a
single event listener.

## Lists

A common pattern is to have a list of items that can be interacted with, where
new items are inserted dynamically with Javascript. If you have event listeners
attached to each item, then your code has to deal with event listeners every
time you generate a new element.

```html
<div id="buttons"></div>

<button id="add">Add new button</button>
```

```js
let buttonCounter = 0;
document.getElementById('button').addEventListener('click', evt => {
	const newButton = document.createElement('button');
	newButton.dataset.number = buttonCounter;
	newButton.addEventListener('click', evt => {
		// When clicked, log the clicked button's number.
		console.log(`Clicked button #${newButton.dataset.number}`);
	});
	buttonCounter++;

	const container = document.getElementById('buttons');
	container.appendChild(newButton);
});
```

By taking advantage of bubbling, you can just have a single event listener on
the container. If you create many elements in your app, this reduces the number
of listeners from _n_ to 2.

```js
let buttonCounter = 0;
document.getElementById('button').addEventListener('click', evt => {
	const newButton = document.createElement('button');
	newButton.dataset.number = buttonCounter;
	buttonCounter++;

	const container = document.getElementById('buttons');
	container.appendChild(newButton);
});
document.getElementById('buttons').addEventListener('click', evt => {
	const clickedButton = evt.target.closest('button');
	if (clickedButton != null) {
		// When clicked, log the clicked button's number.
		console.log(`Clicked button #${clickedButton.dataset.number}`);
	}
});
```

---

## Forms

Perhaps you have a form with lots of inputs, and you want to collect all the
user responses into a single object.

```html
<form>
    <label>Name: <input name="name" type="text"/></label>
    <label>Email: <input name="email" type="email"/></label>
    <label>Password: <input name="password" type="password"/></label>
</form>
```

```js
let responses = {
	name: '',
	email: '',
    password: ''
};

document.querySelector('input[name="name"]').addEventListener('change', evt => {
	const inputElement = document.querySelector('input[name="name"]');
	responses.name = inputElement.value;
});
document.querySelector('input[name="email"]').addEventListener('change', evt => {
	const inputElement = document.querySelector('input[name="email"]');
	responses.email = inputElement.value;
});
document.querySelector('input[name="password"]').addEventListener('change', evt => {
	const inputElement = document.querySelector('input[name="password"]');
	responses.password = inputElement.value;
});
```

Let's switch to a single listener on the parent `<form>` element instead.

```js
let responses = {
	name: '',
	email: '',
    password: ''
};

document.querySelector('form').addEventListener('change', evt => {
	responses[evt.target.name] = evt.target.value;
});
```
