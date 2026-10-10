import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { SharePhrasePreview } from '../components/SharePhrasePreview';
import { BatchResult, type BatchItem } from '../components/BatchResult';
export function ShareSuccessPage({ mode, config, profile, scope, mobile, results, onBack }: { mode: 'success' | 'batch'; config: ShareConfig; profile: MockProfile; scope: StorageScope; mobile: boolean; results: BatchItem[]; onBack: () => void }) {
  return mode === 'success' ? <SharePhrasePreview config={config} profile={profile} scope={scope} mobile={mobile} onBack={onBack}/> : <BatchResult config={config} profile={profile} scope={scope} mobile={mobile} items={results} onBack={onBack}/>;
}
