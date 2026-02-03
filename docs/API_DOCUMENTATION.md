# API Documentation - Collabry Backend

This document serves as a reference for the Frontend development of the Collabry application. It details the available endpoints, request structures, and response formats.

## Base URL
`http://localhost:3000` (or as configured in environment)

## Authentication
All protected endpoints require a Bearer Token in the Authorization header.
`Authorization: Bearer <access_token>`

## Standard Response Format
The API uses a standardized response format for success and errors.

**Success Response:**
```json
{
  "statusCode": 200, // or 201
  "message": "Operation successful",
  "data": { ... } // The actual data payload
}
```

**Error Response:**
```json
{
  "statusCode": 400, // or 401, 403, 404, 500
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## 1. Authentication (`/auth`)

### Register
*   **Endpoint:** `POST /auth/register`
*   **Public:** Yes
*   **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response:** User object (without password).

### Login
*   **Endpoint:** `POST /auth/login`
*   **Public:** Yes
*   **Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response:**
    ```json
    {
      "accessToken": "ey...",
      "user": { ... }
    }
    ```

---

## 2. Users (`/users`)

### Get Profile (Me)
*   **Endpoint:** `GET /users/me` (Implementation depends on specific route, usually `GET /users/:id` with current user ID, or dedicated `/profile` endpoint if exists. Assuming `GET /users/:id` is used for now).
*   **Note:** The current controller has generic CRUD. To get the current user, use the ID from the decoded token or add a specific `/me` endpoint if needed. For now, use `GET /users/:id`.

### Get All Users
*   **Endpoint:** `GET /users`
*   **Query Params:** Pagination support (page, limit, search, etc.)
*   **Response:** List of users.

### Get User by ID
*   **Endpoint:** `GET /users/:id`
*   **Response:** User details.

### Update User
*   **Endpoint:** `PATCH /users/:id`
*   **Body:**
    ```json
    {
      "name": "New Name",
      "email": "newemail@example.com" // Optional
    }
    ```

---

## 3. Workspaces (`/workspaces`)

### Create Workspace
*   **Endpoint:** `POST /workspaces`
*   **Body:**
    ```json
    {
      "name": "My Team Workspace"
    }
    ```

### Get My Workspaces
*   **Endpoint:** `GET /workspaces`
*   **Query Params:** Pagination support.
*   **Response:** List of workspaces where the user is an owner or member.

### Get Workspace Detail
*   **Endpoint:** `GET /workspaces/:id`
*   **Response:** Workspace details.

### Update Workspace
*   **Endpoint:** `PATCH /workspaces/:id`
*   **Role:** ADMIN/OWNER
*   **Body:**
    ```json
    {
      "name": "Updated Workspace Name"
    }
    ```

### Delete Workspace
*   **Endpoint:** `DELETE /workspaces/:id`
*   **Role:** ADMIN/OWNER

---

## 4. Workspace Members (`/workspaces/:workspaceId/members`)

### Add Member
*   **Endpoint:** `POST /workspaces/:workspaceId/members`
*   **Role:** ADMIN
*   **Body:**
    ```json
    {
      "email": "member@example.com",
      "role": "MEMBER" // "ADMIN" | "MEMBER"
    }
    ```

### Get Members
*   **Endpoint:** `GET /workspaces/:workspaceId/members`
*   **Role:** MEMBER
*   **Response:** List of members with their roles.

### Remove Member
*   **Endpoint:** `DELETE /workspaces/:workspaceId/members/:userId`
*   **Role:** ADMIN

---

## 5. Projects (`/projects`)

### Create Project
*   **Endpoint:** `POST /projects`
*   **Role:** MEMBER
*   **Body:**
    ```json
    {
      "name": "Website Redesign",
      "description": "Optional description",
      "workspaceId": "uuid-string"
    }
    ```

### Get All Projects
*   **Endpoint:** `GET /projects`
*   **Query Params:** `workspaceId` (Required to filter by workspace), Pagination.

### Get Project Detail
*   **Endpoint:** `GET /projects/:id`

### Update Project
*   **Endpoint:** `PATCH /projects/:id`
*   **Role:** MEMBER
*   **Body:**
    ```json
    {
      "name": "New Name",
      "description": "New Description"
    }
    ```

### Delete Project
*   **Endpoint:** `DELETE /projects/:id`
*   **Role:** ADMIN

---

## 6. Tasks (`/tasks`)

### Create Task
*   **Endpoint:** `POST /tasks`
*   **Role:** MEMBER
*   **Body:**
    ```json
    {
      "title": "Fix Login Bug",
      "description": "Detailed description...",
      "status": "TODO", // "TODO" | "IN_PROGRESS" | "DONE"
      "priority": "MEDIUM", // "LOW" | "MEDIUM" | "HIGH"
      "dueDate": "2024-12-31T23:59:59Z", // ISO8601
      "projectId": "uuid-string",
      "assigneeId": "uuid-string" // Optional
    }
    ```

### Get All Tasks
*   **Endpoint:** `GET /tasks`
*   **Query Params:**
    *   `projectId` (Filter by project)
    *   `assigneeId` (Filter by user)
    *   `status`
    *   `priority`
    *   Pagination

### Get Task Detail
*   **Endpoint:** `GET /tasks/:id`

### Update Task
*   **Endpoint:** `PATCH /tasks/:id`
*   **Role:** MEMBER
*   **Body:** Partial `CreateTaskDto` fields.

### Delete Task
*   **Endpoint:** `DELETE /tasks/:id`
*   **Role:** ADMIN

---

## 7. Comments (`/comments`)

### Create Comment
*   **Endpoint:** `POST /comments`
*   **Body:**
    ```json
    {
      "content": "This is a comment",
      "taskId": "uuid-string"
    }
    ```

### Get Comments
*   **Endpoint:** `GET /comments`
*   **Query Params:** `taskId` (Required).

---

## 8. Attachments (`/attachments`)

### Upload Attachment (Metadata)
*   **Endpoint:** `POST /attachments`
*   **Body:**
    ```json
    {
      "filename": "design.png",
      "url": "https://storage.example.com/design.png",
      "mimeType": "image/png",
      "size": 102400,
      "taskId": "uuid-string"
    }
    ```

### Get Attachments
*   **Endpoint:** `GET /attachments`
*   **Query Params:** `taskId` (Required).

### Delete Attachment
*   **Endpoint:** `DELETE /attachments/:id`

---

## 9. Activity Logs (`/activity-logs`)

### Get Logs
*   **Endpoint:** `GET /activity-logs`
*   **Query Params:**
    *   `workspaceId`
    *   `userId`
    *   `entityType`
    *   Pagination
