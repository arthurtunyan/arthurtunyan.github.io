// The mono theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in mono.settings.json and the generated mono.settings.ts;
// change them with `astryx experimental theme editor set mono ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {monoSettings} from './mono.settings';

export const monoTheme = defineTheme({
  extends: monoSettings,
  name: 'mono',
});
