export function gracefulShutdown(server: any, worker: any) {
  process.on("SIGTERM", async () => {
    console.log("Shutting down gracefully...");

    await worker.close();
    server.close(() => {
      process.exit(0);
    });
  });
}
