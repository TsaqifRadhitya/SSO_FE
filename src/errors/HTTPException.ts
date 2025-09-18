export class HTTPException extends Error {
    constructor(public message: string, public status: number, error?: any) {
        super()
    }
}