import type { RefObject } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../../components/shortcodes/playground/CodeDemoControls';
import { useFormState } from '../../../components/shortcodes/playground/useFormState';
import { type AnimationState, SidebarContent } from './SidebarContent';

const finalAnimationState = (open: boolean) => (open ? 'open' : 'closed');

function useAnimationStateMachine(
  open: boolean
): [AnimationState, (state: 'open' | 'closed') => void] {
  const [animationState, setAnimationState] = useState<AnimationState>(
    finalAnimationState(open)
  );

  useEffect(() => {
    setAnimationState((lastState) => {
      const finalState = finalAnimationState(open);
      if (lastState === finalState) {
        // Don't animate if the state is already correct
        return lastState;
      } else {
        // Start animating
        return open ? 'opening' : 'closing';
      }
    });
  }, [open]);

  return [animationState, setAnimationState];
}

function useOpenCloseAnimation(
  contentRef: RefObject<HTMLElement>,
  open: boolean,
  duration: number
) {
  const [animationState, setAnimationDone] = useAnimationStateMachine(open);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    let animation: Animation | undefined;
    const options: KeyframeAnimationOptions = {
      easing: 'ease-in-out',
      duration,
    };

    switch (animationState) {
      case 'opening':
        animation = contentRef.current.animate(
          [{ transform: 'translateX(-160px)' }, { transform: 'translateX(0)' }],
          options
        );
        animation.onfinish = () => setAnimationDone('open');
        break;
      case 'closing':
        animation = contentRef.current.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
          options
        );
        animation.onfinish = () => setAnimationDone('closed');
        break;
    }

    return () => animation?.finish();
  }, [contentRef, animationState]);

  return animationState;
}

export function SidebarAnimationDemo() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, callbacks] = useFormState({
    open: true,
    animationDuration: 300,
  });
  const animationState = useOpenCloseAnimation(
    contentRef,
    state.open,
    state.animationDuration
  );

  return (
    <CodeDemoControls
      controls={
        <>
          <div>state: {animationState}</div>
          <CodeDemoControl
            label={`open: ${state.open}`}
            name="open"
            type="checkbox"
            checked={state.open}
          />
          <CodeDemoControl
            label={`animation-duration: ${state.animationDuration}ms`}
            name="animationDuration"
            type="range"
            min="0"
            max="2000"
            list="animation-times"
            value={state.animationDuration}
          />
        </>
      }
      {...callbacks}
    >
      <SidebarContent animationState={animationState} contentRef={contentRef} />
      <datalist id="animation-times">
        <option value="0" />
        <option value="333" />
        <option value="1000" />
        <option value="2000" />
      </datalist>
    </CodeDemoControls>
  );
}

export function SidebarTranslateSliderDemo() {
  const [state, callbacks] = useFormState({ translateX: 0 });

  return (
    <CodeDemoControls
      controls={
        <CodeDemoControl
          label={`transform: translateX(${state.translateX}px)`}
          name="translateX"
          type="range"
          min={-160}
          max={0}
          value={state.translateX}
        />
      }
      {...callbacks}
    >
      <SidebarContent
        animationState="open"
        contentStyle={{ transform: `translateX(${state.translateX}px)` }}
      />
    </CodeDemoControls>
  );
}

type Layout = 'open' | 'animating' | 'closed';
const layouts: readonly Layout[] = ['open', 'animating', 'closed'];
export function SidebarLayoutDemo() {
  const [state, callbacks] = useFormState({
    layout: layouts[0],
    translateX: 0,
  });

  return (
    <CodeDemoControls
      controls={
        <>
          {layouts.map((layout) => (
            <CodeDemoControl
              key={layout}
              label={layout}
              value={layout}
              name="layout"
              type="radio"
              checked={state.layout === layout}
            />
          ))}
          <CodeDemoControl
            label={`transform: translateX(${state.translateX}px)`}
            name="translateX"
            type="range"
            min={-160}
            max={0}
            value={state.translateX}
          />
        </>
      }
      {...callbacks}
    >
      <SidebarContent
        animationState={state.layout === 'animating' ? 'opening' : state.layout}
        contentStyle={{ transform: `translateX(${state.translateX}px)` }}
      />
    </CodeDemoControls>
  );
}

export function SidebarNaiveDemo() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('open');
  const [state, callbacks] = useFormState({ open: true });

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    let animation: Animation | undefined;
    const options: KeyframeAnimationOptions = {
      easing: 'ease-in-out',
      duration: 300,
    };

    if (state.open) {
      setAnimationState('opening');
      animation = contentRef.current.animate(
        [{ transform: 'translateX(-160px)' }, { transform: 'translateX(0)' }],
        options
      );
      animation.onfinish = () => setAnimationState('open');
    } else {
      setAnimationState('opening');
      animation = contentRef.current.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-160px)' }],
        options
      );
      animation.onfinish = () => setAnimationState('closed');
    }

    return () => animation?.finish();
  }, [state.open]);

  return (
    <CodeDemoControls
      controls={
        <CodeDemoControl
          label={`open: ${state.open}`}
          name="open"
          type="checkbox"
          checked={state.open}
        />
      }
      {...callbacks}
    >
      <SidebarContent animationState={animationState} contentRef={contentRef} />
    </CodeDemoControls>
  );
}
