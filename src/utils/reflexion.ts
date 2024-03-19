import { isObject, isFunction, Optional } from "./typing";

// returns the names of all class/object embedded methods as array
export function getObjectMethods(o: any): string[] {

  if (!isObject(o)) {
    console.log("Can only get methods from objects");
    return [];
  }
  return Object.getOwnPropertyNames(o).filter(k => isFunction(o[k]));
}

export function getObjectPropNames(o: any, keepFunctions = false): string[] {

  if (!isObject(o)) {
    return [];
  }
  let names: Set<string> = new Set();
  if (!keepFunctions) {
    for (const n of Object.getOwnPropertyNames(o))
      if (!isFunction(o[n]))
        names.add(n);
  } else {
    Object.getOwnPropertyNames(o).forEach(n => names.add(n));
  }
  return Array.from(names);
}

// returns the values of all class/object attributes as array
export function getObjectProps(o: any, keepFunctions = false): any[] {
  return getObjectPropNames(o, keepFunctions).map(n => o[n]);
}

export function getObjectKeyForValue(o: Record<string, any>, value: any): Optional<any> {
  for (const key in o)
    if (o.hasOwnProperty(key) && o[key] === value)
      return key;
  return undefined;
}

export function intersect<T>(a: T[], b: T[]): T[] {
  // return a.filter((x) => b.includes(x));
  const set = new Set(a);
  return b.filter(v => set.has(v));
}

export function cloneDeep(val: any, map = new WeakMap()) {
  // Base case for non-objects
  if (typeof val !== 'object' || val === null) return val;
  if (val instanceof Date) return new Date(val);
  if (val instanceof RegExp) return new RegExp(val.source, val.flags);
  if (typeof val === 'function') return val;
  if (map.has(val)) return map.get(val);

  let clone: any;

  if (Array.isArray(val)) {
    clone = [];
    map.set(val, clone);
    val.forEach((item, index) => {
      clone[index] = cloneDeep(item, map);
    });
  } else {
    clone = {};
    map.set(val, clone);
    for (const key in val) {
      clone[key] = cloneDeep(val[key], map);
    }
  }

  return clone;
}

export function merge(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}

export function transposeObject(o: {[k: string|number]: string|number}): any {
  if (!o)
    return {};
  const t: {[k: string|number]: any} = {};
  for (const key in o)
    if (o.hasOwnProperty(key))
      t[o[key]] = key;
  return t;
}
