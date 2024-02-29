<script setup>
import { storeToRefs } from 'pinia'
import TextField from '@/components/forms/TextField.vue'

// Stores
import { useProfileStore } from '@/stores/Profile'
import { ref } from 'vue';

// Toast
import { useToast } from "primevue/usetoast";
const toast = useToast();

// Token Store
const profileStore = useProfileStore()
const { user } = storeToRefs(profileStore)

const loading = ref(false)
const errors = ref({})
const message = ref("")

const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ""
  try{
    await profileStore.update()
    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile Updated!', life: 3000 })
  } catch (error) {
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = "The server rejected this submission. Please correct errors listed below"
    } else {
      message.value = "The server rejected this submission due to an SQL Error. Refresh and try again"
    }
  }
  loading.value = false
}
</script>

<template>
  <Panel header="Profile Settings">
    <Message v-if="message" severity="error">{{ message }}</Message>
    <div class="flex flex-column align-items-center row-gap-5 w-full pt-3" v-focustrap v-on:keyup.enter="save">
      <TextField :model="user" field="eid" label="eID" icon="pi pi-at" :errors="errors" :disabled="true"/>
      <TextField :model="user" field="name" label="Name" icon="pi pi-user" :errors="errors"/>
      <Button label="Save" icon="pi pi-check" @click="save" :loading="loading"/>
    </div>
  </Panel>
</template>