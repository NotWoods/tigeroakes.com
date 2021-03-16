---
title: 'How to replace onCommit, onActive, and onDispose in Jetpack Compose'
description: These functions were deprecated in alpha and have been replaced.
date: 2021-03-15
author: tiger
tags:
  - TIL
  - Android
  - Kotlin
  - Jetpack Compose
categories:
  - Planet Mozilla
color: '#28be6b'
toc: true
---

If you're looking at some Jetpack Compose code or tutorials written last year, you might see the use of `onCommit`, `onActive`, and `onDispose`. However, these functions are no longer present in Android's developer documentation. They were deprecated in [version 1.0.0-alpha11](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.0.0-alpha11) in favor of [`SideEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#sideeffect) and [`DisposableEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#disposableeffect_1). Here's how to use those new functions and update your code.

## What do they do?

Composables should be side-effect free and not handle use cases such as connecting with a HTTP API or showing a snackbar directly. You should use [the side effect APIs in Jetpack Compose](https://developer.android.com/jetpack/compose/lifecycle#state-effect-use-cases) to ensure that these effects are run in a predictable way, rather than writing it alongside your UI rendering code.

## `onCommit` with just a callback

This simple use case has a simple update. Just use the new [`SideEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#sideeffect) function instead.

```kotlin
// Before
onCommit {
  sideEffectRunEveryComposition()
}
```

```kotlin
// After
SideEffect {
  sideEffectRunEveryComposition()
}
```

## `onCommit` with keys

If you only want to run your side effect when keys are changed, then you should [`LaunchedEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#launchedeffect_1) if you don't call `onDispose`. (If you do, scroll down to the next section.)

```kotlin
// Before
onCommit(userId) {
  searchUser(userId)
}
```

```kotlin
// After
LaunchedEffect(userId) {
  searchUser(userId)
}
```

## `onCommit` with `onDispose`

Effects using [`onDispose`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/DisposableEffectScope#ondispose) to clean up are now handled in a separate function called [`DisposableEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#disposableeffect_1).

```kotlin
// Before
onCommit(userId) {
  val subscription = subscribeToUser(userId)

  onDispose {
    subscription.cleanup()
  }
}
```

```kotlin
// After
DisposableEffect(userId) {
  val subscription = subscribeToUser(userId)

  onDispose {
    subscription.cleanup()
  }
}
```

## `onActive`

Rather than having a separate function for running an effect only on the first composition, this use cases is now handled by passing `Unit` as a key to `LaunchedEffect` or `DisposableEffect`. You can pass any static value as a key, including `Unit` or `true`.

```kotlin
// Before
onActive {
  search()
}
```

```kotlin
// After
LaunchedEffect(Unit) {
  search()
}
```

## `onActive` with `onDispose`

```kotlin
// Before
onActive {
  val subscription = subscribe()

  onDispose {
    subscription.cleanup()
  }
}
```

```kotlin
// After
DisposableEffect(Unit) {
  val subscription = subscribe()

  onDispose {
    subscription.cleanup()
  }
}
```
