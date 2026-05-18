const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rota básica de teste
app.get('/', (req, res) => {
  res.send('API Currículo Express rodando! Acesse /api-docs para a documentação.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

const pessoasRoutes = require('./routes/pessoas'); // No topo
app.use('/pessoas', pessoasRoutes); // Antes do app.listen

