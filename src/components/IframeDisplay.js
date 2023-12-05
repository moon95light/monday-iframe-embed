import React from 'react';

const IframeDisplay = ({ iframeSrc }) => {
  return (
    <div className="iframe-container" dangerouslySetInnerHTML={{ __html: iframeSrc }} />
  );
};

export default IframeDisplay;
