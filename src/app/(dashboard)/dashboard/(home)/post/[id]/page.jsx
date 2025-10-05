import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "@/components/dashboard/home-user/LikeButton";
import CommentsSection from "./CommentsSection";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_URL_API;

/* ──────────────── 📦 Fetch Post ──────────────── */
async function getPost(id) {
  try {
    const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
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
    <div className="container max-w-3xl mx-auto py-10 space-y-8">
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

          {/* ❤️ Like Button */}
          <div className="pt-4">
            <LikeButton postId={id} initialLikes={post.likes || 0} />
          </div>
        </CardContent>
      </Card>

      {/* 💬 Comments Section */}
      <CommentsSection postId={id} initialComments={post.comments || []} />
    </div>
  );
}
