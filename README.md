# Salute e Fede

Sito web e-commerce per la vendita di pacchetti dieta con pannello di amministrazione.

## Stack Tecnologico

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Autenticazione**: Supabase Auth
- **Pagamenti**: Stripe
- **Storage**: Supabase Storage

## Struttura Progetto

```
salute-e-fede/
├── client/          # Frontend React
├── server/          # Backend Node.js
└── database/        # Schema SQL
```

## Setup

### 1. Configurare Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Vai su SQL Editor ed esegui lo script `database/schema.sql`
3. Copia URL e chiavi API dal pannello Settings > API

### 2. Configurare Stripe

1. Crea un account su [Stripe](https://stripe.com)
2. Ottieni le chiavi API dal Dashboard
3. Per i test usa le chiavi che iniziano con `pk_test_` e `sk_test_`

### 3. Configurare le variabili d'ambiente

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**Server** (`server/.env`):
```
PORT=3001
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 4. Installare le dipendenze

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 5. Avviare l'applicazione

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`

## Pagine

### Pubbliche
- `/` - Home page
- `/pacchetti` - Catalogo pacchetti
- `/pacchetti/:slug` - Dettaglio pacchetto
- `/chi-siamo` - Chi siamo
- `/contatti` - Contatti

### Admin
- `/admin/login` - Login amministratore
- `/admin` - Dashboard
- `/admin/pacchetti` - Gestione pacchetti
- `/admin/ordini` - Gestione ordini
- `/admin/testimonianze` - Gestione testimonianze

## Primo Accesso Admin

1. Aggiungi il tuo email come admin nel database:
```sql
INSERT INTO admin_users (email) VALUES ('tua@email.com');
```

2. Crea un account con quella email su Supabase Auth
3. Accedi a `/admin/login`

## Test Pagamenti

Usa queste carte di test Stripe:
- **Pagamento riuscito**: 4242 4242 4242 4242
- **Pagamento rifiutato**: 4000 0000 0000 0002

Data scadenza: qualsiasi data futura
CVC: qualsiasi 3 cifre

## Produzione

Per il deploy in produzione:
1. Configura le variabili d'ambiente con le chiavi live
2. Configura il webhook Stripe per ricevere gli eventi
3. Imposta CORS per il dominio di produzione
