import styles from '../styles/Index.module.scss';
import Link from 'next/link';
import { TagProps } from '../pages/posts/[id]';

const TagList = (props: any) => {
  const { tags } = props;
  return (
    <div className={styles.tagList}>
      <h3>Tag List</h3>
      <div className={styles.hidden_box}>
        {tags.map((tag: TagProps) => (
          <span key={tag.tag_name.toString()} className={styles.tags}>
            <Link href='/tags/[tag]' as={`/tags/${tag}`} passHref>
              <a>{tag.tag_name}</a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export { TagList };
