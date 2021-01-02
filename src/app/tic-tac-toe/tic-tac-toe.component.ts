import { Component, OnInit } from '@angular/core';
import { GameResult, Square } from '../tic-tac-toe.interface';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
})
export class TicTacToeComponent implements OnInit {
  board: Square[][] = [];
  boardSize = 9;
  activeTurn: string;
  totalPlayedTurns = 0;
  isGameDraw: boolean;
  isGameOver: boolean;
  isWinner: boolean;
  gameResult: GameResult;
  xScanCounter = 0;
  oScanCounter = 0;
  maxCols: number;
  players = {
    x: 'X',
    o: 'O',
  };
  resultText = {
    win: 'Winner!',
    draw: 'Draw!',
  };
  strikePattern: string;

  constructor() {}

  ngOnInit(): void {
    this.createBoard();
  }

  private createBoard() {
    let squares = [];
    const boardSize = this.boardSize;
    const maxCols = Math.sqrt(boardSize);
    this.maxCols = maxCols;
    let square: Square = null;
    for (let i = 0; i < boardSize; i++) {
      const sqNo = i + 1;
      square = Object.assign({});
      square.sqNo = sqNo;
      square.state = null;
      square.chk = false;
      square.markPlaceholder = false;
      squares.push(square);
      if (sqNo % maxCols === 0) {
        this.board.push(Object.assign([], squares));
        squares = [];
      }
    }
    this.selectRandomTurn();
  }

  private selectRandomTurn() {
    const turns = Object.values(this.players);
    this.activeTurn = turns[Math.floor(Math.random() * turns.length)];
  }

  placeMark(square: Square) {
    if (square.chk) {
      return;
    }
    square.state = this.activeTurn;
    square.chk = true;
    this.totalPlayedTurns++;
    if (square.markPlaceholder) {
      square.markPlaceholder = false;
    }
    this.findWinner();
    this.isMatchDraw();
    this.switchTurns();
  }

  private findWinner() {
    if (this.isGameDraw || this.isGameOver) {
      return;
    }
    this.scanRowsOrCols('row');
    this.scanRowsOrCols('col');
    this.scanDiagonals();
  }

  private isMatchDraw() {
    if (
      !this.gameResult &&
      !this.isGameOver &&
      this.totalPlayedTurns === this.boardSize
    ) {
      this.isGameDraw = true;
      this.isGameOver = true;
      this.setGameResult(null, this.resultText.draw);
    }
  }

  private setGameResult(state: string, gameResult: string) {
    const result = {} as GameResult;
    result.state = state;
    result.result = gameResult;
    this.gameResult = result;
  }

  private switchTurns() {
    if (this.isGameOver || this.isGameDraw) {
      return;
    }
    this.activeTurn =
      this.activeTurn === this.players.x ? this.players.o : this.players.x;
  }

  private scanRowsOrCols(scan: string): boolean {
    const maxCols = this.maxCols;
    const board = this.board;
    let isGameWon = false;
    for (let i = 0; i < maxCols; i++) {
      const row = board[i];
      for (let j = 0; j < row.length; j++) {
        const state = scan === 'row' ? row[j].state : board[j][i].state;
        this.increamentScanCounters(state);
        isGameWon = this.isGameWon(state, scan + '-' + (i + 1));
        if (isGameWon) {
          break;
        }
      }
      if (isGameWon) {
        break;
      }
      this.resetScanCounters();
    }
    return isGameWon;
  }

  private scanDiagonals(): void {
    if (this.isGameOver) {
      return;
    }
    // Scan for backward diagonal
    const maxCols = this.maxCols;
    const board = this.board;
    let isGameWon = false;
    for (let i = 0; i < maxCols; i++) {
      const state = board[i][i].state;
      this.increamentScanCounters(state);
      isGameWon = this.isGameWon(state, 'diag-2');
    }
    this.resetScanCounters();
    if (!isGameWon) {
      // Scan for forward diagonal
      for (let i = 0, j = maxCols - 1; j >= 0; i++, j--) {
        const state = board[i][j].state;
        this.increamentScanCounters(state);
        this.isGameWon(state, 'diag-1');
      }
      this.resetScanCounters();
    }
  }

  private increamentScanCounters(state: string): void {
    if (!state) {
      return;
    }
    if (state === this.players.x) {
      this.xScanCounter++;
    } else if (state === this.players.o) {
      this.oScanCounter++;
    }
  }

  private isGameWon(state: string, strikePattern: string): boolean {
    if (!state) {
      return;
    }
    const players = this.players;
    let won = false;
    if (state === players.x && this.maxCols === this.xScanCounter) {
      won = true;
    } else if (state === this.players.o && this.maxCols === this.oScanCounter) {
      won = true;
    }
    if (won) {
      this.strikePattern = strikePattern;
      this.setGameResult(state, this.resultText.win);
      setTimeout(() => {
        this.strikePattern = null;
        this.isGameOver = true;
      }, 800);
      return true;
    }
    return false;
  }

  squareMouseEnter(square: Square) {
    if (square.chk) {
      return;
    }
    square.state = this.activeTurn;
    square.markPlaceholder = true;
  }

  squareMouseLeave(square: Square) {
    if (square.chk) {
      return;
    }
    square.state = null;
    square.markPlaceholder = false;
  }

  private resetScanCounters() {
    this.xScanCounter = 0;
    this.oScanCounter = 0;
  }

  resetBoard() {
    this.board.length = 0;
    this.totalPlayedTurns = 0;
    this.isGameOver = false;
    this.isGameDraw = false;
    this.gameResult = null;
    this.strikePattern = null;
    this.resetScanCounters();
    this.createBoard();
  }
}
