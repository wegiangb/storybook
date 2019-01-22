import { Keybinding, ResolvedKeybinding, SimpleKeybinding } from './keyCodes';
import { ScanCodeBinding } from './scanCode';
import { IKeyboardEvent } from './keybinding';

export interface IKeyboardMapper {
  dumpDebugInfo(): string;
  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
  resolveUserBinding(
    firstPart: SimpleKeybinding | ScanCodeBinding | null,
    chordPart: SimpleKeybinding | ScanCodeBinding | null
  ): ResolvedKeybinding[];
}

export class CachedKeyboardMapper implements IKeyboardMapper {
  private _actual: IKeyboardMapper;
  private _cache: Map<string, ResolvedKeybinding[]>;

  constructor(actual: IKeyboardMapper) {
    this._actual = actual;
    this._cache = new Map<string, ResolvedKeybinding[]>();
  }

  public dumpDebugInfo(): string {
    return this._actual.dumpDebugInfo();
  }

  public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
    const hashCode = keybinding.getHashCode();
    if (!this._cache.has(hashCode)) {
      const r = this._actual.resolveKeybinding(keybinding);
      this._cache.set(hashCode, r);
      return r;
    }
    return this._cache.get(hashCode);
  }

  public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
    return this._actual.resolveKeyboardEvent(keyboardEvent);
  }

  public resolveUserBinding(
    firstPart: SimpleKeybinding | ScanCodeBinding,
    chordPart: SimpleKeybinding | ScanCodeBinding
  ): ResolvedKeybinding[] {
    return this._actual.resolveUserBinding(firstPart, chordPart);
  }
}
