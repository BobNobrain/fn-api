abstract class EAC {
    constructor(...args: any[]) {}
}

export type Class<T> = typeof EAC & {
    prototype: T,
    new (...args: any[]): T
};
