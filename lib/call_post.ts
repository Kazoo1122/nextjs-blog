import { PostValues } from '../pages/admin';

export const callApiPost = () => {
  const postRegister = async (data: PostValues) => {
    return await fetch('/api/post', {
      method: 'POST',
      body: {
        title: data.title,
      },
    });
  };

  return { postRegister };
};
