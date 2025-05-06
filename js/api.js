/**
 * API Service per Open Library
 * Gestisce tutte le chiamate alle API di Open Library
 */

// Base URL per le API di Open Library
const BASE_URL = 'https://openlibrary.org';

/**
 * Recupera i libri per categoria
 * @param {string} category - La categoria da cercare
 * @returns {Promise} - Promise con i dati dei libri
 */
export const fetchBooksByCategory = async (category) => {
  try {
    if (!category) {
      throw new Error('Categoria non specificata');
    }
    
    // Sanitizziamo la categoria per evitare problemi con caratteri speciali
    const sanitizedCategory = encodeURIComponent(category.trim().toLowerCase());
    
    // URL per la ricerca di libri per categoria - aggiungiamo il limit per ottenere più risultati
    const url = `${BASE_URL}/subjects/${sanitizedCategory}.json?limit=100`;
    
    console.log('Fetching books from URL:', url);
    
    try {
      // Eseguiamo la chiamata API senza timeout (rimuoviamo AbortController)
      const response = await fetch(url, { 
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Verifichiamo se la risposta è ok
      if (!response.ok) {
        throw new Error(`Errore nella ricerca: ${response.status}`);
      }
      
      // Convertiamo la risposta in JSON
      const data = await response.json();
      console.log('API response:', data);
      
      // Restituiamo i dati
      return data;
    } catch (error) {
      console.error('Errore durante il recupero dei libri:', error);
      throw error;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei libri:', error);
    throw error;
  }
};

/**
 * Recupera i dettagli di un libro specifico
 * @param {string} workKey - La chiave del libro (es. /works/OL1234W)
 * @returns {Promise} - Promise con i dettagli del libro
 */
export const fetchBookDetails = async (workKey) => {
  try {
    if (!workKey) {
      throw new Error('Chiave del libro non specificata');
    }
    
    // Se la chiave inizia con /works/ la usiamo direttamente, altrimenti la prefissiamo
    const key = workKey.startsWith('/works/') ? workKey : `/works/${workKey}`;
    
    // URL per i dettagli del libro
    const url = `${BASE_URL}${key}.json`;
    
    // Eseguiamo la chiamata API
    const response = await fetch(url);
    
    // Verifichiamo se la risposta è ok
    if (!response.ok) {
      throw new Error(`Errore nel recupero dei dettagli: ${response.status}`);
    }
    
    // Convertiamo la risposta in JSON
    const data = await response.json();
    
    // Restituiamo i dati
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del libro:', error);
    throw error;
  }
};

/**
 * Recupera l'URL dell'immagine della copertina di un libro
 * @param {string} coverId - ID della copertina
 * @param {string} size - Dimensione della copertina (S, M, L)
 * @returns {string} - URL dell'immagine
 */
export const getBookCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  
  // Verifichiamo che la dimensione sia valida
  const validSizes = ['S', 'M', 'L'];
  const coverSize = validSizes.includes(size) ? size : 'M';
  
  // Restituiamo l'URL della copertina
  return `https://covers.openlibrary.org/b/id/${coverId}-${coverSize}.jpg`;
};

/**
 * Recupera libri recenti o di tendenza per la homepage
 * @param {number} limit - Numero massimo di libri da recuperare
 * @returns {Promise} - Promise con i dati dei libri
 */
export const fetchTrendingBooks = async (limit = 100) => {
  try {
    // Utilizziamo alcune categorie popolari per ottenere una selezione varia di libri
    const popularCategories = [
      'fiction', 'fantasy', 'science', 'history', 
      'biography', 'romance', 'mystery', 'thriller'
    ];
    
    // Scegliamo una categoria casuale per variare i risultati
    const randomCategory = popularCategories[Math.floor(Math.random() * popularCategories.length)];
    
    console.log('Fetching trending books from category:', randomCategory);
    
    // Utilizziamo l'API di categoria per ottenere libri recenti
    const url = `${BASE_URL}/subjects/${randomCategory}.json?limit=${limit}`;
    
    try {
      // Eseguiamo la chiamata API senza timeout (rimuoviamo AbortController)
      const response = await fetch(url, { 
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Verifichiamo se la risposta è ok
      if (!response.ok) {
        throw new Error(`Errore nel recupero dei libri in tendenza: ${response.status}`);
      }
      
      // Convertiamo la risposta in JSON
      const data = await response.json();
      console.log('Trending books response:', data);
      
      return data;
    } catch (error) {
      console.error('Errore durante il recupero dei libri in tendenza:', error);
      throw error;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei libri in tendenza:', error);
    throw error;
  }
};
