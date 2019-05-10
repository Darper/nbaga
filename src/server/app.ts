import * as express from "express";
import * as cors from "cors";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { data } from "./Data/handlers";

class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = express.Router();

    this.app.use(cors());

    this.app.use(data);

    router.get("/", (req: Request, res: Response) => {
      res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
    });

    this.app.use("/", router);
  }
}

export default new App().app;
