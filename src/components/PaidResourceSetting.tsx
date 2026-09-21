import { InputNumber, Switch } from 'antd';
import { FieldHint } from './FieldHint';
export function PaidResourceSetting({ enabled, price, mobile, onChange }: { enabled: boolean; price?: number; mobile: boolean; onChange: (v: Partial<{ enabled: boolean; price: number | undefined }>) => void }) {
  return <section className="setting-group"><div className="compact-setting"><span>资源收费 <FieldHint label="资源收费" text="开启后，接收方需支付资源费用后获取资源。"/></span><div className="setting-controls"><Switch aria-label="资源收费" size={mobile ? 'default' : 'small'} checked={enabled} onChange={enabled => onChange({ enabled })}/>{enabled && <div className="price-inputs"><span>资源价格</span><InputNumber aria-label="资源价格" min={1} max={9999} value={price} onChange={price => onChange({ price: price ?? undefined })}/><span>元</span></div>}</div></div></section>;
}
