import { HTTPException } from "./HTTPException";

export class InternalServerError extends HTTPException {
    constructor(error?: any) {
        super("Internal Server Error", 500, error)
    }
}