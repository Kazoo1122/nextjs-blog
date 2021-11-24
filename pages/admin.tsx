import React, { useCallback, useRef } from 'react';
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
import { GetStaticProps } from 'next';
import { getAllPosts } from '../lib/content';
import { PostProps } from './posts/[id]';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import styles from '../styles/admin.module.scss';
import { dbApi } from '../lib/call_api';
import { DATABASE_QUERY } from './api/db/query';

export type PostValues = {
  title: string;
  tags: TagProps[];
  content: string;
  thumbnail_data: string;
  thumbnail_name: string;
};

type PastArticlesProps = {
  posts: PostProps[];
  tags: TagProps[];
};

export type TagProps = {
  id: number;
  tag_name: string;
};

const Admin = (props: PastArticlesProps) => {
  const pageTitle = 'ADMIN';
  const { postDbData } = dbApi();

  //ぱんくずリスト関連
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/admin' },
  ];
  useSetBreadCrumbs(items);

  //記事登録・編集フォーム関連
  const { tags } = props;
  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<PostValues>({
    criteriaMode: 'all',
    defaultValues: {
      title: '',
      tags: [],
      content: '',
      thumbnail_data: '',
      thumbnail_name: 'null',
    },
  });

  const onSubmit: SubmitHandler<PostValues> = async (data) => {
    const res = await postDbData(data);
    const result = res.status === 200 ? 'success' : 'failed';

    await router.push({
      pathname: '/posting',
      query: { result: result },
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

  const onDropText = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onabort = () => console.log('File reading was aborted');
      reader.onerror = () => console.log('File reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result as string;
        setValue('content', binaryStr);
      };
      reader.readAsText(file);
    },
    [setValue]
  );

  const onDropImg = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        setValue('thumbnail_data', base64Data);
        setValue('thumbnail_name', file.name);
      };
      reader.onerror = () => {
        reader.abort();
        alert(`${file.name} reading has failed`);
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const mdTextRef = useRef<DropzoneRef>(null);
  const thumbnailRef = useRef<DropzoneRef>(null);
  const openDialog = () => {
    if (mdTextRef.current) {
      mdTextRef.current.open();
    } else if (thumbnailRef.current) {
      thumbnailRef.current.open();
    }
  };

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

            <div className={styles.file_read_area}>
              <Dropzone ref={mdTextRef} onDrop={onDropText}>
                {({ getRootProps, getInputProps, acceptedFiles, isDragActive }) => (
                  <div
                    {...getRootProps({
                      className: isDragActive ? styles.active_drag_zone : styles.normal_drag_zone,
                    })}
                  >
                    <input {...getInputProps()} />
                    <p>Load the &quot;.md&quot; file containing the text of the blog body here.</p>
                    <Button type='button' onClick={openDialog}>
                      Open file dialog
                    </Button>
                    <aside>
                      <h4>Files</h4>
                      <ul>
                        {acceptedFiles.map((file) => (
                          <li key={file.name}>
                            {file.name} - {file.size} bytes <br />
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </div>
                )}
              </Dropzone>

              <Dropzone ref={thumbnailRef} onDrop={onDropImg}>
                {({ getRootProps, getInputProps, acceptedFiles, isDragActive }) => (
                  <div
                    {...getRootProps({
                      className: isDragActive ? styles.active_drag_zone : styles.normal_drag_zone,
                    })}
                  >
                    <input {...getInputProps()} name='thumbnail_data' />
                    <p>Load the thumbnail image&apos;s path here.</p>
                    <Button type='button' onClick={openDialog}>
                      Open file dialog
                    </Button>
                    <aside>
                      <h4>Files</h4>
                      <ul>
                        {acceptedFiles.map((file) => (
                          <li key={file.name}>
                            {file.name} - {file.size} bytes <br />
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </div>
                )}
              </Dropzone>
            </div>

            <Button
              color='info'
              size='large'
              variant='outlined'
              type='submit'
              //  disabled={formState.isSubmitting}
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
  const { getDbData } = dbApi();
  const posts = await getAllPosts();
  // const sql = 'SELECT id, tag_name FROM tags';
  const tags = (await getDbData(DATABASE_QUERY.ALL_TAGS_ID_AND_NAME)) as TagProps[];
  return {
    props: {
      posts: posts,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Admin;
