import { BreadCrumbs } from '../components/BreadCrumbs';
import { Layout } from '../components/Layout';
import { useGetBreadCrumbs } from '../context/context';
import { useRouter } from 'next/dist/client/router';
import styles from '../styles/module/pages/contact-sent.module.scss';
import Link from 'next/link';

const ContactSent = () => {
  const router = useRouter();
  const result = router.query.result;
  const pageTitle =
    result === 'success' ? 'Thank you for your message!' : 'Sorry, sending message failed.';
  const restItems = useGetBreadCrumbs();
  const items = [...restItems, { title: pageTitle, path: '/contact-sent' }];
  return (
    <Layout pageTitle={pageTitle} items={items}>
      <h2 className='page_title'>{pageTitle}</h2>

      <p className={styles.result}>
        {result === 'success'
          ? 'メッセージありがとうございます！'
          : '申し訳ありません。送信失敗したためメッセージが届いていません。' +
            '\n' +
            '恐れ入りますが下記までメールをお願いします。'}
      </p>
      <Link href='mailto:kazoo1122@experienced.work'>
        <a className={styles.mail}>{result === 'failed' ? 'kazoo1122@experienced.work' : ''}</a>
      </Link>
    </Layout>
  );
};
export default ContactSent;
