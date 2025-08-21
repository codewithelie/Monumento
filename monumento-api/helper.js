exports.success = (message, data) => {
    return { message, data};
}

exports.handleError = (res, error, messageValidationError = 'Erreur sur la validation des champs.', messageUniqueConstraintError = 'Une données existe dèjà.', messageErrorDefault='Une erreur s\'est produite. Réessayez dans quelques instants.') => {
    if(error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: messageUniqueConstraintError, data: null });
    }
    if(error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(e => e.message);
        return res.status(400).json({ message: messageValidationError, data: validationErrors });
    }
    res.status(500).json({ message: messageErrorDefault, data: error });
}
