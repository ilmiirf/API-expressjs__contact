import { app } from "./app/web";
import { logger } from "./app/logging";

app.listen(3000, () => {
  logger.info("server started on port 3000");
});
