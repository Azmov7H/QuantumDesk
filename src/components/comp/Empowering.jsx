"use client";

import { Card } from "@/components/ui/card";
import { FaFile, FaUsers } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

export default function Empowering() {
  const features = [
    { icon: <FaFile className="text-3xl" />, title: "Publish", description: "Easily submit and manage your research articles with our intuitive publishing tools." },
    { icon: <CiSearch className="text-3xl" />, title: "Discover", description: "Search and explore a wide range of scientific articles and verified theories." },
    { icon: <FaUsers className="text-3xl" />, title: "Collaborate", description: "Connect with fellow researchers and review publications together in real-time." },
  ];

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-2xl sm:text-3xl text-white font-semibold">Empowering Researchers</h2>
        <p className="text-white/80">
          QuantumLeap provides a suite of tools to streamline your research workflow.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-white shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col gap-3 items-center text-center">
              <div className="icon">{feature.icon}</div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-white/90">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
