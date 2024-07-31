import { ApiError } from "@planigale/planigale";
export { ResourceNotFound } from "@planigale/planigale";

export class AccessDenied extends ApiError {
  log = false;
  constructor(message: string) {
    super(401, "ACCESS_DENIED", message);
  }
}
