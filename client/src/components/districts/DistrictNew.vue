<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { setErrors } from '@formkit/vue'
import VueMultiselect from 'vue-multiselect'

// Stores
import { useDistrictsStore } from '@/stores/Districts'
import { useTeachersStore } from '@/stores/Teachers'
import { reactive } from 'vue'

// Configure Router
const router = useRouter()

// Districts Store
const districtsStore = useDistrictsStore()
await districtsStore.hydrate()
var districtTeachers = reactive([]);

// Teachers Store
const teacherStore = useTeachersStore()
teacherStore.hydrate()
const { teachers } = storeToRefs(teacherStore)

// Save District
const save = async (data) => {
  data = (({ name, usd, url }) => ({
    name,
    usd,
    url
  }))(data)
  // only send role ids of related teachers
  data['teachers'] = []
  for (const teacher of districtTeachers) {
    data['teachers'].push({
      id: teacher.id,
    })
  }
  try {
    await districtsStore.new(data)
    router.push('/districts/')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      let errors = {}
      if (error.response.data.data) {
        for (const input in error.response.data.data) {
          errors[input] = ''
          for (const message of error.response.data.data[input]) {
            errors[input] = errors[input] + message.message + ' '
          }
        }
        setErrors(
          'districtsForm',
          [
            'The server rejected this submission. Please correct errors listed above',
          ],
          errors // (optional) input level errors
        )
      } else {
        setErrors('districtsForm', [
          'The server rejected this submission due to an SQL Error. Refresh and try again',
        ])
      }
    } else {
      console.error(error)
    }
  }
}
</script>

<template>
  <main>
    <h1 class="display-5 text-center">New District</h1>
    <hr />
    <FormKit
      id="districtsForm"
      type="form"
      :value="district"
      :actions="false"
      @submit="save"
    >
      <FormKit
        type="text"
        name="usd"
        label="USD"
        help="The district's USD Number"
        validation="required"
      />
      <FormKit
        type="text"
        name="name"
        label="Name"
        help="The district's full name"
        validation="required"
      />
      <FormKit
        type="text"
        name="url"
        label="URL"
        help="The district's website URL"
      />
      <div class="mb-3">
        <label for="multiselect-teachers" class="form-label">Teachers</label>
        <VueMultiselect
          id="multiselect-teachers"
          v-model="districtTeachers"
          class="form-control"
          :options="teachers"
          :multiple="true"
          tag-placeholder="Add this as new teacher"
          placeholder="Type to search or add teacher"
          label="name"
          track-by="id"
        />
        <div class="form-text">Teachers assigned to this district</div>
      </div>
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col d-grid mb-2">
          <button class="btn btn-success">Save</button>
        </div>
        <div class="col d-grid mb-2">
          <router-link :to="{ name: 'districts' }" class="btn btn-secondary">
            Cancel</router-link
          >
        </div>
      </div>
    </FormKit>
  </main>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.formkit-messages {
  list-style-type: none;
  padding-left: 0px;
  color: red;
}

[data-invalid] .formkit-inner {
  border-color: red;
  box-shadow: 0 0 0 1px red;
}

[data-complete] .formkit-inner {
  border-color: red;
  box-shadow: 0 0 0 1px green;
}
</style>
