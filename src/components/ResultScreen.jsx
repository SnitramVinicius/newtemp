import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function ResultScreen({
  clima,
  forecast,
  forecastDaily,
  onVoltar,
  onBuscar,
}) {
  if (!clima || !forecast || !forecastDaily) return null;

  const [cidadeInput, setCidadeInput] = useState("");
  const [resumoClima, setResumoClima] = useState("");

  const cidadeNome = clima.name;
  const temperatura = Math.round(clima.main.temp);
  const descricao = clima.weather[0].description;

  // Função para gerar frases dinâmicas
  function gerarResumoDia(forecast) {
    const proximas = forecast.list.slice(0, 3); // até ~6h
    if (proximas.length < 2) return "";

    const primeira = proximas[0];
    const segunda = proximas[1];

    const hora1 = new Date(primeira.dt * 1000).getHours();
    const hora2 = new Date(segunda.dt * 1000).getHours();

    const desc1 = primeira.weather[0].description;
    const desc2 = segunda.weather[0].description;

    const frasesConstantes = [
      `Condições ${desc1} entre ${hora1}:00 e ${hora2}:00.`,
      `O período deve se manter ${desc1} até ${hora2}:00.`,
      `Tempo ${desc1} predominando nas próximas horas.`,
      `Entre ${hora1}:00 e ${hora2}:00 o clima continuará ${desc1}.`,
    ];

    const frasesMudanca = [
      `Entre ${hora1}:00 e ${hora2}:00 teremos ${desc1}, mas a previsão é de ${desc2} em seguida.`,
      `Condições ${desc1} até ${hora2}:00, com ${desc2} previsto logo após.`,
      `O início do período será ${desc1}, mudando para ${desc2} por volta das ${hora2}:00.`,
      `${desc1} no começo, mas deve virar ${desc2} até ${hora2}:00.`,
    ];

    if (desc1 === desc2) {
      return frasesConstantes[
        Math.floor(Math.random() * frasesConstantes.length)
      ];
    }

    return frasesMudanca[Math.floor(Math.random() * frasesMudanca.length)];
  }

  // Atualiza o resumo quando o forecast muda (ou seja, após buscar cidade)
  useEffect(() => {
    if (forecast && forecast.list) {
      setResumoClima(gerarResumoDia(forecast));
    }
  }, [clima, forecast]);

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
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-white md:text-[6dvw] text-[12dvw] font-semibold">
          {cidadeNome}
        </p>
        <h1 className="md:text-[10dvw] text-[15dvw]">{temperatura}°</h1>
        <h1 className="md:text-[1dvw] text-[3dvw] capitalize">{descricao}</h1>

        {/* Caixinhas horárias */}
        <div className="flex overflow-x-auto md:flex-wrap flex-nowrap md:gap-6 gap-2 md:mb-0 mb-5 mt-4 justify-center w-full px-2">
          {forecast.list.slice(0, 6).map((item, index) => {
            const temp = Math.round(item.main.temp);
            const hora = new Date(item.dt * 1000).getHours();
            const icon = item.weather[0].icon;
            const desc = item.weather[0].description;

            return (
              <div
                key={index}
                className="flex flex-col bg-[#3982ca]/80 md:w-[8dvw] w-[20dvw] md:h-auto h-[22dvw] rounded-2xl shadow-md items-center justify-center p-2"
              >
                <p className="text-white md:text-[1dvw] text-[3dvw]">{temp}°</p>
                <img
                  className="md:w-[4dvw] w-[10dvw] h-auto"
                  src={`https://openweathermap.org/img/wn/${icon}.png`}
                  alt="clima"
                />
                <p className="text-white md:text-[0.8dvw] text-[1.3dvw] capitalize text-center mt-1">
                  {desc}
                </p>
                <p className="text-white md:text-[1dvw] text-[2dvw]">{`${hora}:00`}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caixa lateral */}
      <div className="bg-[#3982ca]/80 md:w-[30dvw] h-full flex flex-col items-center justify-center p-4 gap-4">
        {/* Caixa de busca */}
        <div className="flex h-12 shadow-md rounded-full overflow-hidden w-full flex-shrink-0">
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

        {/* Resumo do clima - não empurra a caixa */}
        {resumoClima && (
          <div className="w-full text-center mt-2">
            <p className="md:text-[1dvw] text-[15px] leading-snug">
              {resumoClima}
            </p>
          </div>
        )}

        <p className="text-white font-semibold md:text-[2dvw] text-[30px]">
          Previsão para a semana
        </p>

        {/* Linhas da previsão semanal */}
        <div className="flex flex-col gap-3 w-full">
          {forecastDaily.map((dia, i) => {
            const data = new Date(dia.date);
            const diaNum = data.getDate();
            const diaSemana = data.toLocaleDateString("pt-BR", {
              weekday: "short",
            });
            const icone = dia.weather.icon;
            const descricao = dia.weather.description;
            const tempMax = dia.temp_max;
            const tempMin = dia.temp_min;

            return (
          <div key={i} className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
  <div className="flex items-center justify-center flex-col md:w-[3dvw] md:h-[3dvw] h-12 w-12 bg-white/20 rounded-full flex-shrink-0">
    <h1 className="md:text-[1.2dvw] text-[15px]">{diaNum}</h1>
    <h1 className="md:text-[0.6dvw] text-[10px]">{diaSemana}</h1>
  </div>

  <img
    src={`https://openweathermap.org/img/wn/${icone}.png`}
    alt="clima"
    className="md:w-[3dvw] w-[12dvw] h-auto flex-shrink-0"
  />

  <p className="text-white md:text-[1dvw] text-[12px] text-center w-[6rem] md:max-w-[15ch] break-words flex-1">
    {descricao}
  </p>

  <div className="flex items-center gap-1 flex-shrink-0">
    <FaArrowUp className="text-red-400" />
    <p className="text-white md:text-[1dvw] text-[18px]">{tempMax}°</p>
  </div>

  <div className="flex items-center gap-1 flex-shrink-0">
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
