import { useEffect } from 'react';

export function TermsPage() {
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
							textTransform: 'capitalize',
						}}
					>
						Conditions Générales d&apos;Utilisation
					</h1>
				
				</div>

				{/* Content Card */}
				<div
					className="rounded-2xl p-8 mb-6"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A',
					}}
				>
					<p
						className="text-white mb-8"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '16px',
							fontWeight: 400,
							lineHeight: '1.6',
							color: '#FFFFFFB2',
						}}
					>
						Bienvenue sur <strong style={{ color: '#FFFFFF' }}>PostoryAI</strong>. En accédant à notre site web,
						à notre application ou à nos services (collectivement, le « Service »), vous acceptez d&apos;être lié
						par les présentes Conditions Générales d&apos;Utilisation. Si vous n&apos;acceptez pas ces conditions,
						veuillez ne pas utiliser le Service.
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
								textTransform: 'capitalize',
							}}
						>
							1. À propos de PostoryAI
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							PostoryAI fournit des outils permettant de se connecter à des plateformes de réseaux sociaux (y
							compris Instagram), de récupérer du contenu et des données d&apos;engagement, et de proposer des
							analyses, de l&apos;automatisation et des insights pour des usages professionnels et marketing.
						</p>
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
								textTransform: 'capitalize',
							}}
						>
							2. Éligibilité
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Vous devez avoir au moins 18 ans et être capable de conclure un contrat juridiquement contraignant
							pour utiliser le Service.
						</p>
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
								textTransform: 'capitalize',
							}}
						>
							3. Comptes Utilisateur
						</h2>
						<ul
							className="list-disc list-inside space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							<li>Vous êtes responsable de la confidentialité de vos identifiants de connexion.</li>
							<li>Vous êtes responsable de toutes les activités effectuées via votre compte.</li>
							<li>Vous vous engagez à fournir des informations exactes, complètes et à jour.</li>
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
								textTransform: 'capitalize',
							}}
						>
							4. Utilisation des APIs de Tiers
						</h2>
						<p
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							PostoryAI s&apos;intègre à des plateformes tierces telles que l&apos;API Meta / Instagram Graph.
						</p>
						<ul
							className="list-disc list-inside space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							<li>
								Votre utilisation de ces intégrations est également soumise aux conditions et politiques de ces
								plateformes tierces.
							</li>
							<li>
								Nous ne sommes pas responsables des changements, limitations ou interruptions causés par les
								plateformes tierces.
							</li>
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
								textTransform: 'capitalize',
							}}
						>
							5. Utilisation Acceptable
						</h2>
						<p
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Vous vous engagez à ne pas&nbsp;:
						</p>
						<ul
							className="list-disc list-inside space-y-2"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							<li>Utiliser le Service à des fins illégales ou frauduleuses.</li>
							<li>Violer toute loi applicable ou les droits de tiers.</li>
							<li>
								Tenter de désosser, perturber, surcharger ou abuser du Service, y compris toute tentative
								d&apos;ingénierie inverse.
							</li>
						</ul>
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
								textTransform: 'capitalize',
							}}
						>
							6. Propriété Intellectuelle
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Tous les contenus, marques, logos et logiciels liés à PostoryAI sont la propriété de PostoryAI ou de
							ses concédants de licence. Vous ne pouvez pas copier, modifier ou distribuer ces éléments sans notre
							autorisation écrite préalable.
						</p>
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
								textTransform: 'capitalize',
							}}
						>
							7. Disponibilité du Service
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Nous faisons de notre mieux pour maintenir le Service disponible, mais nous ne garantissons pas un
							fonctionnement ininterrompu ou sans erreur. Nous pouvons modifier, suspendre ou interrompre tout ou
							partie du Service à tout moment.
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
								textTransform: 'capitalize',
							}}
						>
							8. Limitation de Responsabilité
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Dans les limites autorisées par la loi applicable, PostoryAI ne pourra en aucun cas être tenu
							responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de votre
							utilisation du Service.
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
								textTransform: 'capitalize',
							}}
						>
							9. Résiliation
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Nous nous réservons le droit de suspendre ou de résilier votre accès au Service si vous violez les
							présentes Conditions ou toute loi applicable.
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
								textTransform: 'capitalize',
							}}
						>
							10. Modifications des Présentes Conditions
						</h2>
						<p
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Nous pouvons mettre à jour ces Conditions Générales d&apos;Utilisation de temps à autre. La
							poursuite de l&apos;utilisation du Service après la publication des modifications vaut acceptation
							des nouvelles conditions.
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
								textTransform: 'capitalize',
							}}
						>
							11. Contact
						</h2>
						<p
							className="mb-4"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '1.6',
								color: '#FFFFFFB2',
							}}
						>
							Pour toute question concernant ces Conditions, vous pouvez nous contacter à&nbsp;:
						</p>
						<a
							href="mailto:support@postoryai.com"
							className="inline-block"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '16px',
								fontWeight: 400,
								color: '#9747FF',
								textDecoration: 'none',
							}}
						>
							📧 support@postoryai.com
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

