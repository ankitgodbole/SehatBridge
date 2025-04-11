import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <MutatingDots
        visible={true}
        height={100}
        width={100}
        color="#007BFF"
        secondaryColor="#0056b3"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    </div>
  );
};

export default Loader;
