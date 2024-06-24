document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservaForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const tipoQuarto = document.getElementById('tipoQuarto').value;
    const data = document.getElementById('data').value;

    // Salvar os dados no IndexedDB
    saveReservation({ nomeCompleto, tipoQuarto, data });

    // Redirecionar para o WhatsApp
    redirectToWhatsApp(nomeCompleto, tipoQuarto, data);
  });
});

function saveReservation(reservation) {
  const request = indexedDB.open('hotelDB', 1);

  request.onerror = (event) => {
    console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('nomeCompleto', 'nomeCompleto', { unique: false });
    objectStore.createIndex('tipoQuarto', 'tipoQuarto', { unique: false });
    objectStore.createIndex('data', 'data', { unique: false });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['reservations'], 'readwrite');
    const objectStore = transaction.objectStore('reservations');
    objectStore.add(reservation);

    transaction.oncomplete = () => {
      console.log('Reserva salva com sucesso!');
    };

    transaction.onerror = (event) => {
      console.log('Erro ao salvar a reserva:', event.target.errorCode);
    };
  };
}

function redirectToWhatsApp(nomeCompleto, tipoQuarto, data) {
  const message = `Reserva feita com sucesso!\n\nNome: ${nomeCompleto}\nQuarto: ${tipoQuarto}\nData de Chegada: ${data}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.location.href = whatsappUrl;
}
