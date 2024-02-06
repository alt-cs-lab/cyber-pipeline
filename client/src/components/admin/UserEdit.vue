<script setup>
// Imports
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { setErrors } from '@formkit/vue'
import VueMultiselect from 'vue-multiselect'
import EasyMDE from 'easymde'

// Stores
import { useUsersStore } from '@/stores/Users'
import { useRolesStore } from '@/stores/Roles'

// Configure Router
const router = useRouter()

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Users Store
const usersStore = useUsersStore()
await usersStore.hydrate()
const user = usersStore.users.find((user) => user.id === parseInt(props.id))

// Roles Store
const rolesStore = useRolesStore()
rolesStore.hydrate()
const { roles } = storeToRefs(rolesStore)

// Configure EasyMDE
// var easyMDE
// onMounted(() => {
//   easyMDE = new EasyMDE({
//     autoDownloadFontAwesome: false,
//     blockStyles: {
//       italic: '_',
//     },
//     status: false,
//     spellChecker: false,
//   })
// })

// Save User
const save = async (data) => {
  data = (({ id, name }) => ({
    id,
    name,
  }))(data)
  // only send role ids of related roles
  data['roles'] = []
  for (const role of user.roles) {
    data['roles'].push({
      id: role.id,
    })
  }
  try {
    await usersStore.update(data)
    router.push('/admin/')
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
          'usersForm',
          [
            'The server rejected this submission. Please correct errors listed above',
          ],
          errors // (optional) input level errors
        )
      } else {
        setErrors('usersForm', [
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
    <h1 class="display-5 text-center">Edit User</h1>
    <hr />
    <FormKit
      id="userform"
      type="form"
      :value="user"
      :actions="false"
      @submit="save"
    >
      <FormKit
        type="text"
        name="eid"
        label="eID"
        :disabled="true"
        help="The user's K-State eID (cannot be changed)"
        validation="required"
      />
      <FormKit
        type="text"
        name="name"
        label="Name"
        help="The user's full name as you'd like it displayed on the site"
        validation="required"
      />
      <div class="mb-3">
        <label for="multiselect-roles" class="form-label">Roles</label>
        <VueMultiselect
          id="multiselect-roles"
          v-model="user.roles"
          class="form-control"
          :options="roles"
          :multiple="true"
          tag-placeholder="Add this as new role"
          placeholder="Type to search or add role"
          label="name"
          track-by="id"
        />
        <div class="form-text">Roles assigned to this user</div>
      </div>
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col d-grid mb-2">
          <button class="btn btn-success">Save</button>
        </div>
        <div class="col d-grid mb-2">
          <router-link :to="{ name: 'admin' }" class="btn btn-secondary">
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
