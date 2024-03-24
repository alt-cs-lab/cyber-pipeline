<script setup>
// Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// PrimeVue Components
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()
import { useToast } from 'primevue/usetoast'
const toast = useToast()

// Custom Components
import AutocompleteMultiple from '../forms/AutocompleteMultiple.vue'
import DropDownField from '../forms/DropDownField.vue'

// Stores
import { useTeachersStore } from '@/stores/Teachers'
const teachersStore = useTeachersStore()
import { useDistrictsStore } from '@/stores/Districts'
const districtsStore = useDistrictsStore()

// Setup Stores
teachersStore.hydrate()
const { teachers } = storeToRefs(teachersStore)
districtsStore.hydrate()
const { districts, getDistrict } = storeToRefs(districtsStore)

// Variables
const teacherDialog = ref(false) // controls opening the dialog
const teacherDialogHeader = ref('') // controls header for dialog
const loading = ref(false) // controls loading message
const message = ref('') // error message on dialog form
const teacher = ref({}) // item to be edited
const errors = ref({}) // form errors
const dt = ref() // datatable reference

/**
 * Click handler to edit an item in the datatable
 * @param {Teacher} aTeacher
 */
const editTeacher = (aTeacher) => {
  teacher.value = { ...aTeacher }
  teacherDialogHeader.value = 'Edit Teacher'
  teacherDialog.value = true
}

/**
 * Click handler for new button
 */
const newTeacher = () => {
  teacher.value = {
    name: '',
    email: '',
    eid: '',
    wid: '',
    districts: []
  }
  teacherDialogHeader.value = 'New Teacher'
  teacherDialog.value = true
}

/**
 * Click handler to delete an item in the datatable
 *
 * @param {Teacher} aTeacher
 */
const deleteTeacher = (aTeacher) => {
  confirm.require({
    message: 'Are you sure you want to delete ' + aTeacher.name + '?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await teachersStore.delete(aTeacher.id)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Teacher Deleted!',
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

/**
 * Save button handler in edit form dialog
 */
const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  try {
    if (teacher.value.id) {
      await teachersStore.update(teacher.value)
    } else {
      await teachersStore.new(teacher.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Teacher Updated!', life: 3000 })
    teacherDialog.value = false
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

/**
 * Export datatable to CSV
 */
const exportCSV = () => {
  dt.value.exportCSV()
}

/**
 * Custom export function to handle exporting datatable data
 *
 * @param {Teacher} row
 */
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
  <!-- Location for confirmation dialog to be inserted -->
  <ConfirmDialog></ConfirmDialog>

  <!-- Main datatable for items -->
  <Panel header="Manage Teachers">
    <DataTable
      ref="dt"
      :value="teachers"
      stripedRows
      sortField="name"
      :sortOrder="1"
      tableStyle="min-width: 50rem"
      :exportFunction="exportFunction"
    >
      <template #header>
        <Toolbar
          class="mb-2"
          style="border: none"
        >
          <template #start>
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="newTeacher"
            />
          </template>
          <template #end>
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>
      </template>
      <Column
        field="name"
        sortable
        header="Name"
      ></Column>
      <Column
        field="email"
        sortable
        header="Email"
      ></Column>
      <Column
        field="eid"
        sortable
        header="eID"
      ></Column>
      <Column
        field="wid"
        sortable
        header="WID"
      ></Column>
      <Column
        header="Status"
      >
        <template #body="slotProps">
          <Tag
            v-if="slotProps.data.status != '0'"
            :value="slotProps.data.status == '1' ? 'Active' : 'Inactive'"
            :severity="slotProps.data.status == '1' ? 'success' : 'danger'"
            :icon="slotProps.data.status == '1' ? 'pi pi-check' : 'pi-pi-times'"
          />
          <Tag
            v-else
            value="New"
            severity="warning"
            icon="pi pi-star"
          />
        </template>
      </Column>
      <Column
        field="district_id"
        sortable
        header="District"
      >
        <template #body="slotProps">
          <p>{{ getDistrict(slotProps.data.district_id)?.usdName }}</p>
        </template>
      </Column>
      <Column
        field="districts"
        header="Districts"
      >
        <template #body="slotProps">
          <Tag
            v-for="district in slotProps.data.districts"
            :key="district.id"
            :value="district.usdName"
            :severity="district.id == slotProps.data.district_id ? 'success' : 'secondary'"
          />
        </template>
      </Column>
      <Column
        header="Actions"
        :exportable="false"
        style="min-width: 8rem"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editTeacher(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteTeacher(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <!-- Edit item dialog -->
  <Dialog
    v-model:visible="teacherDialog"
    :style="{ width: '450px' }"
    :header="teacherDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >
    <div
      class="flex flex-column align-items-center row-gap-5 w-full pt-3 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="teacher.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <TextField
        v-model="teacher.email"
        field="email"
        label="Email"
        icon="pi pi-envelope"
        :errors="errors"
      />
      <TextField
        v-model="teacher.eid"
        field="eid"
        label="eID"
        icon="pi pi-at"
        :errors="errors"
      />
      <TextField
        v-model="teacher.wid"
        field="wid"
        label="WID"
        icon="pi pi-key"
        :errors="errors"
      />
      <DropDownField
        v-model="teacher.district_id"
        field="district_id"
        label="Primary District"
        icon="pi pi-building"
        :errors="errors"
        :values="districts"
        valueLabel="usdName"
      />
      <AutocompleteMultiple
        v-model="teacher.districts"
        field="districts"
        label="Districts"
        icon="pi pi-building"
        :errors="errors"
        :values="districts"
        valueLabel="usdName"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        @click="save"
        :loading="loading"
      />
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable-header) {
  padding: 0px !important;
}
</style>
