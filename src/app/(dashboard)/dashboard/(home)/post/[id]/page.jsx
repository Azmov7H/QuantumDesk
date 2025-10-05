import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "@/components/dashboard/home-user/LikeButton";
import CommentsSection from "./CommentsSection";
import Image from "next/image";
import api from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_URL_API;

// ✅ جلب البوست
async function getPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// ✅ SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};

  return {
    title: `${post.title} | QuantumLeap`,
    description: post.excerpt || post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content?.slice(0, 160),
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content?.slice(0, 160),
      images: post.image ? [post.image] : [],
    },
  };
}

// ✅ الصفحة
export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return notFound();

  return (
    <div className="container max-w-3xl mx-auto py-10 space-y-8">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            By {post.author?.username} •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="prose max-w-none">{post.content}</div>

          {/* لايك = Client Component */}
          <LikeButton postId={id} initialLikes={post.likes || 0} />
        </CardContent>
      </Card>

      {/* التعليقات = Client Component */}
      <CommentsSection postId={id} initialComments={post.comments || []} />
    </div>
  );
}
