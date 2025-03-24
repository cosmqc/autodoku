import React, { useState, useRef } from 'react';
import Board from './components/Board';
import './App.css';
import init, { Sudoku } from 'sudoku-solver'
import { Button, Paper } from '@mui/material';
import { Fireworks } from '@fireworks-js/react';
import type { FireworksHandlers } from '@fireworks-js/react';

const App = () => {
  const [sudokuInstance, setSudokuInstance] = useState<Sudoku | null>(null);
  const [board, setBoard] = useState<number[][]>([]);
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));

  const [isWinScreen, setIsWinScreen] = useState<boolean>(false);
  const fireworksRef = useRef<FireworksHandlers>(null);

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
      setBoard(tempBoard)
    }
  };

  const handlePlayAgain = () => {
    const sudoku = new Sudoku();
    setSudokuInstance(sudoku);
    setBoard(sudoku.get_initial());
    stopFireworks();
    setIsWinScreen(false);
  }

  const toggleFireworks = () => {
    if (!fireworksRef.current) return
    if (fireworksRef.current.isRunning) {
      fireworksRef.current.waitStop()
    } else {
      fireworksRef.current.start()
    }
  }

  const stopFireworks = () => {
    if (!fireworksRef.current) return
    fireworksRef.current.waitStop();
  }

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
    stopFireworks();
  }, []);

  React.useEffect(() => {
    if (sudokuInstance) {
      let solved: number[][] = sudokuInstance.get_solved()
      if (JSON.stringify(solved) === JSON.stringify(board)) {
        console.log('solved!!')
        triggerWin();
      }
    }
  }, [board]);

  const triggerWin = () => {
    setIsWinScreen(true);
    toggleFireworks();
  }

  return (
    <div className="app"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#d2e0d3',
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
          zIndex: 2
        }}
      >
        <Board
          board={board}
          onChange={handleCellChange}
          initialBoard={sudokuInstance?.get_initial()}
          errors={errors}
        />
      </Paper>
      {isWinScreen ?
        <Paper
        sx={{
          display: 'flex',
          flexFlow: 'column',
          width: '50vh',
          margin: '20px auto auto auto',
          padding: '20px',
          zIndex: 2
        }}
      >
        <Button
          variant="contained"
          onClick={handlePlayAgain}
          style={{
            marginTop: '10px',
            backgroundColor: '#9ea1d4'
          }}
        >
          New Sudoku
        </Button>
        <Button
          variant="contained"
          onClick={toggleFireworks}
          style={{
            marginTop: '10px',
            backgroundColor: '#9ea1d4'
          }}
        >
          Toggle Fireworks
        </Button>
      </Paper>
        :
        <Paper
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: '50vh',
            margin: '20px auto auto auto',
            padding: '20px',
            zIndex: 2
          }}
        >
          <Button
            variant="contained"
            onClick={handleValidate}
            style={{
              marginTop: '10px',
              backgroundColor: '#9ea1d4'
            }}
          >
            Highlight errors
          </Button>
          <Button
            variant="contained"
            onClick={handleHint}
            style={{
              marginTop: '10px',
              backgroundColor: '#9ea1d4'
            }}
          >
            Hint
          </Button>
        </Paper>
      }
      <div
        style={{ display: 'flex', gap: '4px', position: 'absolute', zIndex: 1 }}
      >
        <Fireworks
          ref={fireworksRef}
          options={{ sound: { enabled: true }, opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
        />
      </div>
    </div>
  );
};

export default App;