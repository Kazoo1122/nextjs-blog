import { Layout } from '../components/Layout';
import { useSetBreadCrumbs } from '../context/context';
import styles from '../styles/module/pages/profile.module.scss';
import { GiGuitarHead } from 'react-icons/gi';
import { BiRun } from 'react-icons/bi';

const Profile = () => {
  const pageTitle = 'PROFILE';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/profile' },
  ];
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.profile_wrapper}>
        <div className='contents_area'>
          <div className={styles.container_box}>
            <h3 className={styles.my_name_text}>
              <span>大平 和正 - Kazumasa Ohira -</span>
            </h3>
            <p>
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
            <h4 className={styles.skill_title}>SKILL</h4>
            <h5>LANGUAGES</h5>
            <p>
              JavaScript, TypeScript, Google Apps Script, PHP, <br />
              Python, SQL(MySQL), VBA(Excel, Access), VBS
            </p>
            <h5>OTHERS</h5>
            <p>
              React, Next.js, Linux( Ubuntu ),
              <br />
              RPA ( WinActor, PowerAutomate, Robopat ),
              <br />
              Adobe XD, Premiere Pro
            </p>
          </div>
          <div className={styles.container_box}>
            <h4>FAVORITE</h4>
            <ol>
              <li>
                <GiGuitarHead size={30} className={styles.hobby_icon} />
                Guitar
              </li>
              <li>
                <BiRun size={30} className={styles.hobby_icon} />
                Running
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Profile;
