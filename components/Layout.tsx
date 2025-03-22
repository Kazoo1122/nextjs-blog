import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';
import styles from '../styles/module/components/layout.module.scss';
import { BreadCrumbs } from './BreadCrumbs';
import { useMediaQuery } from '@mui/material';
import Prism from 'prismjs';

// メタデータを格納した型 Headコンポーネント内で使用
type MetaProps = {
  pageTitle: string;
  pageUrl?: string;
  pageDescription?: string;
  children: React.ReactNode;
};

/**
 * 全体の共通レイアウト用のコンポーネント
 * @param props
 */
const Layout = (props: MetaProps) => {
  const { pageTitle, pageUrl, pageDescription, children } = props;
  const siteTitle = 'Interest Tree';
  const defaultDescription = '興味の樹を育てるプログラマのブログ';
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  const description = pageDescription
    ? `${pageDescription} | ${defaultDescription}`
    : defaultDescription;
  const ogType = pageTitle ? 'article' : 'blog';
  const { lg } = styles;
  const isLgSize = useMediaQuery(`(min-width: ${lg})`);
  const [isOpen, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) isOpen && menuRef.current?.focus();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  //シンタックスハイライトの有効化
  useEffect(() => {
    Prism.highlightAll();
  }, []);

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
        <meta property='og:site_name' content={siteTitle} />
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

      <div className='line-numbers'>
        <div className={styles.layout_wrapper}>
          <header className={styles.header_area}>
            <div className={styles.title_area}>
              <Link href='/'>
                <a>
                  <h1 className={styles.title_text}>{siteTitle}</h1>
                  <p className={styles.subtitle_text}>〜{defaultDescription}〜</p>
                </a>
              </Link>
            </div>
            {isLgSize ? (
              <Navigation isLgSize={isLgSize} isOpen={isOpen} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
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
          {isLgSize ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.dot_background_image}
              src='/images/dot_background_wh.png'
              alt='background'
            />
          ) : (
            <Navigation isLgSize={isLgSize} isOpen={isOpen} />
          )}
          <main className={styles.main_area}>
            <BreadCrumbs />
            {children}
            <BreadCrumbs />
          </main>
          <footer className={styles.footer_area}>
            <Link href='/'>
              <a> &copy; 2025 {siteTitle} </a>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

type navProps = {
  isLgSize: boolean;
  isOpen: boolean;
};

// 上部ナビケーションのコンポーネント スマホ画面であればスライドする
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
        <li>
          <Link href={'/dev'}>DEVELOPMENT</Link>
        </li>
      </ul>
    </nav>
  );
};

export { Layout };
