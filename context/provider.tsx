import { useState, FC, HTMLAttributes, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { BreadCrumbContext } from './context';
import { BreadCrumbItem } from '../components/BreadCrumbs';

export const BreadCrumbProvider: FC<HTMLAttributes<HTMLElement>> = ({ children }) => {
  //const router = useRouter();
  const [items, setItems] = useState([] as BreadCrumbItem[]);
  /*
  useEffect(() => {
    router.events.on('routeChangeComplete', () => setItems([]));
  }, []);

  const setBreadCrumbItems = (_items: BreadCrumbItem[]) => {
    if (items.length === 0) {
      setItems(_items);
    }
  };
  const getBreadCrumbItems = () => {
    return items;
  };
*/
  return (
    <>
      <BreadCrumbContext.Provider value={{ items, setItems }}>
        {children}
      </BreadCrumbContext.Provider>
    </>
  );
};
