"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function UserData() {
  const [activeTab, setActiveTab] = useState("about");
  console.log(activeTab);
  return (
    <>
      <Tabs value={activeTab} className="px-4">
        <TabsList className="bg-transparent">
          <TabsTrigger
            className="   relative text-white bg-transparent
    data-[state=active]:text-[#AD91C9]
    before:content-[''] before:absolute before:left-0 before:bottom-0
    before:h-[2px] before:bg-white before:transition-all
    before:w-0 data-[state=active]:before:w-full data-[state=active]:bg-transparent"
            value="about"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setActiveTab("myposts");
            }}
            className="   relative text-white  bg-transparent
    data-[state=active]:text-[#AD91C9]
    before:content-[''] before:absolute before:left-0 before:bottom-0
    before:h-[2px] before:bg-white before:transition-all
    before:w-0 data-[state=active]:before:w-full data-[state=active]:bg-transparent"
            value="myposts"
          >
            My Posts
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setActiveTab("activities");
            }}
            className="   relative text-white  bg-transparent
    data-[state=active]:text-[#AD91C9]
    before:content-[''] before:absolute before:left-0 before:bottom-0
    before:h-[2px] before:bg-white before:transition-all
    before:w-0 data-[state=active]:before:w-full data-[state=active]:bg-transparent"
            value="activities"
          >
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent className="text-white" value="about">
          <h2 className="mb-2 text-[#AD91C9] "> Bio</h2>
          <p className="mb-4 text-sm w-full">
            Dr. Sharma is a leading researcher in quantum computing and
            information theory. Her work focuses on developing new algorithms
            and architectures for quantum computers, with applications in
            cryptography, optimization, and machine learning.
          </p>

          <h2 className="mb-2"> Research Interests</h2>
          <p className="mb-4 text-sm">
            Quantum Computing, Information Theory, Algorithms, Cryptography,
            Machine Learning
          </p>

          <h2 className="mb-2 text-[#AD91C9]"> Links</h2>
          <div className="flex items-center justify-between mb-2">
            <p>Personal Website</p>
            <Link href="/">
              <FaArrowRight className="w-[60px]" />{" "}
            </Link>
          </div>

          <div className="flex items-center justify-between mb-2">
            <p>Twitter</p>
            <Link href="/">
              <FaArrowRight className="w-[60px]" />{" "}
            </Link>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p>LinkedIn</p>
            <Link href="/">
              <FaArrowRight className="w-[60px]" />{" "}
            </Link>
          </div>
        </TabsContent>

        <TabsContent className="text-white" value="myposts">
          Pooooooooooooooooosts
        </TabsContent>

        <TabsContent className="text-white" value="activities">
          Activitieeeeeeeeeeeeeeeees{" "}
        </TabsContent>
      </Tabs>
    </>
  );
}
