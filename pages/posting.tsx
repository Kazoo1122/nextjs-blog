import { Layout } from '../components/Layout';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useGetBreadCrumbs } from '../context/context';
import { useRouter } from 'next/dist/client/router';
import styles from '../styles/module/pages/contact-sent.module.scss';

const Posting = () => {
  const router = useRouter();
  const result = router.query.result;
  const lastID = router.query.id;
  const pageTitle = 'Posting ' + result;

  //ぱんくずリスト関連
  const restItems = useGetBreadCrumbs();
  const items = [...restItems, { title: pageTitle, path: '/contact-sent' }];
  return (
    <Layout pageTitle={pageTitle} items={items}>
      <h2 className='page_title'>{pageTitle}</h2>

      <p className={styles.result}>
        {result === 'success' ? `投稿完了！記事IDは「${lastID}」です。` : '投稿失敗。。。'}
      </p>
    </Layout>
  );
};
export default Posting;
