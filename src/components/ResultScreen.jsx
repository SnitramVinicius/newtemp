import React, { useState } from "react";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function ResultScreen({ clima, forecast, forecastDaily, onVoltar, onBuscar }) {
  if (!clima || !forecast || !forecastDaily) return null;

  const [cidadeInput, setCidadeInput] = useState("");

  const cidadeNome = clima.name;
  const temperatura = Math.round(clima.main.temp);
  const descricao = clima.weather[0].description;

  const handleSearch = () => {
    if (cidadeInput.trim()) {
      onBuscar(cidadeInput.trim());
      setCidadeInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
 <div className="flex md:flex-row flex-col fixed inset-0 w-screen h-screen md:h-full text-white">

      {/* Div da cidade */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-white md:text-[6dvw] text-[12dvw] font-semibold">{cidadeNome}</p>
        <h1 className="md:text-[10dvw] text-[15dvw]">{temperatura}°</h1>
        <h1 className="md:text-[1dvw] text-[3dvw]">{descricao}</h1>

        {/* Caixinhas horárias (a cada 3h) */}
        <div className="flex overflow-x-auto md:flex-wrap flex-nowrap md:gap-6 gap-2 md:mb-0 mb-5 mt-4 justify-center w-full px-2">
          {forecast.list.slice(0, 6).map((item, index) => {
            const temp = Math.round(item.main.temp);
            const hora = new Date(item.dt * 1000).getHours();
            const icon = item.weather[0].icon;
            return (
              <div
                key={index}
                className="flex-col bg-black/50 md:w-[8dvw] w-[20dvw] md:h-auto h-[20dvw] rounded-2xl shadow-md flex items-center justify-center"
              >
                <p className="text-white md:text-[1dvw] text-[3dvw]">{temp}°</p>
                <img
                  className="md:w-[4dvw] w-[10dvw] h-auto"
                  src={`https://openweathermap.org/img/wn/${icon}.png`}
                  alt="clima"
                />
                <p className="text-white md:text-[1dvw] text-[2dvw]">{`${hora}:00`}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caixa preta fixa no canto direito */}
      <div className="bg-black/50 md:w-[30dvw] h-full flex flex-col items-center justify-center p-4 gap-4 ">
        {/* Caixa de busca */}
        <div className="flex h-12 shadow-md rounded-full overflow-hidden w-full">
          <input
            type="text"
            placeholder="Digite o nome da cidade"
            value={cidadeInput}
            onChange={(e) => setCidadeInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white w-full md:w-[20dvw] md:text-[1dvw] flex-1 px-4 text-black focus:outline-none text-center"
          />
          <button
            onClick={handleSearch}
            className="bg-white w-12 h-12 flex items-center justify-center cursor-pointer"
          >
            <FaSearch color="black" />
          </button>
        </div>

        <p className="text-white font-semibold md:text-[2dvw] text-[30px]">Previsão para a semana</p>

        {/* Linhas da previsão semanal */}
        <div className="flex flex-col gap-3 w-full">
          {forecastDaily.map((dia, i) => {
            const data = new Date(dia.date);
            const diaNum = data.getDate();
            const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "short" });
            const icone = dia.weather.icon;
            const descricao = dia.weather.description;
            const tempMax = dia.temp_max;
            const tempMin = dia.temp_min;

            return (
              <div key={i} className="flex items-center justify-between gap-3">
                {/* Dia e data */}
                <div className="flex items-center justify-center flex-col md:w-[3dvw] md:h-[3dvw] h-12 w-12 bg-white/20 rounded-full">
                  <h1 className="md:text-[1.2dvw] text-[15px]">{diaNum}</h1>
                  <h1 className="md:text-[0.6dvw] text-[10px]">{diaSemana}</h1>
                </div>

                {/* Ícone do clima */}
                <img
                  src={`https://openweathermap.org/img/wn/${icone}.png`}
                  alt="clima"
                  className="md:w-[3dvw] w-[12dvw] h-auto"
                />

                {/* Descrição */}
                <p className="text-white md:text-[1dvw] text-[12px]">{descricao}</p>

                {/* Máxima */}
                <div className="flex items-center gap-1">
                  <FaArrowUp className="text-red-400" />
                  <p className="text-white md:text-[1dvw] text-[18px]">{tempMax}°</p>
                </div>

                {/* Mínima */}
                <div className="flex items-center gap-1">
                  <FaArrowDown className="text-blue-400" />
                  <p className="text-white md:text-[1dvw] text-[18px]">{tempMin}°</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
