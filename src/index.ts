import { Hono } from "hono";
import rooms from "./rooms";

const app = new Hono();

app.route("/rooms", rooms);

export default app;
