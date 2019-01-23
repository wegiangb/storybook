
// import { CachedKeyboardMapper, IKeyboardMapper } from './keyboardMapper';
// import { Emitter, Event } from './event';
// import { MacLinuxFallbackKeyboardMapper } from './macLinuxFallbackKeyboardMapper';
// import { OS, OperatingSystem } from './platform';
// import { IMacLinuxKeyboardMapping, MacLinuxKeyboardMapper, macLinuxKeyboardMappingEquals } from './macLinuxKeyboardMapper';
// import { IWindowsKeyboardMapping, WindowsKeyboardMapper, windowsKeyboardMappingEquals } from './windowsKeyboardMapper';

// export const enum DispatchConfig {
//     Code,
//     KeyCode,
// }

// export class KeyboardMapperFactory {
//     public static readonly INSTANCE = new KeyboardMapperFactory();

//     private _keyboardMapper: IKeyboardMapper | null;
//     private _initialized: boolean;

//     private readonly _onDidChangeKeyboardMapper = new Emitter<void>();
//     public readonly onDidChangeKeyboardMapper: Event<void> = this._onDidChangeKeyboardMapper.event;

//     private constructor() {
//         this._layoutInfo = null;
//         this._rawMapping = null;
//         this._keyboardMapper = null;
//         this._initialized = false;
//     }

//     private static _createKeyboardMapper(
//         layoutInfo: nativeKeymap.IKeyboardLayoutInfo,
//         rawMapping: nativeKeymap.IKeyboardMapping
//     ): IKeyboardMapper {
//         const isUSStandard = KeyboardMapperFactory._isUSStandard(layoutInfo);

//         if (OS === OperatingSystem.Windows) {
//             return new WindowsKeyboardMapper(isUSStandard, <IWindowsKeyboardMapping>(<unknown>rawMapping));
//         }

//         if (Object.keys(rawMapping).length === 0) {
//             // Looks like reading the mappings failed (most likely Mac + Japanese/Chinese keyboard layouts)
//             return new MacLinuxFallbackKeyboardMapper(OS);
//         }

//         if (OS === OperatingSystem.Macintosh) {
//             const kbInfo = <nativeKeymap.IMacKeyboardLayoutInfo>layoutInfo;
//             if (kbInfo.id === 'com.apple.keylayout.DVORAK-QWERTYCMD') {
//                 // Use keyCode based dispatching for DVORAK - QWERTY ⌘
//                 return new MacLinuxFallbackKeyboardMapper(OS);
//             }
//         }

//         return new MacLinuxKeyboardMapper(isUSStandard, <IMacLinuxKeyboardMapping>(<unknown>rawMapping), OS);
//     }

//     private static _equals(a: nativeKeymap.IKeyboardMapping | null, b: nativeKeymap.IKeyboardMapping | null): boolean {
//         if (OS === OperatingSystem.Windows) {
//             return windowsKeyboardMappingEquals(<IWindowsKeyboardMapping>(<unknown>a), <IWindowsKeyboardMapping>(<unknown>b));
//         }

//         return macLinuxKeyboardMappingEquals(<IMacLinuxKeyboardMapping>(<unknown>a), <IMacLinuxKeyboardMapping>(<unknown>b));
//     }

//     private static _isUSStandard(_kbInfo: nativeKeymap.IKeyboardLayoutInfo): boolean {
//         if (OS === OperatingSystem.Linux) {
//             const kbInfo = <nativeKeymap.ILinuxKeyboardLayoutInfo>_kbInfo;
//             return kbInfo && kbInfo.layout === 'us';
//         }

//         if (OS === OperatingSystem.Macintosh) {
//             const kbInfo = <nativeKeymap.IMacKeyboardLayoutInfo>_kbInfo;
//             return kbInfo && kbInfo.id === 'com.apple.keylayout.US';
//         }

//         if (OS === OperatingSystem.Windows) {
//             const kbInfo = <nativeKeymap.IWindowsKeyboardLayoutInfo>_kbInfo;
//             return kbInfo && kbInfo.name === '00000409';
//         }

//         return false;
//     }

//     public _onKeyboardLayoutChanged(): void {
//         if (this._initialized) {
//             this._setKeyboardData(nativeKeymap.getCurrentKeyboardLayout(), nativeKeymap.getKeyMap());
//         }
//     }

//     public getKeyboardMapper(dispatchConfig: DispatchConfig): IKeyboardMapper {
//         if (!this._initialized) {
//             this._setKeyboardData(nativeKeymap.getCurrentKeyboardLayout(), nativeKeymap.getKeyMap());
//         }

//         if (dispatchConfig === DispatchConfig.KeyCode) {
//             // Forcefully set to use keyCode
//             return new MacLinuxFallbackKeyboardMapper(OS);
//         }

//         return this._keyboardMapper;
//     }

//     public getCurrentKeyboardLayout(): nativeKeymap.IKeyboardLayoutInfo | null {
//         if (!this._initialized) {
//             this._setKeyboardData(nativeKeymap.getCurrentKeyboardLayout(), nativeKeymap.getKeyMap());
//         }
//         return this._layoutInfo;
//     }

//     public getRawKeyboardMapping(): nativeKeymap.IKeyboardMapping | null {
//         if (!this._initialized) {
//             this._setKeyboardData(nativeKeymap.getCurrentKeyboardLayout(), nativeKeymap.getKeyMap());
//         }
//         return this._rawMapping;
//     }

//     private _setKeyboardData(layoutInfo: nativeKeymap.IKeyboardLayoutInfo, rawMapping: nativeKeymap.IKeyboardMapping): void {
//         this._layoutInfo = layoutInfo;

//         if (this._initialized && KeyboardMapperFactory._equals(this._rawMapping, rawMapping)) {
//             // nothing to do...
//             return;
//         }
//         this._initialized = true;
//         this._rawMapping = rawMapping;
//         this._keyboardMapper = new CachedKeyboardMapper(KeyboardMapperFactory._createKeyboardMapper(this._layoutInfo, this._rawMapping));
//         this._onDidChangeKeyboardMapper.fire();
//     }
// }
