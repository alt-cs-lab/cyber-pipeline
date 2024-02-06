<script setup>
// Imports
import { RouterLink } from 'vue-router'

// Stores
import { useTokenStore } from '@/stores/Token'

// Token Store
const tokenStore = useTokenStore()
</script>

<template>
  <!-- Fixed navbar -->
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-purple">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">Cyber Pipeline</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink to="/about" active-class="active" class="nav-link"
              >About</RouterLink
            >
          </li>
          <li v-if="tokenStore.is_admin" class="nav-item">
            <RouterLink to="/admin" active-class="active" class="nav-link"
              >Admin</RouterLink
            >
          </li>
        </ul>
        <div class="">
          <div v-if="tokenStore.token">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <RouterLink to="/profile" active-class="active" class="nav-link"
                  ><font-awesome-icon icon="user" />
                  {{ tokenStore.eid }}</RouterLink
                >
              </li>
              <li class="nav-item">
                <a
                  class="btn btn-success float-end"
                  @click="tokenStore.logout()"
                  ><font-awesome-icon icon="arrow-right-from-bracket" />
                  Logout</a
                >
              </li>
            </ul>
          </div>
          <div v-else>
            <a class="btn btn-success" @click="tokenStore.getToken()"
              ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bg-purple {
  background-color: #512888;
}
</style>
