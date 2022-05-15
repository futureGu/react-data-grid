export function useMouseState(state: boolean): [boolean, (isPressed: boolean) => void] {
  let nState = state;

  function change(isPressed: boolean) {
    nState = isPressed;
  }

  return [nState, change];
}
