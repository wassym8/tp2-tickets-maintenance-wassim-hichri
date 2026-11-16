<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import TicketBadge from '../components/TicketBadge.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { getTicket, updateTicket, patchTicket, deleteTicket } from '../services/ticketService'
import { STATUT_SUIVANT, messageErreur, formaterDate } from '../utils'

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')
const actionError = ref('')
const notice = ref('')
const editing = ref(route.query.modifier === '1')
const saving = ref(false)
const statutBusy = ref(false)
const showDelete = ref(false)
const deleting = ref(false)

async function charger() {
  loading.value = true
  notFound.value = false
  error.value = ''
  try {
    ticket.value = await getTicket(route.params.id)
  } catch (e) {
    ticket.value = null
    if (e.response?.status === 404) notFound.value = true
    else error.value = messageErreur(e)
  } finally {
    loading.value = false
  }
}
onMounted(charger)
watch(() => route.params.id, charger)

// Quitte le mode édition et retire ?modifier=1 de l'URL (sinon un refresh rouvrirait le formulaire)
function quitterEdition() {
  editing.value = false
  if (route.query.modifier) router.replace({ query: {} })
}

async function enregistrer(data) {
  if (saving.value) return
  saving.value = true
  actionError.value = ''
  try {
    ticket.value = await updateTicket(ticket.value.id, { ...ticket.value, ...data }) // PUT
    quitterEdition()
    notice.value = 'Modifications enregistrées.'
  } catch (e) {
    actionError.value = messageErreur(e)
  } finally {
    saving.value = false
  }
}

async function avancer() {
  const suivant = STATUT_SUIVANT[ticket.value.statut]
  if (!suivant || statutBusy.value) return
  statutBusy.value = true
  actionError.value = ''
  try {
    ticket.value = await patchTicket(ticket.value.id, { statut: suivant }) // PATCH
    notice.value = `Statut mis à jour : ${suivant}.`
  } catch (e) {
    actionError.value = messageErreur(e)
  } finally {
    statutBusy.value = false
  }
}

async function supprimer() {
  if (deleting.value) return
  deleting.value = true
  try {
    await deleteTicket(ticket.value.id)
    router.push('/tickets')
  } catch (e) {
    actionError.value = messageErreur(e)
    showDelete.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <section>
    <RouterLink class="retour" to="/tickets">← Retour à la liste</RouterLink>

    <p v-if="loading" class="message" role="status">Chargement…</p>

    <div v-else-if="notFound" class="message erreur" role="alert">
      <h2>Ticket introuvable</h2>
      <p>Aucun ticket ne porte l'identifiant « {{ route.params.id }} » (erreur 404). Il a peut-être été supprimé.</p>
      <RouterLink class="btn" to="/tickets">Voir tous les tickets</RouterLink>
    </div>

    <div v-else-if="error" class="message erreur" role="alert">
      <p><strong>Erreur :</strong> {{ error }}</p>
      <button type="button" class="btn" @click="charger">Réessayer</button>
    </div>

    <article v-else-if="ticket" class="carte">
      <h2>{{ editing ? 'Modifier le ticket' : 'Détail du ticket' }}</h2>
      <p v-if="notice" class="message succes" role="status">{{ notice }}</p>
      <p v-if="actionError" class="message erreur" role="alert"><strong>Erreur :</strong> {{ actionError }}</p>

      <TicketForm v-if="editing" :initial="ticket" :saving="saving"
        submit-label="Enregistrer les modifications" @submit="enregistrer" @cancel="quitterEdition" />

      <template v-else>
        <dl>
          <dt>Identifiant</dt><dd>{{ ticket.id }}</dd>
          <dt>Titre</dt><dd>{{ ticket.titre }}</dd>
          <dt>Description</dt><dd>{{ ticket.description }}</dd>
          <dt>Demandeur</dt><dd>{{ ticket.demandeur }}</dd>
          <dt>Priorité</dt><dd><TicketBadge type="priorite" :value="ticket.priorite" /></dd>
          <dt>Statut</dt><dd><TicketBadge type="statut" :value="ticket.statut" /></dd>
          <dt>Date de création</dt><dd>{{ formaterDate(ticket.dateCreation) }}</dd>
        </dl>
        <div class="actions">
          <button type="button" class="btn" @click="editing = true; notice = ''">Modifier</button>
          <button v-if="STATUT_SUIVANT[ticket.statut]" type="button" class="btn secondaire"
            :disabled="statutBusy" @click="avancer">Passer à « {{ STATUT_SUIVANT[ticket.statut] }} »</button>
          <button type="button" class="btn danger" @click="showDelete = true">Supprimer</button>
        </div>
      </template>
    </article>

    <ConfirmDialog :open="showDelete" titre="Supprimer ce ticket ?"
      :message="`Le ticket « ${ticket?.titre ?? ''} » sera supprimé définitivement.`"
      :busy="deleting" @confirm="supprimer" @cancel="showDelete = false" />
  </section>
</template>

<style scoped>
.retour { display: inline-block; margin-bottom: .75rem; }
.carte { background: var(--surface); border: 1px solid var(--bordure); border-radius: 8px; padding: 1.25rem; }
h2 { margin: 0 0 1rem; font-size: 1.3rem; }
dl { display: grid; grid-template-columns: 160px 1fr; gap: .6rem 1rem; margin: 0 0 1.25rem; }
dt { font-weight: 600; color: var(--texte-doux); }
dd { margin: 0; }
.actions { display: flex; flex-wrap: wrap; gap: .75rem; }
@media (max-width: 520px) { dl { grid-template-columns: 1fr; gap: 0; } dd { margin-bottom: .6rem; } }
</style>
