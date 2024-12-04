export class PageNotFoundError extends Error {
  constructor() {
    super("Page not found");
    this.name = "PageNotFoundError";
  }
}
