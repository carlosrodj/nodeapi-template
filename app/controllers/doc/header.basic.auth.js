/**
 * @apiDefine headerBasicAuth
 * @apiHeader {String} Authorization email:password do usuário em Base 64. Basic Auth HTTP
 * @apiHeaderExample {json} Authorization:
 *    {
 *     "Authorization": "Basic dGVzdGVAdGVzdGUuY29tOjEyMzQ1Ng=="
 *    }
 * @apiError {Number} 401 Falha na autenticação.
 * @apiErrorExample {Number} Error-Response:
 *  HTTP/1.1 401 Unauthorized
 *
 */
