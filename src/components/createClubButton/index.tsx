import { useRouter } from 'next/router';
import Image from 'next/image';

/**
 * Component to render button that navigates user to the club/DAO creation page
 * @param buttonText
 * @param showIcon
 * Button is displayed on the empty state for the portfolio page as well in the top
 * right corner when there are clubs/DAOs to show.
 */

interface ICreateClubButton {
  creatingClub?: boolean;
  showIcon?: boolean;
}

const CreateClubButton: React.FC<ICreateClubButton> = ({
  creatingClub = true,
  showIcon = true
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
      {showIcon ? (
        <div className="mr-3 flex items-center">
          <Image src={`/images/add.svg`} height={16} width={16} />
        </div>
      ) : null}
      <p className="ml-3">
        {creatingClub ? 'Create an investment club' : 'Create a collective'}
      </p>
    </button>
  );
};

export default CreateClubButton;
