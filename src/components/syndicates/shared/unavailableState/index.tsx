/** component to show any unavailable state for deposits, withdrawals,
 * and instances where the wallet account is not connected.
*/

interface IUnavailableState {
  title: string;
  message: string;
}

export const UnavailableState = ({
  title,
  message,
}: IUnavailableState) => {
  return (
    <div>
        <p className="font-semibold text-xl p-2">{title}</p>
        <p className="p-4 pl-6 text-gray-500 text-sm">{message}</p>
    </div>
  );
};
