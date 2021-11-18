import { createContext, useContext, useEffect } from 'react';
import { BreadCrumbItem } from '../components/BreadCrumbs';

type BreadCrumbContextType = {
  setItems: (items: BreadCrumbItem[]) => void;
  items: BreadCrumbItem[];
};

export const BreadCrumbContext = createContext({} as BreadCrumbContextType);

export const useSetBreadCrumbs = (items: BreadCrumbItem[]) => {
  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems([]);
    context.setItems(items);
  }, []);
};

export const useGetBreadCrumbs = () => {
  const context = useContext(BreadCrumbContext);
  return context.items;
};
