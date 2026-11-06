<?php
declare(strict_types=1);

header('Content-Type: application/manifest+json; charset=utf-8');
header('Cache-Control: public, max-age=300');
$manifest = file_get_contents(__DIR__ . '/manifest.webmanifest');
$iconTime = file_exists(__DIR__ . '/assets/chemsou-logo.png') ? filemtime(__DIR__ . '/assets/chemsou-logo.png') : time();
echo str_replace('__ICON_VERSION__', (string)$iconTime, $manifest);
