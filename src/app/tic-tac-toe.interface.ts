export interface Square {
  state: string;
  sqNo: number;
  chk: boolean;
  markPlaceholder: boolean;
}

export interface GameResult {
  state: string;
  result: string;
  strikePattern: string;
}
