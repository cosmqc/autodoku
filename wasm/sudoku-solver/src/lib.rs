mod utils;

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use sudoku::Sudoku as RustSudoku;
use sudoku::strategy::{StrategySolver, Strategy};
use sudoku::strategy::deduction::{Deduction};
use log::info;
use wasm_bindgen::prelude::*;
use console_log;

#[wasm_bindgen(start)]
pub fn main_js() {
    console_log::init_with_level(log::Level::Info).expect("error initializing logger");
    info!("Wasm logger initialized!");
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Sudoku {
    initial_grid: [[u8; 9]; 9],
    solved_grid: [[u8; 9]; 9],
}

#[wasm_bindgen]
impl Sudoku {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Sudoku {
        let sudoku = RustSudoku::generate();
        let initial_grid = sudoku.to_bytes();
        let solved_grid = sudoku.some_solution().unwrap().to_bytes();
        Sudoku { 
            initial_grid: convert_to_2d_array(initial_grid),
            solved_grid: convert_to_2d_array(solved_grid)
        }
    }

    pub fn get_initial(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.initial_grid).unwrap()
    }

    pub fn get_solved(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.solved_grid).unwrap()
    }

    pub fn validate_grid(&self, js_grid: JsValue) -> JsValue {
        let grid: [[u8; 9]; 9] = serde_wasm_bindgen::from_value(js_grid).unwrap();
        
        let mut result = [[false; 9]; 9];
        for i in 0..9 {
            for j in 0..9 {
                result[i][j] = (grid[i][j] == 0) || (grid[i][j] == self.solved_grid[i][j]);
            }
        }
        serde_wasm_bindgen::to_value(&result).unwrap()
    }

    pub fn get_hint(&self, js_grid: JsValue) -> JsValue {
        let grid: [[u8; 9]; 9] = serde_wasm_bindgen::from_value(js_grid).unwrap();
        let array = convert_from_2d_array(grid);
        let solver = StrategySolver::from_sudoku(
            RustSudoku::from_bytes(array).expect("Failed to convert array to Sudoku")
        );
        let result = solver.solve(&[Strategy::NakedSingles, Strategy::HiddenSingles]);
        let deductions = match result {
            Ok((_, deductions)) | Err((_, deductions)) => deductions,
        };
        if let Some(first_deduction) = deductions.get(0) {
            match first_deduction {
                Deduction::NakedSingles(candidate) => {
                    let row = candidate.row().get();
                    let col = candidate.col().get();
                    let value = candidate.digit.get();
                    return serde_wasm_bindgen::to_value(&[row, col, value]).unwrap();
                }

                Deduction::HiddenSingles(candidate, _) => {
                    let row = candidate.row().get();
                    let col = candidate.col().get();
                    let value = candidate.digit.get();
                    return serde_wasm_bindgen::to_value(&[row, col, value]).unwrap();
                }

                _ => return serde_wasm_bindgen::to_value(&[-1, -1, -1]).unwrap(),
            };
        }

        serde_wasm_bindgen::to_value(&[-1, -1, -1]).unwrap()
    }
}

fn convert_to_2d_array(grid: [u8; 81]) -> [[u8; 9]; 9] {
    let mut result = [[0; 9]; 9];
    for (i, row) in grid.chunks(9).enumerate() {
        result[i].copy_from_slice(row);
    }
    result
}

fn convert_from_2d_array(grid: [[u8; 9]; 9]) -> [u8; 81] {
    let mut result = [0; 81];
    for (i, row) in grid.iter().enumerate() {
        result[i * 9..(i + 1) * 9].copy_from_slice(row);
    }
    result
}