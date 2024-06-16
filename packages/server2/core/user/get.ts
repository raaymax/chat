import {repo} from '../../infra/mod.ts';

export const getUser = async (query: any) => {
  return await repo.user.get(query);
}
