import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "@/components/dashboard/home-user/LikeButton";
import dynamic from "next/dynamic";
const CommentsSection = dynamic(() => import("./CommentsSection"), { ssr: true });
import Image from "next/image";
import api from "@/lib/api";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/* ──────────────── 📦 Fetch Post ──────────────── */
async  function  getPost(id) {
  try {
    const res = await api.posts.get(id);
    if (!res.ok) return null;
    return res.data;
  } catch (err) {
    console.error("❌ Fetch post error:", err);
    return null;
  }
}

/* ──────────────── 🧠 Metadata (SEO) ──────────────── */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return {
      title: "Post Not Found | QuantumDesk",
      description: "The requested post could not be found.",
    };
  }

  const description = post.excerpt || post.content?.slice(0, 160) || "";

  return {
    title: `${post.title} | QuantumDesk`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://quantum-desk.vercel.app/dashboard/post/${id}`,
      siteName: "QuantumDesk",
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : [],
    },
  };
}

/* ──────────────── 🧩 Page ──────────────── */
export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return notFound();

  return (
    <Suspense fallback={<Skeleton className={'container max-w-3xl mx-auto py-10 space-y-8'}/>}>
          <article className="container max-w-3xl mx-auto py-10 space-y-8">
            <Suspense fallback={<Skeleton className="rounded-2xl shadow-md border border-[#223649] bg-[#101a23] text-white" />}>
                    <Card className="rounded-2xl shadow-md border border-[#223649] bg-[#101a23] text-white">
        <CardContent className="p-6 space-y-5">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-400 text-sm">
            By {post.author?.username || "Unknown"} •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {post.image && (
            <div className="relative w-full h-64">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p>{post.content}</p>
          </div>

          {/*  Like Button */}
          <div className="pt-4">
            <LikeButton  postId={id} initialLikes={post.likes || 0} totle={post.likes } />
          </div>
        </CardContent>
      </Card>
            </Suspense>

      {/* 💬 Comments Section */}
      <CommentsSection postId={id} initialComments={post.comments || [] } />
    </article>
    </Suspense>
  );
}
