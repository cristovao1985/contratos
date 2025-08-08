<template>
  <q-layout view="lHh Lpr lFf" class="flex flex-center q-ma-dm">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrintLayout',
})
</script>
