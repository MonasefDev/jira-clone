import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "../schemas";

const auth = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    return c.json({ success: "ok" });
  })
  .post("/register", zValidator("json", signupSchema), async (c) => {
    return c.json({ success: "ok" });
  });

export default auth;
