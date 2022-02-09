// https://dev.to/bwca/create-a-debounce-function-from-scratch-in-typescript-560m

import { useEffect } from "react";
import { debounce } from "../utils/debounce";

export const useDebounce = <A = unknown, R = void>(
    fn: (args: A) => R,
    ms: number,
): ((args: A) => Promise<R>) => {
    const [debounceFunc, clearDebounce] = debounce<A, R>(fn, ms);

    useEffect(() => () => clearDebounce(), []);

    return debounceFunc;
}