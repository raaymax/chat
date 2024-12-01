import { MessageBody, MessageBodyPart } from './MessageBody.ts';
import { Element, H } from "./types.ts";

export class Link extends MessageBodyPart<{href: string}, any> {
	static override propName = 'link';
	static override args = {
		type: 'object',
		required: ['href'],
		properties: {
			href: {type: 'string'}
		}
	};
	override toHtml(h: H): string {
	  return h('a', {href: this.args.href}, [this.children].flat().map((child) => child.toHtml(h)));
	}
}
export class Text extends MessageBodyPart<{}, string> {
	static override propName = 'text';
	static override children = 'string';

  static override parse<J extends { [key: string]: any }>(
    json: J,
  ): MessageBody {
    return new this({}, json.text);
  }

	static override parseFromHtml(html: Element): MessageBody | undefined {
		if (html.nodeName === '#text') {
			return new this({}, html.nodeValue ?? '');
		}
	}

  override toJSON(): string {
    return this.children;
  }

  override toString() {
    return this.children;
  }

	override toHtml() {
		return this.children;
	}

}
export class Bold extends MessageBodyPart {
	static override propName = 'bold';

	override toHtml(h: H): string {
	  return h('b', {}, [this.children].flat().map((child) => child.toHtml(h)));
	}
}
export class Line extends MessageBodyPart {
	static override propName = 'line';

	override toHtml(h: H): string {
	  return h('div', {}, [this.children].flat().map((child) => child.toHtml(h)));
	}
}

export const parts = {Link, Text, Bold, Line};
export const MessageParts = Object.values(parts)
