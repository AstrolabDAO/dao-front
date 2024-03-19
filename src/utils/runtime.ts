const safeScopeBlockedList = new Set([
  'eval', 'window', 'global',
  'Function', 'setTimeout', 'setInterval',
  'importScripts', 'XMLHttpRequest', 'fetch',
  'postMessage'
]);

export function safeEval (src: string, ctx: any = {}): any {
  if (!ctx.hasOwnProperty('result'))
    ctx.result = null;
  ctx = new Proxy(ctx, {
    has: (target: any, prop: string) => {
      if (safeScopeBlockedList.has(prop))
        throw new Error(`${prop} blocked`);
      return prop in target;
    },
    get: (target: any, prop: string) => {
      if (safeScopeBlockedList.has(prop))
        throw new Error(`${prop} blocked`);
      return target?.[prop];
    },
  });

  const fn = new Function(`with(this) { result = (${src}) }`);
  try { fn.call(ctx); } catch (e) { console.error(e); }
  return ctx.result;
}
