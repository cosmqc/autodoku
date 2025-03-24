import React, { useState } from "react";
import Cell from "./Cell";
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material'

interface BoardProps {
  board: number[][];
  initialBoard: number[][];
  errors: boolean[][];
  onChange?: (rowIndex: number, colIndex: number, newValue: number) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  initialBoard,
  errors,
  onChange
}) => {
  const [selectedCell, setSelectedCell] = useState<number[] | null>(null)

  if (!errors) {
    errors = Array(9).fill(null).map(() => Array(9).fill(false));
  }

  const handleChange = (rowIndex: number, colIndex: number, newValue: string): void => {
    // Restrict input to numbers 1-9 or empty
    if (newValue === '' || (/^[1-9]$/.test(newValue))) {
      if (onChange) {
        onChange(rowIndex, colIndex, newValue === '' ? 0 : parseInt(newValue, 10));
      }
    }
  };

  // Check if the cell is part of the initial board
  const isInitialCell = (rowIndex: number, colIndex: number): boolean => {
    return !!initialBoard && initialBoard[rowIndex][colIndex] !== 0;
  };

  // Check if cell has the same value as the selected cell
  const hasSameValue = (rowIndex: number, colIndex: number): boolean => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;
    const selectedValue = board[selectedRow][selectedCol];
    return selectedValue !== 0 && selectedValue === board[rowIndex][colIndex];
  };

  // Check if cell is in the same row, column, or 3x3 box as the selected cell
  const isHighlighted = (rowIndex: number, colIndex: number): boolean => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;

    // Same row or column
    if (selectedRow === rowIndex || selectedCol === colIndex) return true;

    // Same 3x3 box
    const boxRow = Math.floor(selectedRow / 3);
    const boxCol = Math.floor(selectedCol / 3);
    const cellBoxRow = Math.floor(rowIndex / 3);
    const cellBoxCol = Math.floor(colIndex / 3);

    return boxRow === cellBoxRow && boxCol === cellBoxCol;
  };

  const isSelected = (rowIndex: number, colIndex: number): boolean => {
    if (selectedCell) {
      return rowIndex === selectedCell[0] && colIndex === selectedCell[1]
    }
    return false;
  }

  return (
    <Box
      display="grid"
      justifyContent="center"
      alignItems="center"
      width={'100%'}
      height={'100%'}
      sx={{
        border: '2px solid #000',
        backgroundColor: '#f0f0f0',
        boxSizing: 'border-box'
      }}>
      <Grid container spacing={0} columns={9} width={'100%'} height={'100%'}>
        {board.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cellValue, colIndex) => {
              const hasError = errors[rowIndex][colIndex];
              const isInitial = isInitialCell(rowIndex, colIndex);
              const sameValue = hasSameValue(rowIndex, colIndex);
              const highlight = isHighlighted(rowIndex, colIndex);
              const selected = isSelected(rowIndex, colIndex);

              const borderRight = (colIndex + 1) % 3 === 0 && colIndex < 8 ? '2px solid #000' : '';
              const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? '2px solid #000' : '';

              return (
                <Grid key={`cell-${rowIndex}-${colIndex}`} xs={1} sx={{ padding: 0 }}>
                  <Cell
                    value={cellValue}
                    isInitial={isInitial}
                    hasError={hasError}
                    sameValue={sameValue}
                    highlight={highlight}
                    onTextFieldChange={(newValue) => handleChange(rowIndex, colIndex, newValue)}
                    borderRight={borderRight}
                    borderBottom={borderBottom}
                    isSelectedCell={selected}
                    setSelectedCell={() => setSelectedCell([rowIndex, colIndex])}
                  />
                </Grid>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Board;
