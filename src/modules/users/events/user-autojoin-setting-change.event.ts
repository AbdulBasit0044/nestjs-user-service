export class UserAutojoinSettingChangeEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly oldAutojoinSetting: string,
    public readonly newAutojoinSetting: string
  ) {}
}
