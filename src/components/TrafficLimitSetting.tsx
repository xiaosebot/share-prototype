import { Button, InputNumber, Select, Switch, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { newRule, type TrafficRule } from '../mock/shareMock';
import { FieldHint } from './FieldHint';
const targets = [{ value: 'link', label: '此链接' }, { value: 'ip', label: '每IP' }];
const periods = [{ value: 'day', label: '每天' }, { value: 'week', label: '每周' }, { value: 'month', label: '每月' }, { value: 'total', label: '累计' }];
export function TrafficLimitSetting({ enabled, rules, mobile, onChange }: { enabled: boolean; rules: TrafficRule[]; mobile: boolean; onChange: (v: Partial<{ enabled: boolean; rules: TrafficRule[] }>) => void }) {
  const duplicate = (r: TrafficRule) => r.target && r.period && rules.some(x => x.id !== r.id && x.target === r.target && x.period === r.period);
  const update = (id: string, patch: Partial<TrafficRule>) => {
    const proposed = rules.map(r => r.id === id ? { ...r, ...patch } : r);
    if (duplicate(proposed.find(r => r.id === id)!)) { message.warning('已存在相同的流量限制规则'); return; }
    onChange({ rules: proposed });
  };
  return <section className="setting-group"><div className="compact-setting traffic-toggle"><span>分享流量 <FieldHint label="分享流量" text="开启后，已登录和未登录接收方都可使用分享方提供的下载流量。"/></span><div className="setting-controls"><Switch aria-label="分享流量" size={mobile ? 'default' : 'small'} checked={enabled} onChange={enabled => onChange({ enabled })}/><span className="traffic-balance">余额 1.01 TB</span><Button type="link" size="small" onClick={() => message.info('演示：充值需在正式客户端完成')}>充值</Button></div></div>
    {enabled && <div className="sub-setting traffic-limit"><div className="sub-label">流量限额 <FieldHint label="流量限额" text="可不设限额。达限后仅停止消耗分享方流量，不影响访问、查看、转存；登录用户可使用自己的权益，未登录用户按现网付费下载或登录后继续。"/></div>
    {rules.map((rule, i) => <div className="limit-row" key={rule.id}><Select aria-label={`规则${i+1}限制对象`} placeholder="对象" value={rule.target} options={targets.map(x => ({ ...x, disabled: !!duplicate({ ...rule, target: x.value as TrafficRule['target'] }) }))} onChange={target => update(rule.id, { target })}/><Select aria-label={`规则${i+1}周期`} placeholder="周期" value={rule.period} options={periods.map(x => ({ ...x, disabled: !!duplicate({ ...rule, period: x.value as TrafficRule['period'] }) }))} onChange={period => update(rule.id, { period })}/><InputNumber aria-label={`规则${i+1}流量值`} value={rule.amount} placeholder="数值" onChange={amount => update(rule.id, { amount: amount ?? undefined })}/><Select aria-label={`规则${i+1}单位`} value={rule.unit} options={['MB','GB','TB'].map(value => ({ value }))} onChange={unit => update(rule.id, { unit })}/><Button type="text" size="small" aria-label={`删除规则${i+1}`} icon={<CloseOutlined/>} onClick={() => onChange({ rules: rules.filter(r => r.id !== rule.id) })}/></div>)}
    <Button type="link" size="small" icon={<PlusOutlined/>} disabled={rules.length >= 8} onClick={() => onChange({ rules: [...rules, newRule()] })}>添加限制规则</Button></div>}
  </section>;
}
