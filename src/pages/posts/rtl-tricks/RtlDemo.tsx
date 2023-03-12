import { Demo } from '../../../components/shortcodes/playground/Demo';
import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../../components/shortcodes/playground/CodeDemoControls';
import { useFormState } from '../../../components/shortcodes/playground/useFormState';
import classes from './rtl.module.css';

export function HelloWorld() {
  return (
    <>
      <Demo title="Left to Right (LTR)">
        <p class="mx-4 px-2 border" dir="ltr">
          ✈️ Hello world!
        </p>
      </Demo>
      <Demo title="Right to Left (RTL)" class="pb-2">
        <p class="mx-4 px-2 border" dir="rtl">
          <span class="inline-block -scale-x-100">✈️</span> مرحبا بالعالم!
        </p>
      </Demo>
    </>
  );
}

export function AutoMirrorIcon() {
  const [state, callbacks] = useFormState({
    xDirection: 1,
  });

  return (
    <CodeDemoControls
      controls={
        <CodeDemoControl
          label={`--x-direction: ${state.xDirection}`}
          name="xDirection"
          type="range"
          min="-1"
          max="1"
          step="2"
          list="x-directions"
          value={state.xDirection}
        />
      }
      {...callbacks}
      style={{ '--x-direction': state.xDirection }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto"
        style="transform: scaleX(var(--x-direction))"
      >
        <use href="#panel-icon" />
      </svg>
      <code class="block text-center">scaleX({state.xDirection})</code>
      <datalist id="x-directions">
        <option value="-1" />
        <option value="1" />
      </datalist>
    </CodeDemoControls>
  );
}

export function SidebarWithShadow({ dirAware }: { dirAware: boolean }) {
  const [state, callbacks] = useFormState({
    rtl: false,
  });
  const dir = state.rtl ? 'rtl' : 'ltr';

  return (
    <CodeDemoControls
      title={
        dirAware
          ? 'Sidebar with --x-direction shadow'
          : 'Sidebar with regular shadow'
      }
      controls={
        <CodeDemoControl
          label={`dir: ${dir}`}
          name="rtl"
          type="checkbox"
          checked={state.rtl}
        />
      }
      {...callbacks}
    >
      <div class={`flex ${classes.rtl}`} dir={dir}>
        <div
          class={`h-40 p-4 bg-slate-800/20 w-[160px] ${
            dirAware ? classes.sidebarDirAware : classes.sidebar
          }`}
        >
          Sidebar
        </div>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          xmlns="http://www.w3.org/2000/svg"
          class="m-4"
          style="transform: scaleX(var(--x-direction))"
        >
          <use href="#panel-icon" />
        </svg>
      </div>
    </CodeDemoControls>
  );
}
