import type { AllHTMLAttributes, ReactNode } from 'react';
import { CodeDemo, type Props } from './CodeDemo';
import { useMounted } from './useMounted';

type BaseControlProps<
  Type extends string,
  Keys extends keyof AllHTMLAttributes<HTMLInputElement>,
> = { type: Type; name: string; label?: ReactNode } & Pick<
  AllHTMLAttributes<HTMLInputElement>,
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
    <label className="flex flex-wrap gap-x-4 items-center">
      <input autoComplete="off" {...props} />
      <span>{label || props.name}</span>
    </label>
  );
}

interface ControlsProps extends Props {
  controls: ReactNode;
}

export function CodeDemoControls({ controls, ...props }: ControlsProps) {
  const mounted = useMounted();

  return (
    <CodeDemo {...props}>
      <div className="bg-slate-200 text-slate-800 mx-4 relative">
        {props.children}
      </div>
      <fieldset className="px-4 py-2" disabled={!mounted}>
        {controls}
      </fieldset>
    </CodeDemo>
  );
}
