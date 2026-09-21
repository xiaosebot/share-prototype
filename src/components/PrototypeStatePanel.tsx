import { Button, Card, Segmented, Select, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Platform } from '../mock/shareMock';
export type DemoScreen = 'create' | 'success' | 'batchSuccess' | 'batchPartial';
export function PrototypeStatePanel({ platform, screen, mode, profileUid, profiles, onPlatform, onScreen, onMode, onProfile, onReset }: {
  platform: Platform; screen: DemoScreen; mode: 'create' | 'edit'; profileUid: string; profiles: { uid: string; label: string }[];
  onPlatform: (p: Platform) => void; onScreen: (s: DemoScreen) => void; onMode: (m: 'create' | 'edit') => void; onProfile: (uid: string) => void; onReset: () => void;
}) {
  return <Card className="prototype-panel" size="small" title="原型演示面板"><Space direction="vertical" size={8} style={{ width: '100%' }}><Segmented block value={platform} onChange={value => onPlatform(value as Platform)} options={[{ value: 'web', label: 'Web / PC' }, { value: 'app', label: 'App' }]}/><Select value={screen} onChange={onScreen} options={[{ value: 'create', label: '分享设置' }, { value: 'success', label: '单个创建成功' }, { value: 'batchSuccess', label: '批量全部成功' }, { value: 'batchPartial', label: '批量部分失败' }]} style={{ width: '100%' }}/><Select value={profileUid} onChange={onProfile} options={profiles.map(p => ({ value: p.uid, label: p.label }))} style={{ width: '100%' }}/><Segmented block value={mode} disabled={screen !== 'create'} onChange={value => onMode(value as 'create' | 'edit')} options={[{ value: 'create', label: '新建' }, { value: 'edit', label: '编辑' }]}/><Button icon={<ReloadOutlined/>} block onClick={onReset}>清除记忆并恢复默认</Button></Space></Card>;
}
