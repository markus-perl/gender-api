gender-api
==========

jQuery Plugin for the famous <a href="https://gender-api.com">Gender API</a> API.

The gender determination api only requires a first name or an e-mail address containing a first name.

1000 requests to the gender api are free every month. 
If you need more requests you can init the jquery plugin with an api key.

With every query a accuracy value is given back how sure the api is to match the right gender.


Usage
-----

	<script type="text/javascript" src="https://gender-api.com/js/jquery/gender.min.js"></script>


	<script type="text/javascript">
	$('input#firstname').genderApi({key: genderApiClientKey}).on('gender-found', function(e, result) {
		if (result.accuracy >= 60) {
			alert('Gender found: ' + result.gender);
		}
	});
	</script>


Everytime a new gender is found the plugin will trigger an event called 'gender-found'.


Resources
---------

<a href="https://gender-api.com/en/jquery-plugin">Gender API Plugin Website</a>

<a href="https://gender-api.com/en/api-docs">API Docs</a>
