import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "../../../features/auth/server/route";

console.log("passed");

const app = new Hono().basePath("/api").route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);
