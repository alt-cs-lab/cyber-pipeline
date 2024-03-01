<script setup>
const props = defineProps(['field', 'label', 'icon', 'disabled', 'errors', 'values', 'valueLabel'])
const model = defineModel()
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { ref } from 'vue'

const items = ref([])

const search = (event) => {
  items.value = props.values.filter((value) => value[props.valueLabel].includes(event.query))
}
</script>

<template>
  <div class="w-full">
    <FloatLabel class="w-full">
      <IconField iconPosition="left" class="w-full">
        <InputIcon>
          <i :class="props.icon" />
        </InputIcon>
        <AutoComplete
          :optionLabel="valueLabel"
          :id="field"
          :disabled="disabled"
          multiple
          :suggestions="items"
          @complete="search"
          :invalid="errors[field] ? true : false"
          v-model="model"
          class="w-full"
        />
      </IconField>
      <label :for="field" class="ml-5">{{ props.label }}</label>
    </FloatLabel>
    <small :id="field + '-help'" class="w-full text-red-600">{{
      errors[field] ? errors[field][0].message : ''
    }}</small>
  </div>
</template>

<style scoped>
:deep(.p-autocomplete-multiple-container) {
  padding-left: 2.5rem;
}

:deep(.pi) {
  z-index: 1;
}
</style>
