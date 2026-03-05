import { gracefulShutdown } from "./utils/shutdown";
import app from "./server";
import { createServer } from "http";
const PORT = process.env.PORT || 3000;

const server = createServer(app);
try {
  server.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1);
}

gracefulShutdown(server);
