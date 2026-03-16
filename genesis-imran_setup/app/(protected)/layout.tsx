import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <AppShell userCreatedAt={user.created_at} userEmail={user.email ?? "Unknown email"}>
      {children}
    </AppShell>
  );
}
