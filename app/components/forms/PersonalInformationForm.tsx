"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import { User } from "@/types/user";

interface PersonalInformationFormProps {
  readonly user: User | null;
  readonly role: "student" | "studentleader" | "professor";
}

interface InfoFieldProps {
  readonly label: string;
  readonly value: string;
}

const InfoField = ({ label, value }: InfoFieldProps) => (
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-base bg-gray-50 p-2.5 rounded-md border border-gray-200">
      {value || "Not provided"}
    </p>
  </div>
);

export function PersonalInformationForm({
  user,
  role,
}: PersonalInformationFormProps) {
  const renderRoleSpecificFields = () => {
    switch (role) {
      case "professor":
        return <InfoField label="Department" value={user?.department ?? ""} />;
      case "student":
      case "studentleader":
        return <InfoField label="Group" value={user?.group ?? ""} />;
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InfoField label="First Name" value={user?.firstname ?? ""} />
            <InfoField label="Last Name" value={user?.lastname ?? ""} />
          </div>

          <InfoField label="Email" value={user?.email ?? ""} />

          {renderRoleSpecificFields()}

          <InfoField label="Faculty" value={user?.faculty ?? ""} />
        </div>
      </CardContent>
    </Card>
  );
}
