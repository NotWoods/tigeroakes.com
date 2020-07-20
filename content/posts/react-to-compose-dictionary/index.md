---
title: "React to Jetpack Compose Dictionary"
description: Two libraries with similar concepts. What's the equivalent Jetpack Compose terms for React terms?
date: 2020-07-22
author: tiger
tags:
  - TIL
  - Android
  - React
  - Kotlin
  - Jetpack Compose
images:
  - /posts/react-to-compose-dictionary/banner.png
---

![](banner.png)

I've been trying out [Jetpack Compose](https://developer.android.com/jetpack/compose) on a personal project and liking the API. Compose is a pretty big API shift, and I've found my [React](https://reactjs.org/) knowledge much more helpful than my Android knowledge. Perhaps this is how React Native developers come to replace native Android developers.

Many concepts and functions in the two libraries work the same but have different names. Here's a compilation of terms I've seen along with explanations. Jetpack Compose is still changing, and this list is based on [version 0.1.0-dev14](https://developer.android.com/jetpack/androidx/releases/ui#0.1.0-dev14).

{{< toc >}}

## Context > Ambient
While most data is passed through the component tree as props/parameters, sometimes this model can be cumbersome. React includes the [Context](https://reactjs.org/docs/context.html) API to share this data. Compose uses [Ambient](https://developer.android.com/reference/kotlin/androidx/compose/Ambient#current:androidx.compose.Ambient.T) to accomplish the same thing.

### createContext > ambientOf
A React Context is created with [`React.createContext`](https://reactjs.org/docs/context.html#reactcreatecontext), while a Jetpack Compose ambient is created with [`ambientOf`](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#ambientof).

### Provider > Provider
The value can be controlled using a "Provider" in both [React](https://reactjs.org/docs/context.html#contextprovider) and [Compose](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#Providers(androidx.compose.ProvidedValue,%20kotlin.Function0)).

```jsx
<MyContext.Provider value={myValue}>
  <SomeChild />
</MyContext.Provider>
```

```kotlin
Providers(MyAmbient provides myValue) {
  SomeChild()
}
```

### useContext > Ambient.current
Accessing the React context value is accomplished using the [`useContext` hook](https://reactjs.org/docs/hooks-reference.html#usecontext).
```jsx
const myValue = useContext(MyContext);
```

Accessing the value of an Ambient is done by using the [`.current` getter](https://developer.android.com/reference/kotlin/androidx/compose/Ambient#current:androidx.compose.Ambient.T).
```kotlin
val myValue = MyAmbient.current
```

## useEffect > onCommit
Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a UI component. They must be placed inside a callback function that both React and Jetpack Compose will call at the correct point.

React has the [`useEffect` hook](https://reactjs.org/docs/hooks-reference.html#useeffect) to run side effects every [render](#render--composition).
```jsx
useEffect(() => {
  sideEffectRunEveryRender();
});
```

Compose has the [`onCommit` effect](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#oncommit) to run side effects every [composition](#render--composition).
```kotlin
onCommit {
  sideEffectRunEveryComposition()
}
```

### Clean-up function > onDispose
Side effects often create resources that need to be cleaned up once the UI component is unused. React allows the `useEffect` function to return a second function, known as the [clean-up function](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect).
```jsx
useEffect(() => {
  const subscription = source.subscribe();
  return () => {
    subscription.unsubscribe();
  };
});
```

Jetpack Compose exposes an [`onDispose` function](https://developer.android.com/reference/kotlin/androidx/compose/CommitScope#onDispose(kotlin.Function0)) inside `onCommit`, which runs when the effect leaves the composition.
```kotlin
onCommit {
  val subscription = source.subscribe()
  onDispose {
    subscription.unsubscribe()
  }
}
```

### useEffect(callback, deps) > onCommit(inputs, callback)
Both `useEffect` and `onCommit` default to running after every [render/composition](#render--composition). However, side effects can also be run only when their dependencies change.

React allows a second parameter to be passed to `useEffect` with a list of dependencies:
```jsx
useEffect(() => {
  sideEffect();
}, [dep1, dep2]);
```

Jetpack Compose allows inputs to be passed as parameters before the callback:
```kotlin
onCommit(input1, input2) {
  sideEffect()
}
```

### useEffect(callback, []) > onActive(callback)
Side effects can also be run only when the UI component is first displayed.

When an empty dependency list is passed to `useEffect`, the effect is only run once.
```jsx
useEffect(() => {
  sideEffectOnMount();
}, []);
```

Jetpack Compose has a separate [`onActive` effect](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#onActive(kotlin.Function1)) for this.
```kotlin
onActive {
  sideEffectOnActive()
}
```

## useMemo > remember
React allows values to be re-computed only if certain dependencies change inside a component through the [`useMemo` hook](https://reactjs.org/docs/hooks-reference.html#usememo).
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Jetpack Compose has a similar function named [`remember`](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#remember) that only re-computes a value if the inputs change.
```kotlin
val memoizedValue = remember(a, b) { computeExpensiveValue(a, b) }
```

## React Component > Composable
In React, Components are used to split the UI into independent and reusable pieces. They can come in the form of a function that takes a `props` parameter and returns a React node. In Jetpack Compose, Composable functions are building blocks used to split the UI into independent and reusable pieces. They are functions with a `@Composable` annotation that can take any number of parameters. Both libraries also refer to these concepts as UI components.

## Render > Composition
Once data has changed inside a UI component, the library must adjust what is presented on screen. React refers to this as rendering, while Jetpack Compose refers to this as composition.

## State > State
Both React and Compose refer to local variables you want to mutate as "state".

### useState > state
Creating a new state variable in React is done with the [`useState` hook](https://reactjs.org/docs/hooks-reference.html#usestate). It returns a tuple with the value and a setter.
```jsx
const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  You clicked {count} times
</button>
```

Compose uses the [`state` function](https://developer.android.com/reference/kotlin/androidx/compose/package-summary#state(kotlin.Function2,%20kotlin.Function0)) to return a `MutableState` object, which contains a variable with a getter and setter.

```kotlin
val count = state { 0 }

Button(onClick = { count.value++ }) {
    Text("You clicked ${count.value} times")
}
```

## Storybook > Preview
The [Storybook](https://storybook.js.org/) tool helps you preview React components on the web independently by creating "stories". The `@Preview` annotation in Jetpack Compose lets you build example composables that can be previewed in Android Studio.
