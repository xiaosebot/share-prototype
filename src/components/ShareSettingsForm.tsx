import { Alert, Input } from 'antd';
import { useState } from 'react';
import type { MockProfile, ShareConfig } from '../mock/shareMock';
import type { PasswordHistory } from '../utils/shareConfigStorage';
import { addPasswordHistory } from '../utils/shareConfigStorage';
import { validPassword } from '../utils/shareRules';
import { DomainSetting } from './DomainSetting';
import { DownloadPriceSetting } from './DownloadPriceSetting';
import { ExpirySetting } from './ExpirySetting';
import { FieldHint } from './FieldHint';
import { PaidResourceSetting } from './PaidResourceSetting';
import { PasswordSetting } from './PasswordSetting';
import { SpecifiedUserSetting } from './SpecifiedUserSetting';
import { TrafficLimitSetting } from './TrafficLimitSetting';

export function ShareSettingsForm({ config, profile, history, mobile, mode, errors, onChange, onHistory }: {
  config: ShareConfig; profile: MockProfile; history: PasswordHistory; mobile: boolean; mode: 'create' | 'edit'; errors: string[];
  onChange: (patch: Partial<ShareConfig>) => void; onHistory: (history: PasswordHistory) => void;
}) {
  const [titleExpanded, setTitleExpanded] = useState(false);
  const updatePassword = (patch: Partial<{ enabled: boolean; password: string; source: 'manual' | 'random' }>) => {
    const nextPassword = patch.password ?? config.password;
    onChange({ passwordEnabled: patch.enabled ?? config.passwordEnabled, password: nextPassword, passwordSource: patch.source ?? config.passwordSource });
    if (validPassword(nextPassword)) onHistory(addPasswordHistory(history, nextPassword));
  };
  return <div className={mobile ? 'settings-form mobile-settings-form' : 'settings-form'}>
    <section className="setting-group title-setting">
      <label>分享标题 <FieldHint label="分享标题" text="修改分享标题不会修改云盘内原文件名称。"/></label>
      {titleExpanded ? <Input.TextArea aria-label="分享标题" autoFocus value={config.title} autoSize={{ minRows: 2, maxRows: 4 }} maxLength={255} showCount={!mobile} onChange={e => onChange({ title: e.target.value })} onBlur={() => setTitleExpanded(false)}/> : <Input aria-label="分享标题" value={config.title} maxLength={255} onFocus={() => setTitleExpanded(true)} onChange={e => onChange({ title: e.target.value })}/>} 
    </section>
    <ExpirySetting mobile={mobile} editing={mode === 'edit'} shareCreatedAt={config.shareCreatedAt} enabled={config.expiryEnabled} expiryAt={config.expiryAt} onChange={v => onChange({ expiryEnabled: v.enabled ?? config.expiryEnabled, expiryAt: v.expiryAt })}/>
    <PasswordSetting mobile={mobile} enabled={config.passwordEnabled} password={config.password} history={history} onHistory={onHistory} onChange={updatePassword}/>
    <PaidResourceSetting mobile={mobile} enabled={config.paidEnabled} price={config.price} onChange={v => onChange({ paidEnabled: v.enabled ?? config.paidEnabled, price: v.price })}/>
    <SpecifiedUserSetting mobile={mobile} enabled={config.specifiedEnabled} uids={config.uids} onChange={v => onChange({ specifiedEnabled: v.enabled ?? config.specifiedEnabled, uids: v.uids ?? config.uids })}/>
    <TrafficLimitSetting mobile={mobile} enabled={config.trafficEnabled} rules={config.trafficRules} onChange={v => onChange({ trafficEnabled: v.enabled ?? config.trafficEnabled, trafficRules: v.rules ?? config.trafficRules })}/>
    <DownloadPriceSetting mobile={mobile} config={config} profile={profile} onChange={onChange}/>
    <DomainSetting value={config.domain} customDomains={profile.customDomains} onChange={domain => onChange({ domain })}/>
    {!!errors.length && <Alert className="form-errors" type="error" showIcon message={errors[0]} description={errors.length > 1 ? errors.slice(1).join('；') : undefined}/>} 
  </div>;
}
