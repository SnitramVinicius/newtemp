import { useEffect, useRef, useState } from "react";
import Clock from "./components/clock";
import "./App.css";
import Initial from "./components/initial";
import skyVideo from "./assets/158384-816637349_small.mp4";
import ResultScreen from "./components/ResultScreen";
import { getCurrentWeather, getForecast, gerarPrevisaoDiaria } from "./api/weather";

// Componente de vídeo de fundo
function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    >
      <source src={skyVideo} type="video/mp4" />
    </video>
  );
}

function App() {
  const [cidade, setCidade] = useState("");
  const [climaAtual, setClimaAtual] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastDaily, setForecastDaily] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMensagem, setLoadingMensagem] = useState(""); // <--- NOVO

  // Buscar pelo nome da cidade
  async function buscarCidade(nomeCidade) {
    setCidade(nomeCidade);
    setLoading(true);
    setLoadingMensagem(`Buscando o clima para ${nomeCidade}...`);
    try {
      const clima = await getCurrentWeather(nomeCidade);
      const previsao = await getForecast(nomeCidade);

      setClimaAtual(clima);
      setForecast(previsao);
      setForecastDaily(gerarPrevisaoDiaria(previsao.list));
      setMostrarResultado(true);
    } catch (error) {
      console.error("Erro ao buscar clima:", error);
      alert("Erro ao buscar clima. Verifique o nome da cidade.");
    } finally {
      setLoading(false);
      setLoadingMensagem("");
    }
  }

  // Buscar pela localização do dispositivo
  async function buscarPorLocalizacao(lat, lon) {
    setLoading(true);
    setLoadingMensagem("Buscando o clima para sua localização...");
    try {
      const coords = { lat, lon };
      const clima = await getCurrentWeather(coords);
      const previsao = await getForecast(coords);

      setCidade(clima.name);
      setClimaAtual(clima);
      setForecast(previsao);
      setForecastDaily(gerarPrevisaoDiaria(previsao.list));
      setMostrarResultado(true);
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      alert("Não foi possível obter a localização ou os dados do clima.");
    } finally {
      setLoading(false);
      setLoadingMensagem("");
    }
  }

  // Pede a localização ao abrir o app
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          buscarPorLocalizacao(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("Localização não autorizada ou erro:", err);
          // Não faz nada, mantém a tela inicial
        }
      );
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative">
      <BackgroundVideo />
      <Clock />
      {loading && (
        <p className="text-white text-2xl text-center px-4">
          {loadingMensagem || "Carregando..."}
        </p>
      )}
      {!mostrarResultado && !loading && <Initial onBuscar={buscarCidade} />}
      {mostrarResultado && climaAtual && forecast && forecastDaily && !loading && (
        <ResultScreen
          clima={climaAtual}
          forecast={forecast}
          forecastDaily={forecastDaily}
          onVoltar={() => setMostrarResultado(false)}
          onBuscar={buscarCidade}
        />
      )}
    </div>
  );
}

export default App;
