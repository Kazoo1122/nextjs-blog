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
