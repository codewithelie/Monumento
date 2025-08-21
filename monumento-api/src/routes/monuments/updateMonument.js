const { MonumentModel } = require('../../db/sequelize.js');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');
/**
 * @openapi
 * /monuments/{id}:
 *   put:
 *     tags: [Monuments]
 *     summary: Mettre à jour un monument par son ID
 *     description: Met à jour le monument et renvoie l'objet mis à jour.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonumentUpdate'
 *           examples:
 *             exemple:
 *               value:
 *                 title: "Colisée"
 *                 city: "Rome"
 *                 description: "Amphithéâtre romain"
 *     responses:
 *       200:
 *         description: Monument mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le monument avec l'ID 12 a bien été mis à jour.
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

module.exports = (app) => {
  app.put('/monuments/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const monumentData = req.body;

    try {
      const monument = await MonumentModel.findByPk(id);
      if (!monument) {
        const message = `Aucun monument trouvé avec l'ID ${id}.`;
        return res.status(404).json({ message, data: null });
      }

      await MonumentModel.update(monumentData, { where: { id } });

      const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
      const monumentUpdated = { ...monument.toJSON(), ...monumentData };
      return res.json({ message, data: monumentUpdated });

    } catch (error) {
      const msgValidation = 'Le monument n\'a pas pu être mis à jour. Réessayez dans quelques instants.';
      return handleError(res, error, msgValidation);
    }
  });
};