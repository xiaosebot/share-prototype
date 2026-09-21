import { Button, Divider, Input, Modal, Space, Tabs, Tag, Tooltip, Typography, message } from 'antd';
import { CloudOutlined, FolderOpenOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { selectedFiles } from '../mock/shareMock';
import { ShareSettingsForm } from '../components/ShareSettingsForm';
import { loadPasswordHistory, rememberValidConfig, savePasswordHistory, type PasswordHistory } from '../utils/shareConfigStorage';
import { validateConfig } from '../utils/shareRules';
const { Text } = Typography;

export function FileManagerMock({ onOpen }: { onOpen: () => void }) {
  const files = ['我的123备份', '1234等4个文件(1)', '分享页搜索test测试123!@#', '转存优化', '来自：离线下载', 'cs.png', '100W数据', '省外联通增加下行流量回归'];
  return <div className="drive-mock"><header className="drive-header"><Space><div className="drive-logo">123</div><b>云盘</b><Tag color="gold">严禁传播任何色情、暴力、侵权盗版等违法违规内容</Tag></Space><Space><Button size="small">会员中心</Button><Button size="small">推广分佣</Button><Input prefix={<SearchOutlined/>} placeholder="搜索云盘文件" className="drive-search"/></Space></header><aside className="drive-sidebar"><div className="nav-active"><CloudOutlined/> 全部文件</div><div>我的分享</div><div>流量包</div><Divider/><div>保险箱</div><div>收藏夹</div><div>回收站</div></aside><main className="drive-main"><div className="toolbar"><Space.Compact><Button>下载</Button><Button onClick={onOpen}>分享</Button><Button>收藏</Button><Button>删除</Button><Button>移动</Button><Button>复制</Button><Button>获取直链链接</Button></Space.Compact></div><div className="drive-title">我的文件　<Text type="secondary">已选择 10 项　<span className="blue">取消选择</span></Text></div><div className="file-table-head"><span>名称</span><span>修改时间</span><span>大小</span></div>{files.map((file, index) => <div className={`mock-file ${index < 3 ? 'selected' : ''}`} key={file}><span><input type="checkbox" checked={index < 3} readOnly/> <FolderOpenOutlined/>　{file}</span><span>2026-09-{14 - index} 18:{43 - index}</span><span>{index % 2 ? '4.27GB' : '24.26GB'}</span></div>)}</main></div>;
}

export function ShareCreatePage({ open, config, profile, scope, mode, onChange, onSingle, onBatch, onClose, onOpen }: {
  open: boolean; config: ShareConfig; profile: MockProfile; scope: StorageScope; mode: 'create' | 'edit';
  onChange: (patch: Partial<ShareConfig>) => void; onSingle: () => void; onBatch: () => void; onClose: () => void; onOpen: () => void;
}) {
  const [history, setHistory] = useState<PasswordHistory>(() => loadPasswordHistory(scope));
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => { setHistory(loadPasswordHistory(scope)); }, [scope.uid, scope.platform]);
  useEffect(() => { savePasswordHistory(scope, history); }, [history, scope]);
  useEffect(() => {
    if (mode === 'create') rememberValidConfig(scope, config, profile.minPrice);
  }, [config, mode, profile.minPrice, scope]);
  const submit = (kind: 'single' | 'batch' | 'edit') => {
    const next = validateConfig(config, profile, mode === 'edit'); setErrors(next);
    if (next.length) { message.error('请先完成必填配置'); return; }
    if (kind === 'batch' && selectedFiles.length > 100) { message.error('最多可批量创建 100 个分享'); return; }
    if (kind === 'edit') { message.success('修改成功（不更新新建分享记忆）'); onClose(); return; }
    kind === 'single' ? onSingle() : onBatch();
  };
  return <><FileManagerMock onOpen={onOpen}/><Modal open={open} onCancel={onClose} width={560} className="share-modal" title="分享链接设置" centered destroyOnHidden={false} footer={<div className="share-modal-footer"><Tooltip title="严禁传播违法违规文件"><Text type="secondary">禁止传播违法文件 <InfoCircleOutlined/></Text></Tooltip><Space>{mode === 'edit' ? <><Button onClick={onClose}>取消</Button><Button type="primary" onClick={() => submit('edit')}>保存修改</Button></> : <><Button onClick={onClose}>取消</Button><Button onClick={() => submit('batch')}>批量创建链接</Button><Button type="primary" onClick={() => submit('single')}>创建单个链接</Button></>}</Space></div>}>
    <Tabs size="small" defaultActiveKey="web" items={[{ key: 'web', label: '创建网页分享', children: <ShareSettingsForm config={config} profile={profile} history={history} mobile={false} mode={mode} errors={errors} onChange={patch => { setErrors([]); onChange(patch); }} onHistory={setHistory}/> }, { key: 'direct', label: '创建直链分享', children: <div className="direct-placeholder">直链分享沿用现有能力，本期不调整详细配置。</div> }]}/>
  </Modal></>;
}
