import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { IoIosCopy } from "react-icons/io";
import { BiSolidSave } from "react-icons/bi";
import { GiMeshBall } from "react-icons/gi";
import { SlGlobe } from "react-icons/sl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Newposts() {
  return (
    <>
      <form className="sm:flex-col md:flex-row flex text-white p-8 gap-12">
        <div className="sm:w-full lg:w-1/2">
          <label className="pl-3 " htmlFor="title">
            Title
          </label>
          <br />
          <Input
            id="title"
            name="title"
            className="w-1/2 border-[#172633] mb-6"
          />
          <label className="pl-3 " htmlFor="abstract">
            Abstract
          </label>
          <br />
          <textarea
            className="border-2 border-[#172633] w-1/2 rounded-md p-3 resize-none mb-8 "
            rows={5}
            name="abstract"
            id="abstract"
           placeholder="Write abstract..."
          />

          <ul className="mb-4 flex gap-8 ">
            <li>
              <Link href="/" className="relative before:content-[''] before:absolute before:w-0 hover:before:h-[2px] hover:before:bottom-[-2px] before:transition-all before:transition-200 hover:before:left-0 hover:before:bg-white hover:before:w-full">Facts</Link>
            </li>
            <li>
              <Link href="/"  className="relative before:content-[''] before:absolute before:w-0 hover:before:h-[2px] hover:before:bottom-[-2px] before:transition-all before:transition-200 hover:before:left-0 hover:before:bg-white hover:before:w-full">Theories</Link>
            </li>
            <li>
              <Link href="/"  className="relative before:content-[''] before:absolute before:w-0 hover:before:h-[2px] hover:before:bottom-[-2px] before:transition-all before:transition-200 hover:before:left-0 hover:before:bg-white hover:before:w-full">References</Link>
            </li>
          </ul>

          <hr className="text-[#172633]" />

          <div className="flex justify-between items-center my-6">
            <div className="flex gap-4 items-center">
              <IoIosCopy className="text-2xl " />
              <BiSolidSave className="text-2xl " />
              <GiMeshBall className="text-2xl " />
            </div>
            <Button className="bg-[#0A80F5]">
              <SlGlobe />
              <span>Public</span>
            </Button>
          </div>

          <textarea
            className="border-2 border-[#172633] w-full rounded-md p-3 resize-none mb-4 "
            name="review"
            id=""
            placeholder="review"
            rows={8}
          />
          <Button className="bg-[#0A80F5]">Submit for Review</Button>
        </div>

        <div className="sm:w-full lg:w-1/4">
          <label htmlFor="tages">Tags</label>
          <br />
          <Input placeholder="add tages" className="border-[#172633] mt-4" />
          <br />

          <label htmlFor="category">Category</label>
          <br />
          {/* <Input placeholder="Select Category " className="border-[#172633] mt-4" /> */}

          <Select>
            <SelectTrigger className="w-full border-[#172633]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facts">Facts</SelectItem>
              <SelectItem value="theories">Theories</SelectItem>
              <SelectItem value="references">References</SelectItem>
            </SelectContent>
          </Select>
          <br />

          <label htmlFor="tages">Status</label>
          <br />
          <Input className="border-[#172633] mt-4" />
          <br />
          <label htmlFor="img">Feature Image</label>
          <br />
          <div className="relative">
            <Input
              type="file"
              className="border-2 border-dashed border-[#172633] h-[230px] mt-6"
            />
            <div className="absolute flex flex-col justify-center items-center text-center top-[60px] left-[80px]">
              <h3>Upload Image</h3>
              <p className="mb-2 text-xs">Drag and drop or click to upload</p>
              <Button className="bg-[#21364A]">Uplo...</Button>
            </div>
          </div>

          <br />
          <p>Saved 5 minutes ago.</p>
        </div>
      </form>
    </>
  );
}
