// import './console';
import React from 'react';
import './js/setup.ts';
import './assets/fontawesome/css/all.css';
import './fonts.css';
import './style.css';
import './js/components/App.tsx';
import { attachConsole } from '@tauri-apps/plugin-log';
attachConsole();
/*
import { invoke } from '@tauri-apps/api/core';

(async function test() {
  console.log('invoking test');
  console.log(await invoke('test'));
  console.log('after test');
})()
*/
declare global {
  interface Window {
    React: typeof React;
  }
}

window.React = React;
