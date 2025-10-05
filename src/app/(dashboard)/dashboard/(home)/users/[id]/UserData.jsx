'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import api from '@/lib/api'; // ✅ API الرئيسي

export default function UserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.users.me();
        if (res?.data) setUser(res.data);
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
        toast.error('فشل تحميل بيانات المستخدم');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <p className="text-center mt-10">جارٍ تحميل البيانات...</p>;
  if (!user) return <p className="text-center mt-10">لم يتم العثور على بيانات المستخدم</p>;

  return (
    <div className="flex justify-center items-center mt-10">
      <Card className="w-full max-w-xl p-6 shadow-md rounded-2xl">
        <CardContent className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-3">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-500 text-sm mb-2">{user.email}</p>
          <p className="text-gray-700 mb-4">{user.bio || 'لا يوجد وصف بعد'}</p>

          <div className="flex gap-3 mb-4">
            {user.socialLinks?.facebook && (
              <a
                href={user.socialLinks.facebook}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {user.socialLinks?.whatsapp && (
              <a
                href={`https://wa.me/${user.socialLinks.whatsapp}`}
                target="_blank"
                className="text-green-600 hover:underline"
              >
                WhatsApp
              </a>
            )}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-center gap-6 mb-4">
            <div>
              <p className="font-semibold">{user.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">المتابعون</p>
            </div>
            <div>
              <p className="font-semibold">{user.following?.length || 0}</p>
              <p className="text-sm text-gray-500">يتابع</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => (window.location.href = `/profile/${user._id}`)}
            >
              عرض الصفحة الشخصية
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = `/chat/${user._id}`)}
            >
              فتح الشات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
