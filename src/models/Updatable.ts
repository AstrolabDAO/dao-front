import { ref, toRaw } from "vue";
import { addressZero } from "../constants";
import { cache as _cache } from "../store";
import { generateHash } from "../utils/crypto";
import { IndexedDBCache } from "../utils/db";
import { slugify, splitSearchTokens, unslug } from "../utils/format";
import { getObjectProps } from "../utils/reflexion";
import { Optional, isArray, isObject } from "../utils/typing";

export function initUpdatable(src: any, dst: any) {
  dst.revision = src?.revision || 0;
  dst.createdBy = src?.createdBy || "";
  dst.updatedBy = src?.updatedBy || "";
  dst.createdAt = src?.createdAt || new Date();
  dst.updatedAt = src?.updatedAt || new Date();
  dst.isLastRevision = src?.isLastRevision || false;
}

export class ResourceClass {

  static resource: string;

  constructor() {}

  public async init(o: Partial<ResourceClass>={}): Promise<ResourceClass> {
    const r = (<typeof ResourceClass>this.constructor).resource;
    const c = _cache[r];
    if (!c)
      _cache[r] = new IndexedDBCache({ storeName: r, expiry: 3600 * 12 });
    return this;
  }

  public cache(id: string): boolean {
    const c = _cache[(<typeof ResourceClass>this.constructor).resource];
    if (!c)
      return false;
    c.set(id, this);
    return true;
  }

  public static async get<T extends ResourceClass>(id: any): Promise<Optional<T>> {
    if (!id)
      return undefined;
    if (id instanceof ResourceClass)
      return id as T;
    const retrieved = await _cache[this.resource]?.get(id?.id ?? id?.slug ?? id) as T;
    return !retrieved && isObject(id) ? (new this()).init(id) as Promise<T> : retrieved;
  }

  public static async getAll<T extends ResourceClass>(ids?: any[]): Promise<T[]> {
    if (ids)
      return await Promise.all(ids.map((id) => this.get(id) as Promise<T>));
    return await _cache[this.resource]?.getAll() as T[];
  }
}

export class Activable extends ResourceClass {
  active=ref<boolean>(false);

  constructor() {
    super();
  }

  public async init(o: Partial<Activable>={}): Promise<ResourceClass> {
    await super.init(o as ResourceClass);
    this.active.value = false;
    return this;
  }

  public activate() {
    // @ts-ignore
    isBool(this.active) ? (this.active = true) : (this.active.value = true);
  }
  public deactivate() {
    // @ts-ignore
    isBool(this.active) ? (this.active = false) : (this.active.value = false);
  }
  public toggle() {
    // @ts-ignore
    this.active == true || this.active?.value == true
      ? this.deactivate()
      : this.activate();
  }
}

export class Searchable extends Activable {

  searchIndex="";
  searchScore=0;

  constructor() {
    super();
  }

  public async init(o: Partial<Searchable>={}): Promise<Activable> {
    await super.init(o as Activable);
    this.searchIndex = o.searchIndex ?? "";
    this.searchScore = o.searchScore ?? 0;
    return this;
  }

  public addToSearchIndex(data: string | any[] | any): boolean {
    // make array from object props
    if (isObject(data)) data = getObjectProps(data);
    // add all array props
    if (isArray(data)) {
      let ret: boolean = true;
      for (const d of data)
        ret &&= this.addToSearchIndex(d);
      return ret;
      // or single value
    } else if (typeof data == "string") {
      this.searchIndex += toRaw(data);
      return true;
    } else if (typeof data == "number") {
      this.searchIndex += data.toString(); // <-- toAuto() better?
      return true;
    }
    return false;
  }

  protected populateSearchIndex?() {}

  public updateSearchIndex(data: string | any[] | any): boolean {
    this.searchIndex = "";
    return this.addToSearchIndex(data);
  }

  public searchString(s: string): number {
    return this.searchTokens(splitSearchTokens(s));
  }

  public searchTokens(data: string | any[] | any): number {
    let score = 0;

    if (isObject(data))
      data = getObjectProps(data); // <-- imperfect
    if (isArray(data)) {
      for (const d of data)
        if (this.searchTokens(d))
          score++;
    } else if (typeof data == "string" || typeof data == "number") {
      if (this.searchIndex?.includes(data.toString()))
        score++;
    }
    this.searchScore = score;
    return score;
  }
}

export class Updatable extends Searchable {

  _id="";
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  revision?: number;
  isLastRevision: boolean = true; // active revision

  constructor() {
    super();
  }

  public async init(o: Partial<Updatable>={}): Promise<Searchable> {
    await super.init(o);
    // initUpdatable(o, this);
    this._id = o._id?.toString?.() ?? o._id ?? "";
    this.revision = o.revision ?? 0;
    this.createdBy = o.createdBy ?? addressZero;
    this.updatedBy = o.updatedBy ?? addressZero;
    this.createdAt = o.createdAt ?? new Date();
    this.updatedAt = o.updatedAt ?? new Date();
    this.isLastRevision = o.isLastRevision ?? true;
    return this;
  }
}

export class UpdatableSlugged extends Updatable {
  slug="";
  name="";

  constructor() {
    super();
  }

  public async init(o: Partial<UpdatableSlugged>={}): Promise<Updatable> {
    await super.init(o);
    this.slug = o.slug ?? (o.name ? slugify(o.name) : generateHash());
    this.name = o.name ?? unslug(this.slug);
    return this;
  }
}
