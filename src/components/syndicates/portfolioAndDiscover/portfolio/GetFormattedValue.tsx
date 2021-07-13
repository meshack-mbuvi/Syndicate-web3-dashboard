import React, { useEffect, useState } from "react";
import { ifRows } from "./interfaces";
import {
  formatNumbers,
  floatedNumberWithCommas,
} from "@/utils/formattedNumbers";

export const GetFormattedDepositsAmount = ({
  row: { depositTotal, depositERC20TokenSymbol },
}: ifRows) => {
  const [formattedNumber, setFormattedNumber] = useState(0);

  useEffect(() => {
    // format deposits amount and add the correct suffix
    // depending on whether the amount exceeds 999.
    setFormattedNumber(formatNumbers(parseFloat(depositTotal)));
  }, [depositTotal, depositERC20TokenSymbol]);

  return (
    <div className="flex flex-row items-center w-full visibility-container">
      <div className="w-full visibility-container">
        <div className="relative w-full tooltip">
          <div>
            {formattedNumber} {depositERC20TokenSymbol}
          </div>
          {/* Tooltip to show actual deposit amount for formatted values  */}
          {+depositTotal > 999 ? (
            <div
              className={`tooltiptext invisible visibility-hover absolute ${
                depositTotal && depositTotal.toString().length === 1
                  ? `-left-2`
                  : `-left-1`
              } w-full`}
            >
              <div className="relative bg-gray-9 p-4 rounded-custom">
                <div>
                  <table className="table-fixed w-full">
                    <thead className="mb-2">
                      <tr className="mb-4 text-sm">
                        <th className="font-bold text-gray-dim">
                          <b>Token</b>
                        </th>
                        <th className="font-bold text-gray-dim">
                          <b>Amount Deposited</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-90">
                      <tr className="font-whyte-light">
                        <td className="font-whyte-light relative py-2 text-xs">
                          {depositERC20TokenSymbol}
                        </td>
                        <td className="font-whyte-light relative py-2 text-xs">
                          {floatedNumberWithCommas(depositTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
