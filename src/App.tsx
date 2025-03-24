import React, { useState } from 'react';
import Board from './components/Board';
import './App.css';
import init, { Sudoku } from 'sudoku-solver'
import { Button, Paper } from '@mui/material';


const App = () => {
  const [sudokuInstance, setSudokuInstance] = useState<Sudoku | null>(null);
  const [board, setBoard] = useState<number[][]>([]);
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));

  const handleCellChange = (row: number, col: number, value: number) => {
    const newBoard = [...board];
    if (sudokuInstance) {
      newBoard[row][col] = value;
      errors[row][col] = false;
    }
    setBoard(newBoard);
  };

const handleValidate = () => {
    if (sudokuInstance) {
      const validationErrors: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));;

      // Validate the grid
      const solvedGrid = sudokuInstance.get_solved();
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cellValue = board[row][col];
          const isValid = cellValue === 0 || cellValue === solvedGrid[row][col];
          validationErrors[row][col] = !isValid; // Mark error for this cell
        }
      }
      setErrors(validationErrors); // Update error state
    }
  };

  const handleHint = () => {
    if (sudokuInstance) {
      const hint = sudokuInstance.get_hint(board);
      let [row, col, value]: number[] = hint
      // If the solver couldn't find a solution, there's an error on the board. Fix that first.
      if (row === -1) {
        handleValidate();
        return
      }

      const tempBoard = [...board]
      tempBoard[row][col] = value
      console.log(tempBoard)
      setBoard(tempBoard)
    }
  };

  React.useEffect(() => {
    // Wait for the WASM module to be loaded
    const loadWasm = async () => {
      try {
        await init();
      } catch (error) {
        console.error('Error loading WASM.')
      }
      const sudoku = new Sudoku();
      setSudokuInstance(sudoku);
      setBoard(sudoku.get_initial())
    };

    loadWasm();
  }, []);

  return (
    <div className="app"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#d2e0d3'
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexFlow: 'column',
          width: '50vh',
          height: '50vh',
          margin: 'auto auto 20px auto',
          padding: '20px',
        }}
      >
        <Board
          board={board}
          onChange={handleCellChange}
          initialBoard={sudokuInstance?.get_initial()}
          errors={errors}
        />
      </Paper>
      <Paper
        sx={{
          display: 'flex',
          flexFlow: 'column',
          width: '50vh',
          margin: '20px auto auto auto',
          padding: '20px',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleValidate}
          style={{
            marginTop: '10px'
          }}
        >
          Highlight errors
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleHint}
          style={{
            marginTop: '10px'
          }}
        >
          Hint
        </Button>
      </Paper>
    </div>
  );
};

export default App;