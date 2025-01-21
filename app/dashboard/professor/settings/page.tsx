// components/SettingsPage.tsx
"use client";
import { useUser } from "@/contexts/UserContext";
import { PersonalInformationForm } from "@/app/components/forms/PersonalInformationForm";

export default function ProfessorSettingsPage() {
  const { user } = useUser();

  if (!user) return null; // Early return if no user

  return (
    <div className="h-full flex items-center justify-center p-6">
      <PersonalInformationForm user={user} role="professor" />
    </div>
  );
}
