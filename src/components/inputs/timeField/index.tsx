import React, { useState } from 'react';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { default as _moment } from 'moment-timezone';
import moment from 'moment';

const TimeField: React.FC = (): React.ReactElement => {
  const [value, setValue] = useState('0');

  const onChange = (e: any) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  const error = false;

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');
  const defaultTime = now.setHours(23, 59, 0);

  console.log({
    timeZoneString,
    tz,
    default: moment(defaultTime).format('hh[:]mma')
  });
  return (
    <InputFieldWithToken
      placeholderLabel={moment(defaultTime).format('hh[:]mma')}
      symbolDisplayVariant={SymbolDisplay.ONLY_SYMBOL}
      onChange={(e) => {
        onChange(e);
      }}
      extraClasses={`flex w-full min-w-0 text-base font-whyte ${
        error ? 'border border-red-500 focus:border-red-500' : ''
      } flex-grow dark-input-field-advanced`}
      value={value}
      depositTokenSymbol={tz}
    />
  );
};

export default TimeField;
