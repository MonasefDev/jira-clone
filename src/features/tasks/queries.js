import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, TASKS_ID } from "@/lib/config";

export const getTaskById = async ({ taskId }) => {
  try {
    const { databases } = await createSessionClient();
    const task = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("$id", taskId),
    ]);
    if (task?.total === 0) {
      return { data: null };
    }
    return { data: task?.documents[0] };
  } catch (err) {
    return console.error(err);
  }
};
