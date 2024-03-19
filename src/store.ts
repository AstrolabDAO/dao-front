import { App, ref, shallowRef } from "vue";
import { IndexedDBCache } from "./utils/db";
import { parseJwt } from "./utils/format";

export const app = {
  instance: {} as App<Element>,
  element: {} as HTMLElement,
  rect: {} as DOMRect,
}

export const clients = {
  http: {} as any,
  rpc: {} as any,
  api: {} as any,
  ws: {} as any,
}

export const router = {
  instance: {} as any,
  element: {} as HTMLElement,
  rect: {} as DOMRect,
  pathname: ref(location.pathname),
  view: shallowRef(),
  viewProps: ref(),
  components: {} as any,
}

export const bg = {
  speed: .03,
  time: 0,
  computedTime: 0,
  prevTime: 0,
  lineWidth: 0.025,
  // fadeFactor: ref(1),
  // rotSpeed: ref(0.03),
  // distortionSpeed: 0.01,
  // viewDistance: 100,
}

export const session = {
  api: {
    token: {
      value: "",
      expiry: 0,
      get() {
        this.value ??= localStorage.get('session:api:token');
        return this.value;
      },
      set(t: string, expiry?: number) {
        expiry ??= parseJwt(t)?.exp;
        this.value = t;
        localStorage.set('session:api:token', t);
        if (expiry) {
          localStorage.setItem('session:api:token:expiry', expiry.toString());
          this.expiry = expiry;
        }
      },
      flush() {
        localStorage.remove('session:api:token');
        localStorage.remove('session:api:token:expiry');
        this.value = "";
        this.expiry = 0;
      },
    },
  },
  networks: [] as any[],
  rpcByNetwork: {} as { [key: string]: any },
}

export const cache: { [key: string]: IndexedDBCache } = {
  svg: new IndexedDBCache({ storeName: "svg", expiry: 3600 * 12 }),
  endpoint: new IndexedDBCache({ storeName: "endpoint", expiry: 3600 * 12 }),
  md: new IndexedDBCache({ storeName: "md", expiry: 3600 * 12 }),
};
