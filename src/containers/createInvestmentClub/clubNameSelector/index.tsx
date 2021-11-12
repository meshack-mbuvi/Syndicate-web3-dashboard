import { useEffect, useState, useRef } from "react";
import { generateSlug } from "random-word-slugs";
import { useDebounce } from "@/hooks/useDebounce";
import { acronymGenerator } from "@/utils/acronymGenerator";
import { symbolValidation } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setInvestmentClubName,
  setInvestmentClubSymbolPlaceHolder,
} from "@/state/createInvestmentClub/slice";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { SettingsDisclaimerTooltip } from "../shared/SettingDisclaimer";
import useOnClickOutside from "../shared/useOnClickOutside";
import Fade from "@/components/Fade";

const ClubNameSelector: React.FC = () => {
  const ref = useRef();

  const {
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbolPlaceHolder,
    },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();
  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const [errors, setErrors] = useState("");
  const [hasSymbolBeenEdited, setSymbolEditState] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useOnClickOutside(ref, () => setIsButtonActive(false));

  const debouncedSymbol = useDebounce(investmentClubName, 500);

  useEffect(() => {
    if (debouncedSymbol && !hasSymbolBeenEdited) {
      dispatch(
        setInvestmentClubSymbolPlaceHolder(acronymGenerator(debouncedSymbol)),
      );
    } else if (!debouncedSymbol && !hasSymbolBeenEdited) {
      dispatch(setInvestmentClubSymbolPlaceHolder(""));
    }
  }, [debouncedSymbol]);

  useEffect(() => {
    // Dismiss error message after 1 second
    if (errors) {
      setTimeout(() => {
        setErrors("");
      }, 2000);
    }
  }, [errors]);

  useEffect(() => {
    if (investmentClubName && investmentClubSymbolPlaceHolder) {
      setNextBtnDisabled(false);
    } else {
      setNextBtnDisabled(true);
    }
  }, [investmentClubName, investmentClubSymbolPlaceHolder, setNextBtnDisabled]);

  const handleSymbolChange = (e) => {
    const _sym = (e.target.value as string).trim().toUpperCase();
    const { validSym, errorMsg } = symbolValidation(_sym);
    dispatch(setInvestmentClubSymbolPlaceHolder(validSym));
    setErrors(errorMsg); // It will default to empty string if no errors

    // This ensure we don't override what the user typed with our auto generated abbreviation
    setSymbolEditState(true);
    if (!_sym.length) {
      setSymbolEditState(false);
    }
  };

  const handleRandomizer = (e) => {
    e.preventDefault();
    setIsButtonActive(true);
    const slug = generateSlug(2, {
      format: "title",
      categories: {
        noun: [
          "media",
          "science",
          "sports",
          "technology",
          "thing",
          "time",
          "transportation",
          "animals",
        ],
        adjective: [
          "appearance",
          "color",
          "quantity",
          "shapes",
          "size",
          "sounds",
          "taste",
          "touch",
        ],
      },
    });
    dispatch(setInvestmentClubName(slug));
  };

  const activeClasses = "ring-1 ring-blue-navy";

  return (
    <Fade>
      <div className="flex flex-col space-y-6 pb-6 w-full lg:w-2/3">
        <div className="h3">What should we call this investment club?</div>
        <div>
          <div className="relative" data-tip data-for="change-settings-tip">
            <input
              className="block font-whyte text-base bg-transparent p-4 rounded-md border-1 w-full border-gray-24 focus:border-blue-navy outline-none text-white hover:border-gray-syn3"
              placeholder="Name (e.g. Friends With Benefits)"
              value={investmentClubName}
              onChange={(e) => dispatch(setInvestmentClubName(e.target.value))}
            />

            <button
              ref={ref}
              onClick={handleRandomizer}
              className="absolute inset-y-0 right-0 pr-4 py-3.5"
            >
              <div
                className={`flex flex-row items-center space-x-1 text-sm px-4 py-1.5 bg-gray-syn7 rounded-full text-center text-gray-syn4 hover:ring-1 hover:ring-blue-navy ${
                  isButtonActive && activeClasses
                }`}
              >
                <img src="/images/shuffle.svg" alt="" className="w-4 h-4" />
                <span>Randomize</span>
              </div>
            </button>
          </div>
          <SettingsDisclaimerTooltip
            id="change-settings-tip"
            tip="Cannot be modified after club is created"
          />
          <div className="rounded-xl bg-blue-navy bg-opacity-20 flex flex-row text-blue-navy items-center p-4 mt-4 space-x-3">
            <img className="w-5 h-5" src="/images/eye-open.svg" alt="" />
            <div className="text-sm">
              Stored on-chain publicly. If you do not wish to publicize your
              club’s name, generate a random one.
            </div>
          </div>
        </div>
        <div className="h3">a.k.a.</div>
        <div>
          <div className="relative mb-2">
            <span className="absolute inset-y-0 left-0 text-base symbol-prefix">
              syn
            </span>
            <input
              data-tip
              data-for="change-settings-tip"
              className="text-base font-whyte bg-transparent py-4 pl-12 rounded-md border-1 w-full border-gray-24 focus:border-blue-navy outline-none text-white hover:border-gray-syn3"
              placeholder="(e.g. FWB)"
              value={investmentClubSymbolPlaceHolder}
              onChange={handleSymbolChange}
            />
          </div>
          <div className="text-sm">
            {errors ? (
              <span className="text-red-semantic text-sm">{errors}</span>
            ) : (
              <span className="text-gray-3 text-sm">
                Set an easily recognizable symbol for your investment club token
                that powers the club&apos;s cap table management and governance
                infrastructure. Members receive this investment club token as
                proof of their deposit.
              </span>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default ClubNameSelector;
