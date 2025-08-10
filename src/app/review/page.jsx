import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function page() {
  return (
    <>
      <form className="w-1/2 mx-auto">
        <Input className="mb-4 bg-[#21364A]" name="title" placeholder="Title" />
        <textarea rows={5} className=" mb-4 bg-[#21364A] border-2 border-gray-300 w-full resize-none rounded-md"></textarea>
        <textarea rows={5} className=" mb-4 bg-[#21364A] border-2 border-gray-300 w-full resize-none rounded-md"></textarea>
        <Input className="mb-4 bg-[#21364A]" name="tag" placeholder="Tag" />
        <Input className="mb-6 bg-[#21364A]" name="media" placeholder="Media" />
        <div className="flex gap-8">
          <Button className="bg-gray-700">Save Draft</Button>
          <Button>Submit for Review</Button>
        </div>
      </form>
    </>
  );
}
