export function PrivacyPolicyPage() {
	return (
		<div className="w-full py-6 px-4 md:px-6 lg:px-8" style={{ background: '#000000', minHeight: '100vh', width: '100%' }}>
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 
						className="text-white mb-4"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontWeight: 700,
							fontStyle: 'italic',
							fontSize: '48px',
							lineHeight: '110%',
							letterSpacing: '-1%',
							textTransform: 'capitalize'
						}}
					>
						Privacy Policy
					</h1>
					<p 
						className="text-white"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '14px',
							fontWeight: 400,
							color: '#FFFFFFB2'
						}}
					>
						Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
					</p>
				</div>

				{/* Content Card */}
				<div 
					className="rounded-2xl p-8 mb-6"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<p 
						className="text-white mb-8"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '16px',
							fontWeight: 400,
							lineHeight: '1.6',
							color: '#FFFFFFB2'
						}}
					>
						PostoryAI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website, application, and services (collectively, the "Service").
					</p>

					{/* Section 1 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							1. Information We Collect
						</h2>
						
						<h3 
							className="text-white mb-3 mt-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '20px',
								fontWeight: 600,
								color: '#FFFFFF'
							}}
						>
							1.1 Information You Provide
						</h3>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Name and email address</li>
							<li>Account credentials</li>
							<li>Support or contact messages</li>
						</ul>

						<h3 
							className="text-white mb-3 mt-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '20px',
								fontWeight: 600,
								color: '#FFFFFF'
							}}
						>
							1.2 Social Media Data
						</h3>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							When you connect your Instagram or other social media accounts, we may access:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Posts, captions, media URLs</li>
							<li>Likes count and comments count</li>
							<li>Timestamps and permalinks</li>
						</ul>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We only access data you explicitly authorize.
						</p>

						<h3 
							className="text-white mb-3 mt-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '20px',
								fontWeight: 600,
								color: '#FFFFFF'
							}}
						>
							1.3 Technical Data
						</h3>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>IP address</li>
							<li>Browser and device information</li>
							<li>Log files and usage data</li>
						</ul>
					</div>

					{/* Section 2 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							2. How We Use Your Information
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We use your information to:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Provide and operate the Service</li>
							<li>Display analytics and engagement insights</li>
							<li>Improve performance and user experience</li>
							<li>Ensure security and prevent fraud</li>
							<li>Communicate with you (support, updates)</li>
						</ul>
					</div>

					{/* Section 3 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							3. Legal Basis for Processing (GDPR)
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							If you are located in the EU or UK, we process your data based on:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Your consent</li>
							<li>Performance of a contract</li>
							<li>Legitimate business interests</li>
							<li>Legal obligations</li>
						</ul>
					</div>

					{/* Section 4 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							4. Social Media Platform Compliance
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							PostoryAI complies with Meta / Instagram Platform Policies:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>We do not sell social media data</li>
							<li>We do not post or modify content without permission</li>
							<li>Access tokens are stored securely and refreshed automatically</li>
						</ul>
					</div>

					{/* Section 5 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							5. Data Storage & Security
						</h2>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We implement appropriate technical and organizational measures to protect your data. However, no online service can guarantee absolute security.
						</p>
					</div>

					{/* Section 6 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							6. Data Sharing
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We do <strong style={{ color: '#FFFFFF' }}>not</strong> sell your personal data. We may share data only with:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Trusted infrastructure providers (hosting, databases)</li>
							<li>Authorities if required by law</li>
						</ul>
					</div>

					{/* Section 7 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							7. Data Retention
						</h2>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We retain personal and social media data only for as long as necessary to provide the Service or comply with legal obligations. You may request deletion at any time.
						</p>
					</div>

					{/* Section 8 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							8. Your Rights
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							Depending on your location, you may have the right to:
						</p>
						<ul 
							className="list-disc list-inside mb-4 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Access your data</li>
							<li>Correct inaccurate data</li>
							<li>Request deletion</li>
							<li>Withdraw consent</li>
							<li>Data portability</li>
						</ul>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							To exercise these rights, contact us using the details below.
						</p>
					</div>

					{/* Section 9 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							9. Cookies
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We may use cookies or similar technologies to:
						</p>
						<ul 
							className="list-disc list-inside mb-6 ml-4 space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							<li>Maintain sessions</li>
							<li>Analyze usage</li>
							<li>Improve performance</li>
						</ul>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							You can control cookies through your browser settings.
						</p>
					</div>

					{/* Section 10 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							10. Changes to This Policy
						</h2>
						<p 
							className="mb-6"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							We may update this Privacy Policy from time to time. Continued use of the Service after changes means you accept the updated policy.
						</p>
					</div>

					{/* Section 11 */}
					<div className="mb-8">
						<h2 
							className="text-white mb-4"
							style={{
								fontFamily: 'Playfair Display, serif',
								fontWeight: 600,
								fontStyle: 'italic',
								fontSize: '32px',
								lineHeight: '110%',
								letterSpacing: '-1%',
								textTransform: 'capitalize'
							}}
						>
							11. Contact Us
						</h2>
						<p 
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2'
							}}
						>
							If you have questions or privacy requests, contact us at:
						</p>
						<a 
							href="mailto:privacy@postoryai.com"
							className="inline-block"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								color: '#9747FF',
								textDecoration: 'none'
							}}
						>
							📧 privacy@postoryai.com
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
