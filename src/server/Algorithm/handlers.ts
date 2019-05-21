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

function newValue(value: boolean): string {
  let valueString = "";
  if (value) {
    const randomAttributeIndex = getRandomArbitrary(0, columns.length);
    const randomAttribute = columns[randomAttributeIndex];
    const playerAttributeValue = `currentPlayer['${randomAttribute}']`;
    valueString = `${playerAttributeValue}`;
  } else {
    const randomValue = Math.random() * 10;
    const randomString = randomValue.toString();
    valueString = `${randomString}`;
  }
  return valueString;
}

function newValueCombination(level: number): string {
  const whichOperator = Math.floor(Math.random() * 3);
  let operator = "+";
  switch (whichOperator) {
    case 0:
      operator = "-";
      break;
    case 1:
      operator = "*";
      break;
    case 2:
      operator = "/";
      break;
    default:
      operator = "+";
  }
  const side1 = newTree(true, level);
  const side2 = newTree(true, level);
  return "(" + side1 + operator + side2 + ")";
}

function newTree(previous: boolean, level?: number): string {
  let currentLevel = level || 0;
  let functionString = "";
  const numberOrOperator = Math.floor(Math.random() * 100);
  if ((currentLevel > 0 && numberOrOperator < 50) || currentLevel === 4) {
    const currentStat =
      numberOrOperator < 25 ? newValue(true) : newValue(false);
    if (previous) {
      return currentStat;
    } else {
      functionString = functionString + currentStat;
    }
  } else {
    currentLevel++;
    const newCombination = newValueCombination(currentLevel);
    if (previous) {
      return newCombination;
    } else {
      functionString = functionString + newCombination;
    }
  }
  return functionString;
}

function calculateWins(
  roster: IPlayer[],
  population: string[],
  teamWins: number
): IResult[] {
  let allValues: IResult[] = [];
  let playerEquation: Function = function() {};
  population.map((child: string) => {
    let childValue = 0;
    playerEquation = new Function("currentPlayer", `return ${child}`);
    roster.map((player: IPlayer) => {
      const playerValue = playerEquation(player);
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
      child: playerEquation.toString()
    });
  });
  console.log(allValues);
  return allValues;
}

function createPopulation(): string[] {
  let num: number = 0;
  let i: number;
  let population: string[] = [];
  for (i = num; i < populationSize; i++) {
    population.push(newTree(false));
  }
  return population;
}

export function getAlgorithmResults(req: Request, res: Response) {
  let totalWins: IResult[] = [];
  const population = createPopulation();
  for (var property in allStats[2018]) {
    if (allStats[2018].hasOwnProperty(property)) {
      const roster = allStats[2018][property];
      const teamWinPercentage = winsArray[2018][property];
      const teamWins = calculateWins(roster, population, teamWinPercentage);
      teamWins.map((result: IResult, index: number) => {
        if (typeof totalWins[index] === "undefined") {
          totalWins[index] = { child: "", value: 0 };
          totalWins[index].child = result.child;
          totalWins[index].value = result.value;
        } else {
          totalWins[index].value = totalWins[index].value + result.value;
        }
      });
    }
  }
  totalWins.map((result: IResult) => {
    result.value = result.value / 2;
  });
  totalWins.sort(function(a, b) {
    return a.value - b.value;
  });
  console.log(totalWins[0].child);
  res.send({ express: totalWins[0].value });
}

router.get("/algorithm/", getAlgorithmResults);

export const algorithm: Router = router;
