"use server";

import { Account, Client, Databases, Query } from "node-appwrite";
import { cookies } from "next/headers";

import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/src/lib/config";

export const getWorkSpaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
    const session = cookies().get(AUTH_COOKIE);

    // if (!session) return { data: [] };

    client.setSession(session.value);
    const account = new Account(client);
    const user = await account.get();
    const databases = new Databases(client);

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members?.total === 0) {
      return { data: [] };
    }

    const workspaceIds = members?.documents.map((member) => member.workspaceId);
    if (workspaceIds.length === 0) {
      return c.json({ data: [] });
    }

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt")],
      [Query.contains("$id", workspaceIds)]
    );

    return { data: workspaces?.documents };
  } catch (err) {
    return console.error(err);
  }
};
