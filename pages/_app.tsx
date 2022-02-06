import '../styles/global/destyle.css';
import '../styles/global/globals.scss';
import 'github-markdown-css/github-markdown-light.css';

import { AppProps } from 'next/app';
import { BreadCrumbProvider } from '../context/provider';
import { Provider } from 'next-auth/client';
import Router from 'next/router';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';
import { makeStyles } from '@mui/styles';

if (GA_TRACKING_ID) {
  Router.events.on('routeChangeComplete', (url) => pageview(url));
}

// Material UI ボタン用スタイル
export const useStyles = makeStyles({
  button: {
    backgroundColor: '#4d6cdb',
    fontWeight: '800',
    fontSize: '16px',
    fontFamily: 'Spartan, sans-serif',
    textAlign: 'center',
    color: 'white',
    boxShadow: '4px 4px 0 #00000029',
    borderRadius: '18px',
    lineHeight: '250%',
    '&:hover': {
      backgroundColor: '#7a91e8',
    },
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider session={pageProps.session}>
      <BreadCrumbProvider>
        <Component {...pageProps} />
      </BreadCrumbProvider>
    </Provider>
  );
};

export default MyApp;
