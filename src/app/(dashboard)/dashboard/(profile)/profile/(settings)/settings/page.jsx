"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Save } from "lucide-react";
import api from "@/lib/api";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 🟢 تحميل بيانات المستخدم
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.auth.getProfile();
        console.log("Fetched profile:", res);
        if (res?.data) setProfile(res.data);
      } catch (error) {
        console.error("❌ فشل تحميل بيانات المستخدم:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🟡 حفظ التعديلات
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      const res = await api.auth.update (profile);
      if (res?.user) {
        setProfile(res.user);
        setMessage("✅ تم حفظ التغييرات بنجاح");
      }
    } catch (error) {
      console.error("❌ فشل حفظ البيانات:", error);
      setMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-10 text-gray-500">
        لم يتم العثور على بيانات المستخدم
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">إعدادات الحساب</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* الصورة الشخصية */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.profileImage} alt={profile.username} />
              <AvatarFallback>{profile.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              type="text"
              placeholder="رابط الصورة الشخصية"
              value={profile.profileImage || ""}
              onChange={(e) =>
                setProfile({ ...profile, profileImage: e.target.value })
              }
            />
          </div>

          {/* اسم المستخدم */}
          <div>
            <label className="text-sm text-muted-foreground">اسم المستخدم</label>
            <Input
              type="text"
              value={profile.username || ""}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="text-sm text-muted-foreground">البريد الإلكتروني</label>
            <Input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          {/* النبذة */}
          <div>
            <label className="text-sm text-muted-foreground">نبذة شخصية</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="اكتب نبذة قصيرة عنك..."
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            ></textarea>
          </div>

          {/* الروابط الاجتماعية */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">
              الروابط الاجتماعية
            </label>

            <Input
              type="text"
              placeholder="رابط فيسبوك"
              value={profile.socialLinks?.facebook || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, facebook: e.target.value },
                })
              }
            />
            <Input
              type="text"
              placeholder="رابط لينكدإن"
              value={profile.socialLinks?.linkedin || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                })
              }
            />
            <Input
              type="text"
              placeholder="رقم واتساب"
              value={profile.socialLinks?.whatsapp || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, whatsapp: e.target.value },
                })
              }
            />
          </div>

          {/* زر الحفظ */}
          <div className="flex justify-end items-center gap-3">
            {message && (
              <span
                className={`text-sm ${
                  message.includes("خطأ") ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </span>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
