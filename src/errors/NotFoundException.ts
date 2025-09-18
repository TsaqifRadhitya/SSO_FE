import { HTTPException } from "./HTTPException";

export class NotFoundExeption extends HTTPException {
    constructor() {
        super("Not Found", 404)
    }
}