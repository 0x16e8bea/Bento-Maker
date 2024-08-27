import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  console.log('FloatingButton rendered');
  return (
    <button
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => {
        console.log('FloatingButton clicked');
        onClick();
      }}
    >
      +
    </button>
  );
};

export default FloatingButton;