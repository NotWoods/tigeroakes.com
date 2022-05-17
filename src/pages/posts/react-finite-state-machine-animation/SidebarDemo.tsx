import { RefObject } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../../components/shortcodes/playground/CodeDemoControls';
import { useFormState } from '../../../components/shortcodes/playground/useFormState';
import { AnimationState, SidebarContent } from './SidebarContent';

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
          [{ transform: 'translateX(-320px)' }, { transform: 'translateX(0)' }],
          options
        );
        animation.onfinish = () => setAnimationDone('open');
        break;
      case 'closing':
        animation = contentRef.current.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-320px)' }],
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
    animationDuration: 333,
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
          <CodeDemoControl name="open" type="checkbox" checked={state.open} />
          <CodeDemoControl
            label="animation-duration"
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
  const [state, callbacks] = useFormState({ translateX: 320 });

  return (
    <CodeDemoControls
      controls={
        <CodeDemoControl
          name="translateX"
          type="range"
          min={0}
          max={320}
          value={state.translateX}
        />
      }
      {...callbacks}
    >
      <SidebarContent
        animationState="open"
        contentStyle={{ transform: `translateX(${state.translateX - 320}px)` }}
      />
    </CodeDemoControls>
  );
}
