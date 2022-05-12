---
layout: ../../../layouts/PostLayout.astro
title: 'React to Jetpack Compose RC Dictionary'
description: Two libraries with similar concepts. What's the equivalent Jetpack Compose terms for React terms?
date: 2020-07-20
author: tiger
tags:
  - Android
  - React
  - Kotlin
  - Jetpack Compose
categories:
  - Planet Mozilla
  - Feature
images:
  - /posts/react-to-compose-dictionary/banner.png
banner: banner.png
toc: true
---

![React and Jetpack Compose logos](banner.png)

I've been trying out [Jetpack Compose](https://developer.android.com/jetpack/compose) on a personal project and liking the API. Compose is a pretty big API shift, and I've found my [React](https://reactjs.org/) knowledge much more helpful than my Android knowledge. Perhaps this is how React Native developers come to replace native Android developers.

Many concepts and functions in the two libraries work the same but have different names. Here's a compilation of terms I've seen along with explanations. Jetpack Compose is still changing, and this list is based on [version 1.0.0-rc01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.0.0-rc01).

## Children Prop > Children Composable

Both React and Compose refer to elements to be displayed inside another UI component as children.

React passes children by value, under a special prop named `children`.

```jsx
function Container(props) {
  return <div>{props.children}</div>;
}

<Container>
  <span>Hello world!</span>
</Container>;
```

Jetpack Compose passes composable functions as the functions themselves don't return anything.

```kotlin
@Composable
fun Container(children: @Composable () -> Unit) {
  Box {
    children()
  }
}

Container {
  Text("Hello world"!)
}
```

## Context > CompositionLocal

While most data is passed through the component tree as props/parameters, sometimes this model can be cumbersome. React includes the [Context](https://reactjs.org/docs/context.html) API to share this data. Compose uses [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) to accomplish the same thing. This API was called `Ambient` in alpha versions of Jetpack Compose.

### createContext > compositionLocalOf

A React Context is created with [`React.createContext`](https://reactjs.org/docs/context.html#reactcreatecontext), while a Jetpack Compose ambient is created with [`compositionLocalOf`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#compositionlocalof).

### Provider > CompositionLocalProvider

The value can be controlled using a "Provider" in both [React](https://reactjs.org/docs/context.html#contextprovider) and [Compose](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#compositionlocalprovider).

```jsx
<MyContext.Provider value={myValue}>
  <SomeChild />
</MyContext.Provider>
```

```kotlin
CompositionLocalProvider(MyLocal provides myValue) {
  SomeChild()
}
```

### useContext > CompositionLocal.current

Accessing the React context value is accomplished using the [`useContext` hook](https://reactjs.org/docs/hooks-reference.html#usecontext).

```jsx
const myValue = useContext(MyContext);
```

Accessing the value of an Ambient is done by using the [`.current` getter](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal#current:androidx.compose.runtime.CompositionLocal.T).

```kotlin
val myValue = MyLocal.current
```

## Hook > Effect

React lets you [build your own hooks](https://reactjs.org/docs/hooks-custom.html) to extract component logic into reusable functions. They can use other hooks like `useState` and `useEffect` to encapsulate logic that relates to the component lifecycle.

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [friendID]);

  return isOnline;
}
```

In Jetpack Compose, [@Composable functions](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composable) are used as the equivalent of hooks (along with acting as the [equivalent of Components](#react-component--composable)). These composable functions, sometimes referred to as "effect" functions, usually start with a lowercase letter instead of an uppercase letter.

```kotlin
@Composable
fun friendStatus(friendID: String): State<Boolean?> {
  val isOnline = remember { mutableStateOf<Boolean?>(null) }

  DisposableEffect(friendID) {
    val handleStatusChange = { status: FriendStatus ->
      isOnline.value = status.isOnline
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange)
    onDispose {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
    }
  }

  return isOnline
}
```

## useEffect > LaunchedEffect

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a UI component. They must be placed inside a callback function that both React and Jetpack Compose will call at the correct point.

React has the [`useEffect` hook](https://reactjs.org/docs/hooks-reference.html#useeffect) to run side effects.

```jsx
useEffect(() => {
  sideEffectRunEveryRender();
});
```

`useEffect` is used for many different purposes: event subscriptions, logging, asynchronous code, and more. Compose breaks up these use cases into separate functions with the suffix `Effect`, including [`DisposableEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#disposableeffect_1), [`LaunchedEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#launchedeffect_1), and [`SideEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#sideeffect).

### Clean-up function > DisposableEffect

Side effects often create resources that need to be cleaned up once the UI component is unused. React allows the `useEffect` function to return a second function, known as the [clean-up function](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect).

```jsx
useEffect(() => {
  const subscription = source.subscribe(id);
  return () => {
    subscription.unsubscribe(id);
  };
}, [id]);
```

Jetpack Compose exposes an [`DisposableEffect` composable](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#disposableeffect_1) that replaces `useEffect` in this scenario. Rather than returning a function, you can call `onDispose` and pass a callback there. It will run when the effect leaves the composition.

```kotlin
DisposableEffect(id) {
  val subscription = source.subscribe(id)
  onDispose {
    subscription.unsubscribe(id)
  }
}
```

### useEffect(promise, deps) > LaunchedEffect

Asynchronous functions are created in JavaScript using the `async` keyword. React will handle running the function, but doesn't handle cancelling the promise if a re-render occurs before the promise has finished running. Since you shouldn't return anything except for a [clean-up function](#clean-up-function--disposableeffect) from the effect callback, you need to create then immediately invoke the asynchronous function.

```jsx
useEffect(() => {
  async function asyncEffect() {
    await apiClient.fetchUser(id);
  }
  asyncEffect();
}, [id]);
```

The above code fetches from an API whenever the `id` value changes. You can also write the same code using an [IIFE or Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

```jsx
useEffect(() => {
  (async () => {
    await apiClient.fetchUser(id);
  })();
}, [id]);
```

Cancelling the promise is a little more complicated because it isn't built into React. You can use an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel `fetch` functions and certain other promises.

```jsx
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    // The abort signal will send abort events to the API client
    await apiClient.fetchUser(id, controller.signal);
  })();

  // Abort when id changes, or when the component is unmounted
  return () => controller.abort();
}, [id]);
```

Kotlin uses suspend functions and coroutines instead of JavaScript's async functions and promises. Jetpack Compose has a dedicated `LaunchedEffect` composable to handle suspend functions in side effects. The effect dependencies are called "keys" and work the same way as React, expect that you provide them at the start of the function instead of the end.

Compose additionally cancels the coroutine whenever the keys change. As a result, the 11 lines of code above are replaced with the 3 lines below.

```kotlin
LaunchedEffect(id) {
  apiClient.fetchUser(id)
}
```

### useEffect(callback) > SideEffect(callback)

Side effects that run every single [render](#render--composition) are created in React using `useEffect` with no dependency list.

```jsx
useEffect(() => {
  sideEffectRunEveryRender();
});
```

This is accomplished using the [`SideEffect`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#sideeffect) function in Jetpack Compose. These side effects will be run every single composition.

```kotlin
SideEffect {
  sideEffectRunEveryComposition()
}
```

### Dependency array > Keys

`useEffect` takes an optional second parameter: an array [containing the values the effect depends on](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If this parameter isn't passed at all, then the effect will run every single render. If an empty array is passed in, then the effect is only run when the component is first rendered.

```jsx
useEffect(() => {
  // Run when id changes
}, [id]);

useEffect(() => {
  // Run every render
});

useEffect(() => {
  // Run on the first render
}, []);
```

Rather than passing an array as the last parameter, you can pass any number of arguments as the first few parameters to `DisposableEffect` and `LaunchedEffect`.

```kotlin
LaunchedEffect(id) {
  // Run when id changes
}
```

If you want to run something every render, you need to use `SideEffect`. There is no equivalent for not passing the dependency list to `useEffect` in `DisposableEffect` and `LaunchedEffect`. You should always pass some kind of dependency or key.

```kotlin
SideEffect {
  // Run every composition
}
```

To only run an effect on the first composition, you should use a key that never changes - such as `Unit` or `true`.

```kotlin
LaunchedEffect(Unit) {
  // Run only on the first composition
}
```

### useState with useEffect > produceState

In React, frequently you will use a combination of the `useEffect` hook to fetch data, and `useState` to store that data.

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, (status) => {
      setIsOnline(status.isOnline);
    });

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID);
    };
  }, [friendID]);

  return isOnline;
}
```

Jetpack Compose offers a single function to handle this functionality: [`produceState`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#producestate).

```kotlin
@Composable
fun friendStatus(friendID: String): State<Boolean?> {
  return produceState(initialValue = null, friendID) {
    ChatAPI.subscribeToFriendStatus(friendID) { status ->
      value = status.isOnline
    }

    awaitDispose {
      ChatAPI.unsubscribeFromFriendStatus(friendID)
    }
  }
}
```

Instead of calling a set function, you can use the `value` setter inside of the [produce state scope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ProduceStateScope). You can read the current state by looking at the return value from `produceState`.

The side effect inside of `produceState` can be a coroutine or choose to clean itself up using the `awaitDispose` function. This is similar to returning a clean-up function inside React's `useEffect` hook.

## Key Prop > Key Composable

Keys are used to help React and Jetpack Compose identify which items have changed, are added, or are removed. They must be unique among the list of items you display at that point in a UI component.

React has a special [string prop named `key`](https://reactjs.org/docs/lists-and-keys.html).

```jsx
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>
```

Jetpack Compose has a special [utility composable called `key`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#key) that can take any input.

```kotlin
Column {
  for (todo in todos) {
    key(todo.id) { Text(todo.text) }
  }
}
```

Multiple inputs can be passed in to `key` in Compose, while React requires a single string (although multiple strings could be concatenated).

## .map > For Loop

Since React passes elements by value, elements corresponding to an array are usually created using [`array.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). The returned elements in the map callback can be [embedded in JSX](https://reactjs.org/docs/lists-and-keys.html#embedding-map-in-jsx).

```jsx
function NumberList(props) {
  return (
    <ul>
      {props.numbers.map((number) => (
        <ListItem value={number} />
      ))}
    </ul>
  );
}
```

Composable UI functions in Jetpack Compose emit other UI composables and don't return anything. As a result, a simple for loop can be used instead of `.map()`.

```kotlin
@Composable
fun NumberList(numbers: List<Int>) {
  Column {
    for (number in numbers) {
      ListItem(value = number)
    }
  }
}
```

In fact, any iteration method can be used, such as `.forEach()`.

## PropTypes.oneOfType > Function overloading

JavaScript and TypeScript support passing in different variable types for the same parameter. In React, this can be modelled using `PropTypes.oneOfType`. In TypeScript, it can be modelled using a union type.

```tsx
function FancyButton(props) {
  return ...
}

FancyButton.propTypes = {
  text: PropTypes.string,
  background: PropTypes.oneOfType([
    PropTypes.instanceOf(Color),
    PropTypes.number,
  ]),
};

interface FancyButtonProps {
  text: string;
  background: Color | number;
}
```

This is possible to model using overloads in Kotlin.

```kotlin
@Composable fun FancyButton(
  text: String,
  background: Color,
) {
  ...
}
@Composable fun FancyButton(
  text: String,
  background: Int,
) {
  ...
}
```

## useMemo > remember

React allows values to be re-computed only if certain dependencies change inside a component through the [`useMemo` hook](https://reactjs.org/docs/hooks-reference.html#usememo).

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Jetpack Compose has a similar function named [`remember`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#remember) that only re-computes a value if the inputs change.

```kotlin
val memoizedValue = remember(a, b) { computeExpensiveValue(a, b) }
```

## React Component > Composable

In React, Components are used to split the UI into independent and reusable pieces. They can come in the form of a function that takes a `props` parameter and returns a React node.

```jsx
function Greeting(props) {
  return <span>Hello {props.name}!</span>;
}
```

In Jetpack Compose, Composable functions are building blocks used to split the UI into independent and reusable pieces. They are functions with a [`@Composable` annotation](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composable) that can take any number of parameters.

```kotlin
@Composable
fun Greeting(name: String) {
  Text(text = "Hello $name!")
}
```

Both libraries also refer to these concepts as UI components. However, Jetpack Compose also uses composable functions for other functionality, see [hook > effect](#hook--effect) and [key](#key-prop--key-composable) for examples.

## Render > Composition

Once data has changed inside a UI component, the library must adjust what is presented on screen. React refers to this as rendering, while Jetpack Compose refers to this as composition.

## Reconciler > Composer

Internally React needs to figure out what changes when a component is rendered. This diffing algorithm is called the ["Reconciler"](https://reactjs.org/docs/reconciliation.html). React Fiber referred to the release of the new Fiber Reconciler which replaced the old algorithm.

Jetpack Compose's diffing is done using the [Composer](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composer). It determines how nodes change every time a composable completes composition.

## State > State

Both React and Compose refer to local variables you want to mutate as "state".

### useState > state

Creating a new state variable in React is done with the [`useState` hook](https://reactjs.org/docs/hooks-reference.html#usestate). It returns a tuple with the value and a setter.

```jsx
const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>You clicked {count} times</button>;
```

Compose uses the [`mutableStateOf` function](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#mutablestateof) to return a [`MutableState` object](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState), which contains a variable with a getter and setter.

```kotlin
val count = remember { mutableStateOf(0) }

Button(onClick = { count.value++ }) {
  Text("You clicked ${count.value} times")
}
```

`MutableState` contains [`componentN()` functions](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState#component1()>), allowing you to destructure the getter and setter just like React.

```kotlin
val (count, setCount) = remember { mutableStateOf(0) }

Button(onClick = { setCount(count + 1) }) {
  Text("You clicked ${count} times")
}
```

To avoid recomputing the initial state, `mutableStateOf` is usually wrapped with the [`remember` function](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#remember).

### setState updater function > Snapshot

When updating [state in a React component](https://reactjs.org/docs/react-component.html#setstate) based on a previous value, you can pass an "updater" function that receives the current state as a function argument.

```jsx
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    <button
      onClick={() => this.setState((state) => ({ count: state.count + 1 }))}
    >
      You clicked {this.state.count} times
    </button>;
  }
}
```

In Jetpack Compose, this behaviour is encapsulated in a concept called snapshots. A snapshot represents state values at a certain time. The [`Snapshot` class](https://developer.android.com/reference/kotlin/androidx/compose/runtime/snapshots/Snapshot) exposes an [`enter` function](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/snapshots/Snapshot#enter(kotlin.Function0)>) to run an updater callback. Inside the callback, all state objects return the value they had when the snapshot was taken.

## Storybook > Preview

The [Storybook](https://storybook.js.org/) tool helps you preview React components on the web independently by creating "stories". The [`@Preview` annotation](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/Preview) in Jetpack Compose lets you build example composables that can be previewed in Android Studio.

## Ternary Operator > If Statement

React components often use the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) (`cond ? a : b`) to conditionally render components, as the successful branch is returned (unlike if statements in JavaScript).

```jsx
function Greeting(props) {
  return (
    <span>{props.name != null ? `Hello ${props.name}!` : 'Goodbye.'}</span>
  );
}
```

Kotlin doesn't have ternary operators as if statements do return the result of the successful branch. Since if statements in Kotlin act like ternary operators in JavaScript, there is no need for a second variation.

```kotlin
@Composable
fun Greeting(name: String?) {
  Text(text = if (name != null) {
    "Hello $name!"
  } else {
    "Goodbye."
  })
}
```
