import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await api.users.get(id);
  const user = res?.ok ? res.data : null;
  return {
    title: user ? `${user.username} | QuantumLeap` : 'User Not Found | QuantumLeap',
    description: user?.bio || 'User profile on QuantumLeap.',
    openGraph: user ? {
      title: user.username,
      description: user.bio || 'User profile',
      images: user.profileImage ? [{ url: user.profileImage, width: 1200, height: 630, alt: user.username }] : [],
    } : {},
  };
}

export default async function UserProfile({ params }) {
  const { id } = await params;
  const res = await api.users.get(id);
  const userData = res?.ok ? res.data : null;
  if (!userData) return notFound();

  return (
    <div className="flex justify-center items-center mt-10">
      <Card className="w-full max-w-2xl p-6 shadow-md rounded-2xl">
        <CardContent className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-3">
            <AvatarImage src={userData.profileImage || '/default-avatar.png'} alt={userData.username} />
            <AvatarFallback>{userData.username?.charAt(0)}</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold">{userData.username}</h2>
          <p className="text-sm text-gray-500 mb-2">{userData.email}</p>
          <p className="text-gray-700 mb-4">{userData.bio || 'لا يوجد وصف بعد'}</p>

          <div className="flex gap-3 mb-4">
            {userData.socialLinks?.facebook && (
              <a href={userData.socialLinks.facebook} target="_blank" className="text-blue-600 hover:underline">Facebook</a>
            )}
            {userData.socialLinks?.linkedin && (
              <a href={userData.socialLinks.linkedin} target="_blank" className="text-blue-500 hover:underline">LinkedIn</a>
            )}
            {userData.socialLinks?.whatsapp && (
              <a href={`https://wa.me/${userData.socialLinks.whatsapp}`} target="_blank" className="text-green-600 hover:underline">WhatsApp</a>
            )}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-center gap-6 mb-4">
            <div>
              <p className="font-semibold">{userData.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">المتابعون</p>
            </div>
            <div>
              <p className="font-semibold">{userData.following?.length || 0}</p>
              <p className="text-sm text-gray-500">يتابع</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <a href={`/dashboard/chat/${userData._id}`}>فتح الشات</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
