import type { ComponentChildren } from 'preact';

export const DEMO_CLASSES =
  'not-prose bg-slate-800 text-slate-200 -mx-4 max-w-screen accent-orange-500 ';

export interface Props {
  /**
   * Title to show in the header of the demo.
   */
  title?: ComponentChildren;
  class?: string;
  children: ComponentChildren;
}

export function Demo({
  title = 'Code Demo',
  class: className = '',
  ...props
}: Props) {
  return (
    <div {...props} class={DEMO_CLASSES + className}>
      <header class="flex px-4 items-center">
        <h4 class="flex-1">{title}</h4>
      </header>
      {props.children}
    </div>
  );
}
