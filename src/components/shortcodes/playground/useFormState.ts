import { useCallback, useState } from 'preact/hooks';

function readInputState(input: HTMLInputElement) {
  switch (input.type) {
    case 'checkbox':
    case 'radio':
      return input.checked;
    case 'range':
      return Number(input.value);
    default:
      return input.value;
  }
}

export function useFormState<State extends Record<string, unknown>>(
  initialState: State
) {
  const [state, setState] = useState<State>(initialState);

  const onInput = useCallback((event: Event) => {
    const input = event.target as HTMLInputElement;
    setState((state) => ({ ...state, [input.name]: readInputState(input) }));
  }, []);

  const onReset = useCallback(() => setState(initialState), [initialState]);

  return [state, { onInput, onReset }] as const;
}
