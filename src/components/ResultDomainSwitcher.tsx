import { Button, Dropdown } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';

export const initialResultDomain = (customDomains: string[]) => customDomains[0] || 'official';

export function ResultDomainSwitcher({ value, customDomains, onChange, mobile = false }: {
  value: string;
  customDomains: string[];
  onChange: (value: string) => void;
  mobile?: boolean;
}) {
  const options = [
    ...customDomains.map(domain => ({ value: domain, label: domain })),
    { value: 'official', label: 'www.123pan.com' },
    { value: 'backup', label: 'share.123pan.com' },
  ];
  return <Dropdown
    trigger={['click']}
    placement={mobile ? 'bottomLeft' : 'bottomLeft'}
    menu={{
      selectedKeys: [value],
      items: options.map(item => ({
        key: item.value,
        label: <span className="domain-option"><span>{item.label}</span>{item.value === value && <CheckOutlined/>}</span>,
      })),
      onClick: ({ key }) => onChange(key),
    }}
  >
    <Button type="text" className="domain-switch-trigger">切换域名 <DownOutlined/></Button>
  </Dropdown>;
}
