// ref: https://blog.devgenius.io/how-to-better-poll-apis-in-react-312bddc604a4

import { useCallback, useEffect, useRef } from 'react';

export const FetchInterval = 5000;

export const useIntervalAsync = <R = unknown>(fn: () => Promise<R>, ms: number) => {
    const runningCount = useRef(0);
    const timeout = useRef<number>();
    const mountedRef = useRef(false);

    const next = useCallback(
        (handler: string | Function) => {
            if (mountedRef.current && runningCount.current === 0) {
                timeout.current = window.setTimeout(handler, ms);
            }
        },
        [ms]
    );

    const run = useCallback(async () => {
        runningCount.current += 1;
        const result = await fn();
        runningCount.current -= 1;

        next(run);

        return result;
    }, [fn, next]);

    useEffect(() => {
        mountedRef.current = true;
        run();

        return () => {
            mountedRef.current = false;
            window.clearTimeout(timeout.current);
        };
    }, [run]);

    const flush = useCallback(() => {
        window.clearTimeout(timeout.current);
        return run();
    }, [run]);

    return flush;
};
