/**
 * Solution based on https://github.com/lodash/lodash/issues/2403#issuecomment-1158234729
 * Modified to work with _.throttle
 */

import _ from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MemoizeThrottledFunction<F extends (...args: any[]) => any> {
    (...args: Parameters<F>): void;
    flush: (...args: Parameters<F>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoizeThrottle<F extends (...args: any[]) => any>(
    func: F,
    wait = 0,
    options: _.ThrottleSettings = {},
    resolver?: (...args: Parameters<F>) => unknown
): MemoizeThrottledFunction<F> {
    const throttleMemo = _.memoize<
        (...args: Parameters<F>) => _.DebouncedFunc<F>
        >(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (..._args: Parameters<F>) => _.throttle(func, wait, options),
        resolver
    );

    function wrappedFunction(...args: Parameters<F>): ReturnType<F> | undefined {
        return throttleMemo(...args)(...args);
    }

    wrappedFunction.flush = (...args: Parameters<F>): void => {
        throttleMemo(...args).flush();
    };

    return wrappedFunction as unknown as MemoizeThrottledFunction<F>;
}
