import { useRouter } from "next/router";
import Image from "next/image";

const CreateClubButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      className="flex justify-center items-center bg-white text-black rounded-xl py-4 px-8 w-full sm:w-auto"
      onClick={() => {
        router.push(`/clubs/create`);
      }}
    >
      <Image src={`/images/add.svg`} height={16} width={16} />
      <p className="ml-3">Create an investment club</p>
    </button>
  );
};

export default CreateClubButton;
