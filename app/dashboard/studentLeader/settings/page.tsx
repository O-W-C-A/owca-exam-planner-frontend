// components/SettingsPage.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/card';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { useUser } from '@/contexts/UserContext';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={user?.firstname || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={user?.lastname || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="faculty">Faculty</Label>
              <Input
                type="text"
                id="faculty"
                value={user?.faculty || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            {user?.group && (
              <div>
                <Label htmlFor="group">Group</Label>
                <Input
                  type="text"
                  id="group"
                  value={user.group}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
