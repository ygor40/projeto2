<?php

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (
    $origin === 'http://localhost:4200' ||
    preg_match('/^https:\/\/[a-z0-9-]+-4200\.app\.github\.dev$/', $origin)
) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_set_cookie_params([
    'httponly' => true,
    'secure' => isset($_SERVER['HTTPS']),
    'samesite' => 'Lax',
    'path' => '/'
]);

session_start();

require __DIR__ . '/../conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| VERIFICAR LOGIN
|--------------------------------------------------------------------------
*/

if ($metodo === 'GET') {

    if (!isset($_SESSION['usuario_id'])) {

        http_response_code(401);

        echo json_encode([
            'logado' => false
        ]);

        exit;
    }

    echo json_encode([
        'logado' => true,
        'usuario' => [
            'id' => $_SESSION['usuario_id'],
            'username' => $_SESSION['username']
        ]
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

if ($metodo === 'POST') {

    $dados = json_decode(
        file_get_contents('php://input'),
        true
    );

    $username = trim($dados['username'] ?? '');
    $password = $dados['password'] ?? '';

    if ($username === '' || $password === '') {

        http_response_code(400);

        echo json_encode([
            'erro' => 'Informe usuário e senha.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT id, username, password FROM usuarios WHERE username = ? LIMIT 1'
    );

    $stmt->execute([$username]);

    $usuario = $stmt->fetch();

    if (
        !$usuario ||
        !password_verify($password, $usuario['password'])
    ) {

        http_response_code(401);

        echo json_encode([
            'erro' => 'Usuário ou senha incorretos.'
        ]);

        exit;
    }

    session_regenerate_id(true);

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['username'] = $usuario['username'];

    echo json_encode([
        'logado' => true,
        'usuario' => [
            'id' => $usuario['id'],
            'username' => $usuario['username']
        ]
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

if ($metodo === 'DELETE') {

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {

        $params = session_get_cookie_params();

        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'] ?? '',
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();

    echo json_encode([
        'logado' => false
    ]);

    exit;
}

http_response_code(405);

echo json_encode([
    'erro' => 'Método não permitido.'
]);