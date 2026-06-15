<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

try {

    if (isset($_GET['id'])) {

        $stmt = $pdo->prepare(
            "SELECT id, nome, descricao, tecnologias, link_github, ano
             FROM projetos
             WHERE id = ? AND status = 'publicado'"
        );

        $stmt->execute([$_GET['id']]);

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

    $stmt = $pdo->prepare(
        "SELECT id, nome, descricao, tecnologias, link_github, ano
         FROM projetos
         WHERE status = 'publicado'"
    );

    $stmt->execute();

    echo json_encode($stmt->fetchAll());

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'erro' => 'Falha no banco de dados'
    ]);
}