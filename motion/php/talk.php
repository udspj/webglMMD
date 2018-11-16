<?php

header("Access-Control-Allow-Origin: *");

$sth = '{
	"reqType":0,
    "perception": {
        "inputText": {
            "text": "天气"
        },
        "inputImage": {
            "url": "imageUrl"
        },
        "selfInfo": {
            "location": {
                "city": "上海",
                "province": "上海",
                "street": "信息路"
            }
        }
    },
    "userInfo": {
        "apiKey": "cf5fb4b68b69473d91d447667194f578",
        "userId": "348368"
    }
}'

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

if ( $status != 201 ) {
    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
}


curl_close($curl);

$response = json_decode($json_response, true);

print $response;

?>