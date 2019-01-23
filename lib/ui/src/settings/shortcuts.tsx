import React, { Component, SyntheticEvent } from 'react';
import { Icons, Typography } from '@storybook/components';
import { Router } from "@reach/router";
import * as platform from './keyboard/common/platform';
import { setAll, setItem } from './persist';
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
import { USLayoutResolvedKeybinding } from './keyboard/common/usLayoutResolvedKeybinding';

import {
  Button,
  ColWrapper,
  Container,
  Description,
  Footer,
  GridHeaderRow,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  HotKeyWrapper,
  KeyInputWrapper,
  Main,
  Row,
  SuccessIcon,
  TextInput,
  Title,
  TitleText,
  Wrapper,
} from '@storybook/ui/src/settings/keyboardComponents';
import { Event, Emitter } from './keyboard/common/event';
import {Keybinding, KeyCode, ResolvedKeybinding,createKeybinding, SimpleKeybinding } from './keyboard/common/keyCodes';
// import { CachedKeyboardMapper } from './keyboard/common/keyboardMapper';
// import { ScanCodeBinding } from './keyboard/common/scanCode';
import { MacLinuxFallbackKeyboardMapper } from './keyboard/common/macLinuxFallbackKeyboardMapper';
import { IMacLinuxKeyboardMapping, MacLinuxKeyboardMapper, macLinuxKeyboardMappingEquals } from './keyboard/common/macLinuxKeyboardMapper';
import { IWindowsKeyboardMapping, WindowsKeyboardMapper, windowsKeyboardMappingEquals } from './keyboard/common/windowsKeyboardMapper';
import { IKeybindingEvent, IKeybindingService, IKeyboardEvent } from './keyboard/common/keybinding';
import { StandardKeyboardEvent } from './keyboard/common/keyboardEvent';
import { IKeyboardMapper, ShortcutsState } from './models';

// // import { DefineKeybindingWidget, KeybindingsSearchWidget, KeybindingsSearchOptions } from 'vs/workbench/parts/preferences/browser/keybindingWidgets';
// // import { Disposable, dispose, toDisposable, IDisposable } from './keyboard/common/lifecycle';

// // import { IKeybindingItemEntry, IListEntry, KEYBINDING_ENTRY_TEMPLATE_ID } from './keyboard/keybindingsEditorModel';

class ShortcutsPage extends Component<{}, ShortcutsState>{

  private _actual: IKeyboardMapper;
  private _firstPart: ResolvedKeybinding|null;
  private _chordPart: ResolvedKeybinding|null;


  constructor(actual: IKeyboardMapper) {
    super({});
    console.log('IT LIVES');
    const shortcuts = initShortcutKeys();
    this._actual = actual;
    // console.log('this.actual: ', actual);

    this.state = {
      activeInputField: '',
      inputArr: [],
      shortcutKeys: serializedShortcutkeys(shortcuts),
      successField: '',
      _firstPart: null,
      _chordPart: null,
    };
  }


  public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		let keybinding = new SimpleKeybinding(
			keyboardEvent.ctrlKey,
			keyboardEvent.shiftKey,
			keyboardEvent.altKey,
			keyboardEvent.metaKey,
			keyboardEvent.keyCode
		);
		return new USLayoutResolvedKeybinding(keybinding, platform.OS);
	}

      printKeybinding = (keyboardEvent: IKeyboardEvent): void => {
        console.log('in print keybinding keyboardEvent', keyboardEvent)
      const keybinding = this.resolveKeyboardEvent(keyboardEvent);
      console.log('keybinding: ', keybinding);
      
      const info = `code: ${keyboardEvent.code}, keyCode: ${keyboardEvent.keyCode}, key: ${
        keyboardEvent.key
      } => UI: not implemented, user settings: ${keybinding.getUserSettingsLabel()}, dispatch: ${
        keybinding.getDispatchParts()[0]
      }`;
      // const options = this.options as KeybindingsSearchOptions;

      const hasFirstPart = this._firstPart && this._firstPart.getDispatchParts()[0] !== null;
      const hasChordPart = this._chordPart && this._chordPart.getDispatchParts()[0] !== null;
      if (hasFirstPart && hasChordPart) {
        // Reset
        this._firstPart = keybinding;
        this._chordPart = null;
      } else if (!hasFirstPart) {
        this._firstPart = keybinding;
      } else {
        this._chordPart = keybinding;
      }

      let value = '';
      if (this._firstPart) {
        value = this._firstPart.getUserSettingsLabel();
      }
      if (this._chordPart) {
        value = value + ' ' + this._chordPart.getUserSettingsLabel();
      }
      // this.setInputValue(options.quoteRecordedKeys ? `"${value}"` : value);

      this._onKeybinding.fire([this._firstPart, this._chordPart]);
    }

  duplicateFound = (): boolean => {
    // const { activeInputField, inputArr, shortcutKeys } = this.state;
    // const match = Object.entries(shortcutKeys).filter(i => i[0] !== activeInputField && isShortcutTaken(inputArr, i[1].value));

    // return !!match.length;
    return true;
  }

  submitKeyHandler = (): void => {
    const { inputArr, shortcutKeys, activeInputField } = this.state;
    if (inputArr.length === 0 || shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault();
    }
    return undefined;
  }

  handleBackspace = () => {
    const { shortcutKeys, activeInputField } = this.state;
    this.setState(state => {
      const updatedArray = state.inputArr;
      updatedArray.splice(-1);
      return {
        inputArr: updatedArray,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: updatedArray, error: false },
        },
      };
    });
  }

  // activeKeybindingEntry = (): string => {
  // //   return this.state.activeInputField
  //   const focusedElement = this.state.activeInputField;
  // //   // set what field is active
  //   return focusedElement
  // }

  // defineKeybinding(keybindingEntry: string): Promise<any> {
  //   return this.define().then(key => {
  //     console.log('key', key);
  //   });
  // }



  onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const evt = new StandardKeyboardEvent(e);

    if (e.key === 'Backspace') {
      return this.handleBackspace();
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      return this.submitKeyHandler();
    }

    const { shortcutKeys, activeInputField } = this.state;
    const parsedKey = keyToSymbol(parseKey(e)[0]);

    this.printKeybinding(evt);
    return this.setState(state => {
      const lengthTooLong = [...state.inputArr, parsedKey].length > 3;
      const newValue = state.inputArr.length < 3 ? [...state.inputArr, parsedKey] : state.inputArr;
      return {
        inputArr: newValue,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: newValue, error: lengthTooLong },
        },
      };
    });
  }

  onFocus = (focusedInput: string) => (): void => {
    const { shortcutKeys } = this.state;

    this.setState({
      activeInputField: focusedInput,
      inputArr: [],
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { value: [], error: false } },
    });
  }

  onBlur = () => {
    const { shortcutKeys, inputArr, activeInputField } = this.state;

    if (shortcutKeys[activeInputField] && shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault();
    }
    if (this.duplicateFound()) {
      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputArr, error: true } },
      });
    }
    return this.saveShortcut();
  }

  // protected _register<T extends IDisposable>(t: T): T {
  // if (this._lifecycle_disposable_isDisposed) {
  //   console.warn('Registering disposable on object that has already been disposed.');
  //   t.dispose();
  // } else {
  //   this._toDispose.push(t);
  // }

  // return t;
  // }

  saveShortcut = (): void => {
    const { activeInputField, inputArr, shortcutKeys } = this.state;

    this.setState({
      successField: activeInputField,
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputArr, error: false } },
    });
    return setItem('shortcutKeys', activeInputField, inputArr);
  }

  restoreDefaults = (): void => {
    this.setState({ shortcutKeys: defaultShortcutSets });
    return setAll('shortcutKeys', serializableKeyboardShortcuts);
  }

  restoreDefault = (): void => {
    const { activeInputField, shortcutKeys } = this.state;

    this.setState({
      inputArr: defaultShortcutSets[activeInputField].value,
      shortcutKeys: {
        ...shortcutKeys,
        [activeInputField]: defaultShortcutSets[activeInputField],
      },
    });
    return setItem('shortcutKeys', activeInputField, serializableKeyboardShortcuts[activeInputField]);
  }

  displaySuccessMessage = (activeElement: string): string => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false ? 'success' : '';
  }

  displayError = (activeElement: string): string => {
    const { activeInputField, shortcutKeys } = this.state;
    return activeElement === activeInputField && shortcutKeys[activeElement].error === true ? 'error' : '';
    return '';
  }

  private getUserSettingsLabel(): string {
    let label = null;
    if (this._firstPart) {
      label = this._firstPart.getUserSettingsLabel();
      if (this._chordPart) {
        label = label + ' ' + this._chordPart.getUserSettingsLabel();
      }
    }
    return label;
  }

  renderKeyInput = () => {
    const { shortcutKeys } = this.state;
    return Object.entries(shortcutKeys).map((shortcut, i) => {
      const transformedKeyStr = shortcut[1].value.length ? mapToKeyEl(shortcut[1].value).join('') : '';
          return (
            <Row key={`${shortcut[0]}`}>
              <Description>{`${labelsArr[i]}`}</Description>
              <KeyInputWrapper>
                <HotKeyWrapper>
                  <TextInput
                    spellCheck="false"
                    colorTheme={this.displayError(shortcut[0])}
                    className="modalInput"
                    onBlur={this.onBlur}
                    onFocus={this.onFocus(shortcut[0])}
                    onKeyDown={this.onKeyDown}
                    value={transformedKeyStr}
                  /> 
                </HotKeyWrapper>
              </KeyInputWrapper>
              <SuccessIcon colorTheme={this.displaySuccessMessage(shortcut[0])}>
                <Icons height={20} icon="check" />
              </SuccessIcon>
            </Row>
      );
    });
  }

  renderKeyForm = () => (
    <GridWrapper>
      <GridHeaderRow>
        <HeaderItem>Commands</HeaderItem>
        <HeaderItem>Shortcut</HeaderItem>
      </GridHeaderRow>
      {this.renderKeyInput()}
    </GridWrapper>
  )


  render() {
    const layout = this.renderKeyForm();

    return (
      <Container>
          <Wrapper>
            <Title>
              <TitleText>Keyboard Shortcuts</TitleText>
            </Title>
          </Wrapper>
          <ColWrapper>
            <Main>
              <Heading>
                <Header>
                  <Button id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                    Restore Defaults
                  </Button>
                </Header>
              </Heading>
              {layout}
            </Main>
          </ColWrapper>
          <Wrapper>
            <Footer>
            <Typography.Link href="https://storybook.js.org">Storybook docs</Typography.Link>
          <Typography.Link href="https://github.com/storybooks/storybook">GitHub</Typography.Link>
          <Typography.Link href="https://storybook.js.org/support">Support</Typography.Link>
            </Footer>
          </Wrapper>
        </Container>
    );
  }
}

export default ShortcutsPage;
