import { gracefulShutdown } from "./utils/shutdown";
import worker from "./worker/worker";
import app from "./server";
import { createServer } from "http";
const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

gracefulShutdown(server, worker);
