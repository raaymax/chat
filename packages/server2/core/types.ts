import * as v from 'valibot';
import { EntityId } from '../types.ts';

export const Id = v.pipe(v.string(), v.transform((i: string) => EntityId.from(i)));
export const IdArr = v.pipe(v.array(v.string()), v.transform((i: string[]) => i.map(EntityId.from)));


