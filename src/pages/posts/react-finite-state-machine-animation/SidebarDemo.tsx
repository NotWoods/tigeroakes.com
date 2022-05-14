import { useCallback, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../../components/shortcodes/playground/CodeDemoControls';
import classes from './sidebar-demo.module.css';

export function SidebarTranslateSliderDemo() {
  const [translateX, setTranslateX] = useState(320);
  const onInput = useCallback((event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    setTranslateX(Number(target.value));
  }, []);
  const onReset = useCallback(() => setTranslateX(320), []);

  return (
    <CodeDemoControls
      onReset={onReset}
      controls={
        <CodeDemoControl
          id="slider-demo-translate"
          name="translateX"
          type="range"
          min={0}
          max={320}
          value={translateX}
          onInput={onInput}
        />
      }
    >
      <div class={`${classes.container} ${classes.open}`}>
        <div class={classes.sidebar}>Sidebar</div>
        <div
          class={`${classes.content} text-slate-800`}
          style={{ transform: `translateX(${translateX - 320}px)` }}
        >
          Main content
        </div>
      </div>
    </CodeDemoControls>
  );
}
