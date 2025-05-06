/**
 * App principale di Owly
 * Gestisce l'interazione utente e l'interfaccia
 */
import { fetchBooksByCategory, fetchBookDetails, getBookCoverUrl, fetchTrendingBooks } from './api.js';
import '../css/style.css';

// Variabili globali
let bookModal;

// Configurazione paginazione
const BOOKS_PER_PAGE = 12;
let currentPage = 1;
let totalPages = 1;
let allBooks = [];

// Elementi DOM (saranno inizializzati in initApp)
let searchInput;
let searchButton;
let booksContainer;
let loadingIndicator;
let noResultsMessage;
let bookDetails;
let bookModalLabel;
let paginationControls;
let prevPageButton;
let nextPageButton;
let currentPageSpan;
let paginationInfo;

/**
 * Inizializza l'applicazione e i listener degli eventi
 */
function initApp() {
  // Inizializza gli elementi DOM
  searchInput = document.getElementById('search-input');
  searchButton = document.getElementById('search-button');
  booksContainer = document.getElementById('books-container');
  loadingIndicator = document.getElementById('loading');
  noResultsMessage = document.getElementById('no-results');
  const bookModalElement = document.getElementById('book-modal');
  bookDetails = document.getElementById('book-details');
  bookModalLabel = document.getElementById('book-modal-label');
  
  // Elementi di paginazione
  paginationControls = document.getElementById('pagination-controls');
  prevPageButton = document.getElementById('prev-page');
  nextPageButton = document.getElementById('next-page');
  currentPageSpan = document.getElementById('current-page');
  paginationInfo = document.getElementById('pagination-info');
  
  // Inizializza il modal di Bootstrap
  if (typeof bootstrap !== 'undefined') {
    bookModal = new bootstrap.Modal(bookModalElement);
  } else {
    console.error('Bootstrap non è stato caricato correttamente!');
  }
  
  // Event listener per il pulsante di ricerca
  searchButton.addEventListener('click', handleSearch);
  
  // Event listener per il tasto Enter nella casella di ricerca
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });
  
  // Event listeners per i controlli di paginazione
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });
  
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });
  
  // Carica i libri in tendenza per la homepage
  loadTrendingBooks();
}

/**
 * Carica i libri in tendenza per la homepage
 */
async function loadTrendingBooks() {
  // Mostra l'indicatore di caricamento
  showLoading(true);
  
  try {
    // Recupera i libri in tendenza
    const data = await fetchTrendingBooks();
    
    // Verifica se ci sono libri
    if (data && data.works && data.works.length > 0) {
      // Salva tutti i libri
      allBooks = data.works;
      
      // Calcola il numero totale di pagine
      totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
      
      // Aggiorna l'interfaccia di paginazione
      updatePaginationUI();
      
      // Mostra i libri della prima pagina
      displayBooks(getPaginatedBooks(), 'Libri in evidenza');
    } else {
      // Se non ci sono libri, mostra un messaggio
      showNoResults(true, 'Nessun libro disponibile al momento. Prova a cercare un titolo o una categoria.');
    }
  } catch (error) {
    showErrorMessage(`Errore durante il caricamento dei libri: ${error.message}`);
  } finally {
    // Nascondi l'indicatore di caricamento
    showLoading(false);
  }
}

/**
 * Gestisce la ricerca dei libri
 */
async function handleSearch() {
  const query = searchInput.value.trim();
  
  if (!query) {
    // Se la query è vuota, carica i libri in tendenza
    loadTrendingBooks();
    return;
  }
  
  // Mostra l'indicatore di caricamento
  showLoading(true);
  
  // Nascondi i controlli di paginazione durante la ricerca
  paginationControls.classList.add('d-none');
  
  // Resetta lo stato della paginazione
  currentPage = 1;
  
  try {
    // Recupera i libri per categoria
    const data = await fetchBooksByCategory(query);
    
    // Verifica se ci sono libri
    if (data && data.works && data.works.length > 0) {
      // Salva tutti i libri
      allBooks = data.works;
      
      // Calcola il numero totale di pagine
      totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
      
      // Aggiorna l'interfaccia di paginazione
      updatePaginationUI();
      
      // Mostra i libri della prima pagina con il titolo della ricerca
      displayBooks(getPaginatedBooks(), `Risultati per "${query}"`);
    } else {
      // Mostra il messaggio di nessun risultato
      showNoResults(true, `Nessun risultato trovato per "${query}". Prova con un'altra categoria o titolo.`);
    }
  } catch (error) {
    showErrorMessage(`Errore durante la ricerca: ${error.message}`);
  } finally {
    // Nascondi l'indicatore di caricamento
    showLoading(false);
  }
}

/**
 * Restituisce i libri per la pagina corrente
 * @returns {Array} - Array di libri da visualizzare
 */
function getPaginatedBooks() {
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, allBooks.length);
  return allBooks.slice(startIndex, endIndex);
}

/**
 * Naviga a una pagina specifica
 * @param {number} page - Numero di pagina
 */
function goToPage(page) {
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  updatePaginationUI();
  displayBooks(getPaginatedBooks());
  
  // Scorri in alto per mostrare i nuovi risultati
  window.scrollTo({
    top: document.getElementById('search-input').offsetTop - 20,
    behavior: 'smooth'
  });
}

/**
 * Aggiorna l'interfaccia di paginazione
 */
function updatePaginationUI() {
  // Aggiorna il numero di pagina corrente
  currentPageSpan.textContent = currentPage.toString();
  
  // Aggiorna le informazioni di paginazione
  paginationInfo.textContent = `Pagina ${currentPage} di ${totalPages}`;
  
  // Aggiorna lo stato dei pulsanti
  prevPageButton.classList.toggle('disabled', currentPage <= 1);
  nextPageButton.classList.toggle('disabled', currentPage >= totalPages);
  
  // Mostra i controlli di paginazione se ci sono più pagine
  paginationControls.classList.toggle('d-none', totalPages <= 1);
}

/**
 * Mostra i libri nella UI
 * @param {Array} books - Array di libri da visualizzare
 * @param {string} sectionTitle - Titolo della sezione (es. "Risultati per fantasy")
 */
function displayBooks(books, sectionTitle = '') {
  // Pulisci il contenitore
  booksContainer.innerHTML = '';
  
  // Nascondi il messaggio di nessun risultato
  showNoResults(false);
  
  // Aggiungi il titolo della sezione se presente
  if (sectionTitle) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'col-12 mb-4';
    titleDiv.innerHTML = `<h3 class="fw-light">${sectionTitle}</h3>`;
    booksContainer.appendChild(titleDiv);
  }
  
  // Crea le card per ogni libro
  books.forEach(book => {
    const bookCard = createBookCard(book);
    booksContainer.appendChild(bookCard);
  });
  
  // Mostra il conteggio dei risultati
  const totalResults = allBooks.length;
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + books.length - 1, totalResults);
  
  // Aggiungi un elemento di riepilogo prima della paginazione
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'col-12 text-center mt-4';
  summaryDiv.innerHTML = `
    <p class="text-muted">
      Visualizzazione risultati ${startIndex}-${endIndex} di ${totalResults}
    </p>
  `;
  booksContainer.appendChild(summaryDiv);
  
  // Animazione di fade-in
  booksContainer.classList.add('fadeIn');
}

/**
 * Crea una card per un libro
 * @param {Object} book - Dati del libro
 * @returns {HTMLElement} - Elemento DOM della card
 */
function createBookCard(book) {
  // Creiamo un elemento div per la card
  const cardCol = document.createElement('div');
  cardCol.className = 'col-md-4 col-lg-3 mb-4';
  
  // Recuperiamo i dati del libro
  const { title, authors, cover_id, key } = book;
  
  // Tronchiamo il titolo se è troppo lungo
  const shortTitle = title.length > 40 ? `${title.substring(0, 37)}...` : title;
  
  // Formattiamo gli autori
  const authorNames = authors ? authors.map(author => author.name).join(', ') : 'Autore sconosciuto';
  
  // Otteniamo l'URL della copertina
  const coverUrl = cover_id ? getBookCoverUrl(cover_id) : 'https://placehold.co/200x300/e9e9e9/7d7d7d?text=Nessuna+copertina';
  
  // Creiamo l'HTML della card
  cardCol.innerHTML = `
    <div class="card h-100 book-card">
      <img src="${coverUrl}" class="card-img-top" alt="${title}" style="height: 250px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title" title="${title}">${shortTitle}</h5>
        <p class="book-authors">${authorNames}</p>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-sm view-details w-100" data-key="${key}">
          <i class="bi bi-info-circle me-1"></i> Dettagli
        </button>
      </div>
    </div>
  `;
  
  // Aggiungiamo l'event listener per il pulsante di dettaglio
  const viewDetailsButton = cardCol.querySelector('.view-details');
  viewDetailsButton.addEventListener('click', () => {
    viewBookDetails(key);
  });
  
  return cardCol;
}

/**
 * Visualizza i dettagli di un libro
 * @param {string} bookKey - Chiave del libro
 */
async function viewBookDetails(bookKey) {
  // Mostra l'indicatore di caricamento nel modale
  bookDetails.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>
  `;
  
  // Mostra il modale
  bookModal.show();
  
  try {
    // Recupera i dettagli del libro
    const bookData = await fetchBookDetails(bookKey);
    console.log('Book details:', bookData);
    
    // Aggiorna il titolo del modale
    bookModalLabel.textContent = bookData.title || 'Dettagli del libro';
    
    // Formatta la descrizione
    let description = 'Nessuna descrizione disponibile.';
    if (bookData.description) {
      description = typeof bookData.description === 'string' 
        ? bookData.description 
        : bookData.description.value || 'Nessuna descrizione disponibile.';
    }
    
    // Ottieni l'URL della copertina
    const coverUrl = bookData.covers && bookData.covers.length > 0 
      ? getBookCoverUrl(bookData.covers[0], 'L') 
      : 'https://placehold.co/400x600/e9e9e9/7d7d7d?text=Nessuna+copertina';
    
    // Formatta i soggetti/generi
    const subjects = bookData.subjects ? bookData.subjects.slice(0, 10).join(', ') : 'Non disponibili';
    
    // Formatta i formati del libro disponibili
    let formats = 'Non disponibile';
    if (bookData.ebooks && bookData.ebooks.length > 0) {
      const formatsList = [];
      bookData.ebooks.forEach(ebook => {
        if (ebook.formats) {
          Object.keys(ebook.formats).forEach(format => {
            if (!formatsList.includes(format)) {
              formatsList.push(format);
            }
          });
        }
      });
      formats = formatsList.length > 0 ? formatsList.join(', ') : 'Solo formato cartaceo';
    }
    
    // Lingue disponibili
    let languages = 'Non disponibile';
    if (bookData.languages) {
      const languageNames = {
        'eng': 'Inglese',
        'ita': 'Italiano',
        'spa': 'Spagnolo',
        'fre': 'Francese',
        'ger': 'Tedesco',
        'rus': 'Russo',
        'chi': 'Cinese',
        'jpn': 'Giapponese',
        'por': 'Portoghese',
        'ara': 'Arabo'
      };
      
      const langCodes = Array.isArray(bookData.languages) 
        ? bookData.languages 
        : [bookData.language];
      
      if (langCodes && langCodes.length > 0) {
        const langNames = langCodes.map(lang => {
          const key = typeof lang === 'object' ? lang.key : lang;
          const code = key.split('/').pop().toLowerCase();
          return languageNames[code] || code;
        });
        languages = langNames.join(', ');
      }
    }
    
    // Estrattore di informazioni con gestione errori
    const getInfo = (obj, path, defaultValue = 'Non disponibile') => {
      try {
        const result = path.split('.').reduce((o, p) => o && o[p], obj);
        return result || defaultValue;
      } catch (e) {
        return defaultValue;
      }
    };
    
    // Edizione e anno di pubblicazione
    const publishYear = getInfo(bookData, 'first_publish_date', 'Data sconosciuta');
    const publisher = getInfo(bookData, 'publishers.0.name', 'Editore sconosciuto');
    
    // Aggiorna il contenuto del modale con le nuove informazioni
    bookDetails.innerHTML = `
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0">
          <img src="${coverUrl}" alt="${bookData.title}" class="book-cover w-100">
          
          <div class="mt-3">
            <div class="card">
              <div class="card-header bg-light">
                <h6 class="mb-0">Informazioni tecniche</h6>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex">
                  <span class="fw-bold me-2"><i class="bi bi-translate me-2"></i>Lingue:</span> 
                  <span class="ms-auto">${languages}</span>
                </li>
                <li class="list-group-item d-flex">
                  <span class="fw-bold me-2"><i class="bi bi-journal me-2"></i>Formato:</span> 
                  <span class="ms-auto">${formats}</span>
                </li>
                <li class="list-group-item d-flex">
                  <span class="fw-bold me-2"><i class="bi bi-calendar-event me-2"></i>Pubblicazione:</span> 
                  <span class="ms-auto">${publishYear}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <h4>${bookData.title}</h4>
          <p class="text-muted">${bookData.subtitle || ''}</p>
          
          <div class="mb-3">
            <span class="badge bg-primary">${languages.split(',')[0]}</span>
            ${subjects.split(',').slice(0, 3).map(subject => 
              `<span class="badge bg-secondary">${subject.trim()}</span>`
            ).join(' ')}
          </div>
          
          <h6 class="mt-4 mb-2 border-bottom pb-2">Descrizione</h6>
          <p>${description}</p>
          
          <h6 class="mt-4 mb-2 border-bottom pb-2">Genere e Categorie</h6>
          <p>${subjects}</p>
          
          <div class="mt-4">
            <a href="https://openlibrary.org${bookKey}" target="_blank" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-box-arrow-up-right me-1"></i> Vedi su Open Library
            </a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    // Mostra un messaggio di errore nel modale
    bookDetails.innerHTML = `
      <div class="alert alert-danger">
        Si è verificato un errore durante il recupero dei dettagli del libro: ${error.message}
      </div>
    `;
  }
}

/**
 * Mostra o nasconde l'indicatore di caricamento
 * @param {boolean} show - Indica se mostrare o nascondere
 */
function showLoading(show) {
  loadingIndicator.classList.toggle('d-none', !show);
}

/**
 * Mostra o nasconde il messaggio di nessun risultato
 * @param {boolean} show - Indica se mostrare o nascondere
 * @param {string} message - Messaggio personalizzato da visualizzare
 */
function showNoResults(show, message = 'Nessun risultato trovato. Prova con un\'altra categoria.') {
  noResultsMessage.classList.toggle('d-none', !show);
  if (show) {
    noResultsMessage.innerHTML = `<p class="lead">${message}</p>`;
    booksContainer.innerHTML = '';
  }
}

/**
 * Mostra un messaggio di errore
 * @param {string} message - Messaggio di errore
 */
function showErrorMessage(message) {
  // Crea un elemento di avviso
  const alertElement = document.createElement('div');
  alertElement.className = 'alert alert-danger alert-dismissible fade show';
  alertElement.setAttribute('role', 'alert');
  alertElement.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Chiudi"></button>
  `;
  
  // Inserisci l'avviso prima del contenitore dei libri
  booksContainer.parentNode.insertBefore(alertElement, booksContainer);
  
  // Rimuovi l'avviso dopo 5 secondi
  setTimeout(() => {
    alertElement.classList.remove('show');
    setTimeout(() => alertElement.remove(), 300);
  }, 5000);
}

// Inizializza l'app quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', initApp);
