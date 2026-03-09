import express from 'express';
import 'dotenv/config';
import clientesRoutes from './routes/clientesRoute.js';
import itemPedidosRoute from './routes/itemPedidosRoute.js';
import pedidosRoute from './routes/pedidoRoute.js';
import produtoRoute from './routes/produtoRoute.js';
import auth from './utils/apiKey.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api', clientesRoutes);
app.use('/api', itemPedidosRoute);
app.use('/api', pedidosRoute);
app.use('/api', produtoRoute);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});