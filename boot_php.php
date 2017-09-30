<?php require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
$fb = new Facebook\Facebook([
                                   'app_id' => '1748103965504564',
                                   'app_secret' => '86f9c9a878ba602314446f64e2425364',
                                   'default_graph_version' => 'v2.8',]);
$fb->setDefaultAccessToken('EAAY15Cvk9DQBACZCnCdcxpvVAqZCyEblqeZCRVaZAD62RM8mgCP9lnjPnBwO1tNUXHTRCi1fuYZAlwUZC4HdzszWL9XzlH1RlyMKu4kc8O1BDiqwYjY5wNB0OnUUjVPGZAEqlkxVvkkfZC5LMA78wA37yNa34b45QQkZD');
$token_1 = 'EAAY15Cvk9DQBACZCnCdcxpvVAqZCyEblqeZCRVaZAD62RM8mgCP9lnjPnBwO1tNUXHTRCi1fuYZAlwUZC4HdzszWL9XzlH1RlyMKu4kc8O1BDiqwYjY5wNB0OnUUjVPGZAEqlkxVvkkfZC5LMA78wA37yNa34b45QQkZD';
if(isset($_GET["keyword"])){
  $keyword = $_GET["keyword"];
  // $keyword = " usc";
  $choice = $_GET["choice"];
  $url_event = '/search?q='.$keyword.'&type='.$choice."&fields=id,name,picture.width(700).height(700)&access_token=".$token_1;

  try {
    header('Content-Type: application/json');
    $url="https://graph.facebook.com/v2.8$url_event";
    //echo $url;
    $url=preg_replace( '~\s~', '%20', $url);
    //echo $url;
  	$response = file_get_contents($url, false);
    echo $response;
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
  	// When Graph returns an error
  	echo 'Graph returned an error: ' . $e->getMessage();
  	exit;
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
  	// When validation fails or other local issues
  	echo 'Facebook SDK returned an error: ' . $e->getMessage();
  	exit;
  }
}
if(isset($_GET["id"])){
  $id = $_GET["id"];
  try {
    header('Content-Type: application/json');
    $url = "https://graph.facebook.com/v2.8/$id?fields=albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5)&access_token=$token_1";
    $url=preg_replace( '~\s~', '%20', $url);
    //echo $url;
  	$response = file_get_contents($url, false);
    echo $response;
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
  	// When Graph returns an error
  	echo 'Graph returned an error: ' . $e->getMessage();
  	exit;
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
  	// When validation fails or other local issues
  	echo 'Facebook SDK returned an error: ' . $e->getMessage();
  	exit;
  }
}
?>
