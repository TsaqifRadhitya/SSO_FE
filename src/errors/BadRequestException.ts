import { HTTPException } from "./HTTPException";

export class BadRequestException extends HTTPException {
    constructor(err?: unknown) {
        super("Bad Request", 400, err)
    }
}