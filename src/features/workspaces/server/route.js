import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "../../../lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "../../../lib/config";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import { RoleType } from "../../members/role-type";
import { generateInviteCode } from "../../../lib/utils";
import { uploadImage } from "../../../lib/upload-image";
import { getMember } from "../../members/utils";

import { ApiResponse } from "../../../lib/api-response";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    //! get all workspaces of the current user
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members?.total === 0) {
      return c.json(
        new ApiResponse(
          {
            success: false,
            statusCode: 400,
            message: "You are not a member of any workspace",
            data: [],
          },
          400
        )
      );
    }

    const workspaceIds = members?.documents.map((member) => member.workspaceId);

    if (workspaceIds.length === 0) {
      return c.json(
        new ApiResponse(
          {
            success: false,
            statusCode: 400,
            message: "You are not a member of any workspace",
            data: [],
          },
          400
        )
      );
    }

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    const workspacesOfCurrentUser = workspaces?.documents.filter((workspace) =>
      workspaceIds.includes(workspace.$id)
    );

    return c.json(
      new ApiResponse(
        {
          success: true,
          statusCode: 200,
          message: "Success",
          data: workspacesOfCurrentUser,
        },
        200
      )
    );
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
      const uploadedImageUrl = await uploadImage({ image, storage });

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
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 400,
              message: "Failed to create workspace",
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
            message: "Workspace created successfully",
            data: workspace,
          },
          200
        )
      );
    }
  )
  // TODO: refactor this routes bellow and the tanstack routes
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== RoleType.ADMIN) {
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 401,
              message: "You are not authorized to update this workspace",
            },
            401
          )
        );
      }

      const uploadedImageUrl = await uploadImage({ image, storage });

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );
      return c.json(
        new ApiResponse(
          {
            success: true,
            statusCode: 200,
            message: "Workspace updated successfully",
            data: workspace,
          },
          200
        )
      );
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== RoleType.ADMIN) {
      return c.json(
        new ApiResponse({
          success: false,
          statusCode: 401,
          message: "You are not authorized to update this workspace",
        }),
        401
      );
    }

    const workspace = await databases.deleteDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return c.json(
      new ApiResponse(
        {
          success: true,
          statusCode: 200,
          message: "Workspace deleted successfully",
          data: {
            $id: workspaceId,
          },
        },
        200
      )
    );
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== RoleType.ADMIN) {
      return c.json(
        new ApiResponse(
          {
            success: false,
            statusCode: 401,
            message: "You are not authorized to update this workspace",
          },
          401
        )
      );
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(10),
      }
    );
    return c.json(
      new ApiResponse({
        success: true,
        statusCode: 200,
        message: "Invite code updated",
        data: workspace,
      }),
      200
    );
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ inviteCode: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json(
          new ApiResponse(
            {
              success: false,
              statusCode: 401,
              message: "You are already a member of this workspace",
            },
            401
          )
        );
      }

      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace?.inviteCode !== inviteCode) {
        return c.json(
          new ApiResponse({
            success: false,
            statusCode: 401,
            message: "Invalid invite code",
          }),
          401
        );
      }

      const newMember = await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: RoleType.MEMBER,
        }
      );

      if (!newMember) {
        return c.json(
          new ApiResponse({
            success: false,
            statusCode: 500,
            message: "Failed to create member",
          }),
          500
        );
      }

      return c.json(
        new ApiResponse(
          {
            success: true,
            statusCode: 200,
            message: "Workspace joined successfully",
            data: newMember,
          },
          200
        )
      );
    }
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      userId: user.$id,
      workspaceId,
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
      }),
      200
    );
  });

export default app;
