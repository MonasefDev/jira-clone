import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, WORKSPACES_ID } from "@/lib/config";
import { uploadImage } from "@/lib/upload-image";

import { createProjectSchema, updateProjectSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ApiResponse } from "@/lib/api-response";
import { ID, Query } from "node-appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json(
          new ApiResponse({
            success: false,
            statusCode: 401,
            message: "Unauthorized",
            data: [],
          }),
          401
        );
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json(
        new ApiResponse({
          success: true,
          statusCode: 200,
          message: "Success",
          data: projects?.documents,
        }),
        200
      );
    }
  )
  .post(
    "/create",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { name, image, workspaceId } = c.req.valid("form");

      //! Upload image and return image url
      const storage = c.get("storage");
      const uploadedImageUrl = await uploadImage({ image, storage });

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 401,
              message: "Unauthorized",
            },
            401
          )
        );
      }

      if (image && !uploadedImageUrl) {
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 400,
              message: "Image upload failed",
            },
            400
          )
        );
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          imageUrl: uploadedImageUrl,
        }
      );
      if (!project) {
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 400,
              message: "Project creation failed",
            },
            400
          )
        );
      }

      return c.json(
        new ApiResponse(
          {
            success: true,
            statusCode: 200,
            message: "Project created successfully",
            data: project,
          },
          200
        )
      );
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      try {
        const existingProject = await databases.getDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );
        const member = await getMember({
          userId: user.$id,
          workspaceId: existingProject.workspaceId,
          databases,
        });

        if (!member) {
          return c.json(
            new ApiResponse({
              success: false,
              statusCode: 401,
              message: "Unauthorized",
              data: {},
            }),
            401
          );
        }

        const uploadedImageUrl = await uploadImage({ image, storage });

        const project = await databases.updateDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
          {
            name,
            imageUrl: uploadedImageUrl,
          }
        );

        if (!project) {
          return c.json(
            new ApiResponse({
              success: false,
              statusCode: 400,
              message: "Failed to update Project.",
              data: {},
            }),
            400
          );
        }

        return c.json(
          new ApiResponse({
            statusCode: 200,
            message: "Project updated successfully.",
            data: project,
            success: true,
          })
        );
      } catch (error) {
        console.error("Error updating Project:", error);

        let errorMessage = "An error occurred while updating the Project.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        return c.json(
          new ApiResponse({
            statusCode: 500,
            message: errorMessage,
            data: {},
            success: false,
          }),
          500
        );
      }
    }
  )
  .delete(
    "/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.valid("param");
      const existingProject = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      const member = await getMember({
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
        databases,
      });

      if (!member) {
        return c.json(
          new ApiResponse({
            success: false,
            statusCode: 401,
            message: "Unauthorized",
            data: [],
          }),
          401
        );
      }

      const project = await databases.deleteDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      return c.json(
        new ApiResponse({
          success: true,
          statusCode: 200,
          message: "Project deleted successfully",
          data: project,
        }),
        200
      );
    }
  );

export default app;
