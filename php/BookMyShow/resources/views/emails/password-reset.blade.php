<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }

        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }

        .content {
            padding: 20px;
            background-color: white;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }

        .footer {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello {{ $userName }},</p>

            <p>You are receiving this email because we received a password reset request for your account.</p>

            <p>Click the button below to reset your password:</p>

            <a href="{!! $resetLink !!}" class="button">Reset Password</a>

            <p>Or copy and paste this link into your browser:</p>
            <p><a href="{!! $resetLink !!}">{!! $resetLink !!}</a></p>

            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>

            <p>This password reset link will expire in 60 minutes.</p>

            <p>Thank you,<br>BookMyShow Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} BookMyShow. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
