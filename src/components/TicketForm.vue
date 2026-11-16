<script setup>
import { reactive } from 'vue'
import { PRIORITES, STATUTS } from '../utils'

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
  saving: Boolean,
  submitLabel: { type: String, default: 'Enregistrer' },
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  titre: props.initial.titre ?? '',
  description: props.initial.description ?? '',
  demandeur: props.initial.demandeur ?? '',
  priorite: props.initial.priorite ?? 'Moyenne',
  statut: props.initial.statut ?? 'Ouvert',
})
const errors = reactive({ titre: '', description: '', demandeur: '' })

function valider() {
  errors.titre = form.titre.trim() ? '' : 'Le titre est obligatoire.'
  errors.description = form.description.trim() ? '' : 'La description est obligatoire.'
  errors.demandeur = form.demandeur.trim() ? '' : 'Le demandeur est obligatoire.'
  return !errors.titre && !errors.description && !errors.demandeur
}

function envoyer() {
  if (props.saving) return // protège contre les doubles envois
  if (!valider()) {
    const premier = ['titre', 'description', 'demandeur'].find((c) => errors[c])
    document.getElementById(`f-${premier}`)?.focus()
    return
  }
  emit('submit', {
    titre: form.titre.trim(),
    description: form.description.trim(),
    demandeur: form.demandeur.trim(),
    priorite: form.priorite,
    statut: form.statut,
  })
}
</script>

<template>
  <!-- novalidate : on affiche nos propres messages au lieu de ceux du navigateur -->
  <form class="form" novalidate @submit.prevent="envoyer">
    <div class="champ">
      <label for="f-titre">Titre *</label>
      <input id="f-titre" v-model="form.titre" type="text" maxlength="120"
        :aria-invalid="!!errors.titre" :aria-describedby="errors.titre ? 'e-titre' : undefined"
        @input="errors.titre = ''" />
      <p v-if="errors.titre" id="e-titre" class="champ-erreur" role="alert">{{ errors.titre }}</p>
    </div>

    <div class="champ">
      <label for="f-description">Description *</label>
      <textarea id="f-description" v-model="form.description" rows="4"
        :aria-invalid="!!errors.description" :aria-describedby="errors.description ? 'e-description' : undefined"
        @input="errors.description = ''"></textarea>
      <p v-if="errors.description" id="e-description" class="champ-erreur" role="alert">{{ errors.description }}</p>
    </div>

    <div class="champ">
      <label for="f-demandeur">Demandeur *</label>
      <input id="f-demandeur" v-model="form.demandeur" type="text" maxlength="80"
        :aria-invalid="!!errors.demandeur" :aria-describedby="errors.demandeur ? 'e-demandeur' : undefined"
        @input="errors.demandeur = ''" />
      <p v-if="errors.demandeur" id="e-demandeur" class="champ-erreur" role="alert">{{ errors.demandeur }}</p>
    </div>

    <div class="deux">
      <div class="champ">
        <label for="f-priorite">Priorité</label>
        <select id="f-priorite" v-model="form.priorite">
          <option v-for="p in PRIORITES" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="champ">
        <label for="f-statut">Statut</label>
        <select id="f-statut" v-model="form.statut">
          <option v-for="s in STATUTS" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <p class="aide">* Champs obligatoires</p>

    <div class="boutons">
      <button type="submit" class="btn" :disabled="saving">{{ saving ? 'Enregistrement…' : submitLabel }}</button>
      <button type="button" class="btn secondaire" :disabled="saving" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>

<style scoped>
.form { display: grid; gap: 1rem; }
.champ { display: flex; flex-direction: column; gap: .25rem; }
label { font-size: .875rem; font-weight: 600; }
.deux { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
input[aria-invalid='true'], textarea[aria-invalid='true'] { border-color: var(--danger); border-width: 2px; }
.champ-erreur { margin: 0; color: #7a1712; font-size: .875rem; font-weight: 600; }
.aide { margin: 0; font-size: .85rem; color: var(--texte-doux); }
.boutons { display: flex; gap: .75rem; }
@media (max-width: 520px) { .deux { grid-template-columns: 1fr; } }
</style>
