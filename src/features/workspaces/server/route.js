import { Hono } from "hono";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "@/src/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/src/lib/config";
import { createWorkspaceSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";

const app = new Hono().post(
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
      { name, userId: user.$id, imageUrl: uploadedImageUrl }
    );
    return c.json({ data: workspace });
  }
);

export default app;
