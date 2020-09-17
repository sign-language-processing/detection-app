import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {SetSetting} from './settings.actions';

export type Hand = 'right' | 'left';

export interface SettingsStateModel {
  dominantHand: Hand;
  transmitAudio: boolean;
  receiveVideo: boolean;
}

const initialState: SettingsStateModel = {
  dominantHand: 'right',
  transmitAudio: true,
  receiveVideo: true
};

@Injectable()
@State<SettingsStateModel>({
  name: 'settings',
  defaults: initialState
})
export class SettingsState {
  @Action(SetSetting)
  setSetting({patchState}: StateContext<SettingsStateModel>, {setting, value}: SetSetting): void {
    patchState({[setting]: value});
  }
}
