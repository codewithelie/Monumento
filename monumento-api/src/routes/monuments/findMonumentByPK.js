const { MonumentModel } = require('../../db/sequelize.js');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');
/**
 * @openapi
 * /monuments/{id}:
 *   get:
 *     tags: [Monuments]
 *     summary: Récupérer un monument par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du monument
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     responses:
 *       200:
 *         description: Monument trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le monument avec l'ID 12 a bien été trouvé.
 *                 data:
 *                   $ref: '#/components/schemas/Monument'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Aucun monument trouvé avec cet ID.
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
  app.get('/monuments/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const monument = await MonumentModel.findByPk(id);

      if (!monument) {
        return res.status(404).json({
          message: `Aucun monument trouvé avec l'ID ${id}.`,
          data: null
        });
      }

      const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
      res.json({ message, data: monument });

    } catch (error) {
      return handleError(res, error);
    }
  });
}