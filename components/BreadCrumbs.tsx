import { FaChevronRight } from 'react-icons/fa';
import styles from '../styles/Index.module.scss';
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
      {items.map(({ title, path }: any, index: number) => (
        <li className={styles.breadcrumbs_item} key={index}>
          {items.length - 1 !== index ? (
            <>
              <Link href={path}>{title}</Link>
              <FaChevronRight aria-hidden='true' className='chevron' />
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
