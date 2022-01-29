import { FaChevronRight } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import styles from '../styles/module/components/breadcrumbs.module.scss';
import Link from 'next/dist/client/link';
import { useGetBreadCrumbs } from '../context/context';

// パンくずリストの各アイテム
export type BreadCrumbItem = {
  title: string;
  path?: string | RouterObj;
};

// 現在地以外はリンクを持つための型
type RouterObj = {
  pathname: string;
  query: { tag: string };
};

/**
 * ぱんくずリストのコンポーネント
 */
const BreadCrumbs = () => {
  const items = useGetBreadCrumbs();
  return (
    <ol className={styles.breadcrumbs_list}>
      <li className={styles.breadcrumbs_item}>
        <IoHomeSharp aria-hidden='true' className={styles.home_icon} />
      </li>
      {items.map(({ title, path }: any, index: number) => (
        <li className={styles.breadcrumbs_item} key={index}>
          {items.length - 1 !== index ? (
            <>
              <Link href={path}>
                <a className={styles.past_text}>{title}</a>
              </Link>
              <FaChevronRight aria-hidden='true' className={styles.chevron_icon} />
            </>
          ) : (
            <span className={styles.current_text} aria-current>
              {title}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};

export { BreadCrumbs };
