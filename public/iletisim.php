<?php
/**
 * BALCIOĞLU MAKİNA - İLETİŞİM FORMU
 * SADECE PHP - GÜVENLİ
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Sadece POST istekleri kabul edilir.');
}

// Rate limiting
session_start();
$lastSubmit = $_SESSION['last_submit'] ?? 0;
if ((time() - $lastSubmit) < 60) {
    die('<script>alert("Lütfen 1 dakika bekleyin."); window.history.back();</script>');
}
$_SESSION['last_submit'] = time();

// Güvenlik fonksiyonu
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    // Yasaklı karakterler: >£#$½{[]}\|!'^+%&/()=?_
    $yasakli = ['>', '£', '#', '$', '½', '{', '}', '[', ']', '\\', '|', '!', "'", '^', '+', '%', '&', '/', '(', ')', '=', '?', '_', '<', '"', '`'];
    $data = str_replace($yasakli, '', $data);
    
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone($phone) {
    $clean = preg_replace('/\s+/', '', $phone);
    return preg_match('/^[0-9]{10}$/', $clean);
}

// Verileri al ve temizle
$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

// Validasyon
$errors = [];

if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'İsim 2-100 karakter arasında olmalıdır.';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Geçerli bir e-posta adresi giriniz.';
}

if (empty($phone) || !validatePhone($phone)) {
    $errors[] = 'Geçerli bir telefon numarası giriniz (10 haneli).';
}

if (empty($subject)) {
    $errors[] = 'Konu seçimi zorunludur.';
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 1000) {
    $errors[] = 'Mesaj 10-1000 karakter arasında olmalıdır.';
}

if (!empty($errors)) {
    $errorText = implode('\n', $errors);
    die("<script>alert('Hata:\\n{$errorText}'); window.history.back();</script>");
}

// E-posta gönderimi
$to = 'balcioglumakina@gmail.com';
$emailSubject = "İletişim Formu: " . $subject;

$htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px; }
        table { width: 100%; margin-top: 20px; }
        td { padding: 8px 0; }
        .label { font-weight: bold; color: #374151; width: 120px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <h2>Yeni İletişim Formu Mesajı</h2>
    
    <table>
        <tr><td class='label'>İsim:</td><td>{$name}</td></tr>
        <tr><td class='label'>E-posta:</td><td>{$email}</td></tr>
        <tr><td class='label'>Telefon:</td><td>{$phone}</td></tr>
        <tr><td class='label'>Konu:</td><td>{$subject}</td></tr>
        <tr><td class='label' valign='top'>Mesaj:</td><td>".nl2br($message)."</td></tr>
    </table>
    
    <div class='footer'>
        <p>Balcıoğlu Makina - İletişim Formu</p>
        <p>Gönderim Zamanı: ".date('d.m.Y H:i')."</p>
        <p>IP: ".$_SERVER['REMOTE_ADDR']."</p>
    </div>
</body>
</html>
";

$textMessage = "
Yeni İletişim Formu Mesajı

İsim: {$name}
E-posta: {$email}
Telefon: {$phone}
Konu: {$subject}
Mesaj: {$message}

Gönderim Zamanı: ".date('d.m.Y H:i')."
IP: ".$_SERVER['REMOTE_ADDR']."
";

$headers = "MIME-Version: 1.1\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$name} <{$email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $emailSubject, $htmlMessage, $headers)) {
    // Text versiyonu da gönder
    $textHeaders = "From: {$name} <{$email}>\r\n";
    $textHeaders .= "Reply-To: {$email}\r\n";
    mail($to, $emailSubject, $textMessage, $textHeaders);
    
    echo '<script>alert("Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."); window.location.href="/iletisim";</script>';
} else {
    echo '<script>alert("Mesaj gönderilemedi. Lütfen telefon ile iletişime geçin.\\nTel: 0535 396 97 68"); window.history.back();</script>';
}
?>