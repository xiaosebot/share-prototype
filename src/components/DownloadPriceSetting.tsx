import { InputNumber, Switch } from 'antd';
import type { MockProfile, ShareConfig } from '../mock/shareMock';
import { commissionTip } from '../utils/shareRules';
import { FieldHint } from './FieldHint';
export function DownloadPriceSetting({ config, profile, mobile, onChange }: { config: ShareConfig; profile: MockProfile; mobile: boolean; onChange: (v: Partial<ShareConfig>) => void }) {
  if (!profile.eligible) return null;
  return <section className="setting-group"><div className="compact-setting"><span>下载付费 <FieldHint label="下载付费" text={commissionTip(config, profile)}/></span><div className="setting-controls"><Switch aria-label="下载付费" size={mobile ? 'default' : 'small'} checked={config.downloadPriceEnabled} onChange={enabled => onChange({ downloadPriceEnabled: enabled, downloadPrice: enabled ? config.downloadPrice ?? 0.10 : config.downloadPrice })}/>
    {config.downloadPriceEnabled && <div className="price-inputs"><span>下载单价</span><InputNumber aria-label="下载单价" min={profile.minPrice} max={2} step={0.1} value={config.downloadPrice} placeholder="0.10" onChange={price => onChange({ downloadPrice: price ?? undefined })}/><span>元/GB</span></div>}</div></div>{config.downloadPriceEnabled && profile.minPrice !== 0.1 && <div className="special-price-hint"><FieldHint label="单价权限" text={`按用户权限生效，当前最低单价 ${profile.minPrice.toFixed(2)} 元/GB。`}/></div>}</section>;
}
