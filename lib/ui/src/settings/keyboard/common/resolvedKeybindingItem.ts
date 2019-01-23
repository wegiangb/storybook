import { CharCode } from './charCode';
import { ResolvedKeybinding } from './keyCodes';
import { ContextKeyExpr } from './contextkey';

export class ResolvedKeybindingItem {
  _resolvedKeybindingItemBrand: void;

  public readonly resolvedKeybinding: ResolvedKeybinding | null;
  public readonly keypressFirstPart: string | null;
  public readonly keypressChordPart: string | null;
  public readonly bubble: boolean;
  public readonly command: string | null;
  public readonly commandArgs: any;
  public readonly when: ContextKeyExpr | null;
  public readonly isDefault: boolean;

  constructor(
    resolvedKeybinding: ResolvedKeybinding | null,
    command: string | null,
    commandArgs: any,
    when: ContextKeyExpr | null,
    isDefault: boolean
  ) {
    this.resolvedKeybinding = resolvedKeybinding;
    if (resolvedKeybinding) {
      const [keypressFirstPart, keypressChordPart] = resolvedKeybinding.getDispatchParts();
      this.keypressFirstPart = keypressFirstPart;
      this.keypressChordPart = keypressChordPart;
    } else {
      this.keypressFirstPart = null;
      this.keypressChordPart = null;
    }
    this.bubble = command ? command.charCodeAt(0) === CharCode.Caret : false;
    this.command = this.bubble ? command!.substr(1) : command;
    this.commandArgs = commandArgs;
    this.when = when;
    this.isDefault = isDefault;
  }
}
