'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import api from '@/lib/api'; // ✅ الملف الرئيسي للـ REST API

export default function UserProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.users.get(id);
        if (res && res.data) {
          setUserData(res.data);
          setIsFollowing(res.data.isFollowing || false);
        }
      } catch (error) {
        console.error('❌ Error fetching user:', error);
        toast.error('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    try {
      const res = await api.users.follow(id);
      if (res?.success) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? 'تم إلغاء المتابعة' : 'تمت المتابعة بنجاح');
      }
    } catch (error) {
      console.error('❌ Follow error:', error);
      toast.error('فشل تنفيذ العملية');
    }
  };

  if (loading) return <p className="text-center mt-10">جارٍ التحميل...</p>;
  if (!userData) return <p className="text-center mt-10">المستخدم غير موجود</p>;

  return (
    <div className="flex justify-center items-center mt-10">
      <Card className="w-full max-w-2xl p-6 shadow-md rounded-2xl">
        <CardContent className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-3">
            <AvatarImage src={userData.profileImage} alt={userData.username} />
            <AvatarFallback>{userData.username?.charAt(0)}</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold">{userData.username}</h2>
          <p className="text-sm text-gray-500 mb-2">{userData.email}</p>
          <p className="text-gray-700 mb-4">{userData.bio || 'لا يوجد وصف بعد'}</p>

          <div className="flex gap-3 mb-4">
            {userData.socialLinks?.facebook && (
              <a
                href={userData.socialLinks.facebook}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            )}
            {userData.socialLinks?.linkedin && (
              <a
                href={userData.socialLinks.linkedin}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {userData.socialLinks?.whatsapp && (
              <a
                href={`https://wa.me/${userData.socialLinks.whatsapp}`}
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
              <p className="font-semibold">{userData.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">المتابعون</p>
            </div>
            <div>
              <p className="font-semibold">{userData.following?.length || 0}</p>
              <p className="text-sm text-gray-500">يتابع</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'}>
              {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = `/chat/${userData._id}`)}
            >
              فتح الشات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
