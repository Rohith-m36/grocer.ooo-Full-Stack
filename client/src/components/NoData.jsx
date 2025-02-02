import React from 'react';
import noDataImage from '../assets/nothing here yet.webp';

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4 bg-gray-50 rounded-lg shadow-xl max-w-xs mx-auto">
      <img
        src={noDataImage}
        alt="No Data"
        className="w-36 h-36 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
      />
      <p className="text-xl font-semibold text-gray-700">No Data</p>
      <p className="text-sm text-neutral-500">It seems like there's nothing here yet. Please check back later.</p>
    </div>
  );
};

export default NoData;
