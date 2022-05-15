import { createContext, useContext } from 'react';
import type { Position } from '../types';

export interface RangePosition {
  enabled: boolean;
  begin: Position;
  end: Position;
}

export const ConstRangePosition: RangePosition = {
  enabled: true,
  begin: { idx: -1, rowIdx: -1 },
  end: { idx: -1, rowIdx: -1 }
};

const RangeSelectionContext = createContext<RangePosition>(ConstRangePosition);

export const RangeSelectionProvider = RangeSelectionContext.Provider;

export function useRangeSelection(): [boolean, (pos: Position) => boolean] {
  const { enabled, begin, end } = useContext(RangeSelectionContext);

  function rangeFn(pos: Position) {
    return (
      isInRange(begin.idx, end.idx, pos.idx) && isInRange(begin.rowIdx, end.rowIdx, pos.rowIdx)
    );
  }

  function isInRange(r1: number, r2: number, target: number) {
    if (r1 === -1 || r2 === -1) return false;
    if (r1 === target || r2 === target) return true;
    if (r1 < r2) {
      if (target > r1 && target < r2) return true;
    } else if (target > r2 && target < r1) return true;
    return false;
  }

  return [enabled, rangeFn] as [boolean, (pos: Position) => boolean];
}
