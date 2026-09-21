import { Button, Input, Popconfirm, Popover, Switch, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { PasswordHistory } from '../utils/shareConfigStorage';
import { randomPassword } from '../utils/shareRules';
import { FieldHint } from './FieldHint';
export function PasswordSetting({ enabled, password, history, mobile, onChange, onHistory }: { enabled: boolean; password: string; history: PasswordHistory; mobile: boolean; onChange: (v: Partial<{ enabled: boolean; password: string; source: 'manual' | 'random' }>) => void; onHistory: (v: PasswordHistory) => void }) {
  const [open, setOpen] = useState(false);
  const choose = (value: string) => { onChange({ password: value, source: 'manual' }); setOpen(false); };
  const orderedHistory = [...history].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault) || (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
  const content = <div className="password-history">{!orderedHistory.length && <span className="empty-history">暂无历史密码</span>}{orderedHistory.map(item => <div className="password-history-row" key={item.value}><Button type="text" onClick={() => choose(item.value)}>{item.value}</Button>{item.isDefault ? <Tag color="blue">默认</Tag> : <Button type="link" size="small" onClick={() => onHistory(history.map(i => ({ ...i, isDefault: i.value === item.value })))}>设为默认</Button>}<Popconfirm title="删除这条历史密码？" onConfirm={() => onHistory(history.filter(x => x.value !== item.value))}><Button size="small" type="link" danger>删除</Button></Popconfirm></div>)}</div>;
  return <section className="setting-group"><div className="compact-setting"><span>提取密码 <FieldHint label="提取密码" text="开启后，访问者需输入 4 位数字或 4 位英文字母。"/></span>
    <div className="setting-controls"><Switch aria-label="提取密码" size={mobile ? 'default' : 'small'} checked={enabled} onChange={checked => onChange({ enabled: checked, password: checked ? history.find(x => x.isDefault)?.value || '' : '' })}/>
    {enabled && <div className="password-inputs"><Input aria-label="4位提取密码" value={password} maxLength={4} placeholder="4位数字或字母" onChange={e => onChange({ password: e.target.value.replace(/[^a-zA-Z0-9]/g, ''), source: 'manual' })} suffix={<Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight"><button className="dropdown-trigger" aria-label="历史密码" type="button"><DownOutlined/></button></Popover>}/><Button onClick={() => { let next = randomPassword(); while (next === password) next = randomPassword(); onChange({ password: next, source: 'random' }); }}>随机</Button></div>}</div>
  </div></section>;
}
