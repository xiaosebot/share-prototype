import { Button, Modal, Space, Tag, message } from 'antd';
import { DownloadOutlined, EyeOutlined, FolderAddOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ShareConfig } from '../mock/shareMock';

type ResourceAction = '预览' | '下载' | '转存';

export function ShareAccessDemo({ config, mobile, onBack }: { config: ShareConfig; mobile: boolean; onBack: () => void }) {
  const [pending, setPending] = useState<ResourceAction | null>(null);
  const [purchased, setPurchased] = useState(false);
  const [lastAction, setLastAction] = useState<ResourceAction | null>(null);
  const act = (action: ResourceAction) => {
    if (config.paidEnabled && !purchased) { setPending(action); return; }
    setLastAction(action);
    message.success(`已继续${action}（模拟）`);
  };
  const pay = () => {
    const action = pending;
    setPurchased(true);
    setPending(null);
    if (action) {
      setLastAction(action);
      message.success(`支付成功，已自动继续${action}`);
    }
  };
  const content = <>
    <div className="access-demo-status"><Tag color="success">入口权限已通过</Tag><span>资源收费不阻塞进入文件列表</span></div>
    <article className="access-file-row"><div><FolderOpenOutlined/><strong>学习资料</strong><span>2.46 GB · 8 个文件</span></div><Space wrap><Button icon={<EyeOutlined/>} onClick={() => act('预览')}>预览</Button><Button icon={<DownloadOutlined/>} onClick={() => act('下载')}>下载</Button><Button icon={<FolderAddOutlined/>} onClick={() => act('转存')}>转存</Button></Space></article>
    {lastAction && <div className="access-demo-result">最近续接操作：{lastAction}；用户无需再次点击。</div>}
    <Modal title="支付资源费用" open={!!pending} onCancel={() => setPending(null)} centered footer={<><Button onClick={() => setPending(null)}>取消</Button><Button type="primary" onClick={pay}>确认支付 ¥{config.price ?? 1}</Button></>}><p>支付成功后将自动继续刚才的“{pending}”操作。</p></Modal>
  </>;
  if (mobile) return <div className="mobile-screen access-demo mobile-access"><header className="mobile-nav"><Button type="text" onClick={onBack}>‹</Button><h1>分享文件</h1><span/></header><main>{content}</main></div>;
  return <div className="access-demo"><h2>分享文件</h2>{content}</div>;
}
