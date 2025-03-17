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
import { getApi, TagProps } from '../../index';
import { MdDropzone } from '../../../components/MdDropzone';
import { ImgDropzone } from '../../../components/ImgDropzone';
import { BsImage } from 'react-icons/bs';

export type PostValues = {
  title: string;
  tags: TagProps[];
  content: string;
  thumbnail_data: string | null;
  thumbnail_name: string | null;
  is_null_thumbnail: boolean;
};

const TOKEN = process.env.JWT as string;
const headers = {
  Authorization: TOKEN,
  'Content-Type': 'application/json',
};

/**
 * 記事投稿画面のコンポーネント
 * @param props
 */
const PostForm = (props: { postData: PostProps; tags: TagProps[] }) => {
  const { tags } = props;
  const postData = props.postData ?? '';

  //クエリ文字列から取得
  const router = useRouter();
  const post_type = router.query.type ?? '';
  const before_path = router.query.before ?? '';
  const post_id = router.query.id ?? '';

  let title = '';
  if (post_type === 'EDIT') {
    title = postData.title ?? '';
  }

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
      title: title,
      tags: [],
      content: '',
      thumbnail_data: null,
      thumbnail_name: null,
      is_null_thumbnail: false,
    },
  });
  const [result, setResult] = useState('');
  const [lastID, setLastID] = useState(0);
  const onSubmit: SubmitHandler<PostValues> = async (data) => {
    const url = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/api/send-post?type=${post_type}&id=${post_id}`;
    const body = JSON.stringify(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await axios.post(url, body, { headers: headers }).then(async (res: any) => {
      const result = res.status === 201 ? 'success' : 'failed';
      const lastID = res.data.id;
      setResult(result);
      setLastID(lastID);
    });
  };

  // タグのチェックボックスが選択されたら記事につけるタグリストを更新する
  const handleCheck = (
    tag: { tag_name: string; id?: number },
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

  // ドロップゾーンにマークダウン書式がドロップされたら読み取る
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

  // ドロップゾーンにサムネ画像がドロップされたら読み取る
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
  }, [session, isSubmitted, post_type, result]);

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
  }, [pageTitle, before_path, post_type]);

  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems(items);
  }, [items, context]);

  useEffect(() => {
    if (process.browser && post_type === 'EDIT' && postData.attachedTag) {
      //過去記事の編集の場合、以前選択したタグを選択状態にしておく
      const attachedTag = tags.filter((tag) => postData.attachedTag.includes(tag.tag_name));
      attachedTag.map(async (tag) => {
        const selector = `label[id='${tag.tag_name}'] > span > input[type='checkbox']`;
        const element = document.querySelector<HTMLInputElement>(selector);
        if (element === null) return;
        if (!element.checked) element.click();
      });
    }
  }, [session, postData.attachedTag, post_type, tags]);

  // マークダウンと画像のリセット
  const [isClearText, setClearText] = useState(true);
  const [isClearImg, setClearImg] = useState(true);
  const clearText = () => {
    setValue('content', '');
    setClearText(true);
  };
  const clearImg = () => {
    setValue('thumbnail_data', null);
    setValue('thumbnail_name', null);
    setClearImg(true);
  };

  // 記事編集時にサムネ画像をなくすかの選択チェックボックス
  const [checked, setChecked] = useState(false);
  const handleChange = (event: { target: HTMLInputElement }) => {
    setChecked(event.target.checked);
    setValue('is_null_thumbnail', event.target.checked);
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
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
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
                  </div>
                )}
              />
            </FormGroup>

            <div className={styles.file_read_area}>
              <div>
                <AiFillFileMarkdown aria-hidden='true' style={{ fontSize: '32px' }} />
                <MdDropzone onDrop={onDropText} isClear={isClearText} />
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
              disabled={post_type === 'NEW' && isClearText}
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
  const url = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/api/post-ids`;
  const posts = await getApi(url);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
};

// 過去記事とタグ一覧を用意する
export const getStaticProps: GetStaticProps<{ tags: TagProps[] }> = async ({ params }) => {
  const { id } = params as PostUrl;
  let url = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/api/post-detail?params=${id}`;
  const postData = id === 'new' ? [] : ((await getApi(url)) as PostProps); // 新規なら空を、編集なら対象記事を返す
  url = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/api/tags-selection`;
  const tags = (await getApi(url)) as TagProps[];
  return {
    props: {
      postData: postData,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default PostForm;
