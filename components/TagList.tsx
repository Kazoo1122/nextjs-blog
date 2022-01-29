import styles from '../styles/module/components/tag_list.module.scss';
import Link from 'next/link';
import { TagProps } from '../pages';

/**
 * タグ一覧のコンポーネント
 * @param props
 */
const TagList = (props: { tags: TagProps[] }) => {
  const { tags } = props;
  return (
    <div className={styles.tag_list_area}>
      <h3 className={styles.tag_list_title}>
        <span>Tag List</span>
      </h3>
      <div className={styles.tags_box}>
        {tags.map((tag) => (
          <span key={tag.tag_name} className='tags'>
            <Link href={{ pathname: '/', query: { tag: tag.tag_name } }} passHref>
              <a className='tag_text'>
                {tag.tag_name} ( {tag.count} )
              </a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export { TagList };
