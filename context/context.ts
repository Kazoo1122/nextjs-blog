import { createContext, useContext, useEffect, useRef } from 'react';
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
  const flagRef = useRef(false);
  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    if (flagRef.current) context.setItems(items);
    return () => {
      flagRef.current = true;
    };
  }, [context, items]);
};

// ゲッターのカスタムフック
export const useGetBreadCrumbs = () => {
  const context = useContext(BreadCrumbContext);
  return context.items;
};
