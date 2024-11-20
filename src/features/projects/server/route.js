import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/lib/config";
import { uploadImage } from "@/lib/upload-image";

import { ApiResponse } from "@/lib/api-response";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { TaskStatus } from "@/features/tasks/types";

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
  .get(
    "/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.valid("param");

      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      if (!project) {
        return c.json(
          new ApiResponse({
            success: false,
            statusCode: 404,
            message: "Project not found",
            data: [],
          }),
          404
        );
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project?.workspaceId,
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

      return c.json(
        new ApiResponse({
          success: true,
          statusCode: 200,
          message: "Success",
          data: project,
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
  )
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      userId: user.$id,
      workspaceId: project.workspaceId,
      databases,
    });

    if (!member) {
      return c.json(
        new ApiResponse({
          success: false,
          statusCode: 401,
          message: "Unauthorized",
          data: undefined,
        }),
        401
      );
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assignedTasksCount = thisMonthAssignedTasks.total;
    const assignedTasksDifference = taskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json(
      new ApiResponse({
        success: true,
        statusCode: 200,
        message: "Analytics fetched successfully",
        data: {
          taskCount,
          taskDifference,
          assignedTasksCount,
          assignedTasksDifference,
          completedTaskCount,
          completedTaskDifference,
          incompleteTaskCount,
          incompleteTaskDifference,
          overdueTaskCount,
          overdueTaskDifference,
        },
      })
    );
  });

export default app;
