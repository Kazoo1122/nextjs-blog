import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/module/components/layout.module.scss';
import { BreadCrumbItem, BreadCrumbs } from './BreadCrumbs';
import useMedia from 'use-media';

/**
 * メタデータを格納した型 Headコンポーネント内で使用
 */
type MetaProps = {
  pageTitle: string;
  pageUrl?: string;
  pageDescription?: string;
  children: React.ReactNode;
  items: BreadCrumbItem[];
};

const Layout = (props: MetaProps) => {
  const { pageTitle, pageUrl, pageDescription, children, items } = props;
  const siteTitle = 'レジ打ちからエンジニアになりました';
  const defaultDescription =
    'ショップ店員から色んな経験を経て中途のITエンジニアになった人のブログです';
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  const description = pageDescription
    ? `${pageDescription} | ${defaultDescription}`
    : defaultDescription;
  const ogType = pageTitle ? 'article' : 'blog';
  const { lg } = styles;
  const isLgSize = useMedia({ minWidth: lg });
  const [isOpen, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    isOpen && menuRef.current?.focus();
  }, [isOpen]);

  return (
    <div className='page'>
      <Head>
        <title>{title}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes'
        />
        <meta charSet='utf-8' />
        <meta name='description' content={description} />

        {/* ogp */}
        <meta property='og:site_name' content='レジ打ちからエンジニアになりました' />
        <meta property='og:url' content={pageUrl} />
        <meta property='og:type' content={ogType} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:locale' content='ja_JP' />

        {/* twitter */}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:site' content='@kazoo_1122' />
      </Head>

      <div className={styles.layout_wrapper}>
        <header className={styles.header_area}>
          <div className={styles.title_area}>
            <Link href='/'>
              <a>
                <h1 className={styles.title_text}>レジ打ちからエンジニアになりました</h1>
                <p className={styles.subtitle_text}>〜中途エンジニアの開発日誌〜</p>
              </a>
            </Link>
          </div>
          {isLgSize ? (
            <Navigation isLgSize={isLgSize} isOpen={isOpen} />
          ) : (
            <img
              className={styles.hamburger_btn}
              src='/images/hamburger.png'
              alt='hamburger'
              onClick={() => setOpen(!isOpen)}
              ref={menuRef}
              onBlur={() => setOpen(false)}
              tabIndex={0}
            />
          )}
        </header>
        {/*<div className={styles.dot_background_image} />*/}
        {isLgSize ? (
          <img
            className={styles.dot_background_image}
            src='images/dot_background_wh.png'
            alt='background'
          />
        ) : (
          <Navigation isLgSize={isLgSize} isOpen={isOpen} />
        )}
        <main className={styles.main_area}>
          <BreadCrumbs items={items} />
          {children}
          <BreadCrumbs items={items} />
        </main>
        <footer className={styles.footer_area}>
          <Link href='/'>
            <a> &copy; 2021 {siteTitle} </a>
          </Link>
        </footer>
      </div>
    </div>
  );
};

type navProps = {
  isLgSize: boolean;
  isOpen: boolean;
};
const Navigation = ({ isLgSize, isOpen }: navProps) => {
  return (
    <nav
      className={`${isLgSize ? styles.global_navigation_area : styles.slide_menu_area} ${
        isOpen ? styles.open : ''
      }`}
    >
      <ul>
        <li>
          <Link href='/'>BLOG</Link>
        </li>
        <li>
          <Link href={'/profile'}>PROFILE</Link>
        </li>
        <li>
          <Link href={'/contact'}>CONTACT</Link>
        </li>
      </ul>
    </nav>
  );
};

export { Layout };
