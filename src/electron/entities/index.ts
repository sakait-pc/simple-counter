export interface Counter {
  name: string;
  count: number;
  lastUpdate: string;
}
export type StoreType = {
  counters: Counter[] | undefined;
};
