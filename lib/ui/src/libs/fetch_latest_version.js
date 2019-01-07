// TODO: figure out a way to share this code with the CLI (lib/core/src/server/build-dev.js)

import { localStorage, fetch } from 'global';

const versionsUrl = 'https://storybook.js.org/versions.json';
const checkInterval = 24 * 60 * 60 * 1000;

export default function fetchLatestVersion(currentVersion) {
  const time = Date.now();
  return localStorage.getItem('lastUpdateCheck').then((fromCache = { success: false, time: 0 }) => {
    // if last check was more then 24h ago
    if (!fromCache || time - fromCache.time > checkInterval) {
      return Promise.race([
        fetch(`${versionsUrl}?current=${currentVersion}`),
        // if fetch is too slow, we won't wait for it
        new Promise((res, rej) => setTimeout(rej, 1500)),
      ])
        .then(data => data.json())
        .then(result =>
          localStorage
            .setItem('lastUpdateCheck', result)
            .then(() => Promise.resolve({ success: true, data, time }))
        );
    }
    Promise.resolve(fromCache);
  });
}
