import express from 'express';
import 'dotenv/config';
import clienteRoute from './routes/clienteRoute.js';
import itemPedidoRoute from './routes/itemPedidoRoute.js';
import pedidoRoute from './routes/pedidoRoute.js';
import produtoRoute from './routes/produtoRoute.js';
import auth from './utils/apiKey.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api', auth, clienteRoute);
app.use('/api', auth, itemPedidoRoute);
app.use('/api', auth, pedidoRoute);
app.use('/api', auth, produtoRoute);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});