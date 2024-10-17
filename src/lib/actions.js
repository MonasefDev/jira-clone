"use server";

import { getCookie } from "hono/cookie";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "../features/auth/constants";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

    const session = cookies().get(AUTH_COOKIE);
    if (!session || !session.value) {
      return null;
    }

    client.setSession(session.value);
    const account = new Account(client);

    const user = await account.get();

    return user;
  } catch (err) {
    console.error(err);
  }
};
