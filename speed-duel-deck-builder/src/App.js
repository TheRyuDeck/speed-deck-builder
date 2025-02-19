import React, { useState, useEffect } from "react";
import CardSearch from "./components/CardSearch";
import CardList from "./components/CardList";
import DeckBuilder from "./components/DeckBuilder";

function App() {
  const [selectedCards, setSelectedCards] = useState([]);

  // Cargar cartas desde localStorage al iniciar
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("selectedCards"));
    if (savedCards) {
      setSelectedCards(savedCards);
    }
  }, []);

  // Guardar cartas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
  }, [selectedCards]);

  // Función para agregar una carta, asegurando que se pueda tener hasta 3 copias
  const addToDeck = (card) => {
    const count = selectedCards.filter((c) => c.id === card.id).length;
    if (count < 3) {
      const newCard = { ...card, instanceId: crypto.randomUUID() }; // Agregar identificador único
      setSelectedCards((prevCards) => [...prevCards, newCard]);
    } else {
      alert("Solo puedes agregar hasta 3 copias de la misma carta.");
    }
  };

  return (
    <div>
      <h1>Speed Duel Deck Builder</h1>
      <CardSearch addToDeck={addToDeck} />
      <CardList cards={selectedCards} setCards={setSelectedCards} />
      <DeckBuilder selectedCards={selectedCards} />
    </div>
  );
}

export default App;
