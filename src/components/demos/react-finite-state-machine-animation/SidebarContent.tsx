import type { JSX, RefObject } from 'preact';
import { type MutableRef, useEffect, useRef, useState } from 'preact/hooks';
import classes from './sidebar-content.module.css';

export type AnimationState = 'open' | 'opening' | 'closed' | 'closing';

interface Props {
  contentRef?: MutableRef<HTMLDivElement | null>;
  contentStyle?: JSX.HTMLAttributes['style'];
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

  return width !== undefined ? Math.floor(width) : undefined;
}

export function SidebarContent(props: Props) {
  const { contentRef = useRef(null) } = props;
  const width = useElementWidth(contentRef);
  const containerClass = {
    opening: classes.animating,
    closing: classes.animating,
    open: classes.open,
    closed: classes.closed,
  };

  return (
    <div
      class={`text-shadow overflow-x-hidden text-slate-200 ${
        classes.container
      } ${containerClass[props.animationState]}`}
    >
      {props.animationState !== 'closed' && (
        <div class={classes.sidebar}>Sidebar</div>
      )}
      <div ref={contentRef} class={classes.content} style={props.contentStyle}>
        Main content
      </div>
      {width !== undefined && (
        <span class="absolute bottom-0 right-0 bg-gray-900/50 px-2">
          width: {width}px
        </span>
      )}
    </div>
  );
}
