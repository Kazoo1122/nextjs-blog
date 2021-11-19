import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, InputLabel, FilledInput } from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useMail } from '../lib/useMail';
import styles from '../styles/contact.module.scss';
import { AiOutlineWarning } from 'react-icons/ai';
import { router } from 'next/client';

export type FormValues = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const { send } = useMail();
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
      <Box component='form' className={styles.contact_form} onSubmit={handleSubmit(onSubmit)}>
        <FormControl error={'name' in errors} variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>NAME *</InputLabel>
          <FilledInput type='text' {...register('name', { required: true })} />
          {errors.name && (
            <p className={'name' in errors ? styles.error : styles.safe}>
              <AiOutlineWarning />
              名前は必須です
            </p>
          )}
        </FormControl>

        <FormControl error={'email' in errors} variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>E-MAIL</InputLabel>
          <FilledInput
            color={'email' in errors ? 'error' : 'primary'}
            type='email'
            {...register('email')}
          />
        </FormControl>

        <FormControl error={'message' in errors} variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>MESSAGE *</InputLabel>
          <FilledInput multiline type='text' {...register('message', { required: true })} />
          {errors.message && (
            <p className={'message' in errors ? styles.error : styles.safe}>
              <AiOutlineWarning className={styles.warn_icon} />
              お問い合わせ内容は必須です
            </p>
          )}
        </FormControl>
        <Button
          variant='contained'
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
