// components/SettingsPage.tsx
"use client";
import { useUser } from "@/contexts/UserContext";
import { PersonalInformationForm } from "@/app/components/forms/PersonalInformationForm";

export default function StudentLeaderSettingsPage() {
  const { user } = useUser();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <PersonalInformationForm user={user} role="studentleader" />
    </div>
  );
}
