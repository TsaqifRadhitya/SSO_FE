import { HTTPException } from "./HTTPException";

export class UnautencicatedException extends HTTPException {
    constructor() {
        super("unatunticated", 401)
    }
}