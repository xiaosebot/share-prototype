import { Button, DatePicker, Drawer, Input, Space, Switch } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import { FieldHint } from './FieldHint';
const presets = [1, 3, 7, 15, 30, 365];
export function ExpirySetting({ enabled, expiryAt, mobile, editing, shareCreatedAt, onChange }: { enabled: boolean; expiryAt?: string; mobile: boolean; editing: boolean; shareCreatedAt?: string; onChange: (v: Partial<{ enabled: boolean; expiryAt: string | undefined }>) => void }) {
  const [open, setOpen] = useState(false);
  const shortcutTime = (days: number) => (editing && shareCreatedAt ? dayjs(shareCreatedAt) : dayjs()).add(days, 'day');
  const shortcutDisabled = (days: number) => !shortcutTime(days).isAfter(dayjs());
  const pick = (days: number) => {
    if (shortcutDisabled(days)) return;
    onChange({ expiryAt: shortcutTime(days).toISOString() }); setOpen(false);
  };
  const defaultExpiry = () => {
    if (!editing || !shareCreatedAt) return dayjs().add(7, 'day').toISOString();
    return presets.map(shortcutTime).find(value => value.isAfter(dayjs()))?.toISOString();
  };
  const shortcuts = <Space wrap size={4}>{presets.map(n => <Button size="small" type="link" key={n} disabled={shortcutDisabled(n)} onClick={() => pick(n)}>{n === 365 ? '1年' : `${n}天`}</Button>)}</Space>;
  return <section className="setting-group">
    <div className="compact-setting"><span>过期时间 <FieldHint label="过期时间" text="关闭时永久有效；开启后可设置具体到期日期和时间。"/></span>
      <div className="setting-controls"><Switch aria-label="过期时间" size={mobile ? 'default' : 'small'} checked={enabled} onChange={checked => onChange({ enabled: checked, expiryAt: checked ? expiryAt || defaultExpiry() : undefined })}/>
      {enabled && (mobile ? <Button className="mobile-date" onClick={() => setOpen(true)}>{expiryAt ? dayjs(expiryAt).format('YYYY/MM/DD HH:mm') : '选择日期时间'} <DownOutlined/></Button> : <DatePicker aria-label="到期时间" showTime={{ format: 'HH:mm' }} allowClear={false} value={expiryAt ? dayjs(expiryAt) : null} format="YYYY/MM/DD HH:mm" onChange={value => onChange({ expiryAt: value?.toISOString() })} renderExtraFooter={() => shortcuts} disabledDate={d => d.endOf('day').isBefore(dayjs())}/>)}</div>
    </div>
    {mobile && <Drawer title="设置过期时间" placement="bottom" height={290} open={open} onClose={() => setOpen(false)} className="mobile-sheet"><div className="expiry-shortcuts">{shortcuts}</div><Input type="datetime-local" aria-label="到期日期时间" value={expiryAt ? dayjs(expiryAt).format('YYYY-MM-DDTHH:mm') : ''} onChange={e => { if (dayjs(e.target.value).isValid()) onChange({ expiryAt: dayjs(e.target.value).toISOString() }); }}/><Button block type="primary" onClick={() => setOpen(false)} style={{ marginTop: 20 }}>确定</Button></Drawer>}
  </section>;
}
