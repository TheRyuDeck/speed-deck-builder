import React, { useState } from "react";

function DeckBuilder({ selectedCards }) {
  const [deckSize, setDeckSize] = useState(20);
  const [mainDeck, setMainDeck] = useState([]);
  const [extraDeck, setExtraDeck] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [keyCards, setKeyCards] = useState([]);

  // Función para estandarizar el formato de una carta
  const standardizeCard = (card) => ({
    id: Number(card.card_images?.[0]?.id || card.id),
    name: card.name,
    type: card.type,
    card_images: card.card_images || [
      { image_url: "https://via.placeholder.com/100", id: 0 },
    ],
  });

  // Clasifica las cartas entre Main Deck y Extra Deck
  const classifyCards = (cards) => {
    let newMainDeck = [];
    let newExtraDeck = [];
    cards.forEach((card) => {
      const stdCard = standardizeCard(card);
      if (
        ["Fusion", "Synchro", "XYZ", "Link"].some((type) =>
          stdCard.type.includes(type)
        )
      ) {
        if (newExtraDeck.length < 15) newExtraDeck.push(stdCard);
      } else {
        if (newMainDeck.length < deckSize) newMainDeck.push(stdCard);
      }
    });
    setMainDeck(newMainDeck);
    setExtraDeck(newExtraDeck);
  };

  // Construye el deck basado en cartas clave
  const buildAroundKeyCards = () => {
    let filteredCards = selectedCards.filter((card) =>
      keyCards.some(
        (keyCard) =>
          Number(standardizeCard(keyCard).id) ===
          Number(standardizeCard(card).id)
      )
    );
    classifyCards(filteredCards);
  };

  // Agregar una carta clave
  const addKeyCard = (card) => {
    const stdCard = standardizeCard(card);
    if (!keyCards.some((keyCard) => Number(keyCard.id) === Number(stdCard.id))) {
      setKeyCards([...keyCards, stdCard]);
    }
  };

  // Agrega una carta manualmente al deck
  const addSelectedCard = () => {
    const selectedCard = selectedCards.find(
      (card) => Number(standardizeCard(card).id) === Number(selectedCardId)
    );
    if (!selectedCard) return;

    if (
      ["Fusion", "Synchro", "XYZ", "Link"].some((type) =>
        selectedCard.type.includes(type)
      )
    ) {
      addCardToExtraDeck(selectedCard);
    } else {
      addCardToMainDeck(selectedCard);
    }
  };

  const addCardToMainDeck = (card) => {
    if (mainDeck.length < deckSize) setMainDeck([...mainDeck, standardizeCard(card)]);
    else alert(`El Main Deck ya tiene ${deckSize} cartas.`);
  };

  const addCardToExtraDeck = (card) => {
    if (extraDeck.length < 15) setExtraDeck([...extraDeck, standardizeCard(card)]);
    else alert("El Deck Extra ya tiene 15 cartas.");
  };

  // Elimina solo UNA copia de la carta del Main Deck
  const removeCardFromMainDeck = (card) => {
    const index = mainDeck.findIndex((c) => Number(c.id) === Number(card.id));
    if (index !== -1) {
      let newDeck = [...mainDeck];
      newDeck.splice(index, 1);
      setMainDeck(newDeck);
    }
  };

  // Elimina solo UNA copia de la carta del Extra Deck
  const removeCardFromExtraDeck = (card) => {
    const index = extraDeck.findIndex((c) => Number(c.id) === Number(card.id));
    if (index !== -1) {
      let newDeck = [...extraDeck];
      newDeck.splice(index, 1);
      setExtraDeck(newDeck);
    }
  };

  // Guarda el deck en un archivo JSON
  const saveDeckToFile = () => {
    const deckData = { mainDeck, extraDeck };
    const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deck.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Carga un deck desde un archivo JSON
  const loadDeckFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const deckData = JSON.parse(e.target.result);
        setMainDeck(deckData.mainDeck || []);
        setExtraDeck(deckData.extraDeck || []);
      } catch (error) {
        alert("Error al cargar el archivo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Deck Automático</h2>
      <label>
        Tamaño del Main Deck:
        <input
          type="number"
          min="20"
          max="30"
          value={deckSize}
          onChange={(e) => setDeckSize(Number(e.target.value))}
        />
      </label>
      <button onClick={() => classifyCards(selectedCards)}>Armar Deck</button>

      <h3>Opciones de Guardado</h3>
      <button onClick={saveDeckToFile}>Guardar Deck</button>
      <input type="file" onChange={loadDeckFromFile} accept=".json" />

      <h3>Seleccionar Cartas Clave</h3>
      <select
        onChange={(e) =>
          addKeyCard(selectedCards.find((c) => Number(c.id) === Number(e.target.value)))
        }
        defaultValue=""
      >
        <option value="">Selecciona una carta</option>
        {selectedCards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.name}
          </option>
        ))}
      </select>
      <button onClick={buildAroundKeyCards}>Construir alrededor de cartas clave</button>

      {/* Main Deck */}
      <div>
        <h3>Main Deck ({mainDeck.length}/{deckSize})</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {mainDeck.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              style={{
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img src={card.card_images[0].image_url} alt={card.name} width="100" height="140" />
              <p>{card.name}</p>
              <button onClick={() => removeCardFromMainDeck(card)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Deck */}
      <div>
        <h3>Extra Deck ({extraDeck.length}/15)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {extraDeck.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              style={{
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img src={card.card_images[0].image_url} alt={card.name} width="100" height="140" />
              <p>{card.name}</p>
              <button onClick={() => removeCardFromExtraDeck(card)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeckBuilder;
