

import { Freckle_Face } from "next/font/google";

const freckle = Freckle_Face({
  subsets: ["latin"],
  weight: "400", 
});

export default function Logo() {
  return (
    <div className={`${freckle.className} w-max text-white text-3xl bg-indigo-500 rounded-b-md`}>
      QuantumDesk
    </div>
  );
}
