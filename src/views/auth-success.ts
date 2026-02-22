export const authSuccessHtml = `<!doctype html>
<html>
	<head>
		<title>Authentication Successful</title>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			rel="stylesheet"
		/>
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}

			body {
				font-family:
					"Inter",
					-apple-system,
					BlinkMacSystemFont,
					"Segoe UI",
					sans-serif;
				display: flex;
				justify-content: center;
				align-items: center;
				min-height: 100vh;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				padding: 1rem;
			}

			.container {
				text-align: center;
				padding: 3rem 2rem;
				background: white;
				border-radius: 24px;
				box-shadow:
					0 20px 60px rgba(0, 0, 0, 0.15),
					0 8px 20px rgba(0, 0, 0, 0.1);
				max-width: 480px;
				width: 100%;
				animation: slideIn 0.4s ease-out;
			}

			@keyframes slideIn {
				from {
					opacity: 0;
					transform: translateY(20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}

			.logo-container {
				margin-bottom: 1.5rem;
			}

			.logo {
				width: 80px;
				height: 80px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 20px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 2.5rem;
				box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
				animation: bounce 0.6s ease-out 0.2s;
			}

			@keyframes bounce {
				0%,
				100% {
					transform: scale(1);
				}
				50% {
					transform: scale(1.1);
				}
			}

			h1 {
				color: #1a202c;
				font-size: 1.75rem;
				font-weight: 700;
				margin-bottom: 0.5rem;
				letter-spacing: -0.5px;
			}

			.subtitle {
				color: #718096;
				font-size: 1rem;
				margin-bottom: 2rem;
				font-weight: 400;
			}

			.spinner-container {
				margin: 2rem 0;
			}

			.spinner {
				width: 48px;
				height: 48px;
				border: 4px solid #e2e8f0;
				border-top: 4px solid #667eea;
				border-radius: 50%;
				animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
				margin: 0 auto;
			}

			@keyframes spin {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}

			.message {
				color: #4a5568;
				font-size: 0.95rem;
				margin-bottom: 0.5rem;
				font-weight: 500;
			}

			.note {
				color: #a0aec0;
				font-size: 0.875rem;
				font-weight: 400;
			}

			.progress-bar {
				width: 100%;
				height: 4px;
				background: #e2e8f0;
				border-radius: 2px;
				margin-top: 2rem;
				overflow: hidden;
			}

			.progress-fill {
				height: 100%;
				background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
				border-radius: 2px;
				animation: progress 1.5s ease-out;
			}

			@keyframes progress {
				from {
					width: 0%;
				}
				to {
					width: 100%;
				}
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="logo-container">
				<div class="logo">✓</div>
			</div>
			<h1>Authentication Successful!</h1>
			<p class="subtitle">Welcome back to Career Land</p>

			<div class="spinner-container">
				<div class="spinner"></div>
			</div>

			<p class="message">Redirecting you to the dashboard...</p>
			<p class="note">This window will close automatically</p>

			<div class="progress-bar">
				<div class="progress-fill"></div>
			</div>
		</div>
		<script>
			// Notify parent window if opened as popup
			if (window.opener) {
				window.opener.postMessage({ type: "auth-success" }, "*");
			}

			// Close window after a short delay
			setTimeout(() => {
				window.close();
				// If window.close() doesn't work (not a popup), redirect to home
				if (!window.closed) {
					window.location.href = "/";
				}
			}, 1500);
		</script>
	</body>
</html>`;
