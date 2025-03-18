import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import styles from '../styles/module/pages/contact.module.scss';
import { AiOutlineWarning } from 'react-icons/ai';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStyles } from './_app';

export type FormValues = {
  name: string;
  email: string;
  message: string;
};

/**
 * お問い合わせ用フォームのコンポーネント
 */
const Contact = () => {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitted },
  } = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  });
  const [result, setResult] = useState('');
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog-api/mail`;
    const TOKEN = process.env.NEXT_PUBLIC_JWT as string;
    const headers = {
      Authorization: TOKEN,
      'Content-Type': 'application/json',
    };
    await axios.post(url, data, { headers: headers }).then((res) => {
      const result = res.status === 200 ? 'success' : 'failed';
      setResult(result);
    });
  };

  const [pageTitle, setPageTitle] = useState('CONTACT');
  useEffect(() => {
    if (result !== '') {
      setPageTitle(
        result === 'success' ? 'Thank you for your message!' : 'Sorry, sending message failed.'
      );
    }
  }, [isSubmitted, result]);

  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/contact' },
  ];
  useSetBreadCrumbs(items);

  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <ul className={styles.contact_list}>
        <li>
          <Link href={'mailto:kazoo1122@interest-tree.com'}>
            <a>
              <MdEmail size={36} color={'#4d6cdb'} className={styles.contact_icon} />
              <span>Email&nbsp;(kazoo1122@interest-tree.com)</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href={'https://github.com/Kazoo1122/'}>
            <a>
              <FaGithub size={36} className={styles.contact_icon} />
              <span>Git Hub&nbsp;(Kazoo1122)</span>
            </a>
          </Link>
        </li>
      </ul>
      {!isSubmitted ? (
        <Box component='form' className={styles.contact_form} onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            className={styles.form_control_box}
            error={'name' in errors}
            variant='filled'
          >
            <InputLabel htmlFor='component-filled'>NAME *</InputLabel>
            <OutlinedInput type='text' {...register('name', { required: true })} />
            {errors.name && (
              <p className={'name' in errors ? styles.error : ''}>
                <AiOutlineWarning />
                名前は必須です
              </p>
            )}
            {!('name' in errors) ? <br /> : ''}
          </FormControl>

          <FormControl
            className={styles.form_control_box}
            error={'email' in errors}
            variant='filled'
          >
            <InputLabel htmlFor='component-filled'>E-MAIL</InputLabel>
            <OutlinedInput
              color={'email' in errors ? 'error' : 'primary'}
              type='email'
              {...register('email')}
            />
            <br />
          </FormControl>

          <FormControl
            className={styles.form_control_box}
            error={'message' in errors}
            variant='filled'
          >
            <InputLabel htmlFor='component-filled'>MESSAGE *</InputLabel>
            <OutlinedInput
              rows={8}
              multiline
              type='text'
              className={styles.message}
              {...register('message', { required: true })}
            />
            {errors.message && (
              <p className={'message' in errors ? styles.error : ''}>
                <AiOutlineWarning className={styles.warn_icon} />
                お問い合わせ内容は必須です
              </p>
            )}
            {!('message' in errors) ? <br /> : ''}
          </FormControl>
          <Button
            className={classes.button}
            color='primary'
            size='large'
            variant='contained'
            type='submit'
            disabled={!isValid || isSubmitting}
            sx={{
              marginTop: '32px',
              fontWeight: '800',
              fontSize: '16px',
              fontFamily: 'Spartan, sans-serif',
              borderRadius: '18px',
              lineHeight: '250%',
            }}
          >
            SEND
          </Button>
        </Box>
      ) : (
        <>
          <p className={styles.result}>
            {result === 'success'
              ? 'メッセージありがとうございます！'
              : '申し訳ありません。送信失敗したためメッセージが届いていません。' +
                '\n' +
                '恐れ入りますがメールやTwitterなど別の手段でのご連絡をお願いします。'}
          </p>
        </>
      )}
    </Layout>
  );
};

export default Contact;
