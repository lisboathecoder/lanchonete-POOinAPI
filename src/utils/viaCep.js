const buscarEnderecoViaCep = async (cep) => {
const cepNormalizado = cep?.toString().match(/\d/g)?.join("") || "";

  if (cepNormalizado.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepNormalizado}/json/`);

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const data = await response.json();
  return data?.erro ? null : data;
};

export default buscarEnderecoViaCep ;