"use server";

import { Query } from "node-appwrite";

import { createSessionClient } from "../../lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "../../lib/config";

export const getWorkSpaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();
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
      WORKSPACES_ID
    );

    const workspacesOfCurrentUser = workspaces?.documents.filter((workspace) =>
      workspaceIds.includes(workspace.$id)
    );

    // const workspaces = await databases.listDocuments(
    //   DATABASE_ID,
    //   WORKSPACES_ID,
    //   [Query.orderDesc("$createdAt")],
    //   [Query.contains("$id", workspaceIds)]
    // );
    return { data: workspacesOfCurrentUser };
  } catch (err) {
    return console.error(err);
  }
};

export const getWorkSpaceById = async ({ workspaceId }) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("$id", workspaceId)]
    );

    return { data: workspace?.documents[0] };
  } catch (err) {
    return console.error(err);
  }
};

export const getWorkSpaceInfo = async ({ workspaceId }) => {
  try {
    const { account, databases } = await createSessionClient();

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("$id", workspaceId)]
    );

    return { data: { name: workspace?.documents[0]?.name } };
  } catch (err) {
    return console.error(err);
  }
};
