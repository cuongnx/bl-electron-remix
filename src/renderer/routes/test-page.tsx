import React from 'react';

const TestPage: React.FC = () => {
  const onTitleClicked = () => {
    alert('Title clicked');
  };

  return (
    <div>
      <h1 onClick={onTitleClicked}>TEST PAGE</h1>
    </div>
  );
};

export default TestPage;
