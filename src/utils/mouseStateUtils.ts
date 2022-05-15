// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MouseStateUtils {
  private static _isPressed = false;

  private constructor() {}

  public static setMouseState(isPressed: boolean) {
    this._isPressed = isPressed;
  }

  public static getMouseState() {
    return this._isPressed;
  }
}
