import { Request, Response, Router } from "express";
import { winsArray, allStats } from "../common/data";
import { IPlayer } from "../common/interfaces";
import { operators, columns, populationSize } from "../common/variables";

const router: Router = Router();

interface IPopulation [
    
]

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function newTree(player: { [index: string]: IPlayer }): string {
  const numberOrOperator = Math.floor(Math.random() * 100);
  if (numberOrOperator < 52) {
    const randomAttributeIndex = getRandomArbitrary(0, columns.length);
    const randomAttribute = columns[randomAttributeIndex];
    const playerAttributeValue = player[randomAttribute];
    return playerAttributeValue.toString();
  } else {
    if (numberOrOperator < 64) {
      return newTree(player) + " + " + newTree(player);
    } else if (numberOrOperator < 76) {
      return newTree(player) + " - " + newTree(player);
    } else if (numberOrOperator < 88) {
      return newTree(player) + " * " + newTree(player);
    } else {
      return newTree(player) + " / " + newTree(player);
    }
  }
}

function calculateWins(roster: any, fitness: any): number {
  let cumulativeValue = 0;
  roster.map((player: IPlayer) => {
    const playerEquation = fitness(player);
    const playerValue = eval(playerEquation);
    cumulativeValue = cumulativeValue + playerValue;
  });
  return cumulativeValue;
}

function createPopulation(): IPopulation {
  return function(player: { [index: string]: IPlayer }): string {
    let num: number = 0;
    let i: number;
    let population = [];
    for (i = num; i < populationSize; i++) {
      population.push(newTree(player));
    }
    return population;
  };
}

export function getAlgorithmResults(req: Request, res: Response) {
  const winPercent = winsArray[2018]["MIN"];
  const roster = allStats[2018]["MIN"];
  const fitnessFunction = createPopulation();
  const wins = calculateWins(roster, fitnessFunction);
  res.send({ express: wins });
}

router.get("/algorithm/", getAlgorithmResults);

export const algorithm: Router = router;
