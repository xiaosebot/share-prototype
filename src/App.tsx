import { Modal } from 'antd';
import { useMemo, useState } from 'react';
import { ShareCreatePage } from './pages/ShareCreatePage';
import { AppShareCreatePage } from './pages/AppShareCreatePage';
import { ShareSuccessPage } from './pages/ShareSuccessPage';
import { PrototypeStatePanel, type DemoScreen } from './components/PrototypeStatePanel';
import type { ShareConfig, StorageScope, Platform } from './mock/shareMock';
import { defaultTrafficRules, editConfig, profiles, selectedFiles, systemConfig } from './mock/shareMock';
import type { BatchItem } from './components/BatchResult';
import { clearPrototypeMemory, loadDefaultConfig, loadPasswordHistory } from './utils/shareConfigStorage';
import { makeShareUrl, makeTitle, randomPassword } from './utils/shareRules';

const freshConfig = (scope: StorageScope, customDomains: string[]): ShareConfig => {
  const remembered = loadDefaultConfig(scope);
  const defaultPassword = loadPasswordHistory(scope).find(item => item.isDefault)?.value || '';
  const domain = remembered.domain && (remembered.domain === 'official' || customDomains.includes(remembered.domain)) ? remembered.domain : customDomains[0] || 'official';
  return { ...systemConfig, ...remembered, domain, password: remembered.passwordEnabled ? defaultPassword : '', title: makeTitle(selectedFiles), trafficRules: remembered.trafficRules ? [...remembered.trafficRules] : [] };
};
const demoEdit = (customDomains: string[]): ShareConfig => ({ ...editConfig, domain: customDomains[0] || 'official', trafficRules: [...defaultTrafficRules] });
const makeBatch = (partial: boolean, config: ShareConfig): BatchItem[] => selectedFiles.map((file, index) => {
  const failed = partial && [1, 6].includes(index);
  const password = config.passwordEnabled ? (config.passwordSource === 'random' ? randomPassword() : config.password) : '';
  return { key: String(index), file, status: failed ? 'failed' : 'success', url: failed ? undefined : makeShareUrl(config.domain, `batch-${index + 1}`), password, reason: failed ? '网络请求超时，请重试' : undefined };
});

export default function App() {
  const [platform, setPlatform] = useState<Platform>('web'); const [screen, setScreen] = useState<DemoScreen>('create'); const [mode, setMode] = useState<'create' | 'edit'>('create'); const [profileUid, setProfileUid] = useState(profiles[0].uid); const [desktopOpen, setDesktopOpen] = useState(true);
  const profile = useMemo(() => profiles.find(p => p.uid === profileUid) || profiles[0], [profileUid]);
  const scope = useMemo<StorageScope>(() => ({ uid: profile.uid, platform }), [profile.uid, platform]);
  const [config, setConfig] = useState<ShareConfig>(() => freshConfig({ uid: profiles[0].uid, platform: 'web' }, profiles[0].customDomains));
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const resultConfig = config;
  const patch = (value: Partial<ShareConfig>) => setConfig(prev => ({ ...prev, ...value }));
  const reset = (nextPlatform = platform, nextMode = mode, nextProfile = profile, clearMemory = false) => {
    const nextScope = { uid: nextProfile.uid, platform: nextPlatform };
    if (clearMemory) clearPrototypeMemory(nextScope);
    setConfig(nextMode === 'edit' ? demoEdit(nextProfile.customDomains) : freshConfig(nextScope, nextProfile.customDomains));
    setBatch([]); setScreen('create'); setDesktopOpen(true);
  };
  const changePlatform = (next: Platform) => { setPlatform(next); setMode('create'); reset(next, 'create', profile); };
  const changeProfile = (uid: string) => { const next = profiles.find(p => p.uid === uid) || profiles[0]; setProfileUid(uid); reset(platform, 'create', next); setMode('create'); };
  const changeMode = (next: 'create' | 'edit') => { setMode(next); reset(platform, next, profile); };
  const single = () => setScreen('success');
  const batchCreate = (partial = true) => { setBatch(makeBatch(partial, config)); setScreen(partial ? 'batchPartial' : 'batchSuccess'); };
  const retry = (key: string) => setBatch(items => items.map(item => item.key === key ? { ...item, status: 'success', reason: undefined, url: makeShareUrl(config.domain, `retry-${Number(key) + 1}`) } : item));
  const changeScreen = (next: DemoScreen) => {
    setScreen(next);
    if (next.startsWith('batch')) setBatch(makeBatch(next === 'batchPartial', config));
    setDesktopOpen(true);
  };
  const back = () => { setScreen('create'); setDesktopOpen(true); };

  return <div className="prototype-layout">
    {platform === 'web' ? <>{screen === 'create' && <ShareCreatePage open={desktopOpen} config={config} profile={profile} scope={scope} mode={mode} onChange={patch} onOpen={() => setDesktopOpen(true)} onClose={() => setDesktopOpen(false)} onSingle={single} onBatch={() => batchCreate(true)}/>}
      {screen !== 'create' && <><ShareCreatePage open={false} config={config} profile={profile} scope={scope} mode={mode} onChange={patch} onOpen={back} onClose={() => {}} onSingle={single} onBatch={() => batchCreate(true)}/><Modal open={desktopOpen} footer={null} width={screen === 'success' ? 860 : 940} onCancel={back} className="result-modal" centered><ShareSuccessPage mode={screen === 'success' ? 'success' : 'batch'} config={resultConfig} profile={profile} scope={scope} mobile={false} results={batch} onBack={back} onRetry={retry}/></Modal></>}
    </> : <div className="mobile-stage"><div className="phone-shell">{screen === 'create' ? <AppShareCreatePage config={config} profile={profile} scope={scope} mode={mode} onChange={patch} onSingle={single} onBatch={() => batchCreate(true)} onBack={() => {}}/> : <ShareSuccessPage mode={screen === 'success' ? 'success' : 'batch'} config={resultConfig} profile={profile} scope={scope} mobile results={batch} onBack={back} onRetry={retry}/>}</div></div>}
    <aside className="prototype-dock"><PrototypeStatePanel platform={platform} screen={screen} mode={mode} profileUid={profile.uid} profiles={profiles} onPlatform={changePlatform} onScreen={changeScreen} onMode={changeMode} onProfile={changeProfile} onReset={() => reset(platform, 'create', profile, true)}/></aside>
  </div>;
}
