---
title: 'JavaScript Promise to Kotlin Coroutine Dictionary'
description: How to work with concurrency in Kotlin when coming from a web background.
date: 2021-03-20
author: tiger
tags:
  - Android
  - Web
  - Kotlin
  - JavaScript
categories:
  - Planet Mozilla
images:
  - /posts/promise-to-coroutine-dictionary/banner.png
color: '#28be6b'
banner: banner.png
toc: true
---

![](banner.png)



{{< toc >}}

## async function > suspend function

## await > await

## Promise.all > Structured concurrency with async

Let's build a function that concurrently performs two calculations and returns the sum of their results. In JavaScript, you can launch two async functions and pass them into [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) to wait until both operations finish. If either operation fails and throws an error, then `Promise.all` immediately throws an error.

```js
async function concurrentSum() {
  const one = doSomethingUsefulOne();
  const two = doSomethingUsefulTwo();
  const [resultOne, resultTwo] = await Promise.all([one, two]);
  return resultOne + resultTwo;
}
```

Normally, calling one suspend function from another suspend function in Kotlin immediately awaits until the task is finished.

```kotlin
suspend fun concurrentSum(): Int {
  val resultOne = doSomethingUsefulOne()
  val resultTwo = doSomethingUsefulTwo() // Doesn't start until one has been computed
  return resultOne + resultTwo
}
```

We can work around this using [`CoroutineScope.async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) to run each child coroutine. We can then pass the resulting [`Deferred`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html) objects into [`awaitAll`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-all.html).

To use the `async` builder, we need a reference to a [`CoroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html). The [`coroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) function creates a new scope that automatically inherits the parent coroutine context, without the need for an explicit reference.

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
  val one = async { doSomethingUsefulOne() }
  val two = async { doSomethingUsefulTwo() }
  val (resultOne, resultTwo) = awaitAll(one, two)
  return resultOne + resultTwo
}
```

The Kotlin variant has an added benefit over JavaScript: cancellation. If either operation fails and throws an error, Kotlin will additionally cancel the other operation automatically.

## Promise.allSettled >
