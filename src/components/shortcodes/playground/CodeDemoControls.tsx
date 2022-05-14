import type { ComponentChildren } from 'preact';
import type { JSXInternal } from 'preact/src/jsx';
import { CodeDemo, Props } from './CodeDemo';
import { useMounted } from './useMounted';

type BaseControlProps<
  Type extends string,
  Keys extends keyof JSXInternal.HTMLAttributes
> = { type: Type; name: string; label?: ComponentChildren } & Pick<
  JSXInternal.HTMLAttributes<HTMLInputElement>,
  Keys | 'defaultValue' | 'defaultChecked'
>;

export type ControlProps =
  | BaseControlProps<'range', 'list' | 'max' | 'min' | 'step'>
  | BaseControlProps<'checkbox' | 'radio', 'value'>;

export function CodeDemoControl({
  label,
  ...props
}: BaseControlProps<string, 'value' | 'checked' | 'onInput'> &
  ControlProps & { id: string }) {
  return (
    <div>
      <input autocomplete="off" {...props} />
      <label class="ml-4" for={props.id}>{label || props.name}</label>
    </div>
  );
}

interface ControlsPropsArray extends Props {
  idPrefix: string;
  controls: readonly ControlProps[];
}

interface ControlsPropsComponents extends Props {
  controls: ComponentChildren;
}

function hasIdPrefix(
  props: ControlsPropsArray | ControlsPropsComponents
): props is ControlsPropsArray {
  return Boolean((props as any).idPrefix);
}

export function CodeDemoControls(
  props: ControlsPropsArray | ControlsPropsComponents
) {
  const mounted = useMounted();

  return (
    <CodeDemo title={props.title}>
      <div class="bg-slate-200 mx-4">{props.children}</div>
      <fieldset class="px-4 py-2" disabled={!mounted}>
        {hasIdPrefix(props)
          ? props.controls.map((control) => {
              const id = `${props.idPrefix}-${control.name}`;
              return <CodeDemoControl key={id} id={id} {...control} />;
            })
          : props.controls}
      </fieldset>
    </CodeDemo>
  );
}
