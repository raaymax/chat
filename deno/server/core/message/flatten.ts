import * as types from "../../types.ts";

function is<T extends types.MessageBodyPart>(
  data: types.MessageBodyPart,
  key: string,
): data is T {
  return (data as T)[key as keyof T] !== undefined;
}
// FIXME: There is no way of searching messages using mentions or channel links
export function flatten(tree: types.MessageBody): string {
  return [tree].flat().map((n: types.MessageBodyPart) => {
    if (is<types.MessageBodyBlockquote>(n, "blockquote")) {
      return flatten(n.blockquote);
    }
    if (is<types.MessageBodyBold>(n, "bold")) return flatten(n.bold);
    if (is<types.MessageBodyBr>(n, "br")) return "\n";
    if (is<types.MessageBodyBullet>(n, "bullet")) return flatten(n.bullet);
    if (is<types.MessageBodyChannel>(n, "channel")) return n.channel;
    if (is<types.MessageBodyCode>(n, "code")) return n.code;
    if (is<types.MessageBodyCodeblock>(n, "codeblock")) return n.codeblock;
    if (is<types.MessageBodyEmoji>(n, "emoji")) return n.emoji;
    if (is<types.MessageBodyImg>(n, "img")) return n._alt;
    if (is<types.MessageBodyItalic>(n, "italic")) return flatten(n.italic);
    if (is<types.MessageBodyItem>(n, "item")) return flatten(n.item);
    if (is<types.MessageBodyLine>(n, "line")) return [flatten(n.line), "\n"];
    if (is<types.MessageBodyLink>(n, "link")) return flatten(n.link);
    if (is<types.MessageBodyOrdered>(n, "ordered")) return flatten(n.ordered);
    if (is<types.MessageBodyStrike>(n, "strike")) return flatten(n.strike);
    if (is<types.MessageBodyText>(n, "text")) return n.text;
    if (is<types.MessageBodyThread>(n, "thread")) return n.thread;
    if (is<types.MessageBodyUnderline>(n, "underline")) {
      return flatten(n.underline);
    }
    if (is<types.MessageBodyUser>(n, "user")) return n.user;
    // eslint-disable-next-line no-console
    console.log("unknown node", n);
    return "";
  }).flat().join("");
}
