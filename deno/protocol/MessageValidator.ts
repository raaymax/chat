import { ValidationResult } from "./ValidationResult.ts";
import { MessageParts } from "./MessageParts.ts";

export class MessageValidator {
  static validate(json: any): ValidationResult {
    if (Array.isArray(json)) {
      return ValidationResult.combine(
        json.map((item) => MessageValidator.validate(item)),
      );
    }
    if (json === null || json === undefined || typeof json != "object") {
      return new ValidationResult(false, [{
        message: "Invalid message",
        error: "INVALID_MESSAGE",
      }]);
    }
    const part = MessageParts.find((p) => (json as any)[p.propName]);
    if (!part) {
      return new ValidationResult(false, [{
        message: "Invalid message part",
        error: "INVALID_PART",
      }]);
    }
    return part.validate(json);
  }
}
