import * as path from 'path';
import { apiBanner } from '@acte-de-presence/banner';

apiBanner(path.resolve(__dirname, './assets/banner.txt'));
console.log('Hello World!');
