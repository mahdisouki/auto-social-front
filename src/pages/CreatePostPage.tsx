import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr', fr);
import { UploadIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import { useAuthStore } from '../stores/authStore';
import { uploadApi } from '../lib/api';

export function CreatePostPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { createPost, isLoading, error, clearError } = usePostsStore();
	const { user } = useAuthStore();
	
	const [formData, setFormData] = useState({
		productName: '',
		description: '',
		price: '',
		postType: '',
		currency: 'TND',
		caption: '',
		platform: [] as string[],
		scheduledAt: '',
		backgroundType: 'white',
		backgroundColor: '#ffffff',
		useModel: 'no',
		modelType: 'ai',
		modelEthnicity: 'european',
		modelGender: 'female',
		addText: 'no',
	});
	
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [uploadedImages, setUploadedImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessingImages, setIsProcessingImages] = useState(false);
	const [enhancedImageBlob, setEnhancedImageBlob] = useState<Blob | null>(null);
	const [enhancedImagePreview, setEnhancedImagePreview] = useState<string | null>(null);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [englishCaption, setEnglishCaption] = useState<string>('');
	const [arabicCaption, setArabicCaption] = useState<string>('');
	const [captionLanguage, setCaptionLanguage] = useState<'french' | 'arabic' | null>(null);
	const [generateCaption, setGenerateCaption] = useState<boolean>(false);
	const [customModelImage, setCustomModelImage] = useState<File | null>(null);
	const [customModelPreview, setCustomModelPreview] = useState<string | null>(null);
	const [openSections, setOpenSections] = useState<number[]>([1]);
	const [previewTab, setPreviewTab] = useState<'facebook' | 'instagram'>('facebook');

	const toggleSection = (num: number) => {
		setOpenSections(prev =>
			prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
		);
	};
	
	// Pre-fill schedule when navigating from Scheduler with scheduledDate (UTC ISO string)
	useEffect(() => {
		const scheduledDate = (location.state as { scheduledDate?: string } | null)?.scheduledDate;
		if (scheduledDate) {
			const d = new Date(scheduledDate);
			if (!isNaN(d.getTime())) {
				setSelectedDate(d);
				setFormData(prev => ({ ...prev, scheduledAt: scheduledDate }));
			}
		}
	}, [location.state]);

	// Cleanup object URLs when component unmounts
	useEffect(() => {
		return () => {
			imagePreviews.forEach(url => {
				if (url.startsWith('blob:')) {
					URL.revokeObjectURL(url);
				}
			});
			if (enhancedImagePreview) {
				URL.revokeObjectURL(enhancedImagePreview);
			}
		};
	}, [imagePreviews, enhancedImagePreview]);


	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
		if (error) clearError();
	};
	
	

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
		if (date) {
			// Save the exact time the user chose (e.g. 13:30) as UTC, so it doesn't shift by timezone
			const y = date.getFullYear();
			const m = date.getMonth();
			const d = date.getDate();
			const h = date.getHours();
			const min = date.getMinutes();
			const utcDate = new Date(Date.UTC(y, m, d, h, min, 0, 0));
			setFormData(prev => ({
				...prev,
				scheduledAt: utcDate.toISOString(),
			}));
		} else {
			setFormData(prev => ({
				...prev,
				scheduledAt: '',
			}));
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const imageFiles = files.filter(file => file.type.startsWith('image/'));
		
		if (imageFiles.length === 0) {
			alert('Please select only image files');
			return;
		}

		// Limit to single image
		if (uploadedImages.length >= 1) {
			alert('Please upload only one image at a time. Remove the existing image first.');
			return;
		}

		setIsProcessingImages(true);

		// Use only the first image
		const file = imageFiles[0];
		console.log('=== IMAGE UPLOAD DEBUG ===');
		console.log('File name:', file.name);
		console.log('File type:', file.type);
		console.log('File size:', file.size, 'bytes');
		
		try {
			// Create blob URL
			const objectURL = URL.createObjectURL(file);
			console.log('Created object URL:', objectURL);
			console.log('URL is valid:', objectURL.startsWith('blob:'));
			
			// Update state
			setUploadedImages([file]);
			setImagePreviews([objectURL]);
			
			console.log('State updated successfully');
		} catch (error) {
			console.error('ERROR creating object URL:', error);
			alert('Failed to load image preview. Please try again.');
		}
		
		setIsProcessingImages(false);

		// Clear the input so the same file can be selected again
		e.target.value = '';
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter(file => file.type.startsWith('image/'));
		
		if (imageFiles.length === 0) {
			alert('Please drop only image files');
			return;
		}

		// Limit to single image
		if (uploadedImages.length >= 1) {
			alert('Please upload only one image at a time. Remove the existing image first.');
			return;
		}

		setIsProcessingImages(true);

		// Use only the first image
		const file = imageFiles[0];
		console.log('Processing dropped file:', file.name, 'Type:', file.type, 'Size:', file.size);
		
		try {
			const objectURL = URL.createObjectURL(file);
			console.log('Generated object URL for dropped file:', objectURL);
			setUploadedImages([file]);
			setImagePreviews([objectURL]);
		} catch (error) {
			console.error('Error creating object URL for dropped file:', file.name, error);
		}
		
		setIsProcessingImages(false);
	};

	const removeImage = (index: number) => {
		// Clean up the object URL to prevent memory leaks
		const currentPreviews = imagePreviews;
		if (currentPreviews[index]) {
			URL.revokeObjectURL(currentPreviews[index]);
		}
		
		setUploadedImages(prev => prev.filter((_, i) => i !== index));
		setImagePreviews(prev => prev.filter((_, i) => i !== index));
	};

	const handleCustomModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		// Clean up previous preview
		if (customModelPreview) {
			URL.revokeObjectURL(customModelPreview);
		}

		// Create preview
		const previewUrl = URL.createObjectURL(file);
		setCustomModelImage(file);
		setCustomModelPreview(previewUrl);

		console.log('Custom model image uploaded:', file.name);
	};

	const removeCustomModel = () => {
		if (customModelPreview) {
			URL.revokeObjectURL(customModelPreview);
		}
		setCustomModelImage(null);
		setCustomModelPreview(null);
	};

	const handleEnhanceImage = async () => {
		if (uploadedImages.length === 0) {
			alert('Please upload an image first');
			return;
		}

		// Validate custom model if selected
		if (formData.useModel === 'yes' && formData.modelType === 'custom' && !customModelImage) {
			alert('Please upload a custom model image');
			return;
		}

		setIsUploading(true);

		try {
			const file = uploadedImages[0];
			console.log('🎨 Enhancing image with AI...');
			console.log(`Processing image: ${file.name}`);

			// Create FormData for genai.py endpoint
			const formDataAI = new FormData();
			formDataAI.append('file', file);
			formDataAI.append('background_type', formData.backgroundType);
			formDataAI.append('background_color', formData.backgroundColor);
			formDataAI.append('use_model', formData.useModel);
			formDataAI.append('model_type', formData.modelType);
			
			console.log('🔍 MODEL TYPE:', formData.modelType);
			
			// Only send ethnicity and gender for AI models
			if (formData.modelType === 'ai') {
				console.log('✅ AI MODEL - Adding ethnicity and gender');
				formDataAI.append('model_ethnicity', formData.modelEthnicity);
				formDataAI.append('model_gender', formData.modelGender);
			} else {
				console.log('❌ CUSTOM MODEL - Skipping ethnicity and gender');
			}
			
			// Send custom model image for custom models
			if (customModelImage && formData.modelType === 'custom') {
				console.log('✅ CUSTOM MODEL - Adding custom model image');
				formDataAI.append('custom_model_image', customModelImage);
			}
			
			formDataAI.append('add_text', formData.addText);
			formDataAI.append('generate_caption', generateCaption ? 'yes' : 'no');
			formDataAI.append('caption_language', captionLanguage || 'french');
			formDataAI.append('post_type', formData.postType || 'other');
			
			// Log all FormData entries
			console.log('📤 SENDING TO BACKEND:');
			for (let [key, value] of formDataAI.entries()) {
				if (value instanceof File) {
					console.log(`   ${key}: [File: ${value.name}]`);
				} else {
					console.log(`   ${key}: ${value}`);
				}
			}

			// Call genai.py API
			const pythonApiUrl = 'https://ai.postoryai.com';
			
			const aiResponse = await fetch(`${pythonApiUrl}/edit-product`, {
				method: 'POST',
				body: formDataAI,
			});

			if (!aiResponse.ok) {
				const errorText = await aiResponse.text();
				console.error('AI API Error:', errorText);
				throw new Error(`AI enhancement failed: ${aiResponse.statusText}`);
			}

			// Get the JSON response with image and captions
			const responseData = await aiResponse.json();
			console.log('✅ Response received:', responseData);

			// Convert base64 image to blob
			const imageData = atob(responseData.image);
			const imageArray = new Uint8Array(imageData.length);
			for (let i = 0; i < imageData.length; i++) {
				imageArray[i] = imageData.charCodeAt(i);
			}
			const enhancedBlob = new Blob([imageArray], { type: 'image/png' });
			console.log('✅ Image enhanced successfully, size:', enhancedBlob.size);

			// Create preview URL
			const previewUrl = URL.createObjectURL(enhancedBlob);
			setEnhancedImageBlob(enhancedBlob);
			setEnhancedImagePreview(previewUrl);
			
			// Set caption in state
			const generatedCaption = responseData.caption || '';
			
			// Store in appropriate state based on language (only when AI caption was requested)
			if (generateCaption && captionLanguage) {
				if (captionLanguage === 'french') {
					setEnglishCaption(generatedCaption);
					if (!arabicCaption) setArabicCaption('');
				} else {
					setArabicCaption(generatedCaption);
					if (!englishCaption) setEnglishCaption('');
				}
			}
			
			// Set caption in form (use generated if we requested it, else keep existing manual caption)
			setFormData(prev => ({
				...prev,
				caption: generateCaption ? generatedCaption : prev.caption,
			}));
			
			if (generateCaption) console.log(`📝 Generated ${captionLanguage} caption:`, generatedCaption);

		} catch (aiError) {
			console.error('Failed to enhance image:', aiError);
			alert('Failed to enhance image. Please try again or adjust settings.');
		} finally {
			setIsUploading(false);
		}
	};

	const handleRegenerateImage = () => {
		// Clean up previous preview
		if (enhancedImagePreview) {
			URL.revokeObjectURL(enhancedImagePreview);
		}
		setEnhancedImageBlob(null);
		setEnhancedImagePreview(null);
		
		// Trigger new enhancement
		handleEnhanceImage();
	};

	const handleSaveAndCreatePost = async () => {
		if (!enhancedImageBlob) {
			alert('No enhanced image available');
			return;
		}

		setIsUploading(true);

		try {
			console.log('📤 Uploading enhanced image to server...');

			// Upload enhanced image to your main server
			const formDataUpload = new FormData();
			const enhancedFile = new File([enhancedImageBlob], 'enhanced.png', { type: 'image/png' });
			formDataUpload.append('images', enhancedFile);

			const uploadResponse = await uploadApi.uploadImages(formDataUpload);
			const uploadedImageUrls = uploadResponse.data.data.images.map((img: any) => img.url);

			console.log('✅ Image uploaded successfully');

			// Log AI enhancement settings
			console.log('🎨 AI Enhancement Settings:');
			console.log('  backgroundType:', formData.backgroundType);
			console.log('  backgroundColor:', formData.backgroundColor);
			console.log('  useModel:', formData.useModel);
			console.log('  modelEthnicity:', formData.modelEthnicity);
			console.log('  modelGender:', formData.modelGender);
			console.log('  addText:', formData.addText);

		// Create post with enhanced images
		console.log('📝 Creating post with data:', {
			caption: formData.caption || '',
			platform: formData.platform,
			images: uploadedImageUrls,
			scheduledAt: formData.scheduledAt,
			postType: formData.postType,
			currency: formData.currency,
			price: formData.price,
			productName: formData.productName,
			description: formData.description,
			backgroundType: formData.backgroundType,
			backgroundColor: formData.backgroundColor,
			useModel: formData.useModel,
			modelEthnicity: formData.modelEthnicity,
			modelGender: formData.modelGender,
			addText: formData.addText,
		});

		await createPost({
			caption: formData.caption || '',
			aiPrompt: '',
			platform: formData.platform,
			scheduledAt: formData.scheduledAt || undefined,
			images: uploadedImageUrls,
			postType: formData.postType || undefined,
			currency: formData.currency || undefined,
			price: formData.price || undefined,
			productName: formData.productName || undefined,
			description: formData.description || undefined,
			backgroundType: formData.backgroundType,
			backgroundColor: formData.backgroundColor,
			useModel: formData.useModel,
			modelType: formData.modelType,
			modelEthnicity: formData.modelEthnicity,
			modelGender: formData.modelGender,
			addText: formData.addText,
		});		navigate('/posts');
		} catch (err: any) {
			console.error('Failed to create post:', err);
			console.error('Error response:', err.response?.data);
			console.error('Error status:', err.response?.status);
			console.error('Full error object:', JSON.stringify(err.response, null, 2));

			// Check if it's an authentication error
			if (err.response?.status === 401) {
				alert('Authentication required. Please log in again.');
			} else {
				alert(`Failed to create post: ${err.response?.data?.message || err.message}`);
			}
		} finally {
			setIsUploading(false);
		}
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (formData.platform.length === 0) {
			alert('Please select at least one platform');
			return;
		}
		
		if (uploadedImages.length === 0) {
			alert('Please upload at least one image');
			return;
		}

		// Start the enhancement process
		await handleEnhanceImage();
	};

	return (
		<div className="w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden" style={{ background: '#000000' }}>
			{/* Preview Modal */}
			{showPreviewModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
							<button 
								onClick={() => setShowPreviewModal(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						<div className="p-6">
							{/* Generated Caption */}
							{formData.caption && (
								<div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<h4 className="font-semibold text-green-900">Generated Caption</h4>
										<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AI Generated</span>
									</div>
									<p className="text-sm text-green-800 leading-relaxed">{formData.caption}</p>
									<div className="mt-2 text-xs text-green-600">
										Character count: {formData.caption.length}
									</div>
								</div>
							)}
							
							{/* Mock Social Media Post */}
							<div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 bg-primary rounded-full"></div>
									<div>
										<div className="font-medium text-sm">Your Brand</div>
										<div className="text-xs text-gray-500">
											{formData.scheduledAt ? 'Scheduled' : 'Now'}
										</div>
									</div>
								</div>
								<div className="bg-white rounded-lg p-4 mb-3">
									{enhancedImagePreview ? (
										<div className="w-full mb-3 rounded-lg overflow-hidden">
											<img src={enhancedImagePreview} alt="Enhanced preview" className="w-full h-auto" />
										</div>
									) : imagePreviews.length > 0 ? (
										<div className="w-full mb-3 rounded-lg overflow-hidden">
											<img src={imagePreviews[0]} alt="Original preview" className="w-full h-auto" />
										</div>
									) : (
										<div className="w-full h-48 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
											<span className="text-gray-500">Image Preview</span>
										</div>
									)}
									<p className="text-sm text-gray-700">
										{formData.caption || 'Your generated caption will appear here...'}
									</p>
									{formData.platform.length > 0 && (
										<div className="mt-2 flex flex-wrap gap-1">
											{formData.platform.map((platform) => (
												<span key={platform} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
													{platform}
												</span>
											))}
										</div>
									)}
								</div>
								<div className="flex items-center gap-4 text-sm text-gray-500">
									<button type="button" className="flex items-center gap-1 hover:text-red-500">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
										</svg>
										Like
									</button>
									<button type="button" className="flex items-center gap-1 hover:text-blue-500">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
										</svg>
										Comment
									</button>
									<button type="button" className="flex items-center gap-1 hover:text-green-500">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
										</svg>
										Share
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Error Message */}
			{error && (
				<div className="shrink-0 w-full">
					<div className="p-4 rounded-lg mx-4 md:mx-6 lg:mx-8 mt-6" style={{ background: '#1A1A22', border: '1px solid rgba(255,255,255,0.1)' }}>
						<p className="text-sm text-red-400">{error}</p>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="create-post-form flex-1 flex flex-col lg:flex-row lg:items-stretch w-full h-full min-h-0 min-w-0 overflow-hidden">
				<input
					id="file-upload"
					type="file"
					accept="image/*"
					onChange={handleFileUpload}
					className="hidden"
				/>

				{/* Left/Center: Feed preview card */}
				<div className="flex-1 flex flex-col items-center min-w-0 min-h-0 overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
					<div className="flex flex-wrap items-center gap-3 mb-4">
						<h2 className="text-white text-sm font-semibold uppercase tracking-wider shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
							Aperçu du fil
						</h2>
						<div className="flex gap-0 rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid #FFFFFF1A' }}>
							<button
								type="button"
								onClick={() => {
									setPreviewTab('facebook');
									setFormData(prev => ({
										...prev,
										platform: prev.platform.includes('facebook')
											? prev.platform.filter(p => p !== 'facebook')
											: [...prev.platform, 'facebook'],
									}));
								}}
								className="px-6 py-2 text-sm font-medium transition-colors"
								style={{
									background: formData.platform.includes('facebook') ? '#9747FF' : 'rgba(255, 255, 255, 0.08)',
									color: '#FFFFFF',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								Facebook
							</button>
							<button
								type="button"
								onClick={() => {
									setPreviewTab('instagram');
									setFormData(prev => ({
										...prev,
										platform: prev.platform.includes('instagram')
											? prev.platform.filter(p => p !== 'instagram')
											: [...prev.platform, 'instagram'],
									}));
								}}
								className="px-6 py-2 text-sm font-medium transition-colors"
								style={{
									background: formData.platform.includes('instagram') ? '#9747FF' : 'rgba(255, 255, 255, 0.08)',
									color: '#FFFFFF',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								Instagram
							</button>
						</div>
					</div>
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xl min-h-[580px]">
						<div className="p-4 border-b border-gray-100">
							<div className="flex items-center gap-3">
								{user?.profileImage ? (
									<img
										src={user.profileImage}
										alt={user?.name || 'User'}
										className="w-10 h-10 rounded-full object-cover shrink-0"
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
										<span className="text-sm font-semibold text-gray-600">
											{user?.name?.charAt(0).toUpperCase() || '?'}
										</span>
									</div>
								)}
								<span className="font-semibold text-gray-900">{user?.name || 'Votre page'}</span>
							</div>
							<p className="text-gray-400 text-sm mt-1">
								{formData.caption || 'Votre légende apparaîtra ici...'}
							</p>
						</div>
						<div
							className="relative min-h-[320px] flex items-center justify-center bg-gray-50 border-b border-gray-100 cursor-pointer"
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							{enhancedImagePreview ? (
								<img src={enhancedImagePreview} alt="" className="w-full h-full min-h-[320px] object-contain" />
							) : imagePreviews[0] ? (
								<>
									<img src={imagePreviews[0]} alt="" className="w-full h-full min-h-[320px] object-contain" />
									<button
										type="button"
										onClick={(e) => { e.stopPropagation(); removeImage(0); }}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
									>
										×
									</button>
								</>
							) : (
								<div className="w-full flex flex-col items-center justify-center p-8 text-center min-h-[320px]">
									<UploadIcon className="w-16 h-16 text-gray-300 mx-auto mb-2" />
									<p className="text-gray-400 text-sm">Uploadez votre photo produit ici</p>
									<p className="text-gray-300 text-xs mt-1">ou glissez-déposez</p>
								</div>
							)}
						</div>
						
					</div>
				</div>

				{/* Right: Sidebar with accordion */}
				<aside
					className="w-full lg:w-[380px] shrink-0 rounded-2xl overflow-hidden flex flex-col lg:h-full min-h-0"
					style={{ background: '#0E0E13', borderRight: '0.89px solid #FFFFFF0D' }}
				>
					<div className="p-4 overflow-y-auto flex-1 space-y-1">
						{/* 1. PHOTO DU PRODUIT */}
						<div className="rounded-xl overflow-hidden" style={{ background: '#0E0E13' }}>
							<button
								type="button"
								onClick={() => toggleSection(1)}
								className="w-full flex items-center justify-between px-4 py-3 text-left"
							>
								<span
									style={{
										fontFamily: 'Inter, sans-serif',
										fontWeight: 900,
										fontSize: '12px',
										lineHeight: '15px',
										letterSpacing: '2px',
										verticalAlign: 'middle',
										textTransform: 'uppercase',
										color: openSections.includes(1) ? '#9747FF' : '#FFFFFF4D'
									}}
								>
									1. PHOTO DU PRODUIT
								</span>
								<span className="text-xs" style={{ color: openSections.includes(1) ? '#9747FF' : '#FFFFFF4D' }}>{openSections.includes(1) ? '▲' : '▼'}</span>
							</button>
							{openSections.includes(1) && (
								<div
									className="p-4 flex flex-col items-center justify-center cursor-pointer min-h-[140px] rounded-xl mx-3 mb-3"
									style={{
										background: '#0E0E13',
										border: '1px dotted rgba(255,255,255,0.35)'
									}}
									onClick={() => document.getElementById('file-upload')?.click()}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
								>
									{imagePreviews[0] ? (
										<div className="w-full rounded-lg overflow-hidden border border-white/10">
											<img src={imagePreviews[0]} alt="Produit uploadé" className="w-full h-auto max-h-40 object-contain" />
										</div>
									) : (
										<>
											<div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 text-gray-400" style={{ background: 'rgba(255,255,255,0.08)' }}>
												<UploadIcon className="w-7 h-7" />
											</div>
											<p className="text-sm font-medium uppercase" style={{ color: '#9CA3AF' }}>UPLOADER PHOTO PRODUIT</p>
										</>
									)}
								</div>
							)}
						</div>

						{/* 2. INFORMATIONS PRODUIT */}
						<div className="rounded-xl overflow-hidden" style={{ background: '#0E0E13' }}>
							<button
								type="button"
								onClick={() => toggleSection(2)}
								className="w-full flex items-center justify-between px-4 py-3 text-left"
							>
								<span
									style={{
										fontFamily: 'Inter, sans-serif',
										fontWeight: 900,
										fontSize: '12px',
										lineHeight: '15px',
										letterSpacing: '2px',
										verticalAlign: 'middle',
										textTransform: 'uppercase',
										color: openSections.includes(2) ? '#9747FF' : '#FFFFFF4D'
									}}
								>
									2. INFORMATIONS PRODUIT
								</span>
								<span className="text-xs" style={{ color: openSections.includes(2) ? '#9747FF' : '#FFFFFF4D' }}>{openSections.includes(2) ? '▲' : '▼'}</span>
							</button>
							{openSections.includes(2) && (
								<div className="p-4 space-y-3 border-t border-white/10" style={{ background: '#0E0E13' }}>
									<div>
										<label className="block text-xs font-medium text-gray-300 mb-1">Type de post</label>
										<select
											name="postType"
											value={formData.postType}
											onChange={handleInputChange}
											className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none"
											style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}
										>
											<option value="">Sélectionner</option>
											<option value="accessories">Accessories</option>
											<option value="clothing">Vêtements</option>
											<option value="electronics">Électronique</option>
											<option value="furniture">Meubles</option>
											<option value="beauty">Beauté</option>
											<option value="food">Alimentation</option>
											<option value="sports">Sports</option>
											<option value="books">Livres</option>
											<option value="toys">Jouets</option>
											<option value="home">Maison</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-300 mb-1">Nom du produit</label>
										<input
											type="text"
											name="productName"
											value={formData.productName}
											onChange={handleInputChange}
											placeholder="Nom du produit"
											className="w-full px-3 py-2 rounded-lg text-white text-sm border border-white/20 focus:ring-2 focus:ring-purple-500 bg-black/30 placeholder-gray-500"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
										<textarea
											rows={2}
											name="description"
											value={formData.description}
											onChange={handleInputChange}
											placeholder="Décrivez votre produit"
											className="w-full px-3 py-2 rounded-lg text-white text-sm border border-white/20 focus:ring-2 focus:ring-purple-500 bg-black/30 placeholder-gray-500"
										/>
									</div>
									<div>
										<label
											className="block mb-1.5 uppercase font-semibold text-sm tracking-wide"
											style={{ fontFamily: 'Inter, sans-serif', color: '#CCCCCC' }}
										>
											Prix
										</label>
										<div
											className="flex rounded-lg overflow-hidden border border-white/10"
											style={{ background: '#0E0E13' }}
										>
											<input
												type="text"
												name="price"
												value={formData.price}
												onChange={handleInputChange}
												placeholder="0.00"
												className="flex-1 min-w-0 px-4 py-2.5 text-sm border-0 border-r border-white/10 focus:ring-0 focus:outline-none placeholder-gray-500"
												style={{ background: '#0E0E13', color: '#E0E0E0' }}
											/>
											<select
												name="currency"
												value={formData.currency}
												onChange={handleInputChange}
												className="px-4 py-2.5 text-sm font-semibold uppercase border-0 border-l focus:ring-0 focus:outline-none cursor-pointer rounded-r-lg"
												style={{ background: '#0E0E13', color: '#E0E0E0', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
											>
												<option value="TND">DT</option>
												<option value="USD">USD</option>
												<option value="EUR">EUR</option>
											</select>
										</div>
									</div>
									
									<div>
										<label className="block text-xs font-medium text-gray-300 mb-1">Planification</label>
										<DatePicker
											selected={
												formData.scheduledAt
													? (() => {
															const d = new Date(formData.scheduledAt);
															return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
														})()
													: selectedDate
											}
											onChange={handleDateChange}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="d MMM yyyy HH:mm"
											locale="fr"
											timeZone="UTC"
											minDate={new Date()}
											placeholderText="Date et heure"
											className="w-full px-3 py-2 rounded-lg text-white text-sm border border-white/20 focus:ring-2 focus:ring-purple-500 bg-black/30"
											wrapperClassName="w-full"
										/>
									</div>
								</div>
							)}
						</div>

						{/* 3. BACKGROUND & SCÈNE */}
						<div className="rounded-xl overflow-hidden" style={{ background: '#0E0E13' }}>
							<button
								type="button"
								onClick={() => toggleSection(3)}
								className="w-full flex items-center justify-between px-4 py-3 text-left"
							>
								<span
									style={{
										fontFamily: 'Inter, sans-serif',
										fontWeight: 900,
										fontSize: '12px',
										lineHeight: '15px',
										letterSpacing: '2px',
										verticalAlign: 'middle',
										textTransform: 'uppercase',
										color: openSections.includes(3) ? '#9747FF' : '#FFFFFF4D'
									}}
								>
									3. BACKGROUND & SCÈNE
								</span>
								<span className="text-xs" style={{ color: openSections.includes(3) ? '#9747FF' : '#FFFFFF4D' }}>{openSections.includes(3) ? '▲' : '▼'}</span>
							</button>
							{openSections.includes(3) && (
								<div className="p-4 space-y-3 border-t border-white/10" style={{ background: '#0E0E13' }}>
									<div className="space-y-3">
										<div>
											<label className="block text-xs font-medium text-gray-300 mb-1">Type de fond</label>
											<select
												name="backgroundType"
												value={formData.backgroundType}
												onChange={handleInputChange}
												className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none"
												style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}
											>
												<option value="white">Fond blanc</option>
												<option value="color">Couleur personnalisée</option>
											</select>
										</div>
										{formData.backgroundType === 'color' && (
											<div className="flex gap-2">
												<input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleInputChange} className="h-9 w-14 rounded cursor-pointer border border-white/20" />
												<input type="text" name="backgroundColor" value={formData.backgroundColor} onChange={handleInputChange} placeholder="#ffffff" className="flex-1 px-3 py-2 rounded-lg text-white text-sm border border-white/20 bg-black/30 placeholder-gray-500" />
											</div>
										)}
										<div>
											<label className="block text-xs font-medium text-gray-300 mb-1">Modèle humain</label>
											<select name="useModel" value={formData.useModel} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
												<option value="no">Non</option>
												<option value="yes">Oui</option>
											</select>
										</div>
										{formData.useModel === 'yes' && (
											<>
												<div>
													<label className="block text-xs font-medium text-gray-300 mb-1">Type de modèle</label>
													<select name="modelType" value={formData.modelType} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
														<option value="ai">IA</option>
														<option value="custom">Image personnalisée</option>
													</select>
												</div>
												{formData.modelType === 'custom' && (
													<div>
														<input type="file" accept="image/*" onChange={handleCustomModelUpload} className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-purple-500/20 file:text-purple-300" />
														{customModelPreview && (
															<div className="mt-2 relative max-w-full">
																<img src={customModelPreview} alt="Modèle" className="w-full h-auto rounded-lg border border-white/20 max-h-24 object-cover" />
																<button type="button" onClick={removeCustomModel} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
															</div>
														)}
													</div>
												)}
												{formData.modelType === 'ai' && (
													<>
														<div>
															<label className="block text-xs font-medium text-gray-300 mb-1">Ethnicité</label>
															<select name="modelEthnicity" value={formData.modelEthnicity} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
																<option value="european">Européen</option>
																<option value="american">Américain</option>
																<option value="arab">Arabe</option>
																<option value="asian">Asiatique</option>
															</select>
														</div>
														<div>
															<label className="block text-xs font-medium text-gray-300 mb-1">Genre</label>
															<select name="modelGender" value={formData.modelGender} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
																<option value="female">Femme</option>
																<option value="male">Homme</option>
															</select>
														</div>
													</>
												)}
											</>
										)}
										<div>
											<label className="block text-xs font-medium text-gray-300 mb-1">Texte sur l’image</label>
											<select name="addText" value={formData.addText} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
												<option value="no">Non</option>
												<option value="yes">Oui</option>
											</select>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* 4. LÉGENDE */}
						<div className="rounded-xl overflow-hidden" style={{ background: '#0E0E13' }}>
							<button
								type="button"
								onClick={() => toggleSection(4)}
								className="w-full flex items-center justify-between px-4 py-3 text-left"
							>
								<span
									style={{
										fontFamily: 'Inter, sans-serif',
										fontWeight: 900,
										fontSize: '12px',
										lineHeight: '15px',
										letterSpacing: '2px',
										verticalAlign: 'middle',
										textTransform: 'uppercase',
										color: openSections.includes(4) ? '#9747FF' : '#FFFFFF4D'
									}}
								>
									4. LÉGENDE
								</span>
								<span className="text-xs" style={{ color: openSections.includes(4) ? '#9747FF' : '#FFFFFF4D' }}>{openSections.includes(4) ? '▲' : '▼'}</span>
							</button>
							{openSections.includes(4) && (
								<div className="p-4 space-y-3 border-t border-white/10" style={{ background: '#0E0E13' }}>
									<div>
										<div className="flex gap-2">
											<button
												type="button"
												onClick={() => {
													if (captionLanguage === 'french') {
														setCaptionLanguage(null);
														setGenerateCaption(false);
													} else {
														setCaptionLanguage('french');
														setGenerateCaption(true);
														if (englishCaption || arabicCaption) {
															setFormData(prev => ({ ...prev, caption: englishCaption }));
														}
													}
												}}
												className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border"
												style={{
													background: captionLanguage === 'french' ? '#9747FF' : '#111118',
													color: '#FFFFFF',
													borderColor: captionLanguage === 'french' ? '#9747FF' : '#111118'
												}}
											>
												Français
											</button>
											<button
												type="button"
												onClick={() => {
													if (captionLanguage === 'arabic') {
														setCaptionLanguage(null);
														setGenerateCaption(false);
													} else {
														setCaptionLanguage('arabic');
														setGenerateCaption(true);
														if (englishCaption || arabicCaption) {
															setFormData(prev => ({ ...prev, caption: arabicCaption }));
														}
													}
												}}
												className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border"
												style={{
													background: captionLanguage === 'arabic' ? '#9747FF' : '#111118',
													color: '#FFFFFF',
													borderColor: captionLanguage === 'arabic' ? '#9747FF' : '#111118'
												}}
											>
												العربية
											</button>
										</div>
										<p className="text-xs text-gray-400 mt-1">
											{captionLanguage ? 'La légende sera générée automatiquement par l’IA.' : 'Écrivez votre légende manuellement ci-dessous.'}
										</p>
									</div>
									<div>
										<label className="block text-xs font-medium text-gray-300 mb-1">Légende</label>
										<textarea
											rows={3}
											name="caption"
											value={formData.caption}
											onChange={handleInputChange}
											placeholder="Votre légende ou laissez l’IA la générer..."
											className="w-full px-3 py-2 rounded-lg text-white text-sm border border-white/20 focus:ring-2 focus:ring-purple-500 bg-black/30 placeholder-gray-500"
										/>
									</div>
								</div>
							)}
						</div>
						
					</div>

					{/* Sidebar footer: enhanced actions + Generate button */}
					<div className="p-4 border-t border-white/10 space-y-3" style={{ background: '#0E0E13' }}>
						{enhancedImagePreview && (
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleRegenerateImage}
									disabled={isUploading}
									className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-white border border-white/20 hover:bg-white/10 disabled:opacity-50 transition-colors"
								>
									Régénérer
								</button>
								<button
									type="button"
									onClick={handleSaveAndCreatePost}
									disabled={isUploading}
									className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
								>
									{isUploading ? 'Enregistrement...' : 'Sauvegarder'}
								</button>
							</div>
						)}
						<button
							type="submit"
							disabled={uploadedImages.length === 0 || formData.platform.length === 0 || isLoading || isUploading}
							className="w-full py-3 px-4 rounded-xl text-white text-sm font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							style={{ background: '#9747FF' }}
						>
							{isLoading || isUploading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
									Génération...
								</span>
							) : (
								'GENERE LE POST (1 Token)'
							)}
						</button>
					</div>
				</aside>
			</form>
		</div>
				
	);
}
