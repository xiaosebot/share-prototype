import { message } from 'antd';
export async function copyText(text: string, label = '内容') {
  try { await navigator.clipboard.writeText(text); message.success(label === '链接' ? '链接复制成功' : label === '口令' ? '口令复制成功' : `${label}已复制`); }
  catch { message.error('无法访问剪贴板，请选中文本后手动复制'); }
}
