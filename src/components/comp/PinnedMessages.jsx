import Image from "next/image";
import React from "react";

export default function PinnedMessages() {
  return (
    <>
      <h2 className="text-white mb-6 text-2xl">Pinned Messages</h2>

      <div className="text-white flex gap-2">
        <div className="w-[50px] h-[50px]">
            <Image
          src="/dr3.png"
          width={50}
          height={50}
          className="rounded-full object-cover"
          alt="dr image "
        />
        </div>
        <div>
          <div className="flex gap-2 ">
            <h3 className="text-white">Dr. Sophia Chen</h3>
            <p>10:00 AM</p>
          </div>
          <p className="text-white w-full">
            Yes, tomorrow at 10 AM works for me. I'll prepare a summary of the
            key findings to share.
          </p>
        </div>
        <br />
      </div>

      <div></div>
    </>
  );
}
