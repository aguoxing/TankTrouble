<template>
  <div class="blog-editor-container">
    <md-editor
      ref="editorRef"
      editorId="blog-editor"
      v-model="modelValue"
      :preview-only="previewOnly"
      :theme="editorTheme"
      :preview-theme="editorPreviewTheme"
      :code-theme="editorCodeTheme"
    />
    <MdCatalog v-if="showCatalog" style="background-color: skyblue" editorId="blog-editor" :scrollElement="scrollElement" />
  </div>
</template>

<script lang="ts">
import useStore from '@/store'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const MdCatalog = MdEditor.MdCatalog

export default defineComponent({
  name: 'BlogEditor',
  components: {
    MdEditor,
    MdCatalog
  },
  props: {
    inputValue: {
      type: String,
      default: ''
    },
    previewOnly: {
      type: Boolean,
      default: true
    },
    showCatalog: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { setting } = useStore()
    const editorTheme = ref(setting.blogTheme)
    const editorPreviewTheme = ref(setting.editorPreviewTheme)
    const editorCodeTheme = ref(setting.editorCodeTheme)

    const scrollElement = document.scrollingElement

    const modelValue = computed({
      get: () => props.inputValue || '',
      set: val => {
        context.emit('update:inputValue', val)
      }
    })

    watch(
      () => setting.blogTheme,
      (newV, oldV) => {
        editorTheme.value = newV
      }
    )

    return {
      modelValue,
      editorTheme,
      editorPreviewTheme,
      editorCodeTheme,
      scrollElement
    }
  }
})
</script>

<style lang="scss" scoped>
.blog-editor-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
