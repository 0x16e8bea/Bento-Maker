'use client';

import React, { useState, useEffect, useRef } from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import FloatingButton from './FloatingButton';

const BentoGrid: React.FC = () => {
  const [items, setItems] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const muuriInstance = useRef<Muuri | null>(null);

  useEffect(() => {
    if (gridRef.current && !muuriInstance.current) {
      muuriInstance.current = new Muuri(gridRef.current, {
        dragEnabled: true,
        items: '.item',
      });
      muuriInstance.current.layout();
    }
  }, []);

  const resizeItem = (index: number, direction: string) => {
    console.log(`Resizing item at index ${index} in direction ${direction}`);
    if (gridRef.current) {
      const item = gridRef.current.children[index] as HTMLElement;
      const currentWidth = parseInt(item.getAttribute('data-w') || '1');
      const currentHeight = parseInt(item.getAttribute('data-h') || '1');
      const step = 1;

      switch(direction) {
        case 'up':
          item.setAttribute('data-h', Math.max(1, currentHeight - step).toString());
          break;
        case 'down':
          item.setAttribute('data-h', (currentHeight + step).toString());
          break;
        case 'left':
          item.setAttribute('data-w', Math.max(1, currentWidth - step).toString());
          break;
        case 'right':
          item.setAttribute('data-w', (currentWidth + step).toString());
          break;
      }

      updateItemSize(item);
      muuriInstance.current?.refreshItems().layout();
    }
  };

  const updateItemSize = (item: HTMLElement) => {
    const margin = 10;
    const width = parseInt(item.getAttribute('data-w') || '1') * (100 + margin) - margin;
    const height = parseInt(item.getAttribute('data-h') || '1') * (100 + margin) - margin;
    item.style.width = `${width}px`;
    item.style.height = `${height}px`;
  };

  const addItem = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems, prevItems.length + 1];
      setTimeout(() => {
        if (gridRef.current && muuriInstance.current) {
          const newItem = gridRef.current.children[gridRef.current.children.length - 1] as HTMLElement;
          if (!muuriInstance.current.getItems(newItem).length) {
            muuriInstance.current.add(newItem);
          }
        }
      }, 0);
      return newItems;
    });
  };

  return (
    <div className="grid-container">
      <div className="grid" ref={gridRef}>
        {items.map((number, index) => {
          const item = gridRef.current?.children[index] as HTMLElement;
          const width = parseInt(item?.getAttribute('data-w') || '1');
          const height = parseInt(item?.getAttribute('data-h') || '1');
          return (
            <GridItem
              key={number}
              number={number}
              width={width}
              height={height}
              onResize={(direction) => resizeItem(index, direction)}
            />
          );
        })}
      </div>
      <FloatingButton onClick={addItem} />
    </div>
  );
};

export default BentoGrid;