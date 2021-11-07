import Head from 'next/head';
import Link from 'next/link';

const Layout = (props: any) => {
    const { pageTitle, pageUrl, pageDescription, children } = props;
    const siteTitle = 'レジ打ちからエンジニアになりました';
    const defaultDescription =
        'ショップ店員から色んな経験を経て中途のITエンジニアになった人のブログです';
    const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
    const description = pageDescription
        ? `${pageDescription} | ${defaultDescription}`
        : defaultDescription;
    const ogType = pageTitle ? 'article' : 'blog';

    return (
        <div className='page'>
            <Head>
                <title>{title}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
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

            <header>
                <div className='headerBox'>
                    <h1>レジ打ちからエンジニアになりました</h1>
                    <p className='subHeddings'>〜中途エンジニアの開発日誌〜</p>
                    <nav>
                        <ul>
                            <li>
                                <Link href='/index'>BLOG</Link>
                            </li>
                            <li>
                                <Link href='/profile'>PROFILE</Link>
                            </li>
                            <li>
                                <Link href='/contact'>CONTACT</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main>
                {pageTitle ? <h2 className='page-title'>{title}</h2> : ``}
                <div className='page-main'>{children}</div>
            </main>

            <footer>&copy; 2021 {siteTitle}</footer>
        </div>
    );
};

export default Layout;
