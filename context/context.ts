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
    let isMounted = true;
    if (isMounted) context.setItems(items);
    return () => {
      isMounted = false;
    };
  }, []);
};

export const useGetBreadCrumbs = () => {
  const context = useContext(BreadCrumbContext);
  return context.items;
};
