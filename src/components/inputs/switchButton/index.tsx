import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/classNames";

interface ISwitchButton {
  label: string;
  enabled: boolean;
  setEnabled: (checked: boolean) => void;
}

const SwitchButton: React.FC<ISwitchButton> = ({ label, enabled, setEnabled }) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex-grow flex flex-col">
        <Switch.Label as="span" className="text-base" passive>
          {label}
        </Switch.Label>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-blue-navy' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}

export default SwitchButton;
