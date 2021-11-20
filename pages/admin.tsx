import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { Layout } from '../components/Layout';
import { BreadCrumbs } from '../components/BreadCrumbs';
import styles from '../styles/contact.module.scss';
import { AiOutlineWarning } from 'react-icons/ai';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { callApiPost } from '../lib/call_post';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../lib/content';
import { dbQuery } from '../db';
import { PostProps } from './posts/[id]';

export type PostValues = {
  title: string;
  tags: TagProps[];
  body: string;
  thumbnail: string;
};

type PastArticlesProps = {
  posts: PostProps[];
  tags: TagProps[];
};

type TagProps = {
  id: number;
  tag_name: string;
};

const Admin = (props: PastArticlesProps) => {
  const { posts, tags } = props;
  const [checked, setChecked] = React.useState([]);
  const [session, loading] = useSession();
  const router = useRouter();
  const { postRegister } = callApiPost();
  const pageTitle = 'ADMIN';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/admin' },
  ];
  useSetBreadCrumbs(items);
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<PostValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<PostValues> = async (data) => {
    await postRegister(data).then((res) => {
      const result = res.status === 200 ? 'success' : 'failed';
      router.push({
        pathname: '/post-registration',
        query: { result: result },
      });
    });
  };

  if (loading) {
    return (
      <p>
        <CircularProgress />
        Now loading...
      </p>
    );
  }

  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />

      {session && (
        <>
          <h2 className='page_title'>POSTS MANAGEMENT</h2>
          <Box component='form' className={styles.admin_form} onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              className={styles.form_control_box}
              error={'name' in errors}
              variant='filled'
            >
              <InputLabel htmlFor='component-filled'>TITLE *</InputLabel>
              <OutlinedInput type='text' {...register('title', { required: true })} />
              {errors.title && (
                <p className={'name' in errors ? styles.error : ''}>
                  <AiOutlineWarning />
                  記事タイトルは必須です
                </p>
              )}
              {!('title' in errors) ? <br /> : ''}
            </FormControl>

            <FormControl
              className={styles.form_control_box}
              error={'name' in errors}
              variant='filled'
            >
              <InputLabel htmlFor='component-filled'>TITLE *</InputLabel>
              <OutlinedInput type='text' {...register('title', { required: true })} />
              {errors.title && (
                <p className={'name' in errors ? styles.error : ''}>
                  <AiOutlineWarning />
                  記事タイトルは必須です
                </p>
              )}
              {!('title' in errors) ? <br /> : ''}
            </FormControl>

            <FormGroup>
              {tags.map((tag) => {
                <FormControlLabel
                  control={<Checkbox checked={checked[tag.id]} name={tag.tag_name} />}
                  label={tag.tag_name}
                />;
              })}
            </FormGroup>

            <Button
              color='info'
              size='large'
              variant='outlined'
              type='submit'
              disabled={!formState.isValid || formState.isSubmitting}
              className={styles.submit_button}
            >
              SEND
            </Button>
          </Box>

          <Button variant='outlined' color='secondary' onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      )}
      {!session && (
        <>
          <h2 className='page_title'>Not signed in</h2>
          <Button variant='contained' color='secondary' onClick={() => signIn()}>
            Sign in
          </Button>
        </>
      )}
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PastArticlesProps> = async () => {
  const posts = await getAllPosts();
  const query = 'SELECT id, tag_name FROM tags';
  const tags: TagProps[] = await dbQuery(query);
  return {
    props: {
      posts: posts,
      tags: tags,
    },
  };
};

export default Admin;
