<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../conexao.php';

try {

    $stmt = $pdo->prepare(
        "SELECT id, nome, categoria, descricao, ano_criacao
         FROM tecnologias
         ORDER BY id"
    );

    $stmt->execute();

    echo json_encode(
        $stmt->fetchAll(),
        JSON_UNESCAPED_UNICODE
    );

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'erro' => 'Falha no banco de dados',
        'detalhes' => $e->getMessage()
    ]);
}