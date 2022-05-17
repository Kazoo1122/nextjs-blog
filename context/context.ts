import { createContext, useContext, useEffect } from 'react';
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
  const context = useContext(BreadCrumbContext);
  useEffect(
    () => {
      let isMounted = true;
      if (isMounted) context.setItems(items);
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

// ゲッターのカスタムフック
export const useGetBreadCrumbs = () => {
  const context = useContext(BreadCrumbContext);
  return context.items;
};
