import { Ref } from 'preact';
import { JSXInternal } from 'preact/src/jsx';
import classes from './sidebar-demo.module.css';

export type AnimationState = 'open' | 'opening' | 'closed' | 'closing';

interface Props {
  contentRef?: Ref<HTMLDivElement>;
  contentStyle?: JSXInternal.HTMLAttributes['style'];
  animationState: AnimationState;
}

export function SidebarContent(props: Props) {
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
      <div class={classes.sidebar}>Sidebar</div>
      <div
        ref={props.contentRef}
        class={classes.content}
        style={props.contentStyle}
      >
        Main content
      </div>
    </div>
  );
}
