import { dbQuery } from '../db';
import { TagProps } from '../pages/posts/[id]';

export async function getAllTags() {
  const queryAboutTag = `SELECT tag_name FROM tags`;
  const tags: TagProps[] = await dbQuery(queryAboutTag);
  return tags;
}
