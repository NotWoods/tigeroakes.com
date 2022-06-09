import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../../components/shortcodes/playground/CodeDemoControls';
import { useFormState } from '../../../components/shortcodes/playground/useFormState';
import classes from './segoe-font-face.module.css';

export function VariableFontSliders() {
  const [state, callbacks] = useFormState({
    wght: 400,
    opsz: 14,
  });

  return (
    <CodeDemoControls
      controls={
        <>
          <CodeDemoControl
            label={`font weight: ${state.wght}`}
            name="wght"
            type="range"
            min="300"
            max="700"
            list="font-weights"
            value={state.wght}
          />
          <CodeDemoControl
            label={`optical size: ${state.opsz}`}
            name="opsz"
            type="range"
            min="1"
            max="36"
            list="optical-sizes"
            value={state.opsz}
          />
        </>
      }
      {...callbacks}
    >
      <p
        class={`text-slate-800 text-2xl text-center p-4 ${classes.text}`}
        style={`font-variation-settings: 'wght' ${state.wght}, 'opsz' ${state.opsz}`}
      >
        The quick brown fox jumps over the lazy dog
      </p>
      <datalist id="font-weights">
        <option value="300" />
        <option value="350" />
        <option value="400" />
        <option value="600" />
        <option value="700" />
      </datalist>
      <datalist id="optical-sizes">
        <option value="1" />
        <option value="10.5" />
        <option value="36" />
      </datalist>
    </CodeDemoControls>
  );
}
