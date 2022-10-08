"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeThrottle = void 0;
const lodash_1 = __importDefault(require("lodash"));
function memoizeThrottle(func, wait = 0, options = {}, resolver) {
    const throttleMemo = lodash_1.default.memoize((..._args) => lodash_1.default.throttle(func, wait, options), resolver);
    function wrappedFunction(...args) {
        return throttleMemo(...args)(...args);
    }
    wrappedFunction.flush = (...args) => {
        throttleMemo(...args).flush();
    };
    return wrappedFunction;
}
exports.memoizeThrottle = memoizeThrottle;
