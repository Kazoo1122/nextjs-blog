import { BreadCrumbs } from '../components/BreadCrumbs';
import { Layout } from '../components/Layout';
import { useSetBreadCrumbs } from '../context/context';
import styles from '../styles/profile.module.scss';
import { GiGuitarHead } from 'react-icons/gi';
import { BiRun } from 'react-icons/bi';

export default function Profile() {
  const pageTitle = 'PROFILE';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/profile' },
  ];
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.profile_wrapper}>
        <div className='contents_area'>
          <div className={styles.container_box}>
            <h3 className={styles.my_name_text}>
              <span>大平　和正　- Kazumasa Ohira -</span>
            </h3>
            <p>
              新卒で小売業界に飛込み、紆余曲折を経てシステム開発に従事。
              <br />
              大嫌いだった勉強が30代で楽しくなり、
              <br />
              大好きなテレビゲームを封印しIT技術の習得に没頭中。
              <br />
              遅咲き(？)中途エンジニアとして、日々の学びをつづります。
            </p>
          </div>

          <div className={styles.container_box}>
            <h4 className={styles.skill_title}>SKILL</h4>
            <h5>LANGRAGE</h5>
            <p>JavaScript , TypeScript , Python , SQL , VBA , VBS</p>
            <h5>TOOL</h5>
            <p>RPA ( WinActor , PowerAutomate , Robopat ) , Adobe XD , Premiere Pro</p>
          </div>
          <div className={styles.container_box}>
            <h4>FAVORITE</h4>
            <ol>
              <li>
                <GiGuitarHead size={30} className={styles.hobby_icon} />
                Guitar ( I ❤️ Jimi Hendrix!! )
              </li>
              <li>
                <BiRun size={30} className={styles.hobby_icon} />
                Running
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
}
