import React, { useState } from 'react';
import Image from 'next/image';
import { buildUrl, isMobile } from '../../utils/calendarHelpers';

const items = [
  {
    title: 'Google calendar',
    name: 'google',
    icon: '/images/social/google.svg'
  },
  {
    title: 'Apple calendar',
    name: 'apple',
    icon: '/images/social/apple.svg'
  }
];

const AddToCalendar: React.FC<{ calEvent: any }> = ({ calEvent }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownLinkClick = (type: string) => {
    const url = buildUrl(calEvent, type);

    if (!isMobile() && (url.startsWith('data') || url.startsWith('BEGIN'))) {
      const filename = 'download.ics';
      const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, '_blank');
    }

    setShowDropdown(false);
  };

  return (
    <div className="relative inline-block text-center">
      <button
        className="flex flex-row items-center space-x-2 cursor-pointer outline-none"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Image
          height="20"
          width="20"
          className="items-center"
          src="/images/calendar.svg"
          alt=""
        />
        <span>Add to calendar</span>
      </button>
      {showDropdown && (
        <div className="w-62 mt-2 absolute z-20 top-5 -right-1/2 transition-all duration-500 ease-in-out">
          <ul className="rounded bg-gray-syn7 py-1">
            {items.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => handleDropdownLinkClick(item.name)}
                  className="flex justify-center space-x-3 hover:bg-gray-syn6 py-3 w-full text-white text-sm"
                >
                  <Image src={item.icon} height="18" width="18" alt="" />
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddToCalendar;
