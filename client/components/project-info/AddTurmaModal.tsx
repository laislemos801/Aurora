import { Input } from "@/components/ui/input";
import { IoMdClose } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  nomeTurma: string;
  setNomeTurma: (v: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (v: File | null) => void;
  onSave: () => void;
  onClose: () => void;
}

export function AddTurmaModal({
  nomeTurma,
  setNomeTurma,
  uploadedFile,
  setUploadedFile,
  onSave,
  onClose
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 sm:w-[480px] animate-fadeIn relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3B3B3B] rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-normal mb-4 text-[#C288B3] text-start">
          Adicionar Turma
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
              Nome da turma
            </label>
            <Input
              type="text"
              placeholder="Nome da turma"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
              className="border-[#C288B3] border-2 text-[#A1A1A1] pt-3 pb-3 text-sm sm:text-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[#353535] font-medium mb-1 text-sm md:text-lg">
              Adicionar arquivo
            </label>

            {uploadedFile ? (
              <div className="flex items-center justify-between p-2 border-2 border-[#C288B3] rounded-lg">
                <p className="text-[#C288B3] text-sm sm:text-md">
                  {uploadedFile.name}
                </p>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-[#90416B] hover:bg-[#C288B3] rounded-full p-1 transition"
                >
                  <IoTrashOutline size={20} />
                </button>
              </div>
            ) : (
              <div
                className="relative w-full h-40 border-2 border-[#C288B3] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3EAF5] transition"
                onClick={() => document.getElementById("fileUpload")?.click()}
              >
                <div className="text-[#C288B3] mb-2">
                  <FiUpload size={40} />
                </div>
                <p className="text-[#C288B3] text-sm sm:text-md text-center">
                  Arraste ou insira um arquivo xls, xlsx ou csv
                </p>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".xls, .xlsx, .csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onSave}
              className="bg-[#C288B3] text-[#FCF3FA] font-semibold px-6 sm:px-10 py-2 rounded-lg hover:bg-[#90416B] transition"
            >
              Salvar turma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
