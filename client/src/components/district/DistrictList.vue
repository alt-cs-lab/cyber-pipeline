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
// import AutocompleteMultiple from '../forms/AutocompleteMultiple.vue'

// Stores
import { useDistrictsStore } from '@/stores/Districts'
const districtsStore = useDistrictsStore()
// import { useTeachersStore } from '@/stores/Teachers'
// const teachersStore = useTeachersStore()

// Setup Stores
districtsStore.hydrate()
const { districts } = storeToRefs(districtsStore)
// teachersStore.hydrate()
// const { teachers } = storeToRefs(teachersStore)

// Variables
const districtDialog = ref(false) // controls opening the dialog
const districtDialogHeader = ref('') // controls header for dialog
const loading = ref(false) // controls loading message
const message = ref('') // error message on dialog form
const district = ref({}) // item to be edited
const errors = ref({}) // form errors
const dt = ref() // datatable reference
const notesDialog = ref(false) // controls notes dialog
const notes = ref('') // notes for selected item

/**
 * Click handler to edit an item in the datatable
 *
 * @param {District} aDistrict item to edit
 */
const editDistrict = (aDistrict) => {
  district.value = { ...aDistrict }
  districtDialogHeader.value = 'Edit District'
  districtDialog.value = true
}

/**
 * Click handler for new button
 */
const newDistrict = () => {
  district.value = {
    name: '',
    usd: '',
    url: '',
    // teachers: [],
    rural: false,
    urban: false,
    suburban: false,
    town: false,
    notes: ''
  }
  districtDialogHeader.value = 'New District'
  districtDialog.value = true
}

/**
 * Click handler to delete an item in the datatable
 *
 * @param {District} aDistrict item to delete
 */
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

/**
 * Show notes handler
 *
 * @param {String} notes notes to display
 */
const toggleNotes = (aDistrict, event) => {
  notes.value = aDistrict.notes
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

/**
 * Export datatable to CSV
 */
const exportCSV = () => {
  dt.value.exportCSV()
}

/**
 * Custom export function to handle exporting datatable data
 * TODO update this to match your data structure
 *
 * @param {District} row
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
              @click="newDistrict"
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
          <p>No Districts Found</p>
        </div>
      </template>
      <Column
        field="usd"
        sortable
        header="usd"
      ></Column>
      <Column
        field="name"
        sortable
        header="Name"
      ></Column>
      <Column
        field="url"
        sortable
        header="URL"
      >
        <template #body="slotProps">
          <a :href="slotProps.data.url">{{ slotProps.data.url }}</a>
        </template>
      </Column>
      <!--
      <Column
        field="teachers"
        header="Teachers"
      >
        <template #body="slotProps">
          <Tag
            v-for="teacher in slotProps.data.teachers"
            :key="teacher.id"
            :value="teacher.name"
            severity="secondary"
            class="m-1"
          />
        </template>
      </Column>
      -->
      <Column header="Locales">
        <template #body="slotProps">
          <Tag
            v-if="slotProps.data.rural == '1'"
            :value="'Rural'"
            severity="success"
            class="m-1"
          />
          <Tag
            v-if="slotProps.data.town == '1'"
            :value="'Town'"
            severity="primary"
            class="m-1"
          />
          <Tag
            v-if="slotProps.data.suburban == '1'"
            :value="'Suburban'"
            severity="secondary"
            class="m-1"
          />
          <Tag
            v-if="slotProps.data.urban == '1'"
            :value="'Urban'"
            severity="secondary"
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
            @click="editDistrict(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            class="mr-2"
            severity="danger"
            @click="deleteDistrict(slotProps.data)"
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
    v-model:visible="districtDialog"
    :style="{ width: '450px' }"
    :header="districtDialogHeader"
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
        v-model="district.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <TextField
        v-model="district.usd"
        field="usd"
        label="USD"
        icon="pi pi-key"
        :errors="errors"
      />
      <TextField
        v-model="district.url"
        field="url"
        label="URL"
        icon="pi pi-at"
        :errors="errors"
      />
      <div
        class="-mt-3 mb-2 w-full flex flex-row flex-wrap align-items-center justify-content-center row-gap-3"
      >
        <label class="w-full mb-1 text-center">Locales</label>
        <div class="w-6 pr-1">
          <BooleanField
            v-model="district.rural"
            field="rural"
            label="Rural"
            :errors="errors"
          />
        </div>
        <div class="w-6 pl-1">
          <BooleanField
            v-model="district.urban"
            field="urban"
            label="Urban"
            :errors="errors"
          />
        </div>
        <div class="w-6 pr-1">
          <BooleanField
            v-model="district.suburban"
            field="suburban"
            label="Suburban"
            :errors="errors"
          />
        </div>
        <div class="w-6 pl-1">
          <BooleanField
            v-model="district.town"
            field="town"
            label="Town"
            :errors="errors"
          />
        </div>
      </div>
      <!--<AutocompleteMultiple
        v-model="district.teachers"
        field="teachers"
        label="Teachers"
        icon="pi pi-users"
        :errors="errors"
        :values="teachers"
        valueLabel="name"
      />-->
      <TextAreaField
        v-model="district.notes"
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
