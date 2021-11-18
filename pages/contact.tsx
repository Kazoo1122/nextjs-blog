import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, InputLabel, FilledInput } from '@mui/material';
import { useSetBreadCrumbs } from '../context/context';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useMail } from '../lib/useMail';
import styles from '../styles/contact.module.scss';

type FormValues = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const { setName, setEmail, setMessage, send } = useMail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setName(data.name);
    setEmail(data.email);
    setMessage(data.message);
    await send();
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
        <FormControl variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>NAME *</InputLabel>
          <FilledInput type='text' {...register('name', { required: true })} />
          {errors.name && <p className={styles.required}>名前は必須です</p>}
        </FormControl>
        <FormControl variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>E-MAIL</InputLabel>
          <FilledInput
            type='email'
            {...register('email', {
              pattern: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && (
            <p className={styles.required}>正しいメールアドレスを入力してください</p>
          )}
        </FormControl>
        <FormControl variant='filled' className={styles.input_field}>
          <InputLabel htmlFor='component-filled'>MESSAGE *</InputLabel>
          <FilledInput multiline type='text' {...register('message', { required: true })} />
          {errors.message && <p className={styles.required}>お問い合わせ内容は必須です</p>}
        </FormControl>
        <Button variant='contained' type='submit' className={styles.submit_button}>
          SEND
        </Button>
      </Box>
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
}
