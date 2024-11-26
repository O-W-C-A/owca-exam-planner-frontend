// components/SettingsPage.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useState } from 'react';

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Setări Utilizator</h1>
      <Card className="shadow-lg max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Informații Personale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <label className="mt-4">
              <span className="sr-only">Selectează o poză</span>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2 text-sm"
              />
            </label>
          </div>

          {/* Formulare pentru informații personale */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="nume">Nume</Label>
              <Input type="text" disabled id="nume" placeholder="Popescu" />
            </div>
            <div>
              <Label htmlFor="prenume">Prenume</Label>
              <Input type="text" disabled id="prenume" placeholder="Ion" />
            </div>
            <div>
              <Label htmlFor="grupa">Grupa</Label>
              <Input type="text" disabled id="grupa" placeholder="3" />
            </div>
            <div>
              <Label htmlFor="semigrupa">Semigrupa</Label>
              <Input type="text" disabled id="semigrupa" placeholder="1b" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                disabled
                id="email"
                placeholder="exemplu@facultate.ro"
              />
            </div>
          </form>

          {/* Butoane */}
          <div className="flex justify-end mt-6 space-x-4">
            <Button variant="secondary">Anulează</Button>
            <Button variant="default">Salvează</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
