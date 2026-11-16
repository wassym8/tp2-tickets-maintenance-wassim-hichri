<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTickets, patchTicket, deleteTicket } from '../services/ticketService'
import { STATUTS, PRIORITES, STATUT_SUIVANT, messageErreur, formaterDate } from '../utils'
import TicketBadge from './TicketBadge.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const tickets = ref([])
const loading = ref(true)
const error = ref('')
const actionError = ref('')
const notice = ref('')
const recherche = ref('')
const filtreStatut = ref('')
const filtrePriorite = ref('')
const busyId = ref(null)
const aSupprimer = ref(null)
const deleting = ref(false)

async function charger() {
  loading.value = true
  error.value = ''
  try {
    tickets.value = await getTickets()
  } catch (e) {
    error.value = messageErreur(e)
  } finally {
    loading.value = false
  }
}
onMounted(charger)

// Recherche + filtres (TP1)
const ticketsFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase()
  return tickets.value.filter((t) =>
    (!terme || t.titre.toLowerCase().includes(terme)) &&
    (!filtreStatut.value || t.statut === filtreStatut.value) &&
    (!filtrePriorite.value || t.priorite === filtrePriorite.value))
})
const nombreVisibles = computed(() => ticketsFiltres.value.length)

function reinitialiser() {
  recherche.value = ''
  filtreStatut.value = ''
  filtrePriorite.value = ''
}

// Changement rapide de statut : PATCH puis mise à jour de la ligne, sans recharger la page
async function avancer(t) {
  const suivant = STATUT_SUIVANT[t.statut]
  if (!suivant || busyId.value) return
  busyId.value = t.id
  actionError.value = ''
  notice.value = ''
  try {
    const maj = await patchTicket(t.id, { statut: suivant })
    const i = tickets.value.findIndex((x) => x.id === t.id)
    if (i !== -1) tickets.value[i] = maj
    notice.value = `Statut de « ${t.titre} » : ${suivant}.`
  } catch (e) {
    actionError.value = messageErreur(e)
  } finally {
    busyId.value = null
  }
}

// Suppression après confirmation
async function confirmerSuppression() {
  const t = aSupprimer.value
  if (!t || deleting.value) return
  deleting.value = true
  actionError.value = ''
  notice.value = ''
  try {
    await deleteTicket(t.id)
    tickets.value = tickets.value.filter((x) => x.id !== t.id)
    notice.value = `Ticket « ${t.titre} » supprimé.`
  } catch (e) {
    actionError.value = messageErreur(e)
  } finally {
    deleting.value = false
    aSupprimer.value = null
  }
}
</script>

<template>
  <section aria-labelledby="titre-liste">
    <div class="titre-ligne">
      <h2 id="titre-liste">Liste des tickets</h2>
      <RouterLink class="btn" to="/tickets/nouveau">Nouveau ticket</RouterLink>
    </div>

    <p v-if="loading" class="message" role="status">Chargement…</p>

    <div v-else-if="error" class="message erreur" role="alert">
      <p><strong>Erreur :</strong> {{ error }}</p>
      <button type="button" class="btn" @click="charger">Réessayer</button>
    </div>

    <template v-else>
      <p v-if="notice" class="message succes" role="status">{{ notice }}</p>
      <p v-if="actionError" class="message erreur" role="alert"><strong>Erreur :</strong> {{ actionError }}</p>

      <form class="filtres" @submit.prevent>
        <div class="champ champ-recherche">
          <label for="recherche">Rechercher par titre</label>
          <input id="recherche" v-model="recherche" type="search" placeholder="Ex. : imprimante" />
        </div>
        <div class="champ">
          <label for="statut">Statut</label>
          <select id="statut" v-model="filtreStatut">
            <option value="">Tous</option>
            <option v-for="s in STATUTS" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="champ">
          <label for="priorite">Priorité</label>
          <select id="priorite" v-model="filtrePriorite">
            <option value="">Toutes</option>
            <option v-for="p in PRIORITES" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <button type="button" class="btn secondaire" @click="reinitialiser">Réinitialiser</button>
      </form>

      <p class="compteur" aria-live="polite">
        {{ nombreVisibles }} ticket{{ nombreVisibles > 1 ? 's' : '' }} affiché{{ nombreVisibles > 1 ? 's' : '' }}
        sur {{ tickets.length }}
      </p>

      <div v-if="nombreVisibles === 0" class="message">
        <p>Aucun ticket ne correspond à votre recherche.</p>
        <button type="button" class="btn secondaire" @click="reinitialiser">Effacer les filtres</button>
      </div>

      <div v-else class="tableau-wrap">
        <table>
          <caption class="sr-only">Tickets de maintenance</caption>
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col">Demandeur</th>
              <th scope="col">Priorité</th>
              <th scope="col">Statut</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in ticketsFiltres" :key="t.id">
              <td>
                <RouterLink class="lien-titre" :to="{ name: 'detail', params: { id: t.id } }">{{ t.titre }}</RouterLink>
                <span class="desc">{{ t.description }}</span>
              </td>
              <td>{{ t.demandeur }}</td>
              <td><TicketBadge type="priorite" :value="t.priorite" /></td>
              <td><TicketBadge type="statut" :value="t.statut" /></td>
              <td>{{ formaterDate(t.dateCreation) }}</td>
              <td class="actions">
                <button v-if="STATUT_SUIVANT[t.statut]" type="button" class="btn secondaire petit"
                  :disabled="busyId === t.id" @click="avancer(t)">Passer à « {{ STATUT_SUIVANT[t.statut] }} »</button>
                <RouterLink class="btn secondaire petit" :aria-label="`Modifier le ticket ${t.titre}`"
                  :to="{ name: 'detail', params: { id: t.id }, query: { modifier: '1' } }">Modifier</RouterLink>
                <button type="button" class="btn danger petit" :aria-label="`Supprimer le ticket ${t.titre}`"
                  @click="aSupprimer = t">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <ConfirmDialog :open="!!aSupprimer" titre="Supprimer ce ticket ?"
      :message="`Le ticket « ${aSupprimer?.titre ?? ''} » sera supprimé définitivement.`"
      :busy="deleting" @confirm="confirmerSuppression" @cancel="aSupprimer = null" />
  </section>
</template>

<style scoped>
.titre-ligne { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.titre-ligne h2 { margin: 0; font-size: 1.3rem; }
.filtres { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; padding: 1rem;
  background: var(--surface); border: 1px solid var(--bordure); border-radius: 8px; }
.champ { display: flex; flex-direction: column; gap: .25rem; }
.champ-recherche { flex: 1 1 220px; }
label { font-size: .875rem; font-weight: 600; }
.compteur { margin: 1rem 0 .5rem; color: var(--texte-doux); }
.tableau-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--bordure); border-radius: 8px; }
table { width: 100%; border-collapse: collapse; min-width: 860px; }
th, td { text-align: left; padding: .75rem 1rem; vertical-align: top; }
thead th { background: #e8efee; font-size: .875rem; }
tbody tr + tr td { border-top: 1px solid var(--bordure); }
.lien-titre { font-weight: 700; }
.desc { display: block; font-size: .875rem; color: var(--texte-doux); }
.actions { display: flex; flex-wrap: wrap; gap: .4rem; }
</style>
