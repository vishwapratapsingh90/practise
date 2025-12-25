<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    <script>
        window.config = {!! json_encode([
            'appName' => config('app.name'),
            'appUrl' => config('app.url'),
            'appEnv' => config('app.env'),
            'locale' => app()->getLocale(),
            'translations' => [
                'messages' => trans('messages'),
            ],
        ]) !!};
    </script>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>
