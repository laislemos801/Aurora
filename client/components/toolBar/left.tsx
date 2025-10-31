import Image from "next/image";
import { PiHouseBold } from "react-icons/pi";
import { FaRegNoteSticky } from "react-icons/fa6";
import icon from "@/public/for_you.svg";
import logo from "@/public/logo.png";
import { MdExitToApp } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

export default function ToolBarLeft() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div  className="bg-[#FCF3FA] w-full h-full flex flex-col justify-between items-center pb-8">
      <Image src={logo} alt={"logo"} width={1920} height={1080} />

      <div className="flex flex-col gap-8 items-center text-[#C288B3] ">
        <div
          className={`${
            pathname == "/" && "bg-[#90416B] text-white p-2 rounded-full"
          } cursor-pointer`}
          onClick={() => router.push("/")}
        >
          {" "}
          <PiHouseBold size={30} />
        </div>
        <div
          className={`${
            pathname == "/projects-info" &&
            "bg-[#90416B] text-white p-2 rounded-full"
          } cursor-pointer`}
          onClick={() => router.push("/projects-info")}
        >
          <FaRegNoteSticky size={26} />
        </div>
        <div
          className={`${
            pathname == "/edit-profile" &&
            "bg-[#90416B] text-white p-2 rounded-full"
          } cursor-pointer`}
          onClick={() => router.push("/edit-profile")}
        >
          <Image
            src={icon}
            alt={"icone"}
            width={1920}
            height={1080}
            className="w-[30px]"
          />
        </div>
      </div>

      <button className="rotate-180">
        <MdExitToApp size={30} className="text-[#C288B3]" />
      </button>
    </div>
  );
}
