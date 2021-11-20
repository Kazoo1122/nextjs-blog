import '../styles/destyle.css';
import '../styles/globals.scss';
import '../node_modules/github-markdown-css/github-markdown-light.css';
import { AppProps } from 'next/app';
import { BreadCrumbProvider } from '../context/provider';
import { Provider } from 'next-auth/client';
import React from 'react';

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
