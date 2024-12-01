import { Args, MessageBody, MessageBodyPartConstructor } from "./MessageBody.ts";
import { ValidationResult } from "./ValidationResult.ts";
import * as parts from "./MessageParts.ts";
import { MessageParts } from "./MessageParts.ts";
import { Element } from "./types.ts";
export * from "./MessageParts.ts";

export type MessageType = ReturnType<Message["toJSON"]>;

export class Message {
  body: MessageBody;

  toJSON(): ReturnType<typeof MessageParts[number]["prototype"]["toJSON"]> {
    if (Array.isArray(this.body)) return this.body.map((part) => part.toJSON());
    return (this.body as any).toJSON?.() ?? this.body;
  }

  toString() {
    if (Array.isArray(this.body)) {
      return this.body.map((part) => part.toString()).join("");
    }
    return (this.body as any).toString?.() ?? this.body;
  }

  constructor(body: MessageBody) {
    this.body = body;
  }

  static validate(json: any): ValidationResult {
    if (Array.isArray(json)) {
      return ValidationResult.combine(json.map(item => Message.validate(item)));
    }
    if (json === null || json === undefined || typeof json != "object") {
      return new ValidationResult(false, [{
				message: "Invalid message",
				error: "INVALID_MESSAGE"
			}]);
    }
    const part = MessageParts.find((p) => (json as any)[p.propName]);
		if (!part) {
			return new ValidationResult(false, [{
				message: "Invalid message part",
				error: "INVALID_PART"
			}]);
		}
		return part.validate(json);
  }

  static parsePart(json: unknown): MessageBody {
    if (Array.isArray(json)) {
      const arr = json.map((item) => {
        return Message.parsePart(item);
      }).flat().filter(Boolean) as MessageBody[];
      return (arr.length === 1 ? arr[0] : arr) as MessageBody;
    }
    if (json === null || json === undefined || typeof json != "object") {
      return new parts.Text({}, String(json));
    }
    const part = MessageParts.find((p) => (json as any)[p.propName])?.parse(json, this);
    if (!part) throw new Error(`Invalid message part: ${JSON.stringify(json)}`);
    return part;
  }

  static parse(json: unknown): Message {
    return new Message(Message.parsePart(json));
  }

	static create= <
		P extends MessageBodyPartConstructor,
		A extends Args,
		C extends [],
	>(Class: P, args: A, ...children: C) => {
		return new Class(args, children);
	};
}

