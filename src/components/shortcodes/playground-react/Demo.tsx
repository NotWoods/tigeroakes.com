import type { ReactNode } from 'react';

export const DEMO_CLASSES =
  'not-prose bg-slate-800 text-slate-200 -mx-4 max-w-screen accent-orange-500 ';

export interface Props {
  /**
   * Title to show in the header of the demo.
   */
  title?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Demo({ title = 'Code Demo', className = '', ...props }: Props) {
  return (
    <div {...props} className={DEMO_CLASSES + className}>
      <header className="flex px-4 items-center">
        <h4 className="flex-1">{title}</h4>
      </header>
      {props.children}
    </div>
  );
}
