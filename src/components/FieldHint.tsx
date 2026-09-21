import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
export function FieldHint({ label, text }: { label: string; text: string }) {
  return <Tooltip title={text} trigger={['hover', 'focus', 'click']}><button type="button" className="field-hint" aria-label={`${label}说明`}><QuestionCircleOutlined /></button></Tooltip>;
}
