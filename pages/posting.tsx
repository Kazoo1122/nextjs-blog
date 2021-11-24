import { Layout } from '../components/Layout';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useGetBreadCrumbs, useSetBreadCrumbs } from '../context/context';
import { useRouter } from 'next/dist/client/router';
import styles from '../styles/contact-sent.module.scss';

const Posting = () => {
  const router = useRouter();
  const result = router.query.result;
  const pageTitle = 'Posting' + result;

  //ぱんくずリスト関連
  const restItems = useGetBreadCrumbs();
  const items = [...restItems, { title: pageTitle, path: '/contact-sent' }];
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />
      <h2 className='page_title'>{pageTitle}</h2>

      <p className={styles.result}>{result === 'success' ? '投稿完了！' : '投稿失敗。。。'}</p>
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
};
export default Posting;
