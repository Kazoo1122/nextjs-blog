import { GetStaticPaths, GetServerSideProps } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Box, Button, CircularProgress } from '@mui/material';
import { Layout } from '../../../components/Layout';
import { PostProps } from '../../posts/[id]';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import styles from '../../../styles/module/components/articles.module.scss';
import Image from 'next/image';
import { CHAR_LIMIT } from '../../../components/Articles';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { getApi } from '../../index';
import { BreadCrumbContext } from '../../../context/context';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import path from 'path';

type PastArticlesProps = {
  posts: PostProps[];
  page: number;
  pages: number;
  perPage: number;
};

const COUNT_PER_PAGE = 10;

/**
 * 管理用の過去記事一覧ページのコンポーネント
 * @param props
 */
const PostsManagement = (props: PastArticlesProps) => {
  const { posts, page, pages } = props;
  const [session, loading] = useSession();
  const [pageTitle, setPageTitle] = useState('ADMIN');
  useEffect(() => {
    if (!session) {
      setPageTitle('SIGN IN');
    } else {
      setPageTitle('PAST POSTS');
    }
  }, [session]);
  const [items, setItems] = useState([{ title: '', path: '' }]);
  useEffect(() => {
    const titles = [
      { title: 'HOME', path: '/' },
      { title: 'ADMIN', path: '/admin/top' },
      { title: 'PAST POSTS', path: '' },
    ];
    setItems(titles);
  }, [pageTitle]);

  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems(items);
  }, [items, context]);
  const router = useRouter();
  const pageChange = (event: ChangeEvent<unknown>, page: number) => {
    return router.push(`/admin/posts/${page}`);
  };

  // 記事編集ページへ移行
  const editPost = async (id?: string) => {
    const currentPath = router.asPath.replace('/admin/articles/', '');
    await router.push({
      pathname: `/admin/post/${id}`,
      query: { type: 'EDIT', before: currentPath },
    });
  };

  // 記事削除用 削除確認ダイアログを表示する
  const [deletedPost, setDeletedPost] = useState({} as PostProps);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = (post: PostProps) => {
    setDeletedPost(post);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const deletePost = async () => {
    setIsDeleting(true);
    const url = process.env.server + `/api/delete_post?id=${deletedPost.id}`;
    const TOKEN = process.env.NEXT_PUBLIC_JWT as string;
    const headers = {
      Authorization: TOKEN,
    };
    await axios.delete(url, { headers: headers }).then((res) => {
      if (res.status === 200) {
        router.reload();
      }
    });
  };

  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      {loading ? (
        <>
          <p style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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
          {posts.map((post: PostProps) => (
            <article key={post.id} className={styles.articles_area}>
              <div className={styles.thumbnail_area}>
                <Image
                  src={process.env.server + post.thumbnail}
                  layout={'fill'}
                  objectFit={'cover'}
                  alt='thumbnail'
                  priority={true}
                />
              </div>
              <div className={styles.summary_area}>
                <div className={styles.articles_title_area}>
                  <span className={styles.articles_title_text}>{post.title}</span>
                </div>
                <div className={styles.attribute_area}>
                  <div className={styles.tags_area}>
                    {post.attachedTag.map((tag) => (
                      <span key={tag.toString()} className='tags'>
                        <div className='tag_text'>{tag}</div>
                      </span>
                    ))}
                  </div>
                  <div className={styles.date_area}>
                    <p className='date_text'>
                      投稿：{post.created_at}
                      <br />
                      更新：{post.updated_at}
                    </p>
                  </div>
                </div>
                <p className={styles.body_area}>
                  {post.content.length > CHAR_LIMIT
                    ? post.content.slice(0, CHAR_LIMIT - 1) + '…'
                    : post.content}
                </p>
              </div>
              <div className={styles.edit_area}>
                <Button
                  variant='contained'
                  className='button'
                  color='success'
                  onClick={() => editPost(post.id)}
                >
                  Edit
                </Button>
                <Button
                  variant='contained'
                  className='button'
                  color='error'
                  onClick={() => handleOpen(post)}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}

          <Modal
            open={open}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                確認
              </Typography>
              <Typography id='modal-modal-description' sx={{ mt: 2, mb: 4 }}>
                記事を削除しますか？
                <br />
                記事ID：{deletedPost.id}
                <br />
                タイトル：{deletedPost.title}
              </Typography>
              <Button
                variant='contained'
                color='error'
                onClick={deletePost}
                sx={{ mr: 2 }}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </Box>
          </Modal>

          <Pagination count={pages} page={page} onChange={pageChange} sx={{ my: 4 }} />
          <Button variant='outlined' color='secondary' onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      )}
    </Layout>
  );
};

type PageNumProps = {
  page: string;
};

// 記事一覧とページネーションで使用する値を返す
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { page } = params as PageNumProps;
  const pageNumber = parseInt(page, 10);
  const end = COUNT_PER_PAGE * pageNumber;
  const start = end - COUNT_PER_PAGE;
  const url = process.env.server + `/api/posts-list?offset=0&limit=0`;
  const posts = await getApi(url);
  return {
    props: {
      posts: posts.slice(start, end),
      page: pageNumber,
      pages: Math.ceil(posts.length / COUNT_PER_PAGE),
    },
  };
};

export const getPaths: GetStaticPaths = async () => {
  const url = process.env.server + `/api/post-ids`;
  const posts = await getApi(url);
  const pages = range(Math.ceil(posts.length / COUNT_PER_PAGE));
  const paths = pages.map((page) => ({
    params: { page: `${page}` },
  }));
  return {
    paths: paths,
    fallback: true,
  };
};

// 1 から指定された整数までを格納した Array を返す
const range = (stop: number) => {
  return Array.from({ length: stop }, (_, i) => i + 1);
};

export default PostsManagement;
