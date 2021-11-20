import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { callApiMail } from '../lib/call_mail';
import styles from '../styles/contact.module.scss';
import { AiOutlineWarning } from 'react-icons/ai';
import { useRouter } from 'next/router';

export type FormValues = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const router = useRouter();
  const { send } = callApiMail();
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await send(data).then((res) => {
      const result = res.status === 200 ? 'success' : 'failed';
      router.push({
        pathname: '/contact-sent',
        query: { result: result },
      });
    });
  };

  const pageTitle = 'CONTACT';
  const items = [
    { title: 'HOME', path: '/' },
    { title: pageTitle, path: '/contact' },
  ];
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />
      <h2 className='page_title'>{pageTitle}</h2>
      <Box component='form' className={styles.contact_form} onSubmit={handleSubmit(onSubmit)}>
        <FormControl className={styles.form_control_box} error={'name' in errors} variant='filled'>
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

        <FormControl className={styles.form_control_box} error={'email' in errors} variant='filled'>
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
          disabled={!formState.isValid || formState.isSubmitting}
          className={styles.submit_button}
        >
          SEND
        </Button>
      </Box>
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
};

export default Contact;
