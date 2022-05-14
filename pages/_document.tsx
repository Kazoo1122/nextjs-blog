import Document, { Html, Head, Main, NextScript } from 'next/document';

import { GA_TRACKING_ID } from '../lib/gtag';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head>
          {/*
           * Google Fonts
           * - Spartan (Regular Medium ExtraBold)
           * - RocknRoll One
           * - Yusei Magic
           */}
          <link
            href='https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Spartan:wght@400;500;800&family=Yusei+Magic&display=swap'
            rel='stylesheet'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/images/favicon/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/images/favicon/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/images/favicon/favicon-16x16.png'
          />
          <link rel='manifest' href='/images/favicon/site.webmanifest' />
          <link rel='mask-icon' href='/images/favicon/safari-pinned-tab.svg' color='#5bbad5' />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta name='theme-color' content='#ffffff' />

          {/* gtag / Google Analyticsの利用*/}
          {GA_TRACKING_ID && (
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          )}
          {GA_TRACKING_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
