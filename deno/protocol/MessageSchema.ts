import { MessageParts } from "./Message.ts";

export class MessageSchema {
  schemaId: string = "message";

  getPartsRefs() {
    return MessageParts.map((part) => ({
      $ref: `${this.schemaId}#/definitions/${part.propName}`,
    }));
  }

  getAllParts() {
    return Object.fromEntries(MessageParts.map((part) => [part.propName, {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(part.schema)
          .map(([key, value]) => [`_${key}`, { type: value }]),
      ),
    }]));
  }

  generate() {
    return {
      $id: this.schemaId,
      definitions: {
        body: {
          oneOf: this.getPartsRefs(),
        },
        array: { type: "array", items: { $ref: "message#/definitions/body" } },
        ...this.getAllParts(),
      },
    };
  }
}
