<?php

// api/projetos.php
// CRUD completo de projetos: GET, POST, PUT e DELETE

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


// Qualquer erro inesperado vira JSON
set_exception_handler(function ($e) {

    http_response_code(500);

    echo json_encode([
        'erro' => 'Falha no servidor: ' . $e->getMessage()
    ]);

    exit;
});


// Pré-voo do CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(204);
    exit;
}


// Conexão com o banco
require __DIR__ . '/../conexao.php';


// Método da requisição
$metodo = $_SERVER['REQUEST_METHOD'];


// ID vindo da URL: ?id=7
$id = isset($_GET['id'])
    ? (int) $_GET['id']
    : 0;



// =====================================================
// GET
// =====================================================

if ($metodo === 'GET') {

    // Se recebeu um ID, busca apenas um projeto
    if ($id > 0) {

        $stmt = $pdo->prepare(
            "SELECT
                id,
                nome,
                descricao,
                tecnologias,
                link_github,
                ano
             FROM projetos
             WHERE id = ?
             AND status = 'publicado'"
        );

        $stmt->execute([$id]);

        $projeto = $stmt->fetch();

        if (!$projeto) {

            http_response_code(404);

            echo json_encode([
                'erro' => 'Projeto não encontrado'
            ]);

            exit;
        }

        echo json_encode($projeto);

        exit;
    }


    // Sem ID: lista todos os publicados
    $sql = "
        SELECT
            id,
            nome,
            descricao,
            tecnologias,
            link_github,
            ano
        FROM projetos
        WHERE status = 'publicado'
        ORDER BY id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    echo json_encode(
        $stmt->fetchAll()
    );

    exit;
}



// =====================================================
// POST - CRIAR PROJETO
// =====================================================

if ($metodo === 'POST') {

    $dados = json_decode(
        file_get_contents('php://input'),
        true
    );


    // Nome é obrigatório
    if (
        !$dados ||
        empty($dados['nome'])
    ) {

        http_response_code(400);

        echo json_encode([
            'erro' => 'Informe pelo menos o nome do projeto'
        ]);

        exit;
    }


    $sql = "
        INSERT INTO projetos
        (
            nome,
            descricao,
            tecnologias,
            link_github,
            ano,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $dados['nome'],
        $dados['descricao'] ?? '',
        $dados['tecnologias'] ?? '',
        $dados['link_github'] ?? '',
        $dados['ano'] ?? date('Y'),
        'publicado'
    ]);


    http_response_code(201);

    echo json_encode([
        'id' => (int) $pdo->lastInsertId()
    ]);

    exit;
}



// =====================================================
// PUT - ALTERAR PROJETO
// =====================================================

if ($metodo === 'PUT') {

    // Precisa receber ?id=N
    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            'erro' => 'PUT exige o id na URL: ?id=N'
        ]);

        exit;
    }


    $dados = json_decode(
        file_get_contents('php://input'),
        true
    );


    if (
        !$dados ||
        empty($dados['nome'])
    ) {

        http_response_code(400);

        echo json_encode([
            'erro' => 'Informe pelo menos o nome do projeto'
        ]);

        exit;
    }


    $sql = "
        UPDATE projetos
        SET
            nome = ?,
            descricao = ?,
            tecnologias = ?,
            link_github = ?,
            ano = ?
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $dados['nome'],
        $dados['descricao'] ?? '',
        $dados['tecnologias'] ?? '',
        $dados['link_github'] ?? '',
        $dados['ano'] ?? date('Y'),
        $id
    ]);


    echo json_encode([
        'mensagem' => 'Projeto atualizado'
    ]);

    exit;
}



// =====================================================
// DELETE - APAGAR PROJETO
// =====================================================

if ($metodo === 'DELETE') {

    // Precisa receber ?id=N
    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            'erro' => 'DELETE exige o id na URL: ?id=N'
        ]);

        exit;
    }


    $stmt = $pdo->prepare(
        'DELETE FROM projetos WHERE id = ?'
    );

    $stmt->execute([$id]);


    // Se não apagou nada, projeto não existe
    if ($stmt->rowCount() === 0) {

        http_response_code(404);

        echo json_encode([
            'erro' => 'Projeto não encontrado'
        ]);

        exit;
    }


    // Apagado com sucesso
    http_response_code(204);

    exit;
}



// =====================================================
// MÉTODO NÃO PERMITIDO
// =====================================================

http_response_code(405);

echo json_encode([
    'erro' => 'Método não permitido'
]);