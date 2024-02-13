import { Checkmark20Regular, Checkmark48Filled } from '@fluentui/react-icons';
import {
  CodeDemoControl,
  CodeDemoControls,
} from '../../shortcodes/playground-react/CodeDemoControls';
import { useFormState } from '../../shortcodes/playground-react/useFormState';
import logo from './logo.svg';
import { Demo } from '../../shortcodes/playground-react/Demo';

const { Button, FluentProvider, makeStyles, webLightTheme } = import.meta.env
  .SSR
  ? (
      (await import('@fluentui/react-components')) as {
        default: typeof import('@fluentui/react-components');
      }
    ).default
  : await import('./fluentui');

export function ButtonDemo() {
  return (
    <Demo title="Fluent UI Button" className="pb-4">
      <FluentProvider
        theme={webLightTheme}
        className="mx-4 flex justify-center items-center p-2"
      >
        <Button icon={<Checkmark20Regular />}>Text</Button>
      </FluentProvider>
    </Demo>
  );
}

export function IconColor() {
  const [state, callbacks] = useFormState({
    color: '#0000ff',
  });

  return (
    <CodeDemoControls
      title="Icon color"
      controls={
        <CodeDemoControl
          label={`parent color: ${state.color}`}
          name="color"
          type="color"
          defaultValue={state.color}
        />
      }
      {...callbacks}
    >
      <div
        className="flex justify-center items-center p-2"
        style={{ color: state.color }}
      >
        <Checkmark48Filled />
      </div>
    </CodeDemoControls>
  );
}

const useAutoRTLStyles = makeStyles({
  logo: {
    textAlign: 'left',
    marginLeft: '15px',
  },
});

function Logo() {
  const classes = useAutoRTLStyles();

  return <img src={logo.src} alt="Fluent UI Logo" className={classes.logo} />;
}

export function AutoRTL() {
  const [state, callbacks] = useFormState({
    rtl: false,
  });
  const dir = state.rtl ? 'rtl' : 'ltr';

  return (
    <CodeDemoControls
      title="Automatic RTL flipping"
      controls={
        <CodeDemoControl
          label={`dir: ${dir}`}
          name="rtl"
          type="checkbox"
          defaultChecked={state.rtl}
        />
      }
      {...callbacks}
    >
      <FluentProvider theme={webLightTheme} dir={dir} className="p-4">
        <div className="border border-black">
          <Logo />
        </div>
      </FluentProvider>
    </CodeDemoControls>
  );
}
