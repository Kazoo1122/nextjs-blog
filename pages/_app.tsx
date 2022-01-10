import '../styles/global/destyle.css';
import '../styles/global/globals.scss';
import 'github-markdown-css/github-markdown-light.css';

import { AppProps } from 'next/app';
import { BreadCrumbProvider } from '../context/provider';
import { Provider } from 'next-auth/client';
import Router from 'next/router';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';

if (GA_TRACKING_ID) {
  Router.events.on('routeChangeComplete', (url) => pageview(url));
}

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
