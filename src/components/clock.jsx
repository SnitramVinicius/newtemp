import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState({
    dia: "00",
    mes: "mês",
    ano: "ano",
    horas: "00",
    minutos: "00",
  });

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const months = [
        "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
      ];

      let horas = now.getHours();
      let minutos = now.getMinutes();
      if (horas < 10) horas = "0" + horas;
      if (minutos < 10) minutos = "0" + minutos;

      setTime({
        dia: now.getDate(),
        mes: months[now.getMonth()],
        ano: now.getFullYear(),
        horas,
        minutos,
      });
    }

    updateClock(); // roda imediatamente
    const interval = setInterval(updateClock, 1000); // atualiza a cada 1s

    return () => clearInterval(interval); // limpa o intervalo ao desmontar
  }, []);

  return (
<div className="hidden lg:flex flex-nowrap gap-4 items-center justify-center absolute top-0 left-0 right-0 text-sm text-[1dvw]">
  <div className="flex gap-2 font-semibold text-white">
    <span>{time.dia}</span>
    <span>{time.mes}</span>
    <span>{time.ano}</span>
  </div>
  <div>
    <p className="text-white">|</p>
  </div>
  <div className="font-semibold text-white">
    <span>{time.horas}</span>
    <span>:</span>
    <span>{time.minutos}</span>
  </div>
</div>




  );
}