<?php
	$base = $_REQUEST["url"];
	unset($_REQUEST["url"]);
	$url = $base."?".http_build_query($_REQUEST);
	//echo $url;
	$contents = file_get_contents($url);
	echo $contents;
?>
