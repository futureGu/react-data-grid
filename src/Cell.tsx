import { memo } from 'react';
import { css } from '@linaria/core';

import { getCellStyle, getCellClassname, isCellEditable, MouseStateUtils } from './utils';
import type { CellRendererProps } from './types';
import { useRovingCellRef } from './hooks';

const cellCopied = css`
  background-color: #ccccff;
`;

const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;

const cellDraggedOver = css`
  background-color: #ccccff;

  &.${cellCopied} {
    background-color: #9999ff;
  }
`;

const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;

const cellRanged = css`
  background-color: #4e8098;
`;

const cellRangedClassname = `rdg-cell-ranged ${cellRanged}`;

function Cell<R, SR>({
  column,
  colSpan,
  isCellSelected,
  isCopied,
  isDraggedOver,
  isRanged,
  enableRangeSelect,
  row,
  rowIdx,
  dragHandle,
  onRowClick,
  onRowDoubleClick,
  onRowChange,
  onRangeSelecting,
  onRangeChanging,
  selectCell,
  ...props
}: CellRendererProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);
  const { cellClass } = column;
  const className = getCellClassname(
    column,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver,
      [cellRangedClassname]: !isCellSelected && isRanged
    },
    typeof cellClass === 'function' ? cellClass(row) : cellClass
  );

  function selectCellWrapper(openEditor?: boolean | null) {
    selectCell(row, column, openEditor);
  }

  function handleClick() {
    selectCellWrapper(column.editorOptions?.editOnClick);
    onRowClick?.(row, column);
  }

  function handleContextMenu() {
    selectCellWrapper();
  }

  function handleDoubleClick() {
    selectCellWrapper(true);
    onRowDoubleClick?.(row, column);
  }

  function handleMouseDown() {
    if (enableRangeSelect) {
      selectCellWrapper();
      MouseStateUtils.setMouseState(true);
      onRangeSelecting?.({ idx: column.idx, rowIdx });
    }
  }

  function handleMouseOver() {
    if (enableRangeSelect && MouseStateUtils.getMouseState()) {
      onRangeChanging?.({ idx: column.idx, rowIdx });
    }
  }

  function handleMouseUp() {
    MouseStateUtils.setMouseState(false);
  }

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      aria-selected={isCellSelected}
      aria-colspan={colSpan}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={ref}
      tabIndex={tabIndex}
      className={className}
      style={getCellStyle(column, colSpan)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onFocus={onFocus}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {!column.rowGroup && (
        <>
          <column.formatter
            column={column}
            row={row}
            isCellSelected={isCellSelected}
            onRowChange={onRowChange}
          />
          {dragHandle}
        </>
      )}
    </div>
  );
}

export default memo(Cell) as <R, SR>(props: CellRendererProps<R, SR>) => JSX.Element;
