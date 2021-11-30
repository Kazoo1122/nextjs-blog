import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { mailApi } from '../lib/call_api';
import styles from '../styles/module/pages/contact.module.scss';
import { AiOutlineWarning } from 'react-icons/ai';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export type FormValues = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
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
    await mailApi(data).then((res) => {
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
  }, [isSubmitted]);

  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/contact' },
  ];
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
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
            color='info'
            size='large'
            variant='outlined'
            type='submit'
            disabled={!isValid || isSubmitting}
            className={styles.submit_button}
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
                '恐れ入りますが下記までメールをお願いします。'}
          </p>
          <Link href='mailto:kazoo1122@experienced.work'>
            <a className={styles.mail}>{result === 'failed' ? 'kazoo1122@experienced.work' : ''}</a>
          </Link>
        </>
      )}
    </Layout>
  );
};

export default Contact;
