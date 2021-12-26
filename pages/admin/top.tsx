import { Layout } from '../../components/Layout';
import { useSetBreadCrumbs } from '../../context/context';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { signIn, signOut, useSession } from 'next-auth/client';

const AdminTop = () => {
  const pageTitle = 'ADMIN';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/admin/top' },
  ];
  const [session, loading] = useSession();

  const router = useRouter();
  const addNewPost = async () => {
    await router.push({
      pathname: '/admin/registration',
      query: { type: 'NEW' },
    });
  };
  const editPastPosts = async () => {
    await router.push('/admin/posts/[page]', '/admin/posts/1');
  };
  useSetBreadCrumbs(items);
  return (
    <>
      <Layout pageTitle={pageTitle}>
        <h2 className='page_title'>{pageTitle}</h2>
        {loading ? (
          <>
            <p>
              <CircularProgress />
              Now loading...
            </p>
          </>
        ) : (
          !session && (
            <>
              <Button variant='contained' color='secondary' onClick={() => signIn()}>
                Sign in
              </Button>
            </>
          )
        )}
        {session && (
          <>
            <div className='button_area'>
              <Button variant='contained' className='button' onClick={addNewPost}>
                New Post
              </Button>
            </div>
            <div className='button_area'>
              <Button variant='contained' className='button' onClick={editPastPosts}>
                Past Posts
              </Button>
            </div>
            <Button variant='outlined' color='secondary' onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        )}
      </Layout>
      <style jsx>{`
        .button_area {
          margin-bottom: 36px;
          margin-left: 64px;
        }
      `}</style>
    </>
  );
};
export default AdminTop;
