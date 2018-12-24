<?php

	header('Content-Type: text/plain; charset=utf-8');
//	error_reporting(E_ALL); ini_set('display_errors', 1);

	$data = (object) array(
		'emails' => array(
			' ',
			),
		'sub' => (!empty($_REQUEST['form']))?trim(strip_tags($_REQUEST['form'])):'',
		'names' => array(
				'name' => 'Имя',
				'email' => 'E-mail',
				'phone' => 'Телефон',
				'datepicker' => 'Дата брони',
			),
		'fromemail' => 'no-reply@'.$_SERVER['HTTP_HOST'],
		'fromtext' => 'Сообщение с сайта '.$_SERVER['HTTP_HOST'],
		'files' => false
	);
	
	if ((!empty($_REQUEST['phone']) || !empty($_REQUEST['email'])) ) {
		echo SendEmail($data);
	}

	function SendEmail($data) {
		require 'PHPMailer/PHPMailerAutoload.php';
		$mail = new PHPMailer;
//		$mail->SMTPDebug = 3;
//		$data->fromemail = setSMTP($mail); // Включаем SMTP
		$mail->isHTML(false);
		$mail->CharSet = "utf-8";
		$mail->From = $data->fromemail;
		$mail->FromName = $data->fromtext;
		$mail->setFrom($data->fromemail, $data->fromtext);
		
		foreach($data->emails as $value) $mail->addAddress($value);
		
		$mail->Subject = 'Сообщение с формы "'.$data->sub.'" от '.date('d-m-Y H:i');
		
		$message = '';
		foreach($data->names as $key => $value) {
			if (!empty($_REQUEST[$key])) $message .= "$value: ".trim(strip_tags($_REQUEST[$key]))."\n";
		}
		
		$mail->Body = $message;
		
		//if (!empty($_FILES) && !empty($_FILES[$data->files])) $mail->AddAttachment($_FILES[$data->files]['tmp_name'], basename($_FILES[$data->files]['name']));
		
		if ($data->files && !empty($_FILES)) {
			foreach($_FILES as $fpack => $fdata) {
				if (is_array($fdata['tmp_name'])) {
					foreach($fdata['tmp_name'] as $key => $path) {
						$mail->AddAttachment($path, basename($fdata['name'][$key]));
					}
				} else {
					$mail->AddAttachment($fdata['tmp_name'], basename($fdata['name']));
				}
			}
		}
		
		return $mail->send();
		
	}
	
	
	
	function validator() {
		
		$validated = array();
	//	if ( !empty($_POST['name']) && !preg_match('/^[a-zA-Zа-яА-ЯёЁ\- .]+$/ui', $_POST['name']) ) { $validated['wrong'][] = 'name'; }
		if ( !empty($_REQUEST['phone']) && !preg_match("/^\+7 \(([0-9]{3})\) ([0-9]{3})\-([0-9]{2})\-([0-9]{2})$/",trim(strip_tags($_REQUEST['phone']))) ) { $validated['wrong'][] = 'phone'; }
		if ( !empty($_REQUEST['email']) && !preg_match("/.+@.+\..+/i",trim(strip_tags($_REQUEST['email']))) ) { $validated['wrong'][] = 'email'; }
		
		return (empty($validated) ? false : $validated);
	//	return (empty($validated) ? true : false);
	}
	
	function setSMTP($mail) {
			$mail->isSMTP();					// Set mailer to use SMTP
			$mail->Host = 'smtp.yandex.ru';		// Specify main and backup SMTP servers
			$mail->SMTPAuth = true;				// Enable SMTP authentication
			$mail->Username = '@yandex.ru';		// SMTP username
			$mail->Password = '';				// SMTP password
			$mail->SMTPSecure = 'ssl';			// Enable TLS encryption, `ssl` also accepted
			$mail->Port = 465;
			return $mail->Username;
	}
?>
