import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMetaStore } from '../stores/metaStore';
import { getErrorMessage } from '../lib/getErrorMessage';

export function FacebookCallbackPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { fetchPages } = useMetaStore();

	useEffect(() => {
		const success = searchParams.get('success');
		const pages = searchParams.get('pages');
		const error = searchParams.get('error');

		if (success === 'true') {
			// OAuth successful, fetch pages and redirect to settings
			fetchPages().then(() => {
				setTimeout(() => {
					navigate('/settings?tab=facebook');
				}, 2000);
			}).catch((err) => {
				const message = getErrorMessage(err, 'Connexion reussie mais impossible de charger les pages Facebook');
				navigate(`/settings?tab=facebook&error=${encodeURIComponent(message)}`);
			});
		} else if (error) {
			// OAuth failed, redirect to settings with error
			setTimeout(() => {
				navigate(`/settings?tab=facebook&error=${encodeURIComponent(error)}`);
			}, 2000);
		} else {
			// Unknown state, redirect to settings
			navigate('/settings?tab=facebook');
		}
	}, [searchParams, navigate, fetchPages]);

	const success = searchParams.get('success');
	const error = searchParams.get('error');
	const pages = searchParams.get('pages');

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="card p-8 max-w-md w-full text-center">
				{success === 'true' ? (
					<>
						<div className="mb-4">
							<svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
						<p className="text-gray-600 mb-4">
							Facebook connection successful! {pages && `Connected ${pages} page(s).`}
						</p>
						<p className="text-sm text-gray-500">Redirecting to settings...</p>
					</>
				) : error ? (
					<>
						<div className="mb-4">
							<svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
						<p className="text-gray-600 mb-4">{error}</p>
						<p className="text-sm text-gray-500">Redirecting to settings...</p>
					</>
				) : (
					<>
						<div className="mb-4">
							<div className="mx-auto h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
						</div>
						<p className="text-gray-600">Processing Facebook connection...</p>
					</>
				)}
			</div>
		</div>
	);
}
