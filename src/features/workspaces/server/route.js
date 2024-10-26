import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/src/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/src/lib/config";
import { createWorkspaceSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import { RoleType } from "../../members/role-type";
import { generateInviteCode } from "@/src/lib/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    //! get all workspaces of the current user
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members?.total === 0) {
      return c.json({ data: [] });
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

    console.log(workspacesOfCurrentUser);

    return c.json({ data: workspacesOfCurrentUser });
  })
  .post(
    "/create",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      //! Upload image and return image url
      const storage = c.get("storage");
      let uploadedImageUrl = "";
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(10),
        }
      );

      //! Create admin member
      const member = await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          workspaceId: workspace.$id,
          userId: user.$id,
          role: RoleType.ADMIN,
        }
      );
      if (!member) {
        throw new Error("Failed to create member");
      }

      return c.json({ data: workspace });
    }
  );

export default app;
