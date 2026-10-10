import { Modal, message } from 'antd';
import { useMemo, useState } from 'react';
import { ShareCreatePage } from './pages/ShareCreatePage';
import { AppShareCreatePage } from './pages/AppShareCreatePage';
import { ShareSuccessPage } from './pages/ShareSuccessPage';
import { PrototypeStatePanel, type DemoScreen } from './components/PrototypeStatePanel';
import { PrototypeAccessGate } from './components/PrototypeAccessGate';
import type { ShareConfig, StorageScope, Platform } from './mock/shareMock';
import { defaultTrafficRules, editConfig, profiles, selectedFiles, systemConfig } from './mock/shareMock';
import type { BatchItem } from './components/BatchResult';
import { clearPrototypeMemory, loadDefaultConfig, loadPasswordHistory } from './utils/shareConfigStorage';
import { makeTitle, randomPassword } from './utils/shareRules';
import { ShareAccessDemo } from './components/ShareAccessDemo';

const freshConfig = (scope: StorageScope): ShareConfig => {
  const remembered = loadDefaultConfig(scope);
  const defaultPassword = loadPasswordHistory(scope).find(item => item.isDefault)?.value || '';
  return { ...systemConfig, ...remembered, password: remembered.passwordEnabled ? defaultPassword : '', title: makeTitle(selectedFiles), trafficRules: remembered.trafficRules ? [...remembered.trafficRules] : [] };
};
const demoEdit = (): ShareConfig => ({ ...editConfig, trafficRules: [...defaultTrafficRules] });
const filesForCount = (count: number) => Array.from({ length: count }, (_, index) => selectedFiles[index] || `演示资源 ${index + 1}`);
const makeBatch = (count: number, config: ShareConfig): BatchItem[] => filesForCount(count).map((file, index) => {
  const password = config.passwordEnabled ? (config.passwordSource === 'random' ? randomPassword() : config.password) : '';
  return { key: String(index), shareId: `batch-${index + 1}`, file, password };
});

export default function App() {
  const [platform, setPlatform] = useState<Platform>('web'); const [screen, setScreen] = useState<DemoScreen>('create'); const [mode, setMode] = useState<'create' | 'edit'>('create'); const [profileUid, setProfileUid] = useState(profiles[0].uid); const [desktopOpen, setDesktopOpen] = useState(true);
  const profile = useMemo(() => profiles.find(p => p.uid === profileUid) || profiles[0], [profileUid]);
  const scope = useMemo<StorageScope>(() => ({ uid: profile.uid, platform }), [profile.uid, platform]);
  const [config, setConfig] = useState<ShareConfig>(() => freshConfig({ uid: profiles[0].uid, platform: 'web' }));
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [selectedCount, setSelectedCount] = useState(10);
  const [batchShouldFail, setBatchShouldFail] = useState(false);
  const resultConfig = config;
  const patch = (value: Partial<ShareConfig>) => setConfig(prev => ({ ...prev, ...value }));
  const reset = (nextPlatform = platform, nextMode = mode, nextProfile = profile, clearMemory = false) => {
    const nextScope = { uid: nextProfile.uid, platform: nextPlatform };
    if (clearMemory) clearPrototypeMemory(nextScope);
    setConfig(nextMode === 'edit' ? demoEdit() : freshConfig(nextScope));
    setBatch([]); setScreen('create'); setDesktopOpen(true);
  };
  const changePlatform = (next: Platform) => { setPlatform(next); setMode('create'); reset(next, 'create', profile); };
  const changeProfile = (uid: string) => { const next = profiles.find(p => p.uid === uid) || profiles[0]; setProfileUid(uid); reset(platform, 'create', next); setMode('create'); };
  const changeMode = (next: 'create' | 'edit') => { setMode(next); reset(platform, next, profile); };
  const single = () => setScreen('success');
  const batchCreate = () => {
    if (selectedCount > 200) { message.error('单次最多批量创建 200 个分享，请减少选择数量后重试。'); return; }
    if (batchShouldFail) { message.error('创建失败，请重试'); return; }
    setBatch(makeBatch(selectedCount, config)); setScreen('batchSuccess');
  };
  const changeScreen = (next: DemoScreen) => {
    setScreen(next);
    if (next === 'batchSuccess') setBatch(makeBatch(Math.min(selectedCount, 200), config));
    setDesktopOpen(true);
  };
  const back = () => { setScreen('create'); setDesktopOpen(true); };

  return <PrototypeAccessGate><div className="prototype-layout">
    {platform === 'web' ? <>{screen === 'create' && <ShareCreatePage open={desktopOpen} config={config} profile={profile} scope={scope} mode={mode} selectedCount={selectedCount} onChange={patch} onOpen={() => setDesktopOpen(true)} onClose={() => setDesktopOpen(false)} onSingle={single} onBatch={batchCreate}/>}
      {screen !== 'create' && <><ShareCreatePage open={false} config={config} profile={profile} scope={scope} mode={mode} selectedCount={selectedCount} onChange={patch} onOpen={back} onClose={() => {}} onSingle={single} onBatch={batchCreate}/><Modal open={desktopOpen} footer={null} width={screen === 'success' ? 860 : screen === 'access' ? 760 : 940} onCancel={back} className="result-modal" centered>{screen === 'access' ? <ShareAccessDemo config={config} mobile={false} onBack={back}/> : <ShareSuccessPage mode={screen === 'success' ? 'success' : 'batch'} config={resultConfig} profile={profile} scope={scope} mobile={false} results={batch} onBack={back}/>}</Modal></>}
    </> : <div className="mobile-stage"><div className="phone-shell">{screen === 'create' ? <AppShareCreatePage config={config} profile={profile} scope={scope} mode={mode} selectedCount={selectedCount} onChange={patch} onSingle={single} onBatch={batchCreate} onBack={() => {}}/> : screen === 'access' ? <ShareAccessDemo config={config} mobile onBack={back}/> : <ShareSuccessPage mode={screen === 'success' ? 'success' : 'batch'} config={resultConfig} profile={profile} scope={scope} mobile results={batch} onBack={back}/>}</div></div>}
    <aside className="prototype-dock"><PrototypeStatePanel platform={platform} screen={screen} mode={mode} profileUid={profile.uid} profiles={profiles} selectedCount={selectedCount} batchShouldFail={batchShouldFail} onPlatform={changePlatform} onScreen={changeScreen} onMode={changeMode} onProfile={changeProfile} onSelectedCount={setSelectedCount} onBatchShouldFail={setBatchShouldFail} onReset={() => reset(platform, 'create', profile, true)}/></aside>
  </div></PrototypeAccessGate>;
}
