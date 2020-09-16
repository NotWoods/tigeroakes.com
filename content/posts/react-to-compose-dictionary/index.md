---
title: 'React to Jetpack Compose Dictionary'
description: Two libraries with similar concepts. What's the equivalent Jetpack Compose terms for React terms?
date: 2020-07-20
lastmod: 2020-09-14
author: tiger
tags:
  - Android
  - React
  - Kotlin
  - Jetpack Compose
images:
  - /posts/react-to-compose-dictionary/banner.png
color: '#28be6b'
banner: banner.png
toc: true
---

![](banner.png)

I've been trying out [Jetpack Compose](https://developer.android.com/jetpack/compose) on a personal project and liking the API. Compose is a pretty big API shift, and I've found my [React](https://reactjs.org/) knowledge much more helpful than my Android knowledge. Perhaps this is how React Native developers come to replace native Android developers.

Many concepts and functions in the two libraries work the same but have different names. Here's a compilation of terms I've seen along with explanations. Jetpack Compose is still changing, and this list is based on [version 1.0.0-alpha02](https://developer.android.com/jetpack/androidx/releases/ui#1.0.0-alpha02).

{{< toc >}}

## Children Prop > Children Composable

Both React and Compose refer to elements to be displayed inside another UI component as children.

React passes children by value, under a special prop named `children`.

```jsx
function Container(props) {
  return <div>{props.children}</div>;
}

<Container>
  <span>Hello world!</span>
</Container>
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

## Context > Ambient

While most data is passed through the component tree as props/parameters, sometimes this model can be cumbersome. React includes the [Context](https://reactjs.org/docs/context.html) API to share this data. Compose uses [Ambient](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Ambient) to accomplish the same thing.

### createContext > ambientOf

A React Context is created with [`React.createContext`](https://reactjs.org/docs/context.html#reactcreatecontext), while a Jetpack Compose ambient is created with [`ambientOf`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#ambientof).

### Provider > Provider

The value can be controlled using a "Provider" in both [React](https://reactjs.org/docs/context.html#contextprovider) and [Compose](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#providers).

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

Accessing the value of an Ambient is done by using the [`.current` getter](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Ambient#current).

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

Compose has the [`onCommit` effect](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#oncommit) to run side effects every [composition](#render--composition).

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

Jetpack Compose exposes an [`onDispose` function](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#ondispose) inside `onCommit`, which runs when the effect leaves the composition.

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

When an empty dependency list is passed to `useEffect`, the side effect is only run once.

```jsx
useEffect(() => {
  sideEffectOnMount();
}, []);
```

Jetpack Compose has a separate [`onActive` effect](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#onactive) for this.

```kotlin
onActive {
  sideEffectOnActive()
}
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
  });

  return isOnline;
}
```

In Jetpack Compose, [@Composable functions](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composable) are used as the equivalent of hooks (along with acting as the [equivalent of Components](#react-component--composable)). These composable functions, sometimes referred to as "effect" functions, usually start with a lowercase letter instead of an uppercase letter.

```kotlin
@Composable
fun friendStatus(friendID: String): State<Boolean?> {
  val isOnline = remember { mutableStateOf<Boolean?>(null) }

  onCommit {
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

<button onClick={() => setCount(count + 1)}>
  You clicked {count} times
</button>
```

Compose uses the [`mutableStateOf` function](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#mutablestateof) to return a [`MutableState` object](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState), which contains a variable with a getter and setter.

```kotlin
val count = remember { mutableStateOf(0) }

Button(onClick = { count.value++ }) {
  Text("You clicked ${count.value} times")
}
```

`MutableState` contains [`componentN()` functions](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState#component1()), allowing you to destructure the getter and setter just like React.

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
    <button onClick={() => this.setState(state => ({ count: state.count + 1 }))}>
      You clicked {this.state.count} times
    </button>
  }
}
```

In Jetpack Compose, this behaviour is encapsulated in a concept called snapshots. A snapshot represents state values at a certain time. The [`Snapshot` class](https://developer.android.com/reference/kotlin/androidx/compose/runtime/snapshots/Snapshot) exposes an [`enter` function](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/snapshots/Snapshot#enter(kotlin.Function0)>) to run an updater callback. Inside the callback, all state objects return the value they had when the snapshot was taken.

## Storybook > Preview

The [Storybook](https://storybook.js.org/) tool helps you preview React components on the web independently by creating "stories". The [`@Preview` annotation](https://developer.android.com/reference/kotlin/androidx/ui/tooling/preview/Preview) in Jetpack Compose lets you build example composables that can be previewed in Android Studio.

## Ternary Operator > If Statement

React components often use the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) (`cond ? a : b`) to conditionally render components, as the successful branch is returned (unlike if statements in JavaScript).

```jsx
function Greeting(props) {
  return (
    <span>
      {props.name != null
        ? `Hello ${props.name}!`
        : 'Goodbye.'}
    </span>
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
