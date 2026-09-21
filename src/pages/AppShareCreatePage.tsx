import { Button, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { selectedFiles } from '../mock/shareMock';
import { ShareSettingsForm } from '../components/ShareSettingsForm';
import { loadPasswordHistory, rememberValidConfig, savePasswordHistory, type PasswordHistory } from '../utils/shareConfigStorage';
import { validateConfig } from '../utils/shareRules';

export function AppShareCreatePage({ config, profile, scope, mode, onChange, onSingle, onBatch, onBack }: {
  config: ShareConfig; profile: MockProfile; scope: StorageScope; mode: 'create' | 'edit'; onChange: (patch: Partial<ShareConfig>) => void;
  onSingle: () => void; onBatch: () => void; onBack: () => void;
}) {
  const [history, setHistory] = useState<PasswordHistory>(() => loadPasswordHistory(scope)); const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => setHistory(loadPasswordHistory(scope)), [scope.uid, scope.platform]);
  useEffect(() => { savePasswordHistory(scope, history); }, [history, scope]);
  useEffect(() => { if (mode === 'create') rememberValidConfig(scope, config, profile.minPrice); }, [config, mode, profile.minPrice, scope]);
  const submit = (kind: 'single' | 'batch') => { const next = validateConfig(config, profile, mode === 'edit'); setErrors(next); if (next.length) { message.error('请先完成必填配置'); return; } if (kind === 'batch' && selectedFiles.length > 100) { message.error('最多可批量创建 100 个分享'); return; } kind === 'single' ? onSingle() : onBatch(); };
  return <div className="mobile-screen mobile-create"><header className="mobile-nav"><Button type="text" aria-label="返回" onClick={onBack}>‹</Button><h1>{mode === 'edit' ? '编辑分享设置' : '分享链接设置'}</h1><span/></header><main>
    <button className="mobile-legal" type="button" onClick={() => message.info('严禁传播违法犯罪及侵权内容')}><span>严厉打击违法犯罪活动申明</span><span>详情　›</span></button>
    <ShareSettingsForm config={config} profile={profile} history={history} mobile mode={mode} errors={errors} onChange={patch => { setErrors([]); onChange(patch); }} onHistory={setHistory}/>
  </main><footer className="mobile-create-footer"><div className="mobile-illegal-inline">禁止传播违法文件 <InfoCircleOutlined/></div>{mode === 'edit' ? <Button type="primary" block onClick={() => { const next = validateConfig(config, profile, true); setErrors(next); next.length ? message.error('请先完成必填配置') : message.success('修改成功（不更新新建记忆）'); }}>保存修改</Button> : <div className="mobile-create-actions"><Button onClick={() => submit('batch')}>批量创建</Button><Button type="primary" onClick={() => submit('single')}>创建单个链接</Button></div>}</footer></div>;
}
