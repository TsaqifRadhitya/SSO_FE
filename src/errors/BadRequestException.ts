import { HTTPException } from "./HTTPException";

export class BadRequestException extends HTTPException {
    constructor(err?: any) {
        super("Bad Request", 400, err)
    }
}