<script setup>
import { storeToRefs } from 'pinia'
import ConfirmDialog from 'primevue/confirmdialog'

import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

import { useDistrictsStore } from '@/stores/Districts'
import { useTeachersStore } from '@/stores/Teachers'
import { ref } from 'vue'

const districtsStore = useDistrictsStore()
districtsStore.hydrate()
const { districts } = storeToRefs(districtsStore)

// Roles Store
const teachersStore = useTeachersStore()
teachersStore.hydrate()
const { teachers } = storeToRefs(teachersStore)

// Toast
import { useToast } from 'primevue/usetoast'
import AutocompleteMultiple from '../forms/AutocompleteMultiple.vue'
const toast = useToast()

const districtDialog = ref(false)
const districtDialogHeader = ref('')
const loading = ref(false)
const message = ref('')
const district = ref({})
const errors = ref({})
const dt = ref()

const editDistrict = (aDistrict) => {
  district.value = { ...aDistrict }
  districtDialogHeader.value = 'Edit District'
  districtDialog.value = true
}

const newDistrict = () => {
  district.value = {
    name: '',
    usd: '',
    url: '',
    teachers: []
  }
  districtDialogHeader.value = 'New District'
  districtDialog.value = true
}

const deleteDistrict = (aDistrict) => {
  confirm.require({
    message: 'Are you sure you want to delete ' + aDistrict.name + '?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await districtsStore.delete(aDistrict.id)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'District Deleted!',
          life: 3000
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.error,
          life: 3000
        })
      }
    },
    reject: () => {
      // do nothing
    }
  })
}

const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  try {
    if (district.value.id) {
      await districtsStore.update(district.value)
    } else {
      await districtsStore.new(district.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'District Updated!', life: 3000 })
    districtDialog.value = false
  } catch (error) {
    console.log(error)
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = 'The server rejected this submission. Please correct errors listed below'
    } else if (error.response.data.message) {
      message.value = error.response.data.message
    } else {
      message.value =
        'The server rejected this submission due to an SQL Error. Refresh and try again'
    }
  }
  loading.value = false
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const exportFunction = (row) => {
  if (Array.isArray(row.data)) {
    var output = '"'
    for (const item of row.data) {
      output += item.name + ','
    }
    output += '"'
    console.log(output)
    return output
  } else {
    return row.data
  }
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Panel header="Manage Districts">
    <DataTable
      ref="dt"
      :value="districts"
      stripedRows
      sortField="usd"
      :sortOrder="1"
      tableStyle="min-width: 50rem"
      :exportFunction="exportFunction"
    >
      <template #header>
        <Toolbar class="mb-2" style="border: none">
          <template #start>
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="newDistrict"
            />
          </template>
          <template #end>
            <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
          </template>
        </Toolbar>
      </template>
      <Column field="usd" sortable header="usd"></Column>
      <Column field="name" sortable header="Name"></Column>
      <Column field="url" sortable header="URL">
        <template #body="slotProps">
          <a :href="slotProps.data.url">{{ slotProps.data.url }}</a>
        </template>
      </Column>
      <Column field="teachers" header="Teachers">
        <template #body="slotProps">
          <Tag
            v-for="teacher in slotProps.data.teachers"
            :key="teacher.id"
            :value="teacher.name"
            severity="secondary"
          />
        </template>
      </Column>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editDistrict(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteDistrict(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <Dialog
    v-model:visible="districtDialog"
    :style="{ width: '450px' }"
    :header="districtDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
  >
    <Message v-if="message" severity="error">{{ message }}</Message>
    <div
      class="flex flex-column align-items-center row-gap-5 w-full pt-3 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="district.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <TextField v-model="district.usd" field="usd" label="USD" icon="pi pi-key" :errors="errors" />
      <TextField v-model="district.url" field="url" label="URL" icon="pi pi-at" :errors="errors" />
      <AutocompleteMultiple
        v-model="district.teachers"
        field="teachers"
        label="Teachers"
        icon="pi pi-users"
        :errors="errors"
        :values="teachers"
        valueLabel="name"
      />
      <Button label="Save" icon="pi pi-check" @click="save" :loading="loading" />
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable-header) {
  padding: 0px !important;
}
</style>
