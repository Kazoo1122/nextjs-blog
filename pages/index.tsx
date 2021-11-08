import Layout from '../components/Layout';

export default function Home(props: any) {
  return (
    <Layout pageTitle='BLOG'>
      <div>hello next!</div>
      <p>host:{process.env.NEXT_PUBLIC_MYSQL_HOST}</p>
    </Layout>
  );
}
