<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  open: Boolean,
  titre: String,
  message: String,
  confirmLabel: { type: String, default: 'Supprimer' },
  busy: Boolean,
})
const emit = defineEmits(['confirm', 'cancel'])
const dlg = ref(null)

// <dialog> natif : focus piégé, fermeture avec Échap, fond bloqué
watch(() => props.open, async (ouvert) => {
  await nextTick()
  if (ouvert && !dlg.value.open) dlg.value.showModal()
  if (!ouvert && dlg.value.open) dlg.value.close()
})
</script>

<template>
  <dialog ref="dlg" aria-labelledby="dlg-titre" @cancel.prevent="emit('cancel')">
    <h2 id="dlg-titre">{{ titre }}</h2>
    <p>{{ message }}</p>
    <div class="boutons">
      <button type="button" class="btn secondaire" :disabled="busy" @click="emit('cancel')">Annuler</button>
      <button type="button" class="btn danger plein" :disabled="busy" @click="emit('confirm')">
        {{ busy ? 'Suppression…' : confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
dialog { border: 1px solid var(--bordure); border-radius: 10px; padding: 1.5rem; width: calc(100% - 2rem);
  max-width: 440px; color: var(--texte); }
dialog::backdrop { background: rgba(20, 35, 33, .55); }
h2 { margin: 0 0 .5rem; font-size: 1.2rem; }
p { margin: 0; color: var(--texte-doux); }
.boutons { display: flex; gap: .75rem; justify-content: flex-end; margin-top: 1.25rem; }
</style>
