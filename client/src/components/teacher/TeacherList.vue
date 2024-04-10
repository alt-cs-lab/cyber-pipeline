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
const notesDialog = ref(false) // controls notes dialog
const notes = ref('') // notes for selected item

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
    districts: [],
    status: 0,
    pd_status: 0,
    cert_status: 0,
    ms_status: 0
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
 * Show notes handler
 *
 * @param {String} notes notes to display
 */
const toggleNotes = (aTeacher, event) => {
  notes.value = aTeacher.notes
  notesDialog.value.toggle(event)
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

const statuses = [
  { label: 'New', id: 0, severity: 'warning', icon: 'pi pi-star' },
  { label: 'Active', id: 1, severity: 'primary', icon: 'pi pi-sync' },
  { label: 'Inactive', id: 2, severity: 'secondary', icon: 'pi pi-times' },
  { label: 'Complete', id: 3, severity: 'success', icon: 'pi pi-check' }
]

/**
 * Custom export function to handle exporting datatable data
 *
 * @param {Teacher} row
 */
const exportFunction = (row) => {
  if (Array.isArray(row.data)) {
    var output = '"'
    for (const item of row.data) {
      output += item.usdName + ','
    }
    output += '"'
    return output
  } else if (row.field == 'district_id') {
    return getDistrict.value(row.data)?.usdName
  } else if (row.field.endsWith('status')) {
    return statuses[row.data].label
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
      <template #empty>
        <div class="p-text-center">
          <p>No Teachers Found</p>
        </div>
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
        field="status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.status].label"
            :severity="statuses[slotProps.data.status].severity"
            :icon="statuses[slotProps.data.status].icon"
            class="m-1"
          />
        </template>
      </Column>
      <Column
        header="PD"
        field="pd_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.pd_status].label"
            :severity="statuses[slotProps.data.pd_status].severity"
            :icon="statuses[slotProps.data.pd_status].icon"
            class="m-1"
          />
        </template>
      </Column>
      <Column
        header="Cert"
        field="cert_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.cert_status].label"
            :severity="statuses[slotProps.data.cert_status].severity"
            :icon="statuses[slotProps.data.cert_status].icon"
            class="m-1"
          />
        </template>
      </Column>
      <Column
        header="MS"
        field="ms_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.ms_status].label"
            :severity="statuses[slotProps.data.ms_status].severity"
            :icon="statuses[slotProps.data.ms_status].icon"
            class="m-1"
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
            class="m-1"
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
            class="mr-2"
            severity="danger"
            @click="deleteTeacher(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
          <Button
            v-if="slotProps.data.notes && slotProps.data.notes.length > 0"
            icon="pi pi-file"
            outlined
            rounded
            severity="info"
            @click="toggleNotes(slotProps.data, $event)"
            v-tooltip.bottom="'Notes'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <!-- Notes dialog -->
  <OverlayPanel ref="notesDialog">
    <div class="flex flex-column gap-1 w-25rem">
      <div class="w-full">
        <span>Notes</span>
        <hr class="w-full" />
      </div>
      <span>{{ notes }}</span>
    </div>
  </OverlayPanel>

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
        v-model="teacher.status"
        field="status"
        label="Status"
        icon="pi pi-filter"
        :errors="errors"
        :values="statuses"
        valueLabel="label"
      />
      <DropDownField
        v-model="teacher.pd_status"
        field="pd_status"
        label="PD Status"
        icon="pi pi-file"
        :errors="errors"
        :values="statuses"
        valueLabel="label"
      />
      <DropDownField
        v-model="teacher.cert_status"
        field="cert_status"
        label="Certificate Status"
        icon="pi pi-bookmark"
        :errors="errors"
        :values="statuses"
        valueLabel="label"
      />
      <DropDownField
        v-model="teacher.ms_status"
        field="ms_status"
        label="MS Status"
        icon="pi pi-star"
        :errors="errors"
        :values="statuses"
        valueLabel="label"
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
      <TextAreaField
        v-model="teacher.notes"
        field="notes"
        label="Notes"
        icon="pi pi-file"
        :errors="errors"
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
