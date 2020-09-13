export class SetSetting {
  static readonly type = '[Settings] Set Setting';
  static readonly eventParams = ['setting', 'value'];

  constructor(public setting: string, public value: any) {
  }
}
