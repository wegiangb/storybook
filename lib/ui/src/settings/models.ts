// import { Event, Emitter } from './keyboard/common/event';
// import { KeyboardMapperFactory } from './keyboard/keyboardMapperFactory';
import { Keybinding, KeyCode, ResolvedKeybinding, SimpleKeybinding } from './keyboard/common/keyCodes';
// import { CachedKeyboardMapper } from './keyboard/common/keyboardMapper';
import { IKeybindingItemEntry, IListEntry, KEYBINDING_ENTRY_TEMPLATE_ID } from './keyboard/keybindingsEditorModel';
import { IKeybindingEvent, IKeybindingService, IKeyboardEvent } from './keyboard/common/keybinding';

import { ScanCodeBinding } from './keyboard/common/scanCode';
import {
  defaultShortcutSets,
  serializableKeyboardShortcuts,
  initShortcutKeys,
  isShortcutTaken,
  keyToSymbol,
  labelsArr,
  mapToKeyEl,
  parseKey,
  serializedShortcutkeys,
  ShortcutKeyShape,
} from './utils';


export interface ShortcutsState {
  activeInputField: string;
  inputArr: string[];
  shortcutKeys: ShortcutKeyShape;
  successField: string;
  //   // _lifecycle_disposable_isDisposed: boolean;
  //   // _firstPart: ResolvedKeybinding | null;
  //   // _chordPart: ResolvedKeybinding | null;
}

export interface IKeyboardMapper {
  dumpDebugInfo(): string;
  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
  resolveUserBinding(
    firstPart: SimpleKeybinding | ScanCodeBinding | null,
    chordPart: SimpleKeybinding | ScanCodeBinding | null
  ): ResolvedKeybinding[];
}
