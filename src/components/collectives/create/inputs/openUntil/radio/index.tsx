import { RadioButtons } from '@/components/buttons/radioButtons';

export enum OpenUntil {
  FUTURE_DATE = 0,
  MAX_MEMBERS = 1
  // MANUALLY_CLOSED = 2
}

interface Props {
  openUntil: OpenUntil;
  setOpenUntil: (newOpenUntil: OpenUntil) => void;
}

export const RadioButtonsOpenUntil: React.FC<Props> = ({
  openUntil,
  setOpenUntil
}) => {
  return (
    <RadioButtons
      options={[
        'A future date',
        'A max number of collective NFTs are claimed'
        // 'I close it'
      ]}
      activeIndex={openUntil}
      handleIndexChange={(index) => {
        setOpenUntil(index);
      }}
    />
  );
};
