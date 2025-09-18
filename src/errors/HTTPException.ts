export class HTTPException extends Error {
    constructor(public message: string, public status: number, public error?: unknown) {
        super()
    }
}