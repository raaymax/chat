import * as v from 'valibot';
import { EntityId } from "../infra/mod.ts";

export const Id = v.pipe(v.string(), v.transform((i: string) => EntityId.from(i)));
