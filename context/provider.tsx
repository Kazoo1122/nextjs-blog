import { useState, FC, HTMLAttributes } from 'react';
import { BreadCrumbContext } from './context';
import { BreadCrumbItem } from '../components/BreadCrumbs';

export const BreadCrumbProvider: FC<HTMLAttributes<HTMLElement>> = ({ children }) => {
  const [items, setItems] = useState([] as BreadCrumbItem[]);

  return (
    <>
      <BreadCrumbContext.Provider value={{ items, setItems }}>
        {children}
      </BreadCrumbContext.Provider>
    </>
  );
};
