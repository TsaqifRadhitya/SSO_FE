export type TypeCombiner<T, K> = {
    [A in keyof T]: A & {
        [B in keyof K]: K
    }
}