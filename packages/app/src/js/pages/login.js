/* eslint-disable no-await-in-loop */
import {h, render} from 'preact';

import { Login } from '../components/auth/login';
import { App } from './app';

render(<Login><App /></Login>, document.getElementById('root'));
