import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head>
          {/*
           * Google Fontsの利用
           * - Spartan (Regular Medium ExtraBold)
           * - RocknRoll One
           * - Yusei Magic
           */}
          <link
            href='https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Spartan:wght@400;500;800&family=Yusei+Magic&display=swap'
            rel='stylesheet'
          />
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
