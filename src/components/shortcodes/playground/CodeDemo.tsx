import type { ComponentChildren, JSX, Ref } from 'preact';
import { DEMO_CLASSES } from './Demo';

export interface Props {
  title?: ComponentChildren;
  children: ComponentChildren;
  formRef?: Ref<HTMLFormElement>;
  onInput?: (event: Event) => void;
  onReset?: (event: Event) => void;
  class?: string;
  style?: string | JSX.CSSProperties;
}

const preventDefault = (event: Event) => event.preventDefault();

export function CodeDemo(props: Props) {
  return (
    <form
      class={DEMO_CLASSES + props.class}
      ref={props.formRef}
      onInput={props.onInput}
      onReset={props.onReset}
      onSubmit={preventDefault}
      style={props.style}
    >
      <header class="flex px-4 items-center">
        <h4 class="flex-1">{props.title || 'Code Demo'}</h4>
        <button
          type="reset"
          class="button relative shadow text-center whitespace-nowrap px-2 my-1"
        >
          Reset
        </button>
      </header>
      {props.children}
    </form>
  );
}
