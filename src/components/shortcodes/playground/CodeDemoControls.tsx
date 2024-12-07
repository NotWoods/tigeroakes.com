import type { ComponentChildren, JSX } from 'preact';
import { CodeDemo, type Props } from './CodeDemo';
import { useMounted } from './useMounted';

type BaseControlProps<
  Type extends string,
  Keys extends keyof JSX.InputHTMLAttributes<HTMLInputElement>,
> = { type: Type; name: string; label?: ComponentChildren } & Pick<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  Keys | 'defaultValue' | 'defaultChecked' | 'id'
>;

export type ControlProps =
  | BaseControlProps<'range', 'list' | 'max' | 'min' | 'step'>
  | BaseControlProps<'checkbox' | 'radio' | 'color', 'value'>;

export function CodeDemoControl({
  label,
  ...props
}: BaseControlProps<string, 'value' | 'checked' | 'onInput' | 'onChange'> &
  ControlProps) {
  return (
    <label class="flex flex-wrap items-center gap-x-4">
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
      <div class="relative mx-4 bg-slate-200 text-slate-800">
        {props.children}
      </div>
      <fieldset class="px-4 py-2" disabled={!mounted}>
        {controls}
      </fieldset>
    </CodeDemo>
  );
}
