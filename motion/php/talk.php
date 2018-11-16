<?php

header("Access-Control-Allow-Origin: *");

session_start(); 

$inputText = trim($_POST['inputText']); // "天气";//

$sth = '{
    "reqType":0,
    "perception": {
        "inputText": {
            "text": "'.$inputText.'"
        }
    },
    "userInfo": {
        "apiKey": "cf5fb4b68b69473d91d447667194f578",
        "userId": "348368"
    }
}';
// echo $sth;

$url = "http://openapi.tuling123.com/openapi/api/v2";    
$content = $sth;//json_encode("your data to be sent");

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER,
        array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

$json_response = curl_exec($curl);

$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

// if ( $status != 201 ) {
//     die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
// }


curl_close($curl);

// $response = json_decode($json_response, true);

echo $json_response;

?>