/**
 * @api {get} /secure/auth Autenticação do usuário
 * @apiName authenticate
 * @apiDescription Realiza a autenticação do usuário
 * @apiGroup Autenticacao
 *
 * @apiUse headerBasicAuth
 *
 * @apiSuccess (200) {Boolean} email_validated Informa se o usuário já realizou a vaidação do email.
 * @apiSuccess (200) {String} email  E-mail.
 * @apiSuccess (200) {Date} createdAt  Data de criação do usuário.
 * @apiSuccess (200) {String} [name]  Nome do usuário
 * @apiSuccess (200) {String} [birth_date] Data de nascimento do usuário
 * @apiSuccess (200) {String} [genre] Genero do usuário
 * @apiSuccess (200) {Date} updatedAt  Última data de atualização do usuário.
 * @apiSuccess (200) {String} id  Id público do usuário
 */

/**
 * @api {post} /auth/recover Recuperação de senha
 * @apiName recoverPassword
 * @apiDescription Realiza a recuperação de senha
 * @apiGroup Autenticacao
 *
 * @apiParam {String} email Email do usuário
 * @apiSuccessExample {Number} Success-Response:
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Error-Response: email não encontrado
 *    {
 *       "error": true,
 *        "message": "email não encontrado"
 *    }
 */

/**
 * @api {post} /auth/validate_token Validação de token
 * @apiName validateToken
 * @apiDescription Verifica se o token enviado na recuperação de senha ainda esta válido
 * @apiGroup Autenticacao
 *
 * @apiParam {String} token Token enviado por email.
 * @apiSuccessExample {Number} Success-Response:
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Error-Response: token inválido
 *    {
 *       "error": true,
 *       "message": "token inválido",
 *    }
 */

/**
 * @api {post} /auth/update_password Alteração de senha
 * @apiName updatePassword
 * @apiDescription Realiza a alteração da senha
 * @apiGroup Autenticacao
 *
 * @apiParam {String} token Token enviado por email
 * @apiParam  {String} password Nova senha do usuário
 * @apiSuccessExample {Number} Success-Response:
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Error-Response: token inválido
 *    {
 *       "error": true,
 *       "message": "token inválido",
 *    }
 */
