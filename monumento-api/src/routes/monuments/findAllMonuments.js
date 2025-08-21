const { MonumentModel } = require('../../db/sequelize.js');
const { Op } = require('sequelize');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');

/**
 * @openapi
 * /monuments:
 *   get:
 *     tags: [Monuments]
 *     summary: Lister les monuments (avec recherche, limite et tri)
 *     description: |
 *       - Si `name` < 2 caractères → 400
 *       - Si `name` fourni mais 0 résultat → 404
 *       - Sinon → 200 avec la liste
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Filtre par nom (contient). Min 2 caractères.
 *         schema:
 *           type: string
 *           minLength: 2
 *         example: Col
 *       - in: query
 *         name: limit
 *         description: Nombre maximum de résultats.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *       - in: query
 *         name: orderBy
 *         description: Champ de tri croissant (doit correspondre à une colonne autorisée).
 *         schema:
 *           type: string
 *           enum: [id, name, title, country, city, buildYear, created] # adapte selon ton modèle
 *         example: title
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Monument'
 *       400:
 *         description: Terme de recherche trop court.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Aucun monument trouvé avec ce nom.
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
  app.get('/monuments', auth, async (req, res) => {
    const { name, limit, orderBy } = req.query;

    const options = {};

    if (name && name.length >= 2) {
      options.where = {
        name: {
          [Op.like]: `%${name}%`
        }
      };
    } else if (name && name.length < 2) {
      return res.status(400).json({
        message: 'Le terme de recherche est trop court. Veuillez fournir au moins 2 caractères.',
        data: null
      });
    }

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        options.limit = parsedLimit;
      }
    }

    if (orderBy) {
      options.order = [[orderBy, 'ASC']];
    }

    try {
      const monuments = await MonumentModel.findAll(options);
      
      if (name && monuments.length === 0) {
        return res.status(404).json({
          message: `Aucun monument trouvé avec le nom "${name}".`,
          data: null
        });
      }

      const message = name
        ? `Les monuments contenant "${name}" ont bien été trouvés.`
        : `La liste des monuments a bien été récupérée.`;

      res.json({ message, data: monuments });

    } catch (error) {
      return handleError(res, error);
    }
  });
};
