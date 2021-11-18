import '../styles/destyle.css';
import '../styles/globals.scss';
import '../node_modules/github-markdown-css/github-markdown-light.css';
import { AppProps } from 'next/app';
import { BreadCrumbProvider } from '../context/provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BreadCrumbProvider>
      <Component {...pageProps} />
    </BreadCrumbProvider>
  );
}

export default MyApp;
