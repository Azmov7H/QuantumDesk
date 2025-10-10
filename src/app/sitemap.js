export default async function sitemap() {
  try {
    // 🔹 اجلب البوستات من الـ API (غير مخزنة)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BE_API_URL}/api/posts`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch posts for sitemap");
      return [];
    }

    const posts = await res.json();

    // 🔹 الصفحات الثابتة
    const staticPages = [
      {
        url: "https://quantum-desk.vercel.app/",
        lastModified: new Date(),
        priority: 1.0,
      },
      {
        url: "https://quantum-desk.vercel.app/dashboard",
        lastModified: new Date(),
        priority: 0.9,
      },
      {
        url: "https://quantum-desk.vercel.app/auth/login",
        lastModified: new Date(),
        priority: 0.5,
      },
    ];

    // 🔹 بوستات الـ dynamic
    const dynamicPosts = posts.map((post) => ({
      url: `https://quantum-desk.vercel.app/post/${post._id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      priority: 0.8,
    }));

    return [...staticPages, ...dynamicPosts];
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    return [];
  }
}
