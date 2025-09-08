import React from "react";
import { IoIosCopy } from "react-icons/io";

export default function SharedDocuments() {
  const docs = [
    {
      name: "Research Proposal",
      lastEdited: "2 days ago",
    },
    {
      name: "Data Analysis Report",
      lastEdited: "1 week ago",
    },
    {
      name: "Meeting Notes",
      lastEdited: "3 weeks ago",
    },
  ];

  return (
    <>
      <h2 className="text-2xl text-white mb-6">Shared Documents</h2>
      {docs ? (
        docs.map((doc) => (
          <div key={doc.name} className="flex gap-6 mb-6">
            <div className="flex justify-center items-center p-2 bg-[#362447] w-fit rounded-md">
              <IoIosCopy className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-white">{doc.name}</h3>
              <p className="text-[#AD91C9]">LastEdited : {doc.lastEdited}</p>
            </div>
          </div>
        ))
      ) : (
        <p> loadin...</p>
      )}
    </>
  );
}
