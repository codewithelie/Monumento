const { MonumentModel } = require('../../db/sequelize.js');
const { Op, json } = require('sequelize');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');

/**
 * @openapi
 * /monuments/search:
 *   get:
 *     tags: [Monuments]
 *     summary: Rechercher des monuments (pagination + tri)
 *     description: Recherche par **nom** ou **description** (LIKE) avec pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Terme de recherche (au moins 2 caractères).
 *         schema:
 *           type: string
 *           minLength: 2
 *         example: rome
 *       - in: query
 *         name: limit
 *         description: Nombre maximum de résultats.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: offset
 *         description: Décalage de pagination.
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         example: 0
 *       - in: query
 *         name: order
 *         description: Ordre de tri.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         example: desc
 *       - in: query
 *         name: orderBy
 *         description: Champ à trier (croissant/desc selon `order`).
 *         schema:
 *           type: string
 *           enum: [id, name, description, country, city, buildYear, created]  # adapte selon ton modèle
 *           default: name
 *         example: name
 *     responses:
 *       200:
 *         description: Résultats de la recherche.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recherche réussie pour "rome". 3 monument(s) trouvé(s).
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Monument'
 *                 total:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Requête de recherche trop courte (< 2).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Aucun monument trouvé pour cette recherche.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */

module.exports = (app) => {
  app.get('/monuments/search', auth, async (req, res) => {
    const { q, limit = 10, offset = 0, order = 'desc', orderBy = 'name' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        message: 'La requête de recherche doit contenir au moins 2 caractères.',
        data: null,
      });
    }

    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    try {
      const monuments = await MonumentModel.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
          ],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[orderBy, sortOrder]],
      });

      if (monuments.count > 0) {
        const message = `Recherche réussie pour "${q}". ${monuments.count} monument(s) trouvé(s).`;
        return res.json({ message, data: monuments.rows, total: monuments.count });
      } else {
        const message = `Aucun monument trouvé pour la recherche "${q}".`;
        return res.status(404).json({ message, data: null });
      }
    } catch (error) {
      return handleError(res, error);
    }
  });
};