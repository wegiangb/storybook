import { ResolvedKeybinding, ResolvedKeybindingPart } from '../keyboard/keyCodes';
import { OperatingSystem } from './platform';

export interface PartMatches {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  keyCode?: boolean;
}

export interface Matches {
  firstPart: PartMatches;
  chorPart: PartMatches;
}

class KeybindingLabel {
  private keybinding: ResolvedKeybinding;
  private matches: Matches;
  private didEverRender: boolean;

  constructor(private os: OperatingSystem) {
    this.didEverRender = false;
  }
}
