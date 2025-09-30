export type ErrorMapper<T> = {
    [K in keyof T]?: string
} 