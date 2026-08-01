const express = require('express');
const route = express.Router();

const { createBaby, getAllBabies, getBabyById, updateBabyById, deleteBabyById } = require('../controllers/babyController');

/**
 * @swagger
 * /babies:
 *   post:
 *     summary: Add a new baby
 *     tags:
 *       - Babies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - dob
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aadhe
 *               gender:
 *                 type: string
 *                 example: boy
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               bloodGroup:
 *                 type: string
 *                 example: "B+"
 *     responses:
 *       201:
 *         description: Baby added successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.post('/', createBaby);

/**
 * @swagger
 * /babies:
 *   get:
 *     summary: Get all babies
 *     tags:
 *       - Babies
 *     responses:
 *       200:
 *         description: Got babies list successfully
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllBabies);

/**
 * @swagger
 * /babies/{id}:
 *   get:
 *     summary: Get baby details by ID
 *     tags:
 *       - Babies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Baby details retrieved successfully
 *       404:
 *         description: Baby not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getBabyById);

/**
 * @swagger
 * /babies/{id}:
 *   patch:
 *     summary: Update baby details by ID
 *     tags:
 *       - Babies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aadhe
 *               gender:
 *                 type: string
 *                 example: boy
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               bloodGroup:
 *                 type: string
 *                 example: "B+"
 *     responses:
 *       200:
 *         description: Baby updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Baby not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateBabyById);

/**
 * @swagger
 * /babies/{id}:
 *   delete:
 *     summary: Delete baby by id
 *     tags:
 *       - Babies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Baby deleted successfully
 *       404:
 *         description: Baby not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteBabyById);

module.exports = route;