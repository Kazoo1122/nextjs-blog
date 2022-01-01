import { SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
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
import { BreadCrumbContext } from '../../../context/context';
import { Layout } from '../../../components/Layout';
import { AiFillFileMarkdown, AiOutlineWarning } from 'react-icons/ai';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/module/pages/admin.module.scss';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import { PostProps, PostUrl } from '../../posts/[id]';
import { getApi } from '../../index';
import { MdDropzone } from '../../../components/MdDropzone';
import { ImgDropzone } from '../../../components/ImgDropzone';
import { BsImage } from 'react-icons/bs';

export type PostValues = {
  title: string;
  tags: TagProps[];
  content: string;
  thumbnail_data: string;
  thumbnail_name: string;
  is_null_thumbnail: boolean;
};

export type TagProps = {
  id: number;
  tag_name: string;
};

const TOKEN = process.env.NEXT_PUBLIC_JWT as string;
const headers = {
  Authorization: TOKEN,
  'Content-Type': 'application/json',
};

const PostForm = (props: { postData: PostProps; tags: TagProps[] }) => {
  const { postData, tags } = props;
  //クエリ文字列から取得
  const router = useRouter();
  const post_type = router.query.type ?? '';
  const before_path = router.query.before ?? '';
  const post_id = router.query.id ?? '';

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PostValues>({
    criteriaMode: 'all',
    defaultValues: {
      title: postData.title ?? '',
      tags: [],
      content: '',
      thumbnail_data: '',
      thumbnail_name: 'null',
      is_null_thumbnail: false,
    },
  });
  const [result, setResult] = useState('');
  const [lastID, setLastID] = useState(0);
  const onSubmit: SubmitHandler<PostValues> = async (data) => {
    const url = process.env.server + `/api/send-post?type=${post_type}&id=${post_id}`;
    const body = JSON.stringify(data);
    await axios.post(url, body, { headers: headers }).then(async (res: any) => {
      const result = res.status === 201 ? 'success' : 'failed';
      const lastID = res.data.id;
      setResult(result);
      setLastID(lastID);
    });
  };

  const handleCheck = (
    tag: { tag_name: string; id: number },
    event: SyntheticEvent<Element, Event>
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
      if (!file) return;
      const reader = new FileReader();
      reader.onabort = () => console.log('File reading was aborted');
      reader.onerror = () => console.log('File reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result as string;
        setValue('content', binaryStr);
        setClearText(false);
      };
      reader.readAsText(file);
    },
    [setValue]
  );

  const onDropImg = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        setValue('thumbnail_data', base64Data);
        setValue('thumbnail_name', file.name);
        setClearImg(false);
      };
      reader.onerror = () => {
        reader.abort();
        alert(`${file.name} reading has failed`);
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  //認証関連
  const [session, loading] = useSession();
  const [pageTitle, setPageTitle] = useState('ADMIN');
  useEffect(() => {
    if (!session) {
      setPageTitle('SIGN IN');
    } else if (!isSubmitted) {
      setPageTitle(post_type + ' POST');
    } else {
      setPageTitle(`Posting ${result}`);
    }
  }, [session, isSubmitted]);

  const [items, setItems] = useState([{ title: '', path: '' }]);
  useEffect(() => {
    const titles = [
      { title: 'HOME', path: '/' },
      { title: 'ADMIN', path: '/admin/top' },
    ];
    if (post_type === 'EDIT')
      titles.push({ title: 'PAST POSTS', path: '/admin/articles/' + before_path });
    titles.push({ title: pageTitle, path: '' });
    setItems(titles);
  }, [pageTitle]);

  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems(items);
  }, [items]);

  //過去記事の編集の場合、以前選択したタグを選択状態にしておく
  const attachedTag = tags.filter((tag) => postData.attachedTag.includes(tag.tag_name));
  useEffect(() => {
    if (process.browser) {
      attachedTag.map(async (tag) => {
        const selector = `label[id='${tag.tag_name}'] > span > input[type='checkbox']`;
        const element = document.querySelector<HTMLInputElement>(selector);
        if (element === null) return;
        if (!element.checked) element.click();
      });
    }
  }, [session]);

  const [isClearText, setClearText] = useState(false);
  const [isClearImg, setClearImg] = useState(false);
  const clearText = () => {
    setValue('content', '');
    setClearText(true);
  };
  const clearImg = () => {
    setValue('thumbnail_data', '');
    setValue('thumbnail_name', '');
    setClearImg(true);
  };

  const [checked, setChecked] = useState(false);
  const handleChange = (event: { target: HTMLInputElement }) => {
    setChecked(event.target.checked);
    setValue('is_null_thumbnail', event.target.checked);
    console.log(getValues('is_null_thumbnail'), 'isNull');
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
      {session && !isSubmitted && (
        <>
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
                        id={tag.tag_name}
                        onChange={(event) => field.onChange(handleCheck(tag, event))}
                        control={<Checkbox />}
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>

            <div className={styles.file_read_area}>
              <div>
                <AiFillFileMarkdown aria-hidden='true' style={{ fontSize: '32px' }} />
                <MdDropzone props={onDropText} isClear={isClearText} />
                <Button variant='contained' color='warning' onClick={clearText}>
                  Clear
                </Button>
              </div>
              <div>
                <BsImage aria-hidden='true' style={{ fontSize: '32px' }} />
                <ImgDropzone onDrop={onDropImg} data={postData} isClear={isClearImg} />
                <Button variant='contained' color='warning' onClick={clearImg}>
                  Clear
                </Button>
                {post_type === 'EDIT' ? (
                  <>
                    <FormControlLabel
                      control={<Checkbox checked={checked} onChange={handleChange} />}
                      label='画像なし'
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>

            <Button
              color='info'
              size='large'
              variant='outlined'
              type='submit'
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
      {session && isSubmitted && (
        <>
          <p className={styles.result}>
            {result === 'success'
              ? post_type === 'NEW'
                ? `投稿完了！記事IDは「${lastID}」です。`
                : `更新完了！記事IDは「${post_id}」です。`
              : '投稿失敗。。。'}
          </p>
        </>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths<PostUrl> = async () => {
  const url = process.env.server + `/api/post-ids`;
  const posts = await getApi(url);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<{ tags: TagProps[] }> = async ({ params }) => {
  const { id } = params as PostUrl;
  let url = process.env.server + `/api/post-detail?params=${id}`;
  const postData = id === 'new' ? [] : ((await getApi(url)) as PostProps);
  url = process.env.server + `/api/tags-selection`;
  const tags = (await getApi(url)) as TagProps[];
  return {
    props: {
      postData: postData,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default PostForm;
