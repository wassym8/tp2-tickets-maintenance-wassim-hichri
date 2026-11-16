# TP2 — Tickets de maintenance : CRUD, navigation et suivi (Vue.js 3)

**Identité :** Wassim Hichri — Groupe : …

## Prérequis
- Node.js (≥ 18) et npm
- Git

## Installation
```bash
npm install
```

## Lancement (deux terminaux, à garder actifs)
```bash
# Terminal 1 : API simulée sur http://localhost:3000/tickets
npx json-server db.json --port 3000

# Terminal 2 : application Vue
npm run dev
```
Ouvrir ensuite http://localhost:5173.

## Fonctionnalités réalisées
- **Création** (`POST /tickets`) via `/tickets/nouveau` : statut « Ouvert » par défaut, date de création = date du jour.
- **Validation** des champs obligatoires (titre, description, demandeur) : messages sous chaque champ, envoi impossible tant que le formulaire est invalide.
- **Modification** (`PUT /tickets/:id`) depuis la page détail ou le bouton « Modifier » de la liste.
- **Suppression** (`DELETE /tickets/:id`) avec boîte de confirmation (`<dialog>` natif, accessible au clavier, Échap pour annuler).
- **Changement rapide de statut** (`PATCH /tickets/:id`) : Ouvert → En cours → Résolu → Fermé, depuis la liste ou la page détail.
- **Interface actualisée sans rechargement** après chaque opération.
- **Vue Router** : `/tickets` (liste), `/tickets/nouveau` (création), `/tickets/:id` (détail / édition), lien de retour, message 404 si l'identifiant n'existe pas.
- **Robustesse** : `async/await` + `try/catch` pour chaque appel réseau, messages d'erreur non bloquants, bouton d'envoi désactivé pendant l'enregistrement.
- **Recherche et filtres** du TP1 conservés.
- Service `src/services/ticketService.js` : `getTickets`, `getTicket`, `createTicket`, `updateTicket`, `patchTicket`, `deleteTicket`.

## Captures
Voir le dossier `captures/` (01 à 07).

## Réponses aux questions

**Différence entre POST, PUT et PATCH ?**
`POST` crée une nouvelle ressource (le serveur attribue l'identifiant). `PUT` remplace entièrement une ressource existante : il faut renvoyer tous ses champs. `PATCH` modifie partiellement une ressource : on n'envoie que les champs à changer (ex. `{ "statut": "En cours" }`).

**Pourquoi une confirmation avant DELETE ?**
La suppression est irréversible : un clic accidentel ferait perdre des données. La boîte de confirmation laisse à l'utilisateur le temps de vérifier le ticket concerné et d'annuler.

**Quel est le rôle de Vue Router ?**
Il associe des URL à des composants (liste, création, détail) sans recharger la page : l'application garde une navigation de type « multi-pages » tout en restant une SPA. Il fournit aussi les paramètres d'URL (`/tickets/:id`), les liens (`RouterLink`), la navigation par code (`router.push`) et l'historique du navigateur.

**Comment éviter les doublons lors de l'enregistrement ?**
Un indicateur `saving` désactive le bouton de soumission pendant la requête et la fonction ignore tout nouvel appel tant qu'elle n'est pas terminée. On attend la réponse (`await`) puis on redirige vers la liste, ce qui empêche de renvoyer le même formulaire.

## Difficultés rencontrées
- … (à compléter)
"# description-website" 
"# description-website" 
