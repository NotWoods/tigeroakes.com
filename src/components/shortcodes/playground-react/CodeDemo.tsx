import type { CSSProperties, FormEvent, ReactNode, Ref } from 'react';
import { DEMO_CLASSES } from './Demo';

export interface Props {
  title?: ReactNode;
  children: ReactNode;
  formRef?: Ref<HTMLFormElement>;
  onInput?: (event: FormEvent) => void;
  onReset?: (event: FormEvent) => void;
  class?: string;
  style?: CSSProperties;
}

const preventDefault = (event: FormEvent) => event.preventDefault();

export function CodeDemo(props: Props) {
  return (
    <form
      className={DEMO_CLASSES + props.class}
      ref={props.formRef}
      onChange={props.onInput}
      onReset={props.onReset}
      onSubmit={preventDefault}
      style={props.style}
    >
      <header className="flex px-4 items-center">
        <h4 className="flex-1">{props.title || 'Code Demo'}</h4>
        <button
          type="reset"
          className="button relative shadow text-center whitespace-nowrap px-2 my-1"
        >
          Reset
        </button>
      </header>
      {props.children}
    </form>
  );
}
