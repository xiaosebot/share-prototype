import type { MockProfile, ShareConfig, StorageScope } from '../mock/shareMock';
import { SharePhrasePreview } from '../components/SharePhrasePreview';
import { BatchResult, type BatchItem } from '../components/BatchResult';
export function ShareSuccessPage({ mode, config, profile, scope, mobile, results, onBack, onRetry }: { mode: 'success' | 'batch'; config: ShareConfig; profile: MockProfile; scope: StorageScope; mobile: boolean; results: BatchItem[]; onBack: () => void; onRetry: (key: string) => void }) {
  return mode === 'success' ? <SharePhrasePreview config={config} profile={profile} scope={scope} mobile={mobile} onBack={onBack}/> : <BatchResult config={config} profile={profile} scope={scope} mobile={mobile} items={results} onBack={onBack} onRetry={onRetry}/>;
}
