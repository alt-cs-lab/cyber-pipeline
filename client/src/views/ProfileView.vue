<script setup>
import EditProfile from '../components/EditProfile.vue'
</script>

<template>
  <EditProfile />
</template>

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
