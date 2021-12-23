import React from "react";

const PiiWarning: React.FC = () => {
  return (
    <div className="w-full p-6 mt-4 rounded-lg font-whyte text-yellow-saffron bg-brown-dark">
      <p className="text-base">
        To comply with privacy regulations, please do not enter Personal
        Identifiable Information (PII) of any individual involved in
        this club or investment.
      </p>
    </div>
  )
};

export default PiiWarning;
