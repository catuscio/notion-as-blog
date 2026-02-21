import type { ReactNode } from "react";

export function EmptyState({ icon, message }: { icon?: ReactNode; message: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      {icon && <div className="mx-auto mb-4 opacity-30">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );
}
