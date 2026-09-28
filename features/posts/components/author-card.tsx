import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import type { AuthorRef } from "../types";

/** `action` sits on the right, e.g. a "Theo dõi" toggle. */
export function AuthorCard({ author, action }: { author: AuthorRef; action?: ReactNode }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <Avatar name={author.displayName} src={author.avatarUrl} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold">{author.displayName}</p>
        <p className="font-mono text-xs text-faint">@{author.username}</p>
      </div>
      {action}
    </Card>
  );
}
