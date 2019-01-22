import { KeyCode, Keybinding, ResolvedKeybinding } from './keyCodes';
import { createDecorator } from './instantiation';
import { IContextKeyServiceTarget } from './contextkey';
import { ResolvedKeybindingItem } from './resolvedKeybindingItem';
export interface IUserFriendlyKeybinding {
  key: string;
  command: string;
  args?: any;
  when?: string;
}

export const enum KeybindingSource {
  Default = 1,
  User,
}

export interface IKeybindingEvent {
  source: KeybindingSource;
  keybindings?: IUserFriendlyKeybinding[];
}

export interface IKeyboardEvent {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly keyCode: KeyCode;
  readonly code: string;
  readonly key: string;
}

export const IKeybindingService = createDecorator<IKeybindingService>('keybindingService');

export interface IKeybindingService {
  _serviceBrand: any;

  onDidUpdateKeybindings: IKeybindingEvent;

  /**
   * Returns none, one or many (depending on keyboard layout)!
   */
  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];

  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;

  resolveUserBinding(userBinding: string): ResolvedKeybinding[];

  /**
   * Resolve and dispatch `keyboardEvent` and invoke the command.
   */
  dispatchEvent(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean;

  /**
   * Resolve and dispatch `keyboardEvent`, but do not invoke the command or change inner state.
   */
  //   softDispatch(keyboardEvent: IKeyboardEvent, target: IContextKeyServiceTarget): IResolveResult | null;

  dispatchByUserSettingsLabel(userSettingsLabel: string, target: IContextKeyServiceTarget): void;

  /**
   * Look up keybindings for a command.
   * Use `lookupKeybinding` if you are interested in the preferred keybinding.
   */
  lookupKeybindings(commandId: string): ResolvedKeybinding[];

  /**
   * Look up the preferred (last defined) keybinding for a command.
   * @returns The preferred keybinding or null if the command is not bound.
   */
  lookupKeybinding(commandId: string): ResolvedKeybinding | null;

  getDefaultKeybindingsContent(): string;

  getDefaultKeybindings(): ResolvedKeybindingItem[];

  getKeybindings(): ResolvedKeybindingItem[];

  customKeybindingsCount(): number;

  /**
   * Will the given key event produce a character that's rendered on screen, e.g. in a
   * text box. *Note* that the results of this function can be incorrect.
   */
  mightProducePrintableCharacter(event: IKeyboardEvent): boolean;
}
