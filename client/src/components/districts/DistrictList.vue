<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Modal } from 'bootstrap'

// Stores
import { useDistrictsStore } from '@/stores/Districts'
import { useTokenStore } from '@/stores/Token'

// Token Store
const tokenStore = useTokenStore()

// Queues Store
const districtsStore = useDistrictsStore()
districtsStore.hydrate()
const { districts } = storeToRefs(districtsStore)

// Reactive Temp Store
var modalDistrict = reactive({})

// Modal Instance
var districtModal

// Show Modal to Remove District
const removeDistrict = function (district) {
  modalDistrict.id = district.id
  modalDistrict.usd = district.usd
  modalDistrict.name = district.name
  districtModal = new Modal('#districtModal', {})
  districtModal.show()
}

// Confirm District Removal
const confirmDistrict = async function (id) {
  await districtsStore.deleteDistrict(id)
  districtModal.hide()
}

</script>

<template>

  <div
    id="districtModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="districtModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="districtModalLabel" class="modal-title">Delete District</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this district?</h5>
          <p>
            <strong>USD: </strong>{{ modalDistrict.usd }} <br />
            <strong>Name: </strong>{{ modalDistrict.name }}
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
            @click="confirmDistrict(modalDistrict.id)"
          >
            <font-awesome-icon icon="trash" /> Delete District
          </button>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-success float-end" @click="addDistrict">
    <font-awesome-icon icon="plus" /> District
  </button>
  <h1 class="text-center">Districts</h1>
  
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>USD</th>
        <th>Name</th>
        <th>URL</th>
        <th>Teachers</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="district in districts" :key="district.id">
        <tr>
          <td>{{ district.usd }}</td>
          <td>{{ district.name }}</td>
          <td><a :href="district.url">{{ district.url }}</a></td>
          <td>
            <span
              v-for="teacher in district.teachers"
              :key="teacher.id"
              class="badge rounded-pill bg-success"
              >{{ teacher.name }}</span
            >
          </td>
          <td>
            <router-link
              v-if="tokenStore.is_admin"
              :to="{ name: 'district_edit', params: { id: district.id } }"
              class="btn btn-secondary btn-sm mx-1"
            >
              <font-awesome-icon icon="pen-to-square" />
            </router-link>
            <button
              v-if="tokenStore.is_admin"
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeDistrict(district)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

</template>