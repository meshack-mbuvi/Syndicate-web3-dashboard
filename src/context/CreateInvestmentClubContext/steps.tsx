import PlaceHolder from "@/containers/createInvestmentClub/placeHolder";
import AmountToRaise from "@/containers/createInvestmentClub/amountToRaise";

export default [
  {
    component: <PlaceHolder title="step 1" />, // TODO: replace PlaceHolder component with your component
  },
  {
    component: <AmountToRaise />,
  },
  {
    component: <PlaceHolder title="step 3" />, // TODO: replace PlaceHolder component with your component
  },

  {
    component: <PlaceHolder title="Review Page" />, // TODO: replace PlaceHolder component with your component
  },
];
