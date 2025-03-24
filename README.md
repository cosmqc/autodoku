# Autodoku

Autodoku is a Rust-based Sudoku app with built-in hint functionality.
It uses the sudoku crate for generation and strategy, and serde for serialization (among others).

## Features
- Error highlighting
- Related cell (row, column, house) highlighting
- Hints
- Win effects

## Building
- If you haven't already, [install wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- Navigate to wasm/sudoku-solver
- Run `wasm-pack build --target web`
- Navigate to the project root
- Run `npm start`