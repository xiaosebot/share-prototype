import { LockOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import { type FormEvent, type ReactNode, useState } from 'react';

const ACCESS_SESSION_KEY = '123pan-share-prototype-access';
const ACCESS_HASH = '1c2ee40e01f6951b699dff2a79becfd7f7e6f602013aa8f758ce5a4d1c1c665e';

const digest = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
};

export function PrototypeAccessGate({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(() => sessionStorage.getItem(ACCESS_SESSION_KEY) === 'granted');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setChecking(true);
    const matched = await digest(password) === ACCESS_HASH;
    setChecking(false);
    if (!matched) {
      setError('访问密码不正确，请重新输入');
      return;
    }
    sessionStorage.setItem(ACCESS_SESSION_KEY, 'granted');
    setAllowed(true);
  };

  if (allowed) return children;

  return <main className="access-gate">
    <form className="access-card" onSubmit={submit}>
      <div className="access-logo">123</div>
      <Typography.Title level={2}>创建分享功能改版（一期）</Typography.Title>
      <Typography.Paragraph>请输入访问密码查看高保真原型</Typography.Paragraph>
      <Input.Password
        autoFocus
        size="large"
        prefix={<LockOutlined />}
        placeholder="访问密码"
        value={password}
        status={error ? 'error' : undefined}
        onChange={event => { setPassword(event.target.value); setError(''); }}
      />
      <div className="access-error" aria-live="polite">{error}</div>
      <Button type="primary" htmlType="submit" size="large" block loading={checking} disabled={!password}>进入原型</Button>
      <Typography.Text>仅供内部产品评审使用</Typography.Text>
    </form>
  </main>;
}
