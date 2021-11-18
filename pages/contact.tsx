import { Layout } from '../components/Layout';

export default function Contact(props: any) {
  const { setName, setEmail, setMessage, send } = useMail();
  return <Layout pageTitle='CONTACT'></Layout>;
}
