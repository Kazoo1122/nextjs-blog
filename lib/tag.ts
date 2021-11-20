import { dbQuery } from '../db';

export async function getTags(query: string) {
  const tags: string[] = await dbQuery(query);
  return tags;
}
