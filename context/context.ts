import { createContext, useContext, useEffect, useCallback } from 'react';
import { BreadCrumbItem } from '../components/BreadCrumbs';

// パンくずリストをコンテキストに保存するために用意
type BreadCrumbContextType = {
  setItems: (items: BreadCrumbItem[]) => void;
  items: BreadCrumbItem[];
};

// パンくずリストの保存先
export const BreadCrumbContext = createContext({} as BreadCrumbContextType);

// セッターのカスタムフック
export const useSetBreadCrumbs = (items: BreadCrumbItem[]) => {
  let isMounted = true;
  const setMount = useCallback(() => {
    isMounted = false;
  }, []);
  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    if (isMounted) context.setItems(items);
    setMount();
  }, []);
};

// ゲッターのカスタムフック
export const useGetBreadCrumbs = () => {
  const context = useContext(BreadCrumbContext);
  return context.items;
};
