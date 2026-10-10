import { Button, Checkbox, Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { allPhraseSettings, loadPhraseSettings, savePhraseSettings, type PhraseSettings } from '../utils/shareConfigStorage';
import { copyText } from '../utils/clipboard';
import { makeShareUrl, renderPhrase, withPassword } from '../utils/shareRules';
import { initialResultDomain, ResultDomainSwitcher } from './ResultDomainSwitcher';

export type BatchItem = { key: string; shareId: string; file: string; password?: string };

const makeTemplate = (settings: PhraseSettings, hasPassword: boolean) => `『来自123云盘${settings.member ? '{会员身份}' : '用户'}${settings.nickname ? '「{分享人昵称}」' : ''}的分享』${settings.title ? '\n{分享标题}' : ''}\n分享链接：{分享链接}${settings.password && hasPassword ? '\n提取密码：{提取密码}' : ''}`;

export function BatchResult({ items, config, profile, scope, mobile, onBack }: {
  items: BatchItem[];
  config: ShareConfig;
  profile: MockProfile;
  scope: StorageScope;
  mobile: boolean;
  onBack: () => void;
}) {
  const saved = loadPhraseSettings(scope);
  const initialSettings: PhraseSettings = { ...allPhraseSettings, ...saved, member: profile.member ? saved.member : false, password: config.passwordEnabled ? saved.password : false, autoPassword: config.passwordEnabled ? saved.autoPassword : false };
  const [settings, setSettings] = useState(initialSettings);
  const [template, setTemplate] = useState(() => makeTemplate(initialSettings, config.passwordEnabled));
  const [domain, setDomain] = useState(() => initialResultDomain(profile.customDomains));
  const itemUrl = (item: BatchItem) => makeShareUrl(domain, item.shareId);
  const phrase = (item: BatchItem) => renderPhrase(template, {
    会员身份: profile.member ? '会员' : '用户',
    分享人昵称: profile.nickname,
    分享标题: item.file,
    分享链接: withPassword(itemUrl(item), item.password || '', settings.autoPassword),
    提取密码: item.password || '',
  });
  const first = items[0];
  const preview = first ? phrase(first) : '';
  const set = (key: keyof PhraseSettings, checked: boolean) => {
    const next = { ...settings, [key]: checked };
    setSettings(next);
    setTemplate(makeTemplate(next, config.passwordEnabled));
  };
  const option = (key: keyof PhraseSettings, label: string) => <Checkbox checked={settings[key]} onChange={event => set(key, event.target.checked)}>{label}</Checkbox>;
  const remember = () => savePhraseSettings(scope, settings) ? message.success('已记住本端口令设置') : message.error('保存失败，已保留上一次设置');
  const copyAll = (full: boolean) => copyText(items.map(item => full ? phrase(item) : itemUrl(item)).filter(Boolean).join(full ? '\n\n' : '\n'), full ? '全部口令' : '全部链接');
  const canCopyPhrase = items.length > 0 && template.trim().length > 0;
  const options = <div className={mobile ? 'mobile-phrase-options batch-phrase-options' : 'phrase-options batch-phrase-options'}>{profile.member && option('member', '会员身份')}{option('nickname', '分享人昵称')}{option('title', '分享主题')}{config.passwordEnabled && option('password', '提取密码')}{config.passwordEnabled && option('autoPassword', '自动填充提取密码')}</div>;
  const editor = <section className={mobile ? 'mobile-card batch-template' : 'batch-template'}><div className="batch-template-head"><span className={mobile ? 'mobile-card-title' : undefined}>分享口令设置</span><Button type="link" size="small" onClick={remember}>记住设置</Button></div>{options}<div className="batch-editor-grid"><div><Input.TextArea aria-label="分享口令模板" value={template} onChange={event => setTemplate(event.target.value)} autoSize={{ minRows: 5, maxRows: 8 }}/><span className="template-help">变量将按每条分享的真实信息替换</span></div><div className="batch-preview"><span>第一条实时预览</span><Input.TextArea aria-label="第一条实时预览" value={preview} readOnly autoSize={{ minRows: 5, maxRows: 8 }}/></div></div></section>;

  if (mobile) return <div className="mobile-screen mobile-batch"><header className="mobile-nav"><Button type="text" onClick={onBack}>‹</Button><h1>批量创建成功</h1><span/></header><main>
    <div className="mobile-result-summary"><strong>全部创建成功</strong><span>共 {items.length} 个分享</span></div>
    {editor}
    <div className="mobile-domain-switch"><ResultDomainSwitcher value={domain} customDomains={profile.customDomains} onChange={setDomain} mobile/></div>
    <div className="mobile-batch-actions"><Button icon={<CopyOutlined/>} disabled={!items.length} onClick={() => copyAll(false)}>复制所有链接</Button><Button type="primary" icon={<CopyOutlined/>} disabled={!canCopyPhrase} onClick={() => copyAll(true)}>复制所有口令</Button></div>
  </main><div className="mobile-illegal">批量创建按顶层资源逐项生成，不拆分文件夹内部文件</div></div>;

  return <div className="success-page desktop-batch"><div className="batch-heading"><div><h2>批量创建成功</h2><span>已创建 {items.length} 个独立分享</span></div><ResultDomainSwitcher value={domain} customDomains={profile.customDomains} onChange={setDomain}/></div>{editor}<div className="batch-footer-actions"><Button disabled={!items.length} onClick={() => copyAll(false)}>复制所有链接</Button><Button type="primary" disabled={!canCopyPhrase} onClick={() => copyAll(true)}>复制所有口令</Button></div></div>;
}
