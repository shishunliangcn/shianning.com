import { computed } from 'vue'
import { useData } from 'vitepress'

import { EMPTY_CONTEXT, resolvePageContext, type PageContext } from '../../page-context'

/**
 * 读取当前页面的业务上下文。
 *
 * 组件唯一允许的「身份判断」入口：不再自己看 relativePath，
 * 而是问上下文层「我该不该渲染」。
 */
export function usePageContext() {
  const { page } = useData()

  return computed<PageContext>(() => resolvePageContext(page.value.relativePath) ?? EMPTY_CONTEXT)
}
