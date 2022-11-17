export interface Counter {
  name: string;
  count: number;
  lastUpdate: string;
  isLocked: boolean;
}
export type StoreType = {
  counters: Counter[] | undefined;
};
