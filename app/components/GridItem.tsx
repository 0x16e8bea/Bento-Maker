import React, { useState } from 'react';

interface GridItemProps {
  number: number;
  onResize: (direction: string) => void;
  width: number;
  height: number;
}

const GridItem: React.FC<GridItemProps> = ({ number, onResize, width, height }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const style = {
    width: `${width * 100}px`,
    height: `${height * 100}px`,
  };

  return (
    <div className="item" style={style} data-w={width} data-h={height}>
      <div className="item-content">
        {!image && <span className="item-number">{number}</span>}
        <div className="resize-buttons">
          <button className="resize-button" onClick={() => onResize('up')}>↑</button>
          <button className="resize-button" onClick={() => onResize('down')}>↓</button>
          <button className="resize-button" onClick={() => onResize('left')}>←</button>
          <button className="resize-button" onClick={() => onResize('right')}>→</button>
        </div>
        <label className="upload-button">
          Upload
          <input type="file" className="file-input" accept="image/*" onChange={handleUpload} />
        </label>
        {image && <img src={image} alt={`Item ${number}`} className="item-image" />}
      </div>
    </div>
  );
};

export default GridItem;