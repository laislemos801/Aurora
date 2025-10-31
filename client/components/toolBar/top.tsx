import Image from "next/image";
import aurora from "@/public/AURORA.png";
import { MdOutlineCircleNotifications } from "react-icons/md";
import avatar from "@/public/avatar.png";

export default function ToolBarTop() {
  return (
    <div className="bg-[#FCF3FA] w-full h-full flex items-center justify-between pr-8">
      <div>
        <Image
          src={aurora}
          alt={"aurora"}
          width={1920}
          height={1080}
          className="w-12/12 mt-6 "
        />
      </div>
      <div className="flex items-center w-auto gap-8">
        <button className="text-white bg-[#7B6294] rounded-md p-2 px-7">Novo projeto</button>
        <button>
          <MdOutlineCircleNotifications size={37} className="text-[#C288B3] mr-8"/>
        </button>
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt={"aurora"}
            width={1920}
            height={1080}
            className="w-5/12"
          />
          <p className="w-full">Prof. Silva</p>
        </div>
      </div>
    </div>
  );
}
