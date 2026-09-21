import type { MockProfile, ShareConfig, TrafficRule } from '../mock/shareMock';
import type { PhraseSettings } from './shareConfigStorage';
export const validPassword = (value: string) => /^(?:[0-9]{4}|[a-zA-Z]{4})$/.test(value);
export const randomPassword = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
export const validPrice = (n: number | undefined, min: number, max: number) => n !== undefined && Number.isFinite(n) && n >= min && n <= max;
export const validRules = (rules: TrafficRule[]) => rules.length <= 8 && rules.every(r => !!r.target && !!r.period && !!r.unit && r.amount !== undefined && Number.isFinite(r.amount) && r.amount > 0) && new Set(rules.map(r => `${r.target}:${r.period}`)).size === rules.length;
export const makeTitle = (files: string[]) => files.length === 1 ? files[0] : `${files.slice(0, 2).join('、')}等${files.length}个文件`;
export function validateConfig(c: ShareConfig, p: MockProfile, editing = false): string[] {
  const errors: string[] = [];
  if (!c.title.trim()) errors.push('请填写分享标题');
  if (!editing && c.title.length > 255) errors.push('分享标题不能超过 255 个字符');
  if (c.expiryEnabled && (!c.expiryAt || !Number.isFinite(Date.parse(c.expiryAt)) || Date.parse(c.expiryAt) <= Date.now())) errors.push('到期时间必须晚于当前时间');
  if (c.passwordEnabled && !validPassword(c.password)) errors.push('提取密码需为 4 位数字或 4 位英文字母');
  // TODO: 资源价格范围沿用原型演示值，正式边界待确认。
  if (c.paidEnabled && !validPrice(c.price, 1, 9999)) errors.push('请填写 1–9999 元的资源价格');
  if (c.specifiedEnabled && !c.uids.length) errors.push('请至少添加一位指定用户');
  if (c.trafficEnabled && !validRules(c.trafficRules)) errors.push('流量限额须填写完整、数值大于 0，且对象与周期组合不能重复');
  if (p.eligible && c.downloadPriceEnabled && !validPrice(c.downloadPrice, p.minPrice, 2)) errors.push(`下载单价范围为 ${p.minPrice.toFixed(2)}–2.00 元/GB`);
  return errors;
}
export const commissionTip = (c: ShareConfig, p: MockProfile) => c.paidEnabled ? '资源收费分享的下载付费暂不参与推广分佣。' : `当前分佣比例：${p.commission}%`;
export const makeShareUrl = (domain: string, id: string) => `https://${domain === 'official' ? 'www.123pan.com' : domain}/s/${id}`;
export const withPassword = (url: string, password: string, auto: boolean) => auto && password ? `${url}?pwd=${encodeURIComponent(password)}` : url;
export const phraseTemplate = (s: PhraseSettings, hasPassword: boolean) => `『来自123云盘${s.member ? '会员' : '用户'}${s.nickname ? '「{分享人昵称}」' : ''}的分享』${s.title ? '\n{分享标题}' : ''}\n分享链接：{分享链接}${s.password && hasPassword ? '\n提取密码：{提取密码}' : ''}`;
export const renderPhrase = (template: string, values: Record<string, string>) => template.replace(/\{(会员身份|分享标题|分享链接|提取密码|分享人昵称)\}/g, (_, key: string) => values[key] ?? '');
