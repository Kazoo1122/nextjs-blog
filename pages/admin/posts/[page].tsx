import { GetStaticPaths, GetStaticProps } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Button, CircularProgress } from '@mui/material';
import { Layout } from '../../../components/Layout';
import { PostProps } from '../../posts/[id]';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../../../styles/module/components/articles.module.scss';
import Image from 'next/image';
import { CHAR_LIMIT } from '../../../components/Articles';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { getApi } from '../../index';

type PastArticlesProps = {
  posts: PostProps[];
  page: number;
  pages: number;
  perPage: number;
};

const COUNT_PER_PAGE = 10;

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
  const router = useRouter();
  const pageChange = (event: ChangeEvent<unknown>, page: number) => {
    return router.push(`/admin/posts/${page}`);
  };
  return (
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
          {posts.map((post: PostProps) => (
            <article key={post.id} className={styles.articles_area}>
              <div className={styles.thumbnail_area}>
                <Image src={post.thumbnail} layout={'fill'} objectFit={'cover'} alt='thumbnail' />
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
                <Button variant='contained' className='button'>
                  Edit
                </Button>
                <Button variant='contained' className='button'>
                  Delete
                </Button>
              </div>
            </article>
          ))}
          <Pagination count={pages} page={page} onChange={pageChange} />
          <Button variant='outlined' color='secondary' onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      )}
    </Layout>
  );
};

type PageProps = {
  page: string;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { page } = params as PageProps;
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

export const getStaticPaths: GetStaticPaths = async () => {
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

/**
 * ユーティリティ: 1 から指定された整数までを格納した Array を返す
 */
const range = (stop: number) => {
  return Array.from({ length: stop }, (_, i) => i + 1);
};

export default PostsManagement;
