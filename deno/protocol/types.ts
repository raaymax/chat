export type Element = {
  nodeName: string;
  nodeValue?: string;
  childNodes?: Element[];
  getAttribute?: (attr: string) => string;
};

export type H = (
  tag: string,
  args: { [key: string]: any },
  children: any,
) => any;
