document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buscarReservasForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nomeCompleto = document.getElementById('nomeCompletoBusca').value;
    buscarReservas(nomeCompleto);
  });
});

function buscarReservas(nomeCompleto) {
  const request = indexedDB.open('hotelDB', 1);

  request.onerror = (event) => {
    console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['reservations'], 'readonly');
    const objectStore = transaction.objectStore('reservations');
    const index = objectStore.index('nomeCompleto');
    const query = index.getAll(nomeCompleto);

    query.onsuccess = () => {
      const reservas = query.result;
      exibirReservas(reservas);
    };

    query.onerror = (event) => {
      console.log('Erro ao buscar reservas:', event.target.errorCode);
    };
  };
}

function exibirReservas(reservas) {
  const resultadoDiv = document.getElementById('resultadoReservas');
  resultadoDiv.innerHTML = '';

  if (reservas.length > 0) {
    reservas.forEach((reserva) => {
      const reservaDiv = document.createElement('div');
      reservaDiv.classList.add('reserva-item');
      reservaDiv.innerHTML = `
        <p><strong>Nome:</strong> ${reserva.nomeCompleto}</p>
        <p><strong>Tipo de Quarto:</strong> ${reserva.tipoQuarto}</p>
        <p><strong>Data de Chegada:</strong> ${reserva.data}</p>
      `;
      resultadoDiv.appendChild(reservaDiv);
    });
  } else {
    resultadoDiv.innerHTML = '<p>Nenhuma reserva encontrada para o nome fornecido.</p>';
  }
}
