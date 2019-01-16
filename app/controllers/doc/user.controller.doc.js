/**
  *
  * @api {get} secure/user Usuário logado
  * @apiName index
  * @apiGroup Usuario
  * @apiDescription Retorna as informações do usuário logado
  * @apiUse headerBasicAuth
  * @apiSuccess (200) {Boolean} email_validated Informa se o usuário já realizou a vaidação do email.
  * @apiSuccess (200) {String} email  E-mail.
  * @apiSuccess (200) {String} [name]  Nome do usuário
  * @apiSuccess (200) {String} [birth_date] Data de nascimento do usuário
  * @apiSuccess (200) {String} [genre] Genero do usuário
  * @apiSuccess (200) {Date} createdAt  Data de criação do usuário.
  * @apiSuccess (200) {Date} updatedAt  Última data de atualização do usuário.
  * @apiSuccess (200) {String} id  Id público do usuário
  *
  * @apiSuccessExample {json} Success-Response:
  *    {
        "email_validated": true,
        "email": "jjohnys@gmail.com",
        "createdAt": "29/03/2018",
        "updatedAt": "30/03/2018",
        "id": "9a0714c8-c685-4ab6-9d28-09f9dbee3a5f"
        }
  *
  *
  */
/**
  *
  * @api {post} /user Cadastrar usuário
  * @apiName create
  * @apiGroup Usuario
  * @apiDescription Realiza a criação de um novo usuário na base de dados
  *
  * @apiParam  {String} email Email do usuário
  * @apiParam  {String} password Senha do usuário
  *
  * @apiSuccess (200) {Boolean} email_validated Informa se o usuário já realizou a vaidação do email.
  * @apiSuccess (200) {String} email  E-mail.
  * @apiSuccess (200) {String} [name]  Nome do usuário
  * @apiSuccess (200) {String} [birth_date] Data de nascimento do usuário
  * @apiSuccess (200) {String} [genre] Genero do usuário
  * @apiSuccess (200) {Date} createdAt  Data de criação do usuário.
  * @apiSuccess (200) {Date} updatedAt  Última data de atualização do usuário.
  * @apiSuccess (200) {String} id  Id público do usuário
  *
  * @apiSuccessExample {json} Success-Response:
  *    {
        "email_validated": false,
        "email": "jjohnys@gmail.com",
        "createdAt": "29/03/2018",
        "updatedAt": "30/03/2018",
        "id": "9a0714c8-c685-4ab6-9d28-09f9dbee3a5f"
        }
  *
  * @apiErrorExample {json} Erro: Email já em uso
      {
        "error": true,
        "message": "User validation failed: email: Email já em uso",
        "errors": {
            "email": {
                "message": "Email já em uso",
                "type": "user defined"
            }
        }
    }

    @apiErrorExample {json} Erro: Senha com menos de 6 caracteres
        {
            "error": true,
            "message": "User validation failed: password: A senha deve ter no mínimo 6 caracteres",
            "errors": {
                "password": {
                    "message": "A senha deve ter no mínimo 6 caracteres",
                    "type": "regexp"
                }
            }
        }
  */

/**
  *
  * @api {put} /secure/user Alteração de usuário
  * @apiName update
  * @apiGroup Usuario
  * @apiDescription Realiza a alteração do usuário
  *
  * @apiUse headerBasicAuth
  *
  * @apiParam  {String} [name] Nome do usuário
  * @apiParam  {String} [birth_date] Data de nascimento DD/MM/YYYY
  * @apiParam  {String} [genre] Genero M ou F
  *
  * @apiSuccess (200) {Boolean} email_validated Informa se o usuário já realizou a vaidação do email.
  * @apiSuccess (200) {String} email  E-mail.
  * @apiSuccess (200) {String} [name]  Nome do usuário
  * @apiSuccess (200) {String} [birth_date] Data de nascimento do usuário
  * @apiSuccess (200) {String} [genre] Genero do usuário
  * @apiSuccess (200) {Date} createdAt  Data de criação do usuário.
  * @apiSuccess (200) {Date} updatedAt  Última data de atualização do usuário.
  * @apiSuccess (200) {String} id  Id público do usuário
  *
  * @apiSuccessExample {json} Success-Response:
  *    {
        "email_validated": false,
        "email": "jjohnys@gmail.com",
        "name": "Johnys"
        "birth_date": "18/07/1990"
        "createdAt": "29/03/2018",
        "updatedAt": "30/03/2018",
        "genre": "M",
        "id": "9a0714c8-c685-4ab6-9d28-09f9dbee3a5f"
        }
  *
  */

/**
 * @api {post} /user/validate_email Validar email
 * @apiName validateEmail
 * @apiDescription Marca o usuário com o email validado
 * @apiGroup Usuario
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
