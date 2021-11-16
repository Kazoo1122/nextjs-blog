import '../styles/destyle.css';
import '../styles/globals.scss';
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
