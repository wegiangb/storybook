import React from 'react';
import AboutPage from './about_page';
import ShortcutsPage from './shortcuts';

const SettingsPages = () => [
  <AboutPage key="about" />,
  <ShortcutsPage key="shortcuts" path="shortcuts" />,
];

export { SettingsPages as default };
