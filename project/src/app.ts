import { Express } from "express";
import { IController } from "./interfaces/controller.interface";
import { MiddlewareType } from "./types/middleware.type";

export class App {
  constructor(private readonly app: Express) {}

  public addRouter(router: IController) {
    this.app.use(router.getRouter());
  }

  public addMiddleware(middleware: MiddlewareType) {
    this.app.use(middleware);
  }

  public async start() {
    try {
      const PORT = process.env.PORT ?? 3003;

      this.app.listen(PORT, () =>
        console.log("App has been started successfully")
      );
    } catch (e) {
      console.log("Error in running application");
      console.log(e);
    }
  }
}
