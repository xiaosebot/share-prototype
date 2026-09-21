import { Button, Checkbox, Input, Table, Tag, message } from 'antd';
import { CheckCircleFilled, CopyOutlined, ExclamationCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { allPhraseSettings, loadPhraseSettings, savePhraseSettings, type PhraseSettings } from '../utils/shareConfigStorage';
import { copyText } from '../utils/clipboard';
import { renderPhrase, withPassword } from '../utils/shareRules';

export type BatchItem = { key: string; file: string; status: 'success' | 'failed'; url?: string; password?: string; reason?: string };

const makeTemplate = (settings: PhraseSettings, hasPassword: boolean) => `『来自123云盘${settings.member ? '{会员身份}' : '用户'}${settings.nickname ? '「{分享人昵称}」' : ''}的分享』${settings.title ? '\n{分享标题}' : ''}\n分享链接：{分享链接}${settings.password && hasPassword ? '\n提取密码：{提取密码}' : ''}`;

export function BatchResult({ items, config, profile, scope, mobile, onRetry, onBack }: { items: BatchItem[]; config: ShareConfig; profile: MockProfile; scope: StorageScope; mobile: boolean; onRetry: (key: string) => void; onBack: () => void }) {
  const saved = loadPhraseSettings(scope);
  const initialSettings: PhraseSettings = { ...allPhraseSettings, ...saved, member: profile.member ? saved.member : false, password: config.passwordEnabled ? saved.password : false, autoPassword: config.passwordEnabled ? saved.autoPassword : false };
  const [settings, setSettings] = useState(initialSettings);
  const [template, setTemplate] = useState(() => makeTemplate(initialSettings, config.passwordEnabled));
  const success = items.filter(item => item.status === 'success');
  const failed = items.filter(item => item.status === 'failed');
  const phrase = (item: BatchItem) => renderPhrase(template, {
    会员身份: profile.member ? '会员' : '用户',
    分享人昵称: profile.nickname,
    分享标题: item.file,
    分享链接: withPassword(item.url || '', item.password || '', settings.autoPassword),
    提取密码: item.password || '',
  });
  const set = (key: keyof PhraseSettings, checked: boolean) => {
    const next = { ...settings, [key]: checked };
    setSettings(next);
    setTemplate(makeTemplate(next, config.passwordEnabled));
  };
  const option = (key: keyof PhraseSettings, label: string) => <Checkbox checked={settings[key]} onChange={event => set(key, event.target.checked)}>{label}</Checkbox>;
  const remember = () => savePhraseSettings(scope, settings) ? message.success('已记住本端口令设置') : message.error('保存失败，已保留上一次设置');
  const copyAll = (full: boolean) => copyText(success.map(item => full ? phrase(item) : item.url).filter(Boolean).join(full ? '\n\n' : '\n'), full ? '全部口令' : '全部链接');
  const retry = (key: string) => { onRetry(key); message.success('重试成功'); };
  const canCopyPhrase = success.length > 0 && template.trim().length > 0;
  const options = <div className={mobile ? 'mobile-phrase-options batch-phrase-options' : 'phrase-options batch-phrase-options'}>{profile.member && option('member', '会员身份')}{option('nickname', '分享人昵称')}{option('title', '分享主题')}{config.passwordEnabled && option('password', '提取密码')}{config.passwordEnabled && option('autoPassword', '自动填充提取密码')}</div>;

  if (mobile) return <div className="mobile-screen mobile-batch"><header className="mobile-nav"><Button type="text" onClick={onBack}>‹</Button><h1>批量创建结果</h1><span/></header><main>
    <div className={`mobile-result-summary ${failed.length ? 'partial' : ''}`}><strong>{failed.length ? '部分创建完成' : '全部创建成功'}</strong><span>成功 {success.length} 个　失败 {failed.length} 个</span></div>
    <section className="mobile-card batch-template"><div className="batch-template-head"><span className="mobile-card-title">分享口令设置</span><Button type="link" size="small" onClick={remember}>记住设置</Button></div>{options}<Input.TextArea aria-label="分享口令模板" value={template} onChange={event => setTemplate(event.target.value)} autoSize={{ minRows: 4, maxRows: 7 }}/><span className="template-help">统一模板将按每个成功分享的真实信息替换变量</span></section>
    <div className="mobile-batch-actions"><Button icon={<CopyOutlined/>} disabled={!success.length} onClick={() => copyAll(false)}>复制所有链接</Button><Button type="primary" icon={<CopyOutlined/>} disabled={!canCopyPhrase} onClick={() => copyAll(true)}>复制所有口令</Button></div>
    <section className="mobile-result-list">{items.map(item => <article className="mobile-result-item" key={item.key}><div className="result-main"><span className={item.status}>{item.status === 'success' ? <CheckCircleFilled/> : <ExclamationCircleFilled/>}</span><div><strong title={item.file}>{item.file}</strong>{item.status === 'success' ? <span className="result-url">{item.url}</span> : <span className="result-error">{item.reason}</span>}</div></div>{item.status === 'success' ? <div className="row-actions"><Button size="small" onClick={() => copyText(item.url!, '链接')}>复制链接</Button><Button size="small" disabled={!template.trim()} onClick={() => copyText(phrase(item), '口令')}>复制口令</Button></div> : <Button size="small" icon={<ReloadOutlined/>} onClick={() => retry(item.key)}>重试</Button>}</article>)}</section>
  </main><div className="mobile-illegal">批量创建按顶层资源逐项生成，不拆分文件夹内部文件</div></div>;

  const columns = [
    { title: '资源名称', dataIndex: 'file', width: 190, render: (file: string) => <span className="batch-file-name" title={file}>{file}</span> },
    { title: '创建状态', width: 105, render: (_: unknown, row: BatchItem) => row.status === 'success' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> },
    { title: '链接 / 失败原因', render: (_: unknown, row: BatchItem) => row.status === 'success' ? <span className="table-link">{row.url}</span> : <span className="result-error">{row.reason}</span> },
    { title: '操作', width: 126, render: (_: unknown, row: BatchItem) => row.status === 'success' ? <Button size="small" disabled={!template.trim()} onClick={() => copyText(phrase(row), '口令')}>复制口令</Button> : <Button type="link" size="small" icon={<ReloadOutlined/>} onClick={() => retry(row.key)}>重试</Button> },
  ];
  return <div className="success-page desktop-batch"><div className="batch-heading"><div><h2>{failed.length ? '批量创建部分成功' : '批量创建成功'}</h2><span>共 {items.length} 个，成功 {success.length} 个，失败 {failed.length} 个</span></div></div><section className="batch-template"><div className="batch-template-head"><label>分享口令设置</label><Button type="link" size="small" onClick={remember}>记住设置</Button></div>{options}<Input.TextArea aria-label="分享口令模板" value={template} onChange={event => setTemplate(event.target.value)} autoSize={{ minRows: 3, maxRows: 5 }}/><span className="template-help">统一模板将按每个成功分享的真实信息替换变量：{'{会员身份} {分享人昵称} {分享标题} {分享链接} {提取密码}'}</span></section><Table rowKey="key" size="small" columns={columns} dataSource={items} pagination={false} scroll={{ y: 250 }}/><div className="batch-footer-actions"><Button disabled={!success.length} onClick={() => copyAll(false)}>复制所有链接</Button><Button type="primary" disabled={!canCopyPhrase} onClick={() => copyAll(true)}>复制所有口令</Button></div></div>;
}
