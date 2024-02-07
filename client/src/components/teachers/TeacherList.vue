<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Modal } from 'bootstrap'

// Stores
import { useTeachersStore } from '@/stores/Teachers'
import { useTokenStore } from '@/stores/Token'

// Token Store
const tokenStore = useTokenStore()

// Queues Store
const teachersStore = useTeachersStore()
teachersStore.hydrate()
const { teachers } = storeToRefs(teachersStore)

// Reactive Temp Store
var modalTeacher = reactive({})

// Modal Instance
var teacherModal

// Show Modal to Remove Teacher
const removeTeacher = function (teacher) {
  modalTeacher.id = teacher.id
  modalTeacher.email = teacher.email
  modalTeacher.name = teacher.name
  teacherModal = new Modal('#teacherModal', {})
  teacherModal.show()
}

// Confirm Teacher Removal
const confirmTeacher = async function (id) {
  await teachersStore.delete(id)
  teacherModal.hide()
}

</script>

<template>

  <div
    id="teacherModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="teacherModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="teacherModalLabel" class="modal-title">Delete Teacher</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this teacher?</h5>
          <p>
            <strong>USD: </strong>{{ modalTeacher.usd }} <br />
            <strong>Name: </strong>{{ modalTeacher.name }}
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
            @click="confirmTeacher(modalTeacher.id)"
          >
            <font-awesome-icon icon="trash" /> Delete Teacher
          </button>
        </div>
      </div>
    </div>
  </div>

  <router-link
    v-if="tokenStore.is_admin"
    :to="{ name: 'teacher_new' }"
    class="btn btn-success float-end"
  >
  <font-awesome-icon icon="plus" /> Teacher
  </router-link>
  
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>eID</th>
        <th>WID</th>
        <th>Districts</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="teacher in teachers" :key="teacher.id">
        <tr>
          <td>{{ teacher.name }}</td>
          <td>{{ teacher.email }}</td>
          <td>{{ teacher.eid }}</td>
          <td>{{ teacher.wid }}</td>
          <td>
            <span
              v-for="district in teacher.districts"
              :key="district.id"
              class="badge rounded-pill bg-success"
              >{{ district.usdName }}</span
            >
          </td>
          <td>
            <router-link
              v-if="tokenStore.is_admin"
              :to="{ name: 'teacher_edit', params: { id: teacher.id } }"
              class="btn btn-secondary btn-sm mx-1"
            >
              <font-awesome-icon icon="pen-to-square" />
            </router-link>
            <button
              v-if="tokenStore.is_admin"
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeTeacher(teacher)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

</template>