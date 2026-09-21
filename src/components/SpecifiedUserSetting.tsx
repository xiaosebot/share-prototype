import { Button, Input, Switch, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { queryMockUid } from '../mock/shareMock';
import { FieldHint } from './FieldHint';
export function SpecifiedUserSetting({ enabled, uids, mobile, onChange }: { enabled: boolean; uids: string[]; mobile: boolean; onChange: (v: Partial<{ enabled: boolean; uids: string[] }>) => void }) {
  const [input, setInput] = useState(''); const [loading, setLoading] = useState(false);
  const add = async () => {
    if (!input.trim() || loading) return;
    if (uids.length >= 20) { message.warning('最多可添加 20 个指定用户。'); return; }
    setLoading(true); await new Promise(resolve => setTimeout(resolve, 250));
    const uid = queryMockUid(input); setLoading(false);
    if (!uid) { message.error('未找到该用户'); return; }
    if (uids.includes(uid)) { message.warning('该用户已添加'); return; }
    onChange({ uids: [...uids, uid] }); setInput('');
  };
  return <section className="setting-group"><div className="compact-setting"><span>{enabled ? '指定分享' : '公开分享'} <FieldHint label="公开分享" text="关闭公开分享后，仅指定 UID 用户可访问。"/></span><Switch aria-label="公开分享" size={mobile ? 'default' : 'small'} checked={!enabled} onChange={checked => onChange({ enabled: !checked })}/></div>
    {enabled && <div className="sub-setting"><div className="uid-entry"><Input aria-label="手机号或 UID" value={input} onChange={e => setInput(e.target.value)} onPressEnter={add} placeholder="请输入手机号或 UID"/><Button loading={loading} disabled={uids.length >= 20} onClick={add}>添加</Button></div><ul className="uid-list">{uids.map(uid => <li key={uid}><span title={uid}>{uid}</span><Button type="text" size="small" aria-label={`移除用户 ${uid}`} icon={<CloseOutlined/>} onClick={() => onChange({ uids: uids.filter(x => x !== uid) })}/></li>)}</ul>{uids.length >= 20 && <div className="uid-limit-tip">最多可添加 20 个指定用户。</div>}</div>}
  </section>;
}
