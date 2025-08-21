const { MonumentModel } = require('../../db/sequelize.js');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');

/**
 * @openapi
 * /monuments:
 *   post:
 *     tags: [Monuments]
 *     summary: Créer un monument
 *     description: Crée un nouveau monument et renvoie l'objet créé.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonumentCreate'
 *           examples:
 *             exemple:
 *               value:
 *                 title: "Colisée"
 *                 country: "Italie"
 *                 city: "Rome"
 *                 buildYear: -80
 *                 picture: "https://exemple.com/colisee.jpg"
 *                 description: "Amphithéâtre romain emblématique."
 *     responses:
 *       201:
 *         description: Créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le monument a bien été créé.
 *                 data:
 *                   $ref: '#/components/schemas/Monument'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

module.exports = (app) => {
  app.post('/monuments', auth, async (req, res) => {
    const monument = req.body;
    try {
      const createdMonument = await MonumentModel.create(monument);

      req.io.emit('monument_created', createdMonument);

      const message = 'Le monument a bien été créé.';
      return res.status(201).json({ message, data: createdMonument });
    } catch (error) {
      const msgValidation = 'Le monument n\'a pas pu être créé. Réessayez dans quelques instants.';
      return handleError(res, error, msgValidation);
    }
  })
}