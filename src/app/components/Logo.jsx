

import { Source_Code_Pro } from "next/font/google";

const freckle = Source_Code_Pro({
  subsets: ["latin"],
  weight: "600", 
});

export default function Logo() {
  return (
    <div className={`${freckle.className} w-max text-2xl text-black `}>
      QuantumLeap
    </div>
  );
}
