import { Button } from "@/components/ui/button";
import Empowering from "./components/Empowering";
import Featured from "./components/Featured";
import Hero from "./components/Hero";
import Saying from "./components/Saying";



export default function page() {

  return (
    <div className="flex w-4/5 ml-[10%] gap-8 items-center flex-col ">
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
      <p>Join the QuantumLeap Community</p>
      <Button>Join Now</Button>
    </div>
  )
}
