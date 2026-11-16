export const PRIORITES = ['Basse', 'Moyenne', 'Haute']
export const STATUTS = ['Ouvert', 'En cours', 'Résolu', 'Fermé']

// Étape suivante du cycle : Ouvert → En cours → Résolu → Fermé
export const STATUT_SUIVANT = { Ouvert: 'En cours', 'En cours': 'Résolu', 'Résolu': 'Fermé' }

export function messageErreur(e) {
  if (e.response?.status === 404) return 'Ticket introuvable (erreur 404).'
  if (e.response) return `Le serveur a répondu avec une erreur (code ${e.response.status}).`
  return "Impossible de joindre l'API. Vérifiez que JSON Server est démarré : npx json-server db.json --port 3000"
}

export function formaterDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR')
}
