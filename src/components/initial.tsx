import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Initial({ onBuscar }) {
  const [cidade, setCidade] = useState("");

  function handleBuscar(e?: React.FormEvent) {
    if (e) e.preventDefault(); // evita reload
    if (cidade.trim() === "") return;
    onBuscar(cidade); // CHAMA a função do App
    setCidade(""); // limpa campo depois
  }

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
    //   style={{ backgroundImage: "url('/sky-5907605_1920.jpg')" }}
    >
      <form
        onSubmit={handleBuscar}
        className="flex w-80 sm:w-96 h-12 shadow-md rounded-full overflow-hidden"
      >
        <input
          type="text"
          placeholder="Digite o nome da cidade"
          className="bg-white flex-1 px-4 text-black focus:outline-none text-center"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <FaSearch color="black" />
        </button>
      </form>
    </div>
  );
}
