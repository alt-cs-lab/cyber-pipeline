<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Modal } from 'bootstrap'

// Stores
import { useUsersStore } from '@/stores/Users'
import { useTokenStore } from '@/stores/Token'

// Users Store
const usersStore = useUsersStore()
usersStore.hydrate()
const { users } = storeToRefs(usersStore)

// Token Store
const tokenStore = useTokenStore()

// Reactive Temp Store
var modalUser = reactive({})

// Modal Instance
var userModal

// Show Modal to Remove User
const removeUser = function (user) {
  modalUser.id = user.id
  modalUser.eid = user.eid
  modalUser.name = user.name
  userModal = new Modal('#userModal', {})
  userModal.show()
}

// Confirm User Removal
const confirmUser = async function (id) {
  await usersStore.deleteUser(id)
  userModal.hide()
}

// Add a New User
const addUser = async function () {
  var eid = prompt('Enter an eID to create a user')
  if (eid) {
    try {
      await usersStore.addUser(eid)
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert(JSON.stringify(error.response.data))
      } else {
        alert(error)
      }
    }
  }
}
</script>

<template>
  <div
    id="userModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="userModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="userModalLabel" class="modal-title">Delete User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this user?</h5>
          <p>
            <strong>eID: </strong>{{ modalUser.eid }} <br />
            <strong>Name: </strong>{{ modalUser.name }}
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmUser(modalUser.id)"
          >
            <font-awesome-icon icon="trash" /> Delete User
          </button>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-success float-end" @click="addUser">
    <font-awesome-icon icon="plus" /> User
  </button>
  <h1 class="text-center">Users</h1>

  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>eID</th>
        <th>Name</th>
        <th>Roles</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="user in users" :key="user.id">
        <tr>
          <td>{{ user.eid }}</td>
          <td>{{ user.name }}</td>
          <td>
            <span
              v-for="role in user.roles"
              :key="role.id"
              class="badge rounded-pill bg-success"
              >{{ role.name }}</span
            >
          </td>
          <td>
            <router-link
              :to="{ name: 'admin_useredit', params: { id: user.id } }"
              class="btn btn-secondary btn-sm mx-1"
            >
              <font-awesome-icon icon="pen-to-square" />
            </router-link>
            <button
              v-if="user.id != tokenStore.id"
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeUser(user)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
