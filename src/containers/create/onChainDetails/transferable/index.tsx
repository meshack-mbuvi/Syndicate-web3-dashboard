/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { setTransferable } from "@/redux/actions/createSyndicate/syndicateOnChainData/transferable";
import { RootState } from "@/redux/store";
import { classNames } from "@/utils/classNames";
import { useDispatch, useSelector } from "react-redux";

interface ITransferOptions {
  title: string;
  icon: string;
  state: boolean;
}

const transferOptions: ITransferOptions[] = [
  {
    title: "Not transferable by the member",
    icon: "/images/lockClosed.svg",
    state: false,
  },
  {
    title: "Transferable by the member",
    icon: "/images/lockOpen.svg",
    state: true,
  },
];

const Transferable: React.FC = () => {
  const dispatch = useDispatch();

  const {
    transferableReducer: {
      createSyndicate: { transferable },
    },
  } = useSelector((state: RootState) => state);

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-2xl leading-8">
        Should members be able to transfer their ownership in this syndicate?
      </div>

      <div className="w-full">
        {transferOptions.map((option: ITransferOptions) => (
          <div
            key={option.title}
            className={classNames(
              transferable === option.state ? "border-blue" : "border-inactive",
              `relative rounded-lg border px-6 h-24 shadow-sm flex items-center space-x-3 ${
              transferable !== option.state && "hover:border-blue-50"
              } mb-4 cursor-pointer`,
            )}
            onClick={() => dispatch(setTransferable(option.state))}
          >
            <div
              className={classNames(
                transferable !== option.state && "opacity-60",
                "flex-shrink-0",
              )}
            >
              <img
                className="inline mr-4 h-5"
                src={option.icon}
                alt="syndicate-protocal"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={classNames(
                  transferable === option.state
                    ? "opacity-100"
                    : "opacity-50",
                  "text-base leading-6", "text-white"
                )}
              >
                {option.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transferable;
