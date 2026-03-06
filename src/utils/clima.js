

const buscarCoordenadas = async (cidade) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&countryCode=BR`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const buscarClima = async (cidade) => {
    const coordenadas = await buscarCoordenadas(cidade);
    
    if (!coordenadas.results || coordenadas.results.length === 0) {
        return { clima: null };
    }
    
    const { latitude, longitude } = coordenadas.results[0];
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=America/Sao_Paulo`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
        latitude,
        longitude,
        temperatura: data.current.temperature_2m,
        codigoClima: data.current.weathercode
    };
};

export default { buscarCoordenadas, buscarClima };