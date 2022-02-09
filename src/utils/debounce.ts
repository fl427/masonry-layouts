// https://dev.to/bwca/create-a-debounce-function-from-scratch-in-typescript-560m
// useDebounce封装，用以方便得清楚timer
export function debounce<A = unknown, R = void>(
    fn: (args: A) => R,
    ms: number,
): [(args: A) => Promise<R>, () => void] {
    let timer: NodeJS.Timeout;

    const debounceFunc = (args: A): Promise<R> =>
        new Promise((resolve) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                resolve(fn(args));
            }, ms);
        });
    const clearDebounce = () => clearTimeout(timer);
    return [debounceFunc, clearDebounce];
}

// 一般写法
export const debounceSimple = <A = unknown, R = void>(
    fn: (args: A) => R,
    ms: number,
): (args: A) => void => {
    let timer: NodeJS.Timeout;

    return (args: A) => {
        const next = () => fn(args);
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(next, ms);
    }
}