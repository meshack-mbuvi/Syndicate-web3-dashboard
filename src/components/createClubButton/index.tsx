import { useRouter } from 'next/router';
import Image from 'next/image';

const CreateClubButton: React.FC<{ creatingClub?: boolean }> = ({
  creatingClub = true
}) => {
  const router = useRouter();

  return (
    <button
      className="primary-CTA flex justify-center items-center w-full sm:w-auto"
      onClick={() => {
        creatingClub
          ? router.push(`/clubs/create`)
          : router.push(`/collectives/create`);
      }}
    >
      <Image src={`/images/add.svg`} height={16} width={16} />
      <p className="ml-3">
        {creatingClub ? 'Create an investment club' : 'Create a collective'}
      </p>
    </button>
  );
};

export default CreateClubButton;
