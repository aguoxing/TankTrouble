/**
 * 弹窗类型
 */
export type Dialog = {
  title: string
  visible: boolean
}

/**
 * 通用组件选择项类型
 */
export type Option = {
  value: string
  label: string
  checked?: boolean
  children?: Option[]
}
