<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { setErrors } from '@formkit/vue'
import VueMultiselect from 'vue-multiselect'

// Stores
import { useDistrictsStore } from '@/stores/Districts'
import { useTeachersStore } from '@/stores/Teachers'

// Configure Router
const router = useRouter()

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Teachers Store
const teachersStore = useTeachersStore()
await teachersStore.hydrate()
const teacher = teachersStore.teachers.find((teacher) => teacher.id === parseInt(props.id))

// Districts Store
const districtStore = useDistrictsStore()
districtStore.hydrate()
const { districts } = storeToRefs(districtStore)

// Save Teacher
const save = async (data) => {
  data = (({ id, name, usd, url }) => ({
    id,
    name,
    usd,
    url
  }))(data)
  // only send role ids of related teachers
  data['teachers'] = []
  for (const teacher of teacher.teachers) {
    data['teachers'].push({
      id: teacher.id,
    })
  }
  try {
    await teachersStore.update(data)
    router.push('/teachers/')
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
          'teachersForm',
          [
            'The server rejected this submission. Please correct errors listed above',
          ],
          errors // (optional) input level errors
        )
      } else {
        setErrors('teachersForm', [
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
    <h1 class="display-5 text-center">Edit Teacher</h1>
    <hr />
    <FormKit
      id="teachersForm"
      type="form"
      :value="teacher"
      :actions="false"
      @submit="save"
    >
      <FormKit
        type="text"
        name="name"
        label="Name"
        help="The teacher's full name"
        validation="required"
      />
      <FormKit
        type="text"
        name="email"
        label="Email"
        help="The teacher's school email"
        validation="required"
      />
      <FormKit
        type="text"
        name="eid"
        label="eID"
        help="The teacher's K-State eID"
        validation="required"
      />
      <FormKit
        type="text"
        name="wid"
        label="WID"
        help="The teacher's Wildcat ID"
        validation="required"
      />
      <div class="mb-3">
        <label for="multiselect-districts" class="form-label">Districts</label>
        <VueMultiselect
          id="multiselect-districts"
          v-model="teacher.districts"
          class="form-control"
          :options="districts"
          :multiple="true"
          tag-placeholder="Add this as new district"
          placeholder="Type to search or add district"
          label="usdName"
          track-by="id"
        />
        <div class="form-text">Districts assigned to this teacher</div>
      </div>
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col d-grid mb-2">
          <button class="btn btn-success">Save</button>
        </div>
        <div class="col d-grid mb-2">
          <router-link :to="{ name: 'teachers' }" class="btn btn-secondary">
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
