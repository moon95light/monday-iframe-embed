import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    error && (
      <div className="error-container">
        <div className="error">
          {error}
        </div>
      </div>
    )
  );
};

export default ErrorDisplay;
