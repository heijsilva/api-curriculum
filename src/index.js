const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rotas
const pessoasRoutes = require('./routes/pessoas');
const experienciasRoutes = require('./routes/experiencias');

app.use('/pessoas', pessoasRoutes);
app.use('/experiencias', experienciasRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('API Currículo Express funcionando!');
});

// EXPORTANTE PARA VERCEL
module.exports = app;

// Apenas local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}