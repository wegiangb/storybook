import {
    KeyCode,
    KeyCodeUtils,
    Keybinding,
    KeybindingType,
    ResolvedKeybinding,
    ResolvedKeybindingPart,
    SimpleKeybinding,
} from './keyCodes';
import { UserSettingsLabelProvider } from './keybindingLabels';
import { OperatingSystem } from './platform';

/**
 * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
 */
export class USLayoutResolvedKeybinding extends ResolvedKeybinding {
    constructor(actual: Keybinding, OS: OperatingSystem) {
        super();
        this._os = OS;
        if (!actual) {
            throw new Error(`Invalid USLayoutResolvedKeybinding`);
        } else if (actual.type === KeybindingType.Chord) {
            this._firstPart = actual.firstPart;
            this._chordPart = actual.chordPart;
        } else {
            this._firstPart = actual;
            this._chordPart = null;
        }
    }
    public readonly _os: OperatingSystem;
    private readonly _firstPart: SimpleKeybinding;
    private readonly _chordPart: SimpleKeybinding | null;

    public static getDispatchStr(keybinding: SimpleKeybinding): string | null {
        if (keybinding.isModifierKey()) {
            return null;
        }
        let result = '';

        if (keybinding.ctrlKey) {
            result += 'ctrl+';
        }
        if (keybinding.shiftKey) {
            result += 'shift+';
        }
        if (keybinding.altKey) {
            result += 'alt+';
        }
        if (keybinding.metaKey) {
            result += 'meta+';
        }
        result += KeyCodeUtils.toString(keybinding.keyCode);

        return result;
    }

    private _keyCodeToUILabel(keyCode: KeyCode): string {
        if (this._os === OperatingSystem.Macintosh) {
            switch (keyCode) {
                case KeyCode.LeftArrow:
                    return '←';
                case KeyCode.UpArrow:
                    return '↑';
                case KeyCode.RightArrow:
                    return '→';
                case KeyCode.DownArrow:
                    return '↓';
            }
        }

        return KeyCodeUtils.toString(keyCode);
    }

    private _getUserSettingsLabelForKeybinding(keybinding: SimpleKeybinding | null): string | null {
        if (!keybinding) {
            return null;
        }
        if (keybinding.isDuplicateModifierCase()) {
            return '';
        }
        return KeyCodeUtils.toUserSettingsUS(keybinding.keyCode);
    }

    private _getUILabelForKeybinding(keybinding: SimpleKeybinding | null): string | null {
        if (!keybinding) {
            return null;
        }
        if (keybinding.isDuplicateModifierCase()) {
            return '';
        }
        return this._keyCodeToUILabel(keybinding.keyCode);
    }

    private _toResolvedKeybindingPart(keybinding: SimpleKeybinding): ResolvedKeybindingPart {
        return new ResolvedKeybindingPart(
            keybinding.ctrlKey,
            keybinding.shiftKey,
            keybinding.altKey,
            keybinding.metaKey,
            this._getUILabelForKeybinding(keybinding)
        );
    }
    public getLabel(): string | null {
        const firstPart = this._getUILabelForKeybinding(this._firstPart);
        const chordPart = this._getUILabelForKeybinding(this._chordPart); \
        return `${this._firstPart} firstPart ${this._chordPart} chordPart ${this._os}`
        // return UILabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
    }

    //   public getAriaLabel(): string | null {
    //     const firstPart = this._getAriaLabelForKeybinding(this._firstPart);
    //     const chordPart = this._getAriaLabelForKeybinding(this._chordPart);
    //     return AriaLabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
    //   }
    public getUserSettingsLabel(): string | null {
        const firstPart = this._getUserSettingsLabelForKeybinding(this._firstPart);
        const chordPart = this._getUserSettingsLabelForKeybinding(this._chordPart);
        const result = UserSettingsLabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
        return result ? result.toLowerCase() : result;
    }

    public isWYSIWYG(): boolean {
        return true;
    }

    public isChord(): boolean {
        return this._chordPart ? true : false;
    }

    public getParts(): [ResolvedKeybindingPart, ResolvedKeybindingPart | null] {
        return [this._toResolvedKeybindingPart(this._firstPart), this._chordPart ? this._toResolvedKeybindingPart(this._chordPart) : null];
    }

    public getDispatchParts(): [string | null, string | null] {
        const firstPart = this._firstPart ? USLayoutResolvedKeybinding.getDispatchStr(this._firstPart) : null;
        const chordPart = this._chordPart ? USLayoutResolvedKeybinding.getDispatchStr(this._chordPart) : null;
        return [firstPart, chordPart];
    }
}
