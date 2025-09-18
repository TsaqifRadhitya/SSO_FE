import { HTTPException } from "./HTTPException";

export class InternalServerError extends HTTPException {
    constructor(error?: unknown) {
        super("Internal Server Error", 500, error)
    }
}