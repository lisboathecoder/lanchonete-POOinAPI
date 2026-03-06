import buscarEnderecoPorCep from "./viaCep.js";

const buscarClimaViaCep = async (cep) => {
    try {
        const endereco = await buscarEnderecoPorCep(cep);

        if (!endereco || !endereco.localidade) {
            return null;
        }

        return await buscarClima(endereco.localidade);
    } catch (error) {
        return null;
    }
};

const buscarCoordenadas = async (cidade) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&countryCode=BR`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar coordenadas");
    }

    return response.json();
};

const buscarClima = async (cidade) => {
    try {
        const coordenadas = await buscarCoordenadas(cidade);

        if (!coordenadas.results || coordenadas.results.length === 0) {
            return null;
        }

        const { latitude, longitude } = coordenadas.results[0];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=America/Sao_Paulo`;
        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const temperatura = data?.current?.temperature_2m;
        const weatherCode = data?.current?.weathercode;

        if (typeof temperatura !== "number" || typeof weatherCode !== "number") {
            return null;
        }

        return {
            temperatura,
            weatherCode
        };
    } catch (error) {
        return null;
    }
};

export { buscarClimaViaCep, buscarCoordenadas, buscarClima };
