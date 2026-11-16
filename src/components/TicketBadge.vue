<script setup>
import { computed } from 'vue'

const props = defineProps({ type: String, value: String })

// Couleur + symbole + texte : l'information ne repose pas sur la couleur seule
const MAP = {
  priorite: { Haute: ['haute', '▲'], Moyenne: ['moyenne', '■'], Basse: ['basse', '▼'] },
  statut: { Ouvert: ['ouvert', '○'], 'En cours': ['encours', '◆'], 'Résolu': ['resolu', '●'], 'Fermé': ['ferme', '×'] },
}
const info = computed(() => MAP[props.type]?.[props.value] ?? ['', ''])
</script>

<template>
  <span class="badge" :class="info[0]"><span aria-hidden="true">{{ info[1] }}</span> {{ value }}</span>
</template>

<style scoped>
.badge { display: inline-block; padding: .15rem .6rem; border-radius: 999px; font-size: .85rem;
  font-weight: 600; border: 1px solid; white-space: nowrap; }
.haute   { background: #fde7e4; color: #8c1d14; border-color: #b3261e; }
.moyenne { background: #fff1cc; color: #6b4a00; border-color: #b07a00; }
.basse   { background: #e3f1e5; color: #1d5a2a; border-color: #2e7d3f; }
.ouvert  { background: #e3edfb; color: #164a8a; border-color: #2a65b8; }
.encours { background: #efe6fa; color: #4a2a82; border-color: #6d44b0; }
.resolu  { background: #e6ebea; color: #35504d; border-color: #5f7a77; }
.ferme   { background: #3a4a48; color: #fff; border-color: #3a4a48; }
</style>
