import Image from "next/image";
import Menu from "@/components/Menu";
import Login from "./auth/login/page";

export default function Home() {
  return (
    <div className="bg-[#0D1117] min-h-screen">
      <Login />
    </div>
  );
}
