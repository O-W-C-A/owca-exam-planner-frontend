"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfessorPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/professor/calendar");
  }, [router]);

  return null;
}
