const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pessoa:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 */

/**
 * @swagger
 * /pessoas:
 *   get:
 *     summary: Retorna todas as pessoas
 *     responses:
 *       200:
 *         description: Lista de pessoas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pessoa'
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pessoas');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /pessoas:
 *   post:
 *     summary: Cria uma nova pessoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       201:
 *         description: Pessoa criada
 */
router.post('/', async (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO pessoas (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /pessoas/{id}:
 *   put:
 *     summary: Atualiza uma pessoa existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       200:
 *         description: Pessoa atualizada
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    try {
        const result = await db.query(
            'UPDATE pessoas SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
            [nome, email, telefone, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Pessoa não encontrada" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /pessoas/{id}:
 *   delete:
 *     summary: Deleta uma pessoa e seus vínculos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pessoa removida
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM pessoas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Pessoa não encontrada" });
        res.json({ message: 'Pessoa removida com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /pessoas/{id}/curriculo:
 *   get:
 *     summary: Retorna os dados completos do currículo de uma pessoa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Currículo completo
 */
router.get('/:id/curriculo', async (req, res) => {
    const { id } = req.params;
    try {
        const pessoa = await db.query('SELECT * FROM pessoas WHERE id = $1', [id]);
        const experiencias = await db.query('SELECT * FROM experiencias WHERE pessoa_id = $1', [id]);
        
        if (pessoa.rows.length === 0) return res.status(404).json({ error: "Pessoa não encontrada" });
        
        res.json({
            ...pessoa.rows[0],
            experiencias: experiencias.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;