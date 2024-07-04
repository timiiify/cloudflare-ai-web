<script setup lang="ts">
const input = ref('')
const addHistory = ref(true)
const { openModelSelect } = useGlobalState()
const toast = useToast()
onMounted(() => {
  toast.add({ title: "如需联系上文请开启左下角携带历史记录，图像生成请输入英文描述词" })
  addHistory.value = localStorage.getItem('addHistory') === 'true'
})
watch(addHistory, () => {
  localStorage.setItem('addHistory', addHistory.value.toString())
})
const handleButtonClick = () => {
  addHistory.value = !addHistory.value
  if (addHistory.value === true) {
    toast.add({ title: '已开启携带历史记录，会话可联系上文' })
  } else {
    toast.add({ title: '已关闭携带历史记录，会话无法联系上文' })
  }

}
const p = defineProps<{
  loading: boolean
  selectedModel: Model

  handleSend: (input: string, addHistory: boolean) => void
}>()

function handleInput(e: KeyboardEvent) {
  if (e.shiftKey) {
    input.value += '\n'
  }
  if (e.isComposing || e.shiftKey) {
    return
  }

  if (input.value.trim() === '') return
  if (p.loading) return
  p.handleSend(input.value, addHistory.value)
  input.value = ''
}
</script>

<template>
  <div class="flex flex-col space-y-1">
    <UButton class="self-center" color="white" @click="openModelSelect = !openModelSelect">
      {{ selectedModel.name }}
      <template #trailing>
        <UIcon name="i-heroicons-chevron-down-solid" />
      </template>
    </UButton>
    <div class="flex items-end">
      <UTooltip :text="addHistory ? $t('with_history') : $t('without_history')">
        <UButton class="m-1" @click="handleButtonClick" :color="addHistory ? 'primary' : 'gray'"
          icon="i-heroicons-clock-solid" />
      </UTooltip>
      <UTextarea v-model="input" :placeholder="$t('please_input_text') + '...'"
        @keydown.prevent.enter="handleInput($event)" autofocus :rows="1" autoresize
        class="flex-1 max-h-48 overflow-y-auto p-1" />
      <UButton @click="handleInput($event)" :disabled="loading" class="m-1">
        {{ $t('send') }}
      </UButton>
    </div>
  </div>
</template>