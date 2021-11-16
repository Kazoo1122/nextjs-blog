import { createContext } from 'react';
import { BreadCrumbItem } from '../components/BreadCrumbs';

type BreadCrumbContextType = {
  setItems: (items: BreadCrumbItem[]) => void;
  items: BreadCrumbItem[];
};

export const BreadCrumbContext = createContext({} as BreadCrumbContextType);
