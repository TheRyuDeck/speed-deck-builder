import React, { useEffect } from "react";

function CardList({ cards, setCards }) {
  useEffect(() => {
    console.log("Cartas seleccionadas:", cards);
  }, [cards]);

  // Guardar todo el array de cartas en un archivo JSON
  const exportToFile = () => {
    const data = JSON.stringify(cards, null, 2); 
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cartas_seleccionadas.json";
    a.click();
  };

  // Cargar todo el array de cartas desde un archivo JSON
  const importFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Aquí están todas las cartas con su info completa
        const importedCards = JSON.parse(e.target.result);
        setCards(importedCards); 
      } catch (error) {
        console.error("Error al importar archivo:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Cartas Seleccionadas</h2>
      <button onClick={exportToFile}>Guardar Cartas</button>
      <input type="file" accept=".json" onChange={importFromFile} />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              key={card.instanceId || index}
              style={{
                margin: "10px",
                textAlign: "center",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={card.card_images?.[0]?.image_url}
                alt={card.name}
                width="100"
              />
              <p>{card.name}</p>
            </div>
          ))
        ) : (
          <p>No hay cartas seleccionadas.</p>
        )}
      </div>
    </div>
  );
}

export default CardList;
