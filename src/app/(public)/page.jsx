// src/app/page.jsx
import Empowering from "../components/Empowering";
import Featured from "../components/Featured";
import Hero from "../components/Hero";
import Saying from "../components/Saying";

export default function Page() {
  return (
    <main className="container mx-auto px-4 flex flex-col gap-16 py-8">
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
    </main>
  )
}
