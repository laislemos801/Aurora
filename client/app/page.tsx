import AllProjects from "@/components/home/allProjects";
import CardsPorjects from "@/components/home/cardsProjects";
import Statistics from "@/components/home/statistics";
import { IoSearchSharp } from "react-icons/io5";

export default function Home() {
  return (
    <div className="w-full  h-full px-8 ">
      <div className="flex w-full justify-between px-8 mb-4">
        <p className="text-3xl ">Meus projetos</p>
        <div className="flex bg-[#F6F6F6] text-[#8C8C8C] items-center gap-2 py-3 px-4 rounded-full w-3/12">
          <IoSearchSharp />
          <input type="text" name="" id="" placeholder="Pesquisar" />
        </div>
      </div>
      <div className="w-full h-6/12 flex relative justify-end">
        <div className="flex absolute left-0 top-[25%] w-12/12">
          <AllProjects />
        </div>
        <div className="w-[97%] h-full bg-[#C288B3] rounded-4xl flex">
          <div className="h-full w-4/12" />
          <div
            className="h-full w-8/12  flex items-center pl-8 overflow-y-auto px-8"
            style={{
              scrollbarWidth: "none",
            }}
          >
            <div>
              <CardsPorjects />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full h-6/12 pt-6 p-8">
            <Statistics/>
        </div>
      </div>
    </div>
  );
}
