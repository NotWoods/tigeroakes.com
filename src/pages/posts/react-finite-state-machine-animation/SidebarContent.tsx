import { RefObject } from 'preact';
import { MutableRef, useEffect, useRef, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import classes from './sidebar-content.module.css';

export type AnimationState = 'open' | 'opening' | 'closed' | 'closing';

interface Props {
  contentRef?: MutableRef<HTMLDivElement>;
  contentStyle?: JSXInternal.HTMLAttributes['style'];
  animationState: AnimationState;
}

function useElementWidth(elementRef: RefObject<HTMLElement>) {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!elementRef.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentBoxSize) {
        setWidth(entry.contentBoxSize[0].inlineSize);
      } else {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(elementRef.current);

    return () => resizeObserver.disconnect();
  }, [elementRef]);

  return Math.floor(width);
}

export function SidebarContent(props: Props) {
  const { contentRef = useRef() } = props;
  const width = useElementWidth(contentRef);
  const containerClass = {
    opening: classes.animating,
    closing: classes.animating,
    open: classes.open,
    closed: classes.closed,
  };

  return (
    <div
      class={`text-shadow overflow-x-hidden ${classes.container} ${
        containerClass[props.animationState]
      }`}
    >
      {props.animationState !== 'closed' && (
        <div class={classes.sidebar}>Sidebar</div>
      )}
      <div ref={contentRef} class={classes.content} style={props.contentStyle}>
        Main content
      </div>
      {width != undefined && (
        <span class="absolute bottom-0 right-0 px-2 bg-gray-900/50">
          width: {width}px
        </span>
      )}
    </div>
  );
}
