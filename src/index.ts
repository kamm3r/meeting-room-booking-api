import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import rooms from "./rooms";

const app = new Hono();

app.route("/rooms", rooms);
app.get(
  "/openapi",
  openAPIRouteHandler(app, {
    documentation: {
      openapi: "3.1.0",
      info: {
        title: "Meeting Room Booking API",
        version: "1.0.0",
        description: "Simple meeting room booking API",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
    },
  }),
);

export default app;
