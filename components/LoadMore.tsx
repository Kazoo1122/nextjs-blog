import styles from '../styles/Index.module.scss';
import { COUNT_PER_POSTS } from '../pages';

const LoadMore = (props: any) => {
  const { posts, currentCount, setCount, postsLength } = props;
  return (
    <div className={styles.button_area}>
      {postsLength > currentCount ? (
        <button
          className={styles.load_more}
          onClick={() => setCount(currentCount + COUNT_PER_POSTS)}
        >
          LOAD MORE
        </button>
      ) : (
        ''
      )}
    </div>
  );
};
export { LoadMore };
