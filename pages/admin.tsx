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
  FormLabel,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { Layout } from '../components/Layout';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { AiOutlineWarning } from 'react-icons/ai';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import { callApiPost } from '../lib/call_post';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../lib/content';
import { dbQuery } from '../db';
import { PostProps } from './posts/[id]';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/admin.module.scss';

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
  const pageTitle = 'ADMIN';

  //ぱんくずリスト関連
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/admin' },
  ];
  useSetBreadCrumbs(items);

  //記事登録・編集フォーム関連
  const { tags } = props;
  const { postRegister } = callApiPost();
  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<PostValues>({
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
  const handleCheck = (
    tag: { tag_name: string; id: number },
    event: React.SyntheticEvent<Element, Event>
  ) => {
    let values = getValues('tags') || [];
    values = values.filter((value) => value.tag_name); //空要素削除

    let newValues: TagProps[];
    if ((event.target as HTMLInputElement).checked) {
      newValues = [...(values ?? []), tag];
    } else {
      newValues = values?.filter((value) => value.tag_name !== tag.tag_name);
    }
    setValue('tags', newValues);
    return newValues;
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone();
  const files = acceptedFiles.map((file, i) => <li key={i}>{file.name}</li>);

  //認証関連
  const [session, loading] = useSession();
  const router = useRouter();
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
          <Box
            component='form'
            className={styles.admin_form}
            onSubmit={handleSubmit(onSubmit)}
            encType='multipart/form-data'
          >
            <FormControl
              className={styles.form_control_box}
              error={'title' in errors}
              variant='filled'
            >
              <InputLabel htmlFor='component-filled'>TITLE *</InputLabel>
              <OutlinedInput fullWidth type='text' {...register('title', { required: true })} />
              {errors.title && (
                <p className={'title' in errors ? styles.error : ''}>
                  <AiOutlineWarning />
                  記事タイトルは必須です
                </p>
              )}
              {!('title' in errors) ? <br /> : ''}
            </FormControl>

            <FormControl className={styles.form_control_box} variant='filled'>
              <InputLabel htmlFor='component-filled'>THUMBNAIL</InputLabel>
              <OutlinedInput fullWidth type='text' {...register('thumbnail')} />
            </FormControl>

            <FormLabel className={styles.tags_label} component='legend'>
              Tags select
            </FormLabel>
            <FormControl
              required
              error={Object.prototype.hasOwnProperty.call(errors, 'tags')}
              component='fieldset'
              fullWidth
            />
            <FormGroup className={styles.form_check_box}>
              <Controller
                name='tags'
                control={control}
                render={({ field }) => (
                  <>
                    {tags.map((tag, i) => (
                      <FormControlLabel
                        {...field}
                        key={i}
                        label={tag.tag_name}
                        onChange={(event) => field.onChange(handleCheck(tag, event))}
                        control={<Checkbox />}
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>

            <div
              {...getRootProps({
                className: isDragActive ? styles.active_drag_zone : styles.normal_drag_zone,
              })}
            >
              <input {...getInputProps()} />
              <p>Drag n drop some files here, or click to select files</p>
            </div>
            <ul>{files}</ul>

            <Button
              color='info'
              size='large'
              variant='outlined'
              type='submit'
              disabled={formState.isSubmitting}
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
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Admin;
