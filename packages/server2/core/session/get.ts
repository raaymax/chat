import {repo} from '../../infra/mod.ts';

export const getSession = async (query: any) => {
  return await repo.session.get(query);
}
