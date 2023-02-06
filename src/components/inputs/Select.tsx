import { Control, useController } from 'react-hook-form';

interface SelectProps {
  name: string;
  options: [string | number, string | number][];
  control: Control;
  extraClasses: string;
}

export default function Select(props: SelectProps) {
  const { control, name, options, extraClasses } = props;

  const { field } = useController({
    name,
    control,
    defaultValue: options[0][0]
  });

  return (
    <select {...field} className={`bg-gray-syn8 rounded-md ${extraClasses}`}>
      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
