import type { ShareConfig, StorageScope } from '../mock/shareMock';
import { validPassword, validPrice, validRules } from './shareRules';
const key = (scope: StorageScope, type: string) => `123pan-share:v2:${scope.platform}:${scope.uid}:${type}`;
const read = <T,>(scope: StorageScope, type: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key(scope, type)) || 'null') ?? fallback; } catch { return fallback; }
};
const write = (scope: StorageScope, type: string, value: unknown) => {
  try { localStorage.setItem(key(scope, type), JSON.stringify(value)); return true; } catch { return false; }
};
export const loadDefaultConfig = (scope: StorageScope): Partial<ShareConfig> => read(scope, 'config', {});
export const clearPrototypeMemory = (scope: StorageScope) => {
  ['config', 'passwords', 'phrase'].forEach(type => localStorage.removeItem(key(scope, type)));
};
// 新建时即时记忆完整、合法、可提交的配置；编辑不会调用。标题、实际密码不写入默认配置。
export const rememberValidConfig = (scope: StorageScope, c: ShareConfig, minPrice: number) => {
  const saved = loadDefaultConfig(scope);
  if (!c.expiryEnabled || (c.expiryAt && Date.parse(c.expiryAt) > Date.now())) Object.assign(saved, { expiryEnabled: c.expiryEnabled, expiryType: c.expiryType, expiryAt: c.expiryAt });
  if (!c.passwordEnabled || validPassword(c.password)) saved.passwordEnabled = c.passwordEnabled;
  if (!c.paidEnabled || validPrice(c.price, 1, 9999)) Object.assign(saved, { paidEnabled: c.paidEnabled, price: c.price });
  if (!c.specifiedEnabled || c.uids.length > 0) Object.assign(saved, { specifiedEnabled: c.specifiedEnabled, uids: c.uids });
  if (!c.trafficEnabled || validRules(c.trafficRules)) Object.assign(saved, { trafficEnabled: c.trafficEnabled, ...(validRules(c.trafficRules) ? { trafficRules: c.trafficRules } : {}) });
  if (!c.downloadPriceEnabled || validPrice(c.downloadPrice, minPrice, 2)) Object.assign(saved, { downloadPriceEnabled: c.downloadPriceEnabled, downloadPrice: c.downloadPrice });
  saved.domain = c.domain;
  return write(scope, 'config', saved);
};
export type PasswordHistory = { value: string; isDefault?: boolean; lastUsedAt?: number }[];
const sortPasswordHistory = (items: PasswordHistory): PasswordHistory => [...items].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault) || (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
export const loadPasswordHistory = (scope: StorageScope): PasswordHistory => {
  const data = read<PasswordHistory>(scope, 'passwords', []);
  return Array.isArray(data) ? sortPasswordHistory(data.filter(x => validPassword(x.value))).slice(0, 10) : [];
};
export const savePasswordHistory = (scope: StorageScope, items: PasswordHistory) => write(scope, 'passwords', sortPasswordHistory(items).slice(0, 10));
export const addPasswordHistory = (items: PasswordHistory, password: string): PasswordHistory => {
  if (!validPassword(password)) return items;
  const now = Date.now();
  const existing = items.find(item => item.value === password);
  const next: PasswordHistory = existing
    ? items.map(item => item.value === password ? { ...item, lastUsedAt: now } : item)
    : [...items, { value: password, lastUsedAt: now }];
  const sorted = sortPasswordHistory(next);
  if (sorted.length <= 10) return sorted;
  const oldestNonDefault = [...sorted].reverse().find(item => !item.isDefault);
  return oldestNonDefault ? sorted.filter(item => item !== oldestNonDefault) : sorted.slice(0, 10);
};
export type PhraseSettings = { member: boolean; nickname: boolean; title: boolean; password: boolean; autoPassword: boolean };
export const allPhraseSettings: PhraseSettings = { member: true, nickname: true, title: true, password: true, autoPassword: true };
export const loadPhraseSettings = (scope: StorageScope): PhraseSettings => ({ ...allPhraseSettings, ...read(scope, 'phrase', {}) });
export const savePhraseSettings = (scope: StorageScope, settings: PhraseSettings) => write(scope, 'phrase', settings);
