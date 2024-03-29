<?php

if (!$_POST) exit;

function isEmail($email) {
    return (preg_match("/^[-_.[:alnum:]]+@((([[:alnum:]]|[[:alnum:]][[:alnum:]-]*[[:alnum:]])\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i", $email));
}

if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

// Funktion, um die IP-Adresse des Benutzers zu erhalten
function getRealIpAddr() {
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   // check IP from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   // to check for proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else
        $ip = $_SERVER['REMOTE_ADDR'];
    return $ip;
}

$user_ip = getRealIpAddr();
$user_agent = $_SERVER['HTTP_USER_AGENT'];

$e_reply .= "<p><b>IP-Adresse:</b> $user_ip</p>";

$name = stripslashes($_POST['name']);
$email = stripslashes($_POST['email']);
$comments = stripslashes($_POST['comments']);

if (trim($name) == '') {
    echo '<div class="error_message">Du musst deinen Namen eingeben.</div>';
    exit();
} else if (trim($email) == '') {
    echo '<div class="error_message">Bitte gib eine gültige E-Mail Adresse ein.</div>';
    exit();
} else if (!isEmail($email)) {
    echo '<div class="error_message">Du hast eine ungültige E-Mail Adresse eingegeben, versuche es erneut.</div>';
    exit();
} else if (trim($comments) == '') {
    echo '<div class="error_message">Bitte hinterlasse eine Nachricht.</div>';
    exit();
}

if (get_magic_quotes_gpc()) {
    $comments = stripslashes($comments);
}

$address = "info@maxipape.com";

$e_subject = 'Anfrage von ' . $name . '';

$e_body = "Die Nachricht lautet wie folgt:" . PHP_EOL . PHP_EOL;
$e_content = "$comments" . PHP_EOL . PHP_EOL;
$e_reply = "Name: $name ". PHP_EOL . "E-Mail: $email" . PHP_EOL . PHP_EOL . "IP-Adresse: $user_ip";

$msg = wordwrap($e_body . $e_content . $e_reply, 70);

$headers = "From: info@maxipape.com" . PHP_EOL;
$headers .= "Reply-To: $email" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;

if (mail($address, $e_subject, $msg, $headers)) {
    
    echo "<fieldset>";
    echo "<div id='success_page'>";
    echo "<h3>Nachricht erfolgreich gesendet.</h3>";
    echo "<p>Vielen Dank <strong>$name</strong>, deine Nachricht wurde übermittelt.</p>";
    echo "</div>";
    echo "</fieldset>";
} else {
    
    echo 'Fehler beim Versenden der E-Mail!';
    var_dump(error_get_last());
}

?>