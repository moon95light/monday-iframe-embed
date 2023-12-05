import React from 'react';
import { Button, TextField } from 'monday-ui-react-core';

const InputForm = ({ url, handleUrlChange, handleUnfurl }) => {
  return (
    <div className="input-container">
      <TextField 
        placeholder="Enter URL" 
        value={url} 
        onChange={handleUrlChange} 
        className="input-field"
        size={TextField.sizes.MEDIUM}
      />
      <Button onClick={handleUnfurl} className="button">Embed</Button>
    </div>
  );
};

export default InputForm;
