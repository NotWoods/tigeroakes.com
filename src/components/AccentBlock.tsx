export interface Props {
  position: 'left' | 'bottom';
  animate?: boolean;
  class?: string;
}

const classes = {
  left: {
    base: 'inset-y-0 origin-right max-h-7',
    animate:
      'scale-x-initial group-hover:scale-x-100 group-active:scale-x-50 motion-safe:transition-transform',
  },
  bottom: {
    base: 'inset-x-0 origin-top',
    animate:
      'scale-y-initial group-hover:scale-y-100 group-active:scale-y-50 motion-safe:transition-transform',
  },
};

export function AccentBlock({ position, animate, class: className }: Props) {
  return (
    <div
      aria-hidden="true"
      class={[
        'block absolute bg-accent',
        `accent-block--${position}`,
        classes[position].base,
        animate && classes[position].animate,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
