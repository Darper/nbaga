import { Request, Response, Router } from "express";
import { winsArray, allStats } from "../common/data";
import { IPlayer } from "../common/interfaces";
import { operators, columns, populationSize } from "../common/variables";

const router: Router = Router();

interface IResult {
  value: number;
  child: string;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function newTree(player: { [index: string]: IPlayer }): string {
  const numberOrOperator = Math.floor(Math.random() * 100);
  if (numberOrOperator < 52) {
    if (numberOrOperator < 26) {
      const randomAttributeIndex = getRandomArbitrary(0, columns.length);
      const randomAttribute = columns[randomAttributeIndex];
      const playerAttributeValue = player[randomAttribute];
      return playerAttributeValue.toString();
    } else {
      const randomValue = Math.random() * 10;
      return randomValue.toString();
    }
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

function calculateWins(
  roster: IPlayer[],
  population: Function[],
  teamWins: number
): number {
  let allValues: IResult[] = [];
  population.map((child: Function) => {
    let childValue = 0;
    roster.map((player: IPlayer) => {
      const playerEquation = child(player);
      const playerValue = eval(playerEquation);
      childValue = childValue + playerValue;
    });
    if (childValue < teamWins && childValue <= 0) {
      childValue = (childValue + teamWins) * -1;
    } else if (childValue < teamWins && childValue > 0) {
      childValue = teamWins - childValue;
    } else if (childValue >= teamWins) {
      childValue = childValue - teamWins;
    } else {
      childValue = 99999999999999999999999999999999999;
    }
    allValues.push({
      value: childValue,
      child: child.toString()
    });
  });
  allValues.sort(function(a, b) {
    return a.value - b.value;
  });
  console.log(allValues);
  return allValues[0].value;
}

function createPopulation(): Function[] {
  let num: number = 0;
  let i: number;
  let population: Function[] = [];
  for (i = num; i < populationSize; i++) {
    const fitnessFunction = function(player: {
      [index: string]: IPlayer;
    }): string {
      return newTree(player);
    };
    population.push(fitnessFunction);
  }
  return population;
}

export function getAlgorithmResults(req: Request, res: Response) {
  const winPercent = winsArray[2018]["MIN"];
  const roster = allStats[2018]["MIN"];
  const population = createPopulation();
  const teamWins = winsArray[2018]["MIN"];
  const wins = calculateWins(roster, population, teamWins);
  res.send({ express: wins });
}

router.get("/algorithm/", getAlgorithmResults);

export const algorithm: Router = router;
