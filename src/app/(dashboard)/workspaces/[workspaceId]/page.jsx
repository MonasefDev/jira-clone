"use client";

import { useParams } from "next/navigation";

function WorkspacIdPage() {
  const { workspaceId } = useParams();
  return (
    <div>
      <h1>workspace page : {workspaceId}</h1>
    </div>
  );
}

export default WorkspacIdPage;
