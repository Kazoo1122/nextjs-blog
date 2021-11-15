import styles from '../styles/Index.module.scss';
import Link from 'next/link';
import { PostProps, TagProps } from '../pages/posts/[id]';
import { BlogGalleryProps } from '../pages';
//import { filterByTags } from '../lib/tag';

const TagList = (props: BlogGalleryProps) => {
  const { tags, posts } = props;
  return (
    <div className={styles.tag_list}>
      <h3>
        <span>Tag List</span>
      </h3>
      <div className={styles.hidden_box}>
        {tags.map((tag: TagProps) => (
          <span key={tag.tag_name.toString()} className='tags'>
            <Link href='/tags/[tag]' as={`/tags/${tag.tag_name}`} passHref>
              <a>
                {tag.tag_name} ({filterByTags(posts, tag.tag_name).length})
              </a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export function filterByTags(posts: PostProps[], tag: string) {
  return posts.filter((post) => {
    const attachedTag = post.attachedTag;
    return attachedTag.includes(tag);
  });
}

export { TagList };
