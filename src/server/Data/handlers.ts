import { Request, Response, Router } from "express";
import { wins } from "../json/wins";
import { playerStats } from "../json/playerStats";
import { IWins, IAllStats, IPlayer } from "../common/interfaces";

const router: Router = Router();
const winsArray: IWins = wins;
const allStats: IAllStats = playerStats;

export function getWins(req: Request, res: Response) {
  const year = req.params.year;
  const team = req.params.id;
  const winPercent = winsArray[year][team];
  res.send({ express: winPercent });
}

export function getTeamStats(req: Request, res: Response) {
  const team = req.params.team;
  const year = req.params.year;
  const roster = allStats[year][team];
  res.send({ stats: roster });
}

export function getPlayerStats(req: Request, res: Response) {
  const team = req.params.team;
  const year = req.params.year;
  const name = req.params.player;
  const roster = allStats[year][team];
  roster.map((player: IPlayer) => {
    if (player.name === name) {
      res.send({ name: name, stats: player });
    }
  });
}

router.get("/wins/:year/:id", getWins);
router.get("/players/:team/:year", getTeamStats);
router.get("/players/:team/:year/:player", getPlayerStats);

export const data: Router = router;
