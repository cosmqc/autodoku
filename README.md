# Autodoku

Autodoku is a Sudoku app with hint functionality, built with WASM, Rust, React, and Typescript.

It uses the `sudoku` crate for generation and strategy, and `serde` for serialization (among others).

## Features
- Error highlighting
- Related cell (row, column, house) highlighting
- Hints
- Win effects (with sound!!)

## Building
- If you haven't already, [install wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- Clone my repository (`git clone https://github.com/cosmqc/autodoku`)
- Navigate to autodoku/wasm/sudoku-solver
- Run `wasm-pack build --target web`
- Run `npm install`
- Run `npm start`
- If the project doesn't auto-open, navigate to http://localhost:3000
