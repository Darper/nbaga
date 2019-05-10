export interface ITeamPercentages {
  [key: string]: number;
}

export interface IWins {
  [key: number]: ITeamPercentages;
}

export interface IPlayer {
  name: string;
  age: number;
  g: number;
  mp: number;
  tsp: number;
  tpar: number;
  ftr: number;
  orbp: number;
  drbp: number;
  trbp: number;
  astp: number;
  stlp: number;
  blkp: number;
  tovp: number;
  usgp: number;
}

export interface ITeam {
  [key: string]: Array<IPlayer>;
}

export interface IAllStats {
  [key: number]: ITeam;
}
