import addons from '@storybook/addons';
import { STORY_EVENT_ID } from './events';

function getLocation(context, locationsMap) {
  return locationsMap[`${context.kind}@${context.name}`] || locationsMap[`@${context.name}`];
}

function setStorySource(context, source, locationsMap) {
  const channel = addons.getChannel();
  const currentLocation = getLocation(context, locationsMap);
  const {
    parameters: { fileName },
  } = context;

  channel.emit(STORY_EVENT_ID, {
    source,
    currentLocation,
    locationsMap,
    fileName,
  });
}

export function withStorySource(source, locationsMap = {}) {
  return (story, context) => {
    setStorySource(context, source, locationsMap);
    return story();
  };
}
