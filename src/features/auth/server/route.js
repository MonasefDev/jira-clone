import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import { loginSchema, signupSchema } from "../schemas";
import { createAdminClient } from "@/src/lib/appwrite";
import { AUTH_COOKIE } from "../constants";
import { ID } from "node-appwrite";
import { sessionMiddleware } from "@/src/lib/session-middleware";

const auth = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    //! Get current user endpoint
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    //! Login endpoint

    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: "ok" });
  })
  .post("/register", zValidator("json", signupSchema), async (c) => {
    //! Register endpoint
    const { account } = await createAdminClient();
    const { email, password, name } = c.req.valid("json");

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true, data: user });
  })
  .post("/logout", async (c) => {
    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: true });
  });

export default auth;
