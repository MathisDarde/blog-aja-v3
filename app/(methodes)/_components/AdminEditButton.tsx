"use client";

import Link from "next/link";
import { PenBox } from "lucide-react";
import { authClient } from "@/lib/auth-client";

/** Lien vers le formulaire de la méthode, pour les administrateurs uniquement. */
export default function AdminEditButton({ id }: { id: string }) {
  const { data: session } = authClient.useSession();
  if (!session?.user?.admin) return null;

  return (
    <Link
      href={`/admin/dashboard/updateelement/${id}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-aja-blue px-3 py-1 text-xs font-semibold text-white hover:bg-orange-third transition-colors"
    >
      <PenBox size={14} /> Modifier
    </Link>
  );
}
