import React, { useState } from "react";

function CardSearch({ addToDeck }) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]); // Ahora es una lista de cartas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCardInfo = async () => {
    setLoading(true);
    setError("");
    setCards([]); // Limpiamos los resultados previos

    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}` // Ahora usamos "fname" para búsqueda parcial
      );
      const data = await response.json();

      if (data.data) {
        setCards(data.data); // Guardamos todas las coincidencias
      } else {
        setError("No se encontraron cartas. Prueba con otro nombre.");
      }
    } catch (err) {
      setError("Error al buscar la carta.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Buscador de Cartas</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe el nombre de la carta..."
      />
      <button onClick={fetchCardInfo}>Buscar</button>

      {loading && <p>Buscando cartas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cards.length > 0 && (
        <div>
          <h3>Resultados encontrados:</h3>
          <ul>
            {cards.map((card) => (
              <li key={card.id} style={{ marginBottom: "10px" }}>
                <h4>{card.name}</h4>
                <img src={card.card_images[0].image_url} alt={card.name} width="100" />
                <p><strong>Tipo:</strong> {card.type}</p>
                <p><strong>Descripción:</strong> {card.desc}</p>
                <button onClick={() => addToDeck(card)}>Agregar al mazo</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CardSearch;
