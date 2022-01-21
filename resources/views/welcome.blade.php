<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanctum</title>
  <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body class="font-sans antialiased">
  <div id="app" data-logged-in="{{ $isLoggedIn ? 1 : 0 }}"></div>
  <script src="{{ mix('js/manifest.js') }}"></script>
  <script src="{{ mix('js/vendor.js') }}"></script>
  <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>