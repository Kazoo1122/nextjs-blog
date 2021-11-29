import styles from '../styles/module/components/load_more.module.scss';
import { COUNT_PER_POSTS } from '../pages';
import React, { SetStateAction } from 'react';
import { Button } from '@mui/material';

type LoadMoreProps = {
  currentCount: number;
  setCount: React.Dispatch<SetStateAction<number>>;
  postsLength: number;
};

const LoadMore = (props: LoadMoreProps) => {
  const { currentCount, setCount, postsLength } = props;
  return (
    <>
      {postsLength > currentCount ? (
        <Button
          variant='contained'
          className={styles.load_more_button}
          onClick={() => setCount(currentCount + COUNT_PER_POSTS)}
        >
          LOAD MORE
        </Button>
      ) : (
        ''
      )}
    </>
  );
};
export { LoadMore };
