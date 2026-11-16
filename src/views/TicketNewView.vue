<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import { createTicket } from '../services/ticketService'
import { messageErreur } from '../utils'

const router = useRouter()
const saving = ref(false)
const error = ref('')

async function enregistrer(data) {
  if (saving.value) return
  saving.value = true
  error.value = ''
  try {
    await createTicket(data)
    router.push('/tickets') // la liste se recharge et affiche le nouveau ticket
  } catch (e) {
    error.value = messageErreur(e)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="carte">
    <RouterLink to="/tickets">← Retour à la liste</RouterLink>
    <h2>Nouveau ticket</h2>
    <div v-if="error" class="message erreur" role="alert"><p><strong>Erreur :</strong> {{ error }}</p></div>
    <TicketForm :saving="saving" submit-label="Enregistrer le ticket" @submit="enregistrer" @cancel="router.push('/tickets')" />
  </section>
</template>

<style scoped>
.carte { background: var(--surface); border: 1px solid var(--bordure); border-radius: 8px; padding: 1.25rem; }
h2 { margin: .75rem 0 1rem; font-size: 1.3rem; }
</style>
