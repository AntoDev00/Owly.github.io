# Owly - Esplora il Mondo dei Libri

![Owly Logo](https://img.shields.io/badge/Owly-Book%20Discovery-4e73df)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

## 📖 Descrizione

**Owly** è un'applicazione web interattiva che incentiva la lettura dei libri integrando il servizio Open Library API. L'applicazione permette agli utenti di cercare libri per categoria e visualizzarne i dettagli in modo semplice e intuitivo.

### [Prova l'applicazione](https://antodev00.github.io/Owly.github.io/) 🚀

## 🌟 Caratteristiche

- **Ricerca per Categoria**: Trova libri filtrando per categorie come fantasy, science, history, ecc.
- **Visualizzazione Dettagli**: Esplora informazioni dettagliate su ogni libro
- **Interfaccia Intuitiva**: Design moderno e responsive con Bootstrap 5
- **Integrazione Completa**: Utilizza le API di Open Library per accedere a un vasto catalogo di libri

## 🛠️ Tecnologie Utilizzate

- **JavaScript (ES6+)**: Linguaggio di programmazione principale
- **Bootstrap 5**: Framework CSS per l'interfaccia utente
- **Webpack**: Bundler per gestire le dipendenze e il build
- **Open Library API**: Servizio esterno per i dati sui libri

## 🚀 Installazione e Avvio

### Prerequisiti

- Node.js (versione 14.x o superiore)
- npm (versione 6.x o superiore)

### Passaggi per l'Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/yourusername/owly.github.io.git
   cd owly.github.io
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm start
   ```

4. Apri il browser e vai a `http://localhost:9000`

### Build per la Produzione

Per creare una build ottimizzata per la produzione:

```bash
npm run build
```


## 🧠 Architettura del Progetto

```
owly.github.io/
├── src/                  # Codice sorgente
│   ├── css/              # File CSS
│   │   └── style.css     # Stili personalizzati
│   ├── js/               # Script JavaScript
│   │   ├── api.js        # Servizio per le chiamate API
│   │   └── app.js        # Logica principale dell'applicazione
│   ├── img/              # Immagini e risorse
│   └── index.html        # Layout HTML principale
├── .env                  # Variabili d'ambiente
├── .gitignore            # File ignorati da Git
├── package.json          # Dipendenze e script npm
├── webpack.config.js     # Configurazione webpack
└── README.md             # Documentazione del progetto
```

*Nota: La cartella `dist/` (contenente i file compilati) viene generata automaticamente quando si esegue il comando `npm run build` e non è inclusa nel repository.*

## 🔍 API Utilizzate

L'applicazione utilizza le seguenti API di Open Library:

- **Ricerca per Categoria**: `https://openlibrary.org/subjects/{category}.json`
- **Dettagli del Libro**: `https://openlibrary.org/works/{key}.json`
- **Copertine dei Libri**: `https://covers.openlibrary.org/b/id/{id}-{size}.jpg`

## 🌱 Chi Siamo

Owly è una piattaforma SaaS nel settore education, sviluppata da un team di esperti con l'obiettivo di affiancare i programmi scolastici delle scuole primarie, fornendo strumenti utili per consolidare le basi dell'apprendimento.

### Vision
📚 Migliorare l'istruzione nelle scuole primarie, rendendola più efficace e accessibile.

### Mission
Supportare bambini e insegnanti nell'apprendimento quotidiano, sia in classe che a distanza, attraverso un sistema interattivo, aggiornato e condiviso.

## 📝 Licenza

Questo progetto è distribuito con licenza MIT. Vedere il file `LICENSE` per ulteriori informazioni.

## 📞 Contatti

Per domande o suggerimenti, non esitare a contattarci:

- **Email**: aabbruzzeselive@gmail.com
- **GitHub**: [Owly GitHub](https://github.com/AntoDev00)
- **Website**: [Owly.com](https://antodev00.github.io/Owly.github.io/)

---

&copy; 2025 Owly - Sviluppato con ❤️ per migliorare l'istruzione
