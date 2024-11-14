import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { ApiResponse } from "@/lib/api-response";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/lib/config";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { z } from "zod";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const {
        workspaceId,
        name,
        description,
        dueDate,
        status,
        projectId,
        assigneeId,
      } = c.req.valid("form");
      console.log(workspaceId, name, description, dueDate, status, projectId);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
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

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );
      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          description,
          position: newPosition,
        }
      );

      return c.json(
        new ApiResponse({
          success: true,
          statusCode: 201,
          message: "Task created successfully",
          data: task,
        }),
        201
      );
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z
          .nativeEnum(["BACKLOG", "TODO", "IN_REVIEW", "IN_PROGRESS", "DONE"])
          .nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query");

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
            data: {},
          }),
          401
        );
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId", projectId);
        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        console.log("status", status);
        query.push(Query.equal("status", status));
      }
      if (assigneeId) {
        console.log("assigneeId", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }
      if (dueDate) {
        console.log("dueDate", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }
      if (search) {
        console.log("search", search);
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);
      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds?.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds?.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json(
        new ApiResponse({
          success: true,
          statusCode: 200,
          message: "Tasks fetched successfully",
          data: populatedTasks,
        }),
        200
      );
    }
  );

export default app;
