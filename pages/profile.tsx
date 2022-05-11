import { Layout } from '../components/Layout';
import { useSetBreadCrumbs } from '../context/context';
import styles from '../styles/module/pages/profile.module.scss';
import { GiGuitarHead } from 'react-icons/gi';
import { BiRun, BiBookOpen } from 'react-icons/bi';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getApi, TagProps } from './index';
import { TagList } from '../components/TagList';

/**
 * プロフィールページのコンポーネント
 */
const Profile = (props: { tags: TagProps[] }) => {
  const pageTitle = 'PROFILE';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/profile' },
  ];
  const { tags } = props;
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className='wrapper'>
        <div className='contents_area'>
          <div className={styles.container_box}>
            <h3 className={styles.my_name_text}>
              <span>大平 和正 - Kazumasa Ohira -</span>
            </h3>
            <div className={styles.account_area}>
              <Link href={'https://github.com/Kazoo1122/'}>
                <a>
                  <FaGithub size={36} className={styles.profile_icon} />
                </a>
              </Link>
              <Link href={'https://twitter.com/kazoo_1122'}>
                <a>
                  <FaTwitter size={36} color={'#00acee'} className={styles.profile_icon} />
                </a>
              </Link>
            </div>
            <p className={styles.profile_content}>
              30代の遅咲き（？）エンジニア。
              <br />
              ものぐさな性分から最近になって勉強にハマる。
              <br />
              新卒で小売業界に飛び込むも、紆余曲折を経てエンジニアへ転身。
              <br />
              大好きなTVゲームは封印し、スキルアップに勤しむ日々を送る。
            </p>
          </div>

          <div className={styles.container_box}>
            <h4 className={styles.profile_title}>SKILL</h4>
            <h5 className={styles.profile_subtitle}>LANGUAGES</h5>
            <p className={styles.profile_content}>
              JavaScript, TypeScript, Google Apps Script, PHP, <br />
              Python, SQL, VBA(Excel, Access), VBS
            </p>
            <h5 className={styles.profile_subtitle}>FRAMEWORKS</h5>
            <p className={styles.profile_content}>Laravel, React, Next.js</p>
            <h5 className={styles.profile_subtitle}>OTHERS</h5>
            <p className={styles.profile_content}>AWS, RPA(Robo-Pat, WinActor), XD, Premiere Pro</p>
          </div>
          <div className={styles.container_box}>
            <h4 className={styles.profile_title}>FAVORITE</h4>
            <ol>
              <li className={styles.profile_list_item}>
                <BiBookOpen size={30} className={styles.hobby_icon} />
                Study(Mathematics)
              </li>
              <li className={styles.profile_list_item}>
                <BiRun size={30} className={styles.hobby_icon} />
                Running
              </li>
            </ol>
          </div>
        </div>
        <div className='side_area'>
          <TagList tags={tags} />
        </div>
      </div>
    </Layout>
  );
};

// タグ一覧のデータを取得
export const getStaticProps: GetStaticProps<{ tags: TagProps[] }> = async () => {
  const url = process.env.server + `/api/tags-list`;
  const tags = await getApi(url);
  return {
    props: {
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Profile;
