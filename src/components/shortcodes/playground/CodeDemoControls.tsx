import type { ComponentChildren } from 'preact';
import type { JSXInternal } from 'preact/src/jsx';
import { CodeDemo, Props } from './CodeDemo';
import { useMounted } from './useMounted';

type BaseControlProps<
  Type extends string,
  Keys extends keyof JSXInternal.HTMLAttributes
> = { type: Type; name: string; label?: ComponentChildren } & Pick<
  JSXInternal.HTMLAttributes<HTMLInputElement>,
  Keys | 'defaultValue' | 'defaultChecked' | 'id'
>;

export type ControlProps =
  | BaseControlProps<'range', 'list' | 'max' | 'min' | 'step'>
  | BaseControlProps<'checkbox' | 'radio', 'value'>;

export function CodeDemoControl({
  label,
  ...props
}: BaseControlProps<string, 'value' | 'checked' | 'onInput' | 'onChange'> &
  ControlProps) {
  return (
    <label class="flex flex-wrap gap-x-4 items-center">
      <input autocomplete="off" {...props} />
      <span>{label || props.name}</span>
    </label>
  );
}

interface ControlsProps extends Props {
  controls: ComponentChildren;
}

export function CodeDemoControls({ controls, ...props }: ControlsProps) {
  const mounted = useMounted();

  return (
    <CodeDemo {...props}>
      <div class="bg-slate-200 mx-4 relative">{props.children}</div>
      <fieldset class="px-4 py-2" disabled={!mounted}>
        {controls}
      </fieldset>
    </CodeDemo>
  );
}
