'use client';

import React, { useState, useEffect, useRef } from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import FloatingButton from './FloatingButton';

interface GridItemData {
  id: number;
  width: number;
  height: number;
  image: string | null;
  link: string | null;
}

const BentoGrid: React.FC = () => {
  const [items, setItems] = useState<GridItemData[]>([]);
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
      const newItem: GridItemData = {
        id: prevItems.length + 1,
        width: 1,
        height: 1,
        image: null,
        link: null,
      };
      const newItems = [...prevItems, newItem];
      setTimeout(() => {
        if (gridRef.current && muuriInstance.current) {
          const newElement = gridRef.current.children[gridRef.current.children.length - 1] as HTMLElement;
          if (!muuriInstance.current.getItems(newElement).length) {
            muuriInstance.current.add(newElement);
          }
        }
      }, 0);
      return newItems;
    });
  };

  const saveGrid = () => {
    const gridData = items.map((item, index) => {
      const element = gridRef.current?.children[index] as HTMLElement;
      return {
        ...item,
        width: parseInt(element.getAttribute('data-w') || '1'),
        height: parseInt(element.getAttribute('data-h') || '1'),
      };
    });
    const jsonData = JSON.stringify(gridData);
    localStorage.setItem('bentoGridData', jsonData);
    alert('Grid saved successfully!');
  };

  const loadGrid = () => {
    const savedData = localStorage.getItem('bentoGridData');
    if (savedData) {
      const parsedData: GridItemData[] = JSON.parse(savedData);
      setItems(parsedData);
      setTimeout(() => {
        if (muuriInstance.current) {
          muuriInstance.current.remove(muuriInstance.current.getItems());
          muuriInstance.current.add(gridRef.current?.children);
          muuriInstance.current.layout();
        }
      }, 0);
    }
  };

  const updateItemData = (index: number, data: Partial<GridItemData>) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], ...data };
      return newItems;
    });
  };

  return (
    <div className="grid-container">
      <div className="grid" ref={gridRef}>
        {items.map((item, index) => (
          <GridItem
            key={item.id}
            number={item.id}
            width={item.width}
            height={item.height}
            image={item.image}
            link={item.link}
            onResize={(direction) => resizeItem(index, direction)}
            onUpdateData={(data) => updateItemData(index, data)}
          />
        ))}
      </div>
      <FloatingButton onClick={addItem} />
      <button onClick={saveGrid} className="save-button">Save Grid</button>
      <button onClick={loadGrid} className="load-button">Load Grid</button>
    </div>
  );
};

export default BentoGrid;