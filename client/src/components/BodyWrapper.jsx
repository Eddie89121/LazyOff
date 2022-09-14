import React from 'react';

const BodyWrapper = ({children}) => {
  return (
      <div className="flex justify-content-center relative min-h-screen">
        <main className="max-w-screen-xl min-h-screen">{children}</main>
      </div>
  );
};

export default BodyWrapper;
