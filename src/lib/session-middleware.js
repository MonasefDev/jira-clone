import "server-only";

import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { Account, Client, Databases, Storage } from "node-appwrite";
import { AUTH_COOKIE } from "../features/auth/constants";

export const sessionMiddleware = createMiddleware(async (context, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const session = getCookie(context, AUTH_COOKIE);

  if (!session) {
    return context.json({ error: "Unauthorized" }, 401);
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  context.set("user", user);
  context.set("databases", databases);
  context.set("storage", storage);
  context.set("account", account);

  return next();
});
