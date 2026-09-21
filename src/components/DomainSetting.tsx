import { Select } from 'antd';
import { FieldHint } from './FieldHint';
export function DomainSetting({ value, customDomains, onChange }: { value: string; customDomains: string[]; onChange: (value: string) => void }) {
  if (!customDomains.length) return null;
  return <section className="setting-group"><div className="compact-setting"><span>分享域名 <FieldHint label="分享域名" text="使用所选域名生成分享链接，编辑分享时也可以修改。"/></span><Select aria-label="分享域名" value={value} options={[{ value: 'official', label: '官方域名' }, ...customDomains.map(value => ({ value, label: value }))]} onChange={onChange}/></div></section>;
}
