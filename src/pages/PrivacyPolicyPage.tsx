import { useEffect } from 'react';

export function PrivacyPolicyPage() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
						Politique de Confidentialité
					</h1>
					
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
						PostoryAI ("nous", "notre" ou "nos") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre site web, application et services (collectivement, le "Service").
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
							1. Informations que Nous Collectons
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
							1.1 Informations que Vous Fournissez
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
							<li>Nom et adresse e-mail</li>
							<li>Identifiants de compte</li>
							<li>Messages de support ou de contact</li>
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
							1.2 Données des Réseaux Sociaux
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
							Lorsque vous connectez votre compte Instagram ou d'autres comptes de réseaux sociaux, nous pouvons accéder à :
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
							<li>Publications, légendes, URLs des médias</li>
							<li>Nombre de likes et de commentaires</li>
							<li>Horodatages et permaliens</li>
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
							Nous n'accédons qu'aux données que vous autorisez explicitement.
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
							1.3 Données Techniques
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
							<li>Adresse IP</li>
							<li>Informations sur le navigateur et l'appareil</li>
							<li>Fichiers journaux et données d'utilisation</li>
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
							2. Comment Nous Utilisons Vos Informations
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
							Nous utilisons vos informations pour :
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
							<li>Fournir et exploiter le Service</li>
							<li>Afficher des analyses et des insights d'engagement</li>
							<li>Améliorer les performances et l'expérience utilisateur</li>
							<li>Assurer la sécurité et prévenir la fraude</li>
							<li>Communiquer avec vous (support, mises à jour)</li>
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
							3. Base Légale du Traitement (RGPD)
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
							Si vous êtes situé dans l'UE ou au Royaume-Uni, nous traitons vos données sur la base de :
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
							<li>Votre consentement</li>
							<li>L'exécution d'un contrat</li>
							<li>Des intérêts légitimes de l'entreprise</li>
							<li>Des obligations légales</li>
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
							5. Stockage et Sécurité des Données
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
							Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données. Cependant, aucun service en ligne ne peut garantir une sécurité absolue.
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
							7. Conservation des Données
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
							Nous conservons les données personnelles et des réseaux sociaux uniquement aussi longtemps que nécessaire pour fournir le Service ou respecter les obligations légales. Vous pouvez demander la suppression à tout moment.
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
							8. Vos Droits
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
							Selon votre localisation, vous pouvez avoir le droit de :
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
							<li>Accéder à vos données</li>
							<li>Corriger les données inexactes</li>
							<li>Demander la suppression</li>
							<li>Retirer votre consentement</li>
							<li>Portabilité des données</li>
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
							Pour exercer ces droits, contactez-nous en utilisant les coordonnées ci-dessous.
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
							Nous pouvons utiliser des cookies ou des technologies similaires pour :
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
							<li>Maintenir les sessions</li>
							<li>Analyser l'utilisation</li>
							<li>Améliorer les performances</li>
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
							Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
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
							10. Modifications de Cette Politique
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
							Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. L'utilisation continue du Service après les modifications signifie que vous acceptez la politique mise à jour.
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
							Pour toute question ou demande relative à la confidentialité, veuillez nous contacter à l'adresse suivante :
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
							📧 contact@postoryai.com
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
