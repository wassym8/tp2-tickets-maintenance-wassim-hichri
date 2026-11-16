import { createRouter, createWebHistory } from 'vue-router'
import TicketList from '../components/TicketList.vue'
import TicketNewView from '../views/TicketNewView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'liste', component: TicketList },
  // "nouveau" doit être déclaré AVANT ":id", sinon "nouveau" serait pris pour un identifiant
  { path: '/tickets/nouveau', name: 'nouveau', component: TicketNewView },
  { path: '/tickets/:id', name: 'detail', component: TicketDetailView },
  { path: '/:pathMatch(.*)*', redirect: '/tickets' },
]

export default createRouter({ history: createWebHistory(), routes })
