<?php
	$params = array_change_key_case($_REQUEST, CASE_LOWER);
	$base = $params["url"];
	unset($params["url"]);
	$url = $base."?".http_build_query($params);
	//echo $url;
	$contents = file_get_contents($url);
	echo $contents;
?>
