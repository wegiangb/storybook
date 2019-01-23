// eslint-disable-next-line no-unused-vars
import React from 'react';
import { navigator } from 'global';
import { get, setAll } from './persist';

export const isMacLike = () => (navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false);
export const controlOrMetaSymbol = () => (isMacLike() ? '⌘' : 'ctrl');
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');
export const optionOrAltSymbol = () => (isMacLike() ? '⌥' : 'alt');

export const isShortcutTaken = (arr1: string[], arr2: string[]): boolean => JSON.stringify(arr1) === JSON.stringify(arr2);

export const parseKey = (e: KeyboardEvent): string[] => {
  const keys = [];
  if (e.altKey) {
    keys.push('alt');
  }
  if (e.ctrlKey) {
    keys.push('control');
  }
  if (e.metaKey) {
    keys.push('meta');
  }
  if (e.key && e.key.length === 1 && e.key !== ' ') {
    keys.push(e.key.toUpperCase());
  }
  if (e.shiftKey) {
    keys.push('shift');
  }
  if (e.key === ' ') {
    keys.push('space');
  }
  if (e.key === 'Escape') {
    keys.push('escape');
  }
  if (e.key === 'ArrowRight') {
    keys.push('ArrowRight');
  }
  if (e.key === 'ArrowDown') {
    keys.push('ArrowDown');
  }
  if (e.key === 'ArrowUp') {
    keys.push('ArrowUp');
  }
  if (e.key === 'ArrowLeft') {
    keys.push('ArrowLeft');
  }

  return keys;
};

export const keyToSymbol = (key: string): string => {
  if (key === 'alt') {
    return optionOrAltSymbol();
  }
  if (key === 'control') {
    return '⌃';
  }
  if (key === 'meta') {
    return '⌘';
  }
  if (key === 'shift') {
    return '⇧​';
  }
  if (key === 'Enter' || key === 'Backspace' || key === 'Esc') {
    return '';
  }
  if (key === 'escape') {
    return '';
  }
  if (key === ' ') {
    return 'SPACE';
  }
  if (key === 'ArrowUp') {
    return '↑';
  }
  if (key === 'ArrowDown') {
    return '↓';
  }
  if (key === 'ArrowLeft') {
    return '←';
  }
  if (key === 'ArrowRight') {
    return '→';
  }
  return key.toUpperCase();
};

export const labelsArr = [
  'Go full screen',
  'Toggle panel',
  'Toggle panel position',
  'Toggle navigation',
  'Toggle toolbar',
  'Focus search',
  'Focus navigation',
  'Focus iFrame',
  'Focus panel',
  'Previous component',
  'Next component',
  'Previous story',
  'Next story',
  'Go to shortcuts page',
  'Go to about page',
];

export const defaultShortcutSets: ShortcutKeyShape = {
  fullScreen: {
    altKey: false,
    ctrlKey: false,
    keyCode: 70,
    metaKey: false,
    shiftKey: false,
    value: ['F'],
    error: false,
  },
  togglePanel: {
    altKey: false,
    ctrlKey: false,
    keyCode: 83,
    metaKey: false,
    shiftKey: false,
    value: ['S'],
    error: false,
  },
  panelPosition: {
    altKey: false,
    ctrlKey: false,
    keyCode: 68,
    metaKey: false,
    shiftKey: false,
    value: ['D'],
    error: false,
  },
  navigation: {
    altKey: false,
    ctrlKey: false,
    keyCode: 65,
    metaKey: false,
    shiftKey: false,
    value: ['A'],
    error: false,
  },
  toolbar: {
    altKey: false,
    ctrlKey: false,
    keyCode: 50,
    metaKey: false,
    shiftKey: false,
    value: ['T'],
    error: false,
  },
  search: {
    altKey: false,
    ctrlKey: false,
    keyCode: 85,
    metaKey: false,
    shiftKey: false,
    value: ['/'],
    error: false,
  },
  focusNav: {
    altKey: false,
    ctrlKey: false,
    keyCode: 22,
    metaKey: false,
    shiftKey: false,
    value: ['1'],
    error: false,
  },
  focusIframe: {
    altKey: false,
    ctrlKey: false,
    keyCode: 23,
    metaKey: false,
    shiftKey: false,
    value: ['2'],
    error: false,
  },
  focusPanel: {
    altKey: false,
    ctrlKey: false,
    keyCode: 24,
    metaKey: false,
    shiftKey: false,
    value: ['3'],
    error: false,
  },
  prevComponent: {
    altKey: true,
    ctrlKey: false,
    keyCode: 16,
    metaKey: false,
    shiftKey: false,
    value: ['alt', 'ArrowUp'],
    error: false,
  },
  nextComponent: {
    altKey: true,
    ctrlKey: false,
    keyCode: 18,
    metaKey: false,
    shiftKey: false,
    value: ['alt', 'ArrowDown'],
    error: false,
  },
  prevStory: {
    altKey: true,
    ctrlKey: false,
    keyCode: 15,
    metaKey: false,
    shiftKey: false,
    value: ['alt', 'ArrowLeft'],
    error: false,
  },
  nextStory: {
    altKey: true,
    ctrlKey: false,
    keyCode: 17,
    metaKey: false,
    shiftKey: false,
    value: ['alt', 'ArrowRight'],
    error: false,
  },
  shortcutsPage: {
    altKey: true,
    ctrlKey: controlOrMetaKey(),
    keyCode: 82,
    metaKey: controlOrMetaKey(),
    shiftKey: true,
    value: [','],
    error: false,
  },
  aboutPage: {
    altKey: true,
    ctrlKey: false,
    keyCode: 82,
    metaKey: false,
    shiftKey: false,
    value: [','],
    error: false,
  },
};

export const serializableKeyboardShortcuts: ParsedShortcutKeys = Object.freeze({
  fullScreen: ['F'],
  togglePanel: ['S'], // Panel visibiliy
  panelPosition: ['D'],
  navigation: ['A'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['shift', ',', controlOrMetaKey()],
  aboutPage: [','],
});


type ShortcutNames =
  | 'fullScreen'
  | 'togglePanel'
  | 'panelPosition'
  | 'navigation'
  | 'toolbar'
  | 'search'
  | 'focusNav'
  | 'focusIframe'
  | 'focusPanel'
  | 'prevComponent'
  | 'nextComponent'
  | 'prevStory'
  | 'nextStory'
  | 'shortcutsPage'
  | 'aboutPage';


export interface ShortcutKeyShape {
  [fullScreen: string]: { value: string[]; error: boolean };
  togglePanel: { value: string[]; error: boolean };
  panelPosition: { value: string[]; error: boolean };
  navigation: { value: string[]; error: boolean };
  toolbar: { value: string[]; error: boolean };
  search: { value: string[]; error: boolean };
  focusNav: { value: string[]; error: boolean };
  focusIframe: { value: string[]; error: boolean };
  focusPanel: { value: string[]; error: boolean };
  prevComponent: { value: string[]; error: boolean };
  nextComponent: { value: string[]; error: boolean };
  prevStory: { value: string[]; error: boolean };
  nextStory: { value: string[]; error: boolean };
  shortcutsPage: { value: string[]; error: boolean };
  aboutPage: { value: string[]; error: boolean };
}

export interface ParsedShortcutKeys {
  [fullScreen: string]: string[];
  togglePanel: string[];
  panelPosition: string[];
  navigation: string[];
  toolbar: string[];
  search: string[];
  focusNav: string[];
  focusIframe: string[];
  focusPanel: string[];
  prevComponent: string[];
  nextComponent: string[];
  prevStory: string[];
  nextStory: string[];
  shortcutsPage: string[];
  aboutPage: string[];
}

export const serializedShortcutkeys = (obj: ParsedShortcutKeys): ShortcutKeyShape =>
  Object.entries(obj).reduce<Partial<ShortcutKeyShape>>(
    (acc, i) => ({ ...acc, [i[0]]: { value: [...i[1]], error: false } }),
    {}
  ) as ShortcutKeyShape;

export const initShortcutKeys = (): ParsedShortcutKeys => {
  const shortcutKeys = get('shortcutKeys');

  if (!shortcutKeys) {
    setAll('shortcutKeys', serializableKeyboardShortcuts);
  }
  return shortcutKeys;
};

export const mapToKeyEl = (inputValue: string[]) => {
  if (inputValue && inputValue.length > 0) {
    return inputValue.map(k => keyToSymbol(k));
  }
  return undefined;
};
