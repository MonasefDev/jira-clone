"use server";

import { Query } from "node-appwrite";

import { createSessionClient } from "../../lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID } from "../../lib/config";

export const getProject = async ({ projectId }) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
      Query.equal("workspaceId", project?.workspaceId),
    ]);

    if (!member) {
      throw new Error("Unauthorized");
    }

    return project;
  } catch (err) {
    return console.error(err);
  }
};
