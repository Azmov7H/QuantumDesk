"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Save, Upload } from "lucide-react";
import api from "@/lib/api";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🟢 تحميل بيانات المستخدم
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.auth.profile();
        if (res?.data) {
          setProfile(res.data);
          setPreviewImage(res.data.profileImage);
        }
      } catch (error) {
        console.error("❌ فشل تحميل بيانات المستخدم:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🟡 عند اختيار صورة جديدة
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 🔵 رفع الصورة للسيرفر
  const uploadImage = async () => {
    if (!selectedFile) return profile.profileImage;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await api.users.uploadImage(formData); // 🧩 API endpoint خاص بالصور
      return res?.url || profile.profileImage;
    } catch (err) {
      console.error("❌ فشل رفع الصورة:", err);
      return profile.profileImage;
    }
  };

  // 🟣 حفظ التغييرات
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const uploadedUrl = await uploadImage();
      const updatedProfile = { ...profile, profileImage: uploadedUrl };

      const res = await api.users.update(updatedProfile);

      if (res?.user) {
        setProfile(res.user);
        setMessage("✅ تم حفظ التغييرات بنجاح");
      } else {
        setMessage("⚠️ حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("❌ فشل حفظ البيانات:", error);
      setMessage("⚠️ حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  // 🧩 واجهة التحميل
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
      <Card className="shadow-md border border-border bg-background/60 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            إعدادات الحساب
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* 🖼️ الصورة الشخصية */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage src={previewImage} alt={profile.username} />
              <AvatarFallback>
                {profile.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">
                اختر صورة جديدة
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewImage(null)}
                >
                  <Upload className="mr-2 w-4 h-4" /> إزالة
                </Button>
              </div>
            </div>
          </div>

          {/* 🧑‍💼 اسم المستخدم */}
          <div className="space-y-2">
            <Label>اسم المستخدم</Label>
            <Input
              type="text"
              value={profile.username || ""}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
            />
          </div>

          {/* 📧 البريد الإلكتروني */}
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          {/* 📝 النبذة */}
          <div className="space-y-2">
            <Label>نبذة شخصية</Label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="اكتب نبذة قصيرة عنك..."
              value={profile.bio || ""}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />
          </div>

          {/* 🌐 الروابط الاجتماعية */}
          <div className="space-y-2">
            <Label>الروابط الاجتماعية</Label>
            {["facebook", "linkedin", "whatsapp"].map((key) => (
              <Input
                key={key}
                type="text"
                placeholder={`رابط ${key}`}
                value={profile.socialLinks?.[key] || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: {
                      ...profile.socialLinks,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            ))}
          </div>

          {/* 💾 زر الحفظ */}
          <div className="flex justify-end items-center gap-3">
            {message && (
              <span
                className={`text-sm ${
                  message.includes("خطأ") || message.includes("⚠️")
                    ? "text-red-500"
                    : "text-green-600"
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
