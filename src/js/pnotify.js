import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

export function onErrorEmptyInput() {
  error({
    title: 'Error! Σ(‘◉⌓◉’)',
    text: 'Enter the query correctly... (；☉_☉)',
    delay: 2000,
    closerHover: true,
    mouseReset: true,
    shadow: true,
  });
}

export function onErrorNoSuchMatches() {
  error({
    title: 'Error! Σ(‘◉⌓◉’)',
    text: 'No such matches... (；☉_☉)',
    delay: 2000,
    closerHover: true,
    mouseReset: true,
    shadow: true,
  });
}