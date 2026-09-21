export type TrafficRule = { id: string; target?: 'link' | 'ip'; period?: 'day' | 'week' | 'month' | 'total'; amount?: number; unit?: 'MB' | 'GB' | 'TB' };
export type ShareConfig = {
  title: string; expiryEnabled: boolean; expiryType: string; expiryAt?: string; passwordEnabled: boolean; password: string; passwordSource?: 'manual' | 'random';
  paidEnabled: boolean; price?: number; specifiedEnabled: boolean; uids: string[]; trafficEnabled: boolean; trafficRules: TrafficRule[];
  downloadPriceEnabled: boolean; downloadPrice?: number; domain: string; shareCreatedAt?: string;
};
export type Platform = 'web' | 'app';
export type StorageScope = { uid: string; platform: Platform };
export type MockProfile = { uid: string; label: string; eligible: boolean; customDomains: string[]; minPrice: number; commission: number; member: boolean; nickname: string };
// 模拟接口返回值：资格、特殊最低价、实际分佣比例不在展示组件中写死。
export const profiles: MockProfile[] = [
  { uid: '100001', label: '普通推广用户 · 有自定义域名', eligible: true, customDomains: ['share.example.com', 'download.example.com'], minPrice: 0.10, commission: 10, member: true, nickname: '小明' },
  { uid: '100002', label: '普通推广用户 · 无自定义域名', eligible: true, customDomains: [], minPrice: 0.10, commission: 10, member: false, nickname: '小林' },
  { uid: '100003', label: '挂载合作用户 · 无推广资格', eligible: false, customDomains: ['share.example.com'], minPrice: 0.10, commission: 0, member: true, nickname: '小陈' },
  { uid: '100004', label: '活动拉黑用户 · 无推广资格', eligible: false, customDomains: [], minPrice: 0.10, commission: 0, member: false, nickname: '小周' },
  { uid: '100005', label: '特殊推广用户 · 后台配置最低价', eligible: true, customDomains: ['share.example.com'], minPrice: 0.05, commission: 15, member: true, nickname: '小明' },
];
export const selectedFiles = ['学习资料', '年度报告.pdf', '工作文档', '产品方案.pptx', '旅行照片', '设计规范.pdf', '会议纪要.docx', '项目排期.xlsx', '视频素材', '合同模板.docx'];
export const domains = [{ value: 'official', label: '官方域名' }, { value: 'share.example.com', label: 'share.example.com' }, { value: 'download.example.com', label: 'download.example.com' }];
export const defaultTrafficRules: TrafficRule[] = [
  { id: 'rule-ip-day', target: 'ip', period: 'day', amount: 2, unit: 'GB' },
  { id: 'rule-link-total', target: 'link', period: 'total', amount: 100, unit: 'GB' },
];
export const systemConfig: ShareConfig = { title: '', expiryEnabled: false, expiryType: '7d', passwordEnabled: false, password: '', passwordSource: 'manual', paidEnabled: false, specifiedEnabled: false, uids: [], trafficEnabled: false, trafficRules: [], downloadPriceEnabled: false, domain: 'official' };
export const editConfig: ShareConfig = { ...systemConfig, title: '2026 年学习资料', shareCreatedAt: '2026-09-10T10:00:00+08:00', expiryEnabled: true, expiryType: '15d', expiryAt: '2026-09-25T10:00:00+08:00', passwordEnabled: true, password: 'ABCD', paidEnabled: true, price: 29.9, specifiedEnabled: true, uids: ['167827183', '123232334'], trafficEnabled: true, trafficRules: defaultTrafficRules, downloadPriceEnabled: true, downloadPrice: 0.8, domain: 'share.example.com' };
export const newRule = (): TrafficRule => ({ id: crypto.randomUUID(), unit: 'GB' });
export const mockUsers = [
  { phone: '13800138000', uid: '167827183' }, { phone: '13900139000', uid: '123232334' },
  { phone: '13700137000', uid: '162337183' }, { phone: '13600136000', uid: '167454567' },
];
export const queryMockUid = (input: string) => mockUsers.find(user => user.uid === input.trim() || user.phone === input.trim())?.uid;
