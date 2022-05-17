import type { ComponentChildren, Ref } from 'preact';

export interface Props {
  title?: ComponentChildren;
  children: ComponentChildren;
  formRef?: Ref<HTMLFormElement>;
  onInput?: (event: Event) => void;
  onReset?: (event: Event) => void;
}

const preventDefault = (event: Event) => event.preventDefault();

export function CodeDemo(props: Props) {
  return (
    <form
      class="not-prose bg-slate-800 text-slate-200 -mx-4 max-w-screen accent-orange-500"
      ref={props.formRef}
      onInput={props.onInput}
      onReset={props.onReset}
      onSubmit={preventDefault}
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
