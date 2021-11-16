import { FaChevronRight } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import styles from '../styles/breadcrumbs.module.scss';
import Link from 'next/dist/client/link';

export type BreadCrumbItem = {
  title: string;
  path?: string;
};

export type BreadCrumbProps = {
  items: BreadCrumbItem[];
};

const BreadCrumbs = ({ items }: BreadCrumbProps) => {
  return (
    <ol className={styles.breadcrumbs}>
      <li className={styles.breadcrumbs_item}>
        <IoHomeSharp aria-hidden='true' className={styles.home_icon} />
      </li>
      {items.map(({ title, path }: any, index: number) => (
        <li className={styles.breadcrumbs_item} key={index}>
          {items.length - 1 !== index ? (
            <>
              <Link href={path}>
                <a>{title}</a>
              </Link>
              <FaChevronRight aria-hidden='true' className={styles.chevron_icon} />
            </>
          ) : (
            <span aria-current>{title}</span>
          )}
        </li>
      ))}
    </ol>
  );
};

export { BreadCrumbs };
