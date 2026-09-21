import { Button, Checkbox, Input, Modal, QRCode, Space, Tooltip, message } from 'antd';
import { CopyOutlined, DownloadOutlined, LinkOutlined, QrcodeOutlined, WechatOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { allPhraseSettings, loadPhraseSettings, savePhraseSettings, type PhraseSettings } from '../utils/shareConfigStorage';
import { copyText } from '../utils/clipboard';
import { makeShareUrl, phraseTemplate, renderPhrase, withPassword } from '../utils/shareRules';
export function SharePhrasePreview({ config, profile, scope, mobile, onBack }: { config: ShareConfig; profile: MockProfile; scope: StorageScope; mobile: boolean; onBack: () => void }) {
  const saved = loadPhraseSettings(scope);
  const [settings, setSettings] = useState<PhraseSettings>({ ...allPhraseSettings, ...saved, member: profile.member ? saved.member : false, password: config.passwordEnabled ? saved.password : false, autoPassword: config.passwordEnabled ? saved.autoPassword : false });
  const baseUrl = makeShareUrl(config.domain, 'w7xhTd-3pvKh');
  const qrUrl = withPassword(baseUrl, config.password, settings.autoPassword);
  const generate = (next: PhraseSettings) => renderPhrase(phraseTemplate(next, config.passwordEnabled), { 分享标题: config.title, 分享链接: withPassword(baseUrl, config.password, next.autoPassword), 提取密码: config.password, 分享人昵称: profile.nickname });
  const [phrase, setPhrase] = useState(() => generate(settings));
  const [qrOpen, setQrOpen] = useState(false);
  const set = (key: keyof PhraseSettings, checked: boolean) => { const next = { ...settings, [key]: checked }; setSettings(next); setPhrase(generate(next)); };
  const option = (key: keyof PhraseSettings, label: string, disabled = false) => <Checkbox checked={settings[key]} disabled={disabled} onChange={e => set(key, e.target.checked)}>{label}</Checkbox>;
  const remember = () => savePhraseSettings(scope, settings) ? message.success('已记住本端口令设置') : message.error('保存失败，已保留上一次设置');
  const qr = <div className="qr-content"><QRCode value={qrUrl} size={mobile ? 210 : 166}/><p>扫码打开分享链接</p></div>;
  if (mobile) return <div className="mobile-screen mobile-success"><header className="mobile-nav"><Button type="text" onClick={onBack}>‹</Button><h1>创建分享成功</h1><span/></header><main>
    <div className="mobile-section-title">口令设置</div><div className="mobile-phrase-options">{profile.member && option('member', '会员身份')}{option('nickname', '分享人昵称')}{option('title', '分享主题')}{config.passwordEnabled && option('password', '提取密码')}{config.passwordEnabled && option('autoPassword', '自动填充提取密码')}</div>
    <Input.TextArea aria-label="分享口令" className="mobile-phrase-text" value={phrase} onChange={e => setPhrase(e.target.value)} autoSize={{ minRows: 5, maxRows: 8 }}/>
    <Button block className="remember-button" onClick={remember}>记住设置</Button>
    <div className="mobile-share-channels"><Button type="text" icon={<WechatOutlined/>} onClick={() => message.success('已唤起微信好友分享（模拟）')}>微信好友</Button><Button type="text" icon={<span className="moments-icon">◎</span>} onClick={() => message.success('已唤起朋友圈分享（模拟）')}>朋友圈</Button><Button type="text" icon={<LinkOutlined/>} onClick={() => copyText(baseUrl, '链接')}>复制链接</Button><Button type="text" icon={<CopyOutlined/>} disabled={!phrase.trim()} onClick={() => copyText(phrase, '口令')}>复制口令</Button><Button type="text" icon={<QrcodeOutlined/>} onClick={() => setQrOpen(true)}>生成二维码</Button></div>
  </main><div className="mobile-illegal">严厉打击色情低俗等不良信息的传播行为，如发现将封禁账号</div><Modal title="分享二维码" open={qrOpen} footer={null} onCancel={() => setQrOpen(false)} centered width={290}>{qr}</Modal></div>;
  return <div className="success-page desktop-success"><h2>复制分享口令</h2><div className="desktop-success-grid"><section className="phrase-panel"><div className="phrase-settings-head"><span>口令设置</span><Button type="link" onClick={remember}>记住设置</Button></div><div className="phrase-options">{profile.member && option('member', '会员身份')}{option('nickname', '分享人昵称')}{option('title', '分享主题')}{config.passwordEnabled && option('password', '提取密码')}{config.passwordEnabled && option('autoPassword', '自动填充提取密码')}</div><Input.TextArea aria-label="分享口令" value={phrase} onChange={e => setPhrase(e.target.value)} autoSize={{ minRows: 6, maxRows: 8 }}/><div className="phrase-actions"><Button onClick={() => copyText(baseUrl, '链接')}>复制链接</Button><Button type="primary" disabled={!phrase.trim()} onClick={() => copyText(phrase, '口令')}>复制口令</Button></div></section><aside className="qr-panel">{qr}<Space><Tooltip title="保存二维码（模拟）"><Button icon={<DownloadOutlined/>} onClick={() => message.success('二维码已保存（模拟）')}/></Tooltip><Tooltip title="复制二维码（模拟）"><Button icon={<CopyOutlined/>} onClick={() => message.success('二维码已复制（模拟）')}/></Tooltip></Space></aside></div><div className="success-illegal">严厉打击色情低俗等不良信息的传播行为，如发现将封禁账号。</div></div>;
}
