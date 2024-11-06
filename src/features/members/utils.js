import { DATABASE_ID, MEMBERS_ID } from "../../lib/config";
import { Query } from "node-appwrite";

export const getMember = async ({ databases, userId, workspaceId }) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", userId),
    Query.equal("workspaceId", workspaceId),
  ]);
  return members?.documents[0];
};
