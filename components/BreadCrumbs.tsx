import { FaChevronRight } from 'react-icons/fa';
import styles from '../styles/Index.module.scss';
import Link from 'next/dist/client/link';

const BreadCrumbs = ({ visitedLists }: any) => {
  return (
    <ol className={styles.breadcrumbs}>
      {visitedLists.map(({ title, path }: any, index: any) => (
        <li className={styles.breadcrumbs_item} key={index}>
          {visitedLists.length - 1 !== index ? (
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
