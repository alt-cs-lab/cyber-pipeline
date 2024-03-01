<script setup>
const props = defineProps(['field', 'label', 'icon', 'disabled', 'errors', 'values', 'valueLabel'])
const model = defineModel()
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
</script>

<template>
  <div class="w-full">
    <FloatLabel class="w-full">
      <IconField iconPosition="left" class="w-full">
        <InputIcon>
          <i :class="props.icon" />
        </InputIcon>
        <Dropdown
          :id="field"
          :disabled="disabled"
          :invalid="errors[field] ? true : false"
          v-model="model"
          class="w-full"
          :options="values"
          :optionLabel="valueLabel"
          optionValue="id"
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
:deep(.p-dropdown-label) {
  padding-left: 2.5rem;
}

:deep(.pi) {
  z-index: 1;
}
</style>
