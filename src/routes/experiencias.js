const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Experiencia:
 *       type: object
 *       required:
 *         - pessoa_id
 *         - empresa
 *         - cargo
 *       properties:
 *         id:
 *           type: integer
 *         pessoa_id:
 *           type: integer
 *         empresa:
 *           type: string
 *         cargo:
 *           type: string
 *         descricao:
 *           type: string
 */

/**
 * @swagger
 * /experiencias:
 *   get:
 *     summary: Retorna todas as experiências
 *     responses:
 *       200:
 *         description: Lista de experiências
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM experiencias');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /experiencias:
 *   post:
 *     summary: Cria uma nova experiência vinculada a uma pessoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Experiencia'
 *     responses:
 *       201:
 *         description: Experiência criada
 */
router.post('/', async (req, res) => {
    const { pessoa_id, empresa, cargo, descricao } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO experiencias (pessoa_id, empresa, cargo, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
            [pessoa_id, empresa, cargo, descricao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /experiencias/{id}:
 *   delete:
 *     summary: Deleta uma experiência
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 */
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM experiencias WHERE id = $1', [req.params.id]);
        res.json({ message: 'Experiência removida' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;