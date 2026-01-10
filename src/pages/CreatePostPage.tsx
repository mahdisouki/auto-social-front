import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SectionTitle } from '../components/layout';
import { UploadIcon, EyeIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import { uploadApi } from '../lib/api';

export function CreatePostPage() {
	const navigate = useNavigate();
	const { createPost, isLoading, error, clearError } = usePostsStore();
	
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
	const [captionLanguage, setCaptionLanguage] = useState<'french' | 'arabic'>('french');
	const [generateCaption, setGenerateCaption] = useState<boolean>(true);
	const [customModelImage, setCustomModelImage] = useState<File | null>(null);
	const [customModelPreview, setCustomModelPreview] = useState<string | null>(null);
	
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
	
	const handlePlatformChange = (platform: string) => {
		setFormData(prev => ({
			...prev,
			platform: prev.platform.includes(platform)
				? prev.platform.filter(p => p !== platform)
				: [...prev.platform, platform],
		}));
	};

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
		if (date) {
			// Store the date directly - it's already in Tunisia time from the DatePicker
			setFormData(prev => ({
				...prev,
				scheduledAt: date.toISOString(),
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
			formDataAI.append('caption_language', captionLanguage);
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
			const aiResponse = await fetch('https://ai.postoryai.com/edit-product', {
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
			
			// Store in appropriate state based on language
			if (captionLanguage === 'french') {
				setEnglishCaption(generatedCaption);
				// Keep Arabic empty if not generated
				if (!arabicCaption) setArabicCaption('');
			} else {
				setArabicCaption(generatedCaption);
				// Keep English empty if not generated
				if (!englishCaption) setEnglishCaption('');
			}
			
			// Set caption in form
			setFormData(prev => ({
				...prev,
				caption: generatedCaption,
			}));
			
			console.log(`📝 Generated ${captionLanguage} caption:`, generatedCaption);

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
		<div className="container-max py-6">
			<SectionTitle 
				title="Create New Post" 
				subtitle="Generate and schedule your next social media post" 
			/>

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
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}
			
			<form onSubmit={handleSubmit}>
				<div className="card p-6 max-w-4xl mx-auto">
				

					{/* Upload Section */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Content</h3>
						<div 
							className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							<UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600 mb-2">Drag and drop your images here</p>
							<p className="text-sm text-gray-500">or click to browse</p>
							<button type="button" className="mt-4 btn-primary">Choose Files</button>
							<input
								id="file-upload"
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
							/>
						</div>
						
						{/* Image Previews */}
						{(imagePreviews.length > 0 || isProcessingImages) && (
							<div className="mt-4">
								<h4 className="font-medium text-gray-900 mb-3">
									Uploaded Image ({imagePreviews.length}/1)
									{isProcessingImages && <span className="text-sm text-blue-600 ml-2">Processing...</span>}
								</h4>
								<div className="mt-2">
									{imagePreviews.map((preview, index) => (
										<div key={index} className="relative max-w-md mx-auto">
											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												className="w-full h-auto rounded-lg shadow-md"
												onLoad={(e) => {
													console.log('✅ Image loaded successfully');
													console.log('Natural dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
												}}
												onError={() => {
													console.error('❌ Image failed to load');
												}}
											/>
											
											{/* Remove button */}
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													removeImage(index);
												}}
												className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
											>
												×
											</button>
										</div>
									))}
									{/* Loading placeholder for processing images */}
									{isProcessingImages && uploadedImages.length > imagePreviews.length && (
										<div className="relative">
											<div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
												<div className="text-center">
													<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
													<p className="text-sm text-gray-600">Processing...</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
						
						{/* Product Details */}
						<div className="mt-6">
							<h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
									<select
										name="postType"
										value={formData.postType}
										onChange={handleInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									>
										<option value="">Select post type</option>
										<option value="accessories">Accessories</option>
										<option value="clothing">Clothing (Vêtements)</option>
										<option value="electronics">Electronics (Électronique)</option>
										<option value="furniture">Furniture (Meubles)</option>
										<option value="beauty">Beauty & Cosmetics</option>
										<option value="food">Food & Beverages</option>
										<option value="sports">Sports & Fitness</option>
										<option value="books">Books & Media</option>
										<option value="toys">Toys & Games</option>
										<option value="home">Home & Garden</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
									<input 
										type="text" 
										name="productName"
										value={formData.productName}
										onChange={handleInputChange}
										placeholder="Enter product name" 
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
									<textarea 
										rows={3} 
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										placeholder="Describe your product" 
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									></textarea>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
										<input 
											type="text" 
											name="price"
											value={formData.price}
											onChange={handleInputChange}
											placeholder="0.00" 
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
										<select
											name="currency"
											value={formData.currency}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
										>
											<option value="TND">TND - Tunisian Dinar</option>
											<option value="USD">USD - US Dollar</option>
											<option value="EUR">EUR - Euro</option>
										</select>
									</div>
								</div>
								
								{/* AI Image Enhancement Options */}
								<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<h5 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
										</svg>
										AI Image Enhancement
									</h5>
									
									<div className="space-y-3">
										{/* Background Type */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Background Type</label>
											<select
												name="backgroundType"
												value={formData.backgroundType}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
											>
												<option value="white">White Background</option>
												<option value="color">Custom Color Background</option>
											</select>
										</div>
										
										{/* Background Color Picker (shown when color is selected) */}
										{formData.backgroundType === 'color' && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
												<div className="flex gap-2">
													<input 
														type="color" 
														name="backgroundColor"
														value={formData.backgroundColor}
														onChange={handleInputChange}
														className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
													/>
													<input 
														type="text" 
														name="backgroundColor"
														value={formData.backgroundColor}
														onChange={handleInputChange}
														placeholder="#ffffff"
														className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
													/>
												</div>
											</div>
										)}
										
										{/* Model Selection */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Add Human Model</label>
											<select
												name="useModel"
												value={formData.useModel}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
											>
												<option value="no">No Model</option>
												<option value="yes">Yes, Add Model</option>
											</select>
										</div>
										
										{/* Model Type (shown when model is selected) */}
										{formData.useModel === 'yes' && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Model Type</label>
												<select
													name="modelType"
													value={formData.modelType}
													onChange={handleInputChange}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
												>
													<option value="ai">AI Generated Model</option>
													<option value="custom">Custom Model Image</option>
												</select>
											</div>
										)}

										{/* Custom Model Upload (shown when custom is selected) */}
										{formData.useModel === 'yes' && formData.modelType === 'custom' && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Upload Model Image</label>
												<input
													type="file"
													accept="image/*"
													onChange={handleCustomModelUpload}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
												/>
												{customModelPreview && (
													<div className="mt-2 relative max-w-xs">
														<img src={customModelPreview} alt="Custom model" className="w-full h-auto rounded-lg border-2 border-blue-300" />
														<button
															type="button"
															onClick={removeCustomModel}
															className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
														>
															×
														</button>
													</div>
												)}
												<p className="text-xs text-gray-500 mt-1">Upload an image of the person you want to use as a model</p>
											</div>
										)}
										
										{/* Model Ethnicity (shown when AI model is selected) */}
										{formData.useModel === 'yes' && formData.modelType === 'ai' && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Model Ethnicity</label>
								<select
									name="modelEthnicity"
									value={formData.modelEthnicity}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
								>
									<option value="european">European</option>
									<option value="american">American</option>
									<option value="arab">Arab</option>
									<option value="asian">Asian</option>
								</select>
							</div>
						)}
						
						{/* Model Gender (shown when AI model is selected) */}
						{formData.useModel === 'yes' && formData.modelType === 'ai' && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Model Gender</label>
								<select
									name="modelGender"
									value={formData.modelGender}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
								>
									<option value="female">Female Model</option>
									<option value="male">Male Model</option>
								</select>
							</div>
						)}										{/* Caption Language Selection */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Caption Language</label>
											<select
												value={captionLanguage}
												onChange={(e) => {
													const newLang = e.target.value as 'french' | 'arabic';
													setCaptionLanguage(newLang);
													// Update caption when language changes
													if (englishCaption || arabicCaption) {
														setFormData(prev => ({
															...prev,
															caption: newLang === 'french' ? englishCaption : arabicCaption,
														}));
													}
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
											>
												<option value="french">Français (French)</option>
												<option value="arabic">العربية (Arabic)</option>
											</select>
										</div>
										
										{/* Generate Caption Toggle */}
										<div>
											<label className="flex items-center space-x-2 cursor-pointer">
												<input
													type="checkbox"
													checked={generateCaption}
													onChange={(e) => setGenerateCaption(e.target.checked)}
													className="rounded border-gray-300 text-primary focus:ring-primary"
												/>
												<span className="text-sm font-medium text-gray-700">Generate AI Caption</span>
											</label>
											<p className="text-xs text-gray-500 mt-1 ml-6">
												{generateCaption 
													? 'AI will generate a caption for your post' 
													: 'You can write your own caption manually'}
											</p>
										</div>
										
										{/* Add Text Overlay */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Add Text Overlay</label>
											<select
												name="addText"
												value={formData.addText}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
											>
												<option value="no">No Text in Image</option>
												<option value="yes">Yes, Add Descriptive Text</option>
											</select>
											{formData.addText === 'yes' && (
												<p className="mt-1 text-xs text-blue-600">
													AI will add elegant product description text to the image
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						
						{/* Platform Selection */}
						<div className="mt-6">
							<h4 className="font-medium text-gray-900 mb-3">Select Platforms</h4>
							<div className="grid grid-cols-2 gap-3">
								{['facebook', 'instagram', 'tiktok', 'twitter'].map((platform) => (
									<label key={platform} className="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											checked={formData.platform.includes(platform)}
											onChange={() => handlePlatformChange(platform)}
											className="rounded border-gray-300 text-primary focus:ring-primary"
										/>
										<span className="text-sm font-medium text-gray-700 capitalize">{platform}</span>
									</label>
								))}
							</div>
						</div>
						
						{/* Scheduling */}
						<div className="mt-6">
							<h4 className="font-medium text-gray-900 mb-3">Schedule (Optional)</h4>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Publish Date & Time (Tunisia Time - GMT+1)
								</label>
								<DatePicker
									selected={selectedDate}
									onChange={handleDateChange}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="MMMM d, yyyy h:mm aa"
									minDate={new Date()}
									placeholderText="Select date and time"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									wrapperClassName="w-full"
								/>
								{selectedDate && (
									<p className="mt-2 text-xs text-gray-500">
										Scheduled for: {selectedDate.toLocaleString('en-US', { 
											timeZone: 'Africa/Tunis',
											dateStyle: 'full',
											timeStyle: 'short'
										})} (Tunisia Time)
									</p>
								)}
							</div>
						</div>

						{/* Enhanced Image Preview */}
						{enhancedImagePreview && (
							<div className="mt-6">
								<h4 className="font-medium text-gray-900 mb-3">AI Enhanced Image</h4>
								<div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
									<div className="flex items-center gap-2 mb-3">
										<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<h4 className="font-semibold text-blue-900">Enhanced Preview</h4>
										<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Ready</span>
									</div>
									<div className="relative rounded-lg overflow-hidden border-2 border-blue-200 max-w-md mx-auto">
										<img
											src={enhancedImagePreview}
											alt="Enhanced preview"
											className="w-full h-auto"
										/>
									</div>
									<div className="mt-4 grid grid-cols-2 gap-3">
										<button 
											type="button"
											onClick={handleRegenerateImage}
											disabled={isUploading}
											className="bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
											</svg>
											Regenerate
										</button>
										<button 
											type="button"
											onClick={handleSaveAndCreatePost}
											disabled={isUploading}
											className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
										>
											{isUploading ? (
												<>
													<svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													Saving...
												</>
											) : (
												<>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
													Save & Post
												</>
											)}
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Enhance Image Button */}
						{!enhancedImagePreview && (
							<div className="mt-4">
								<button 
									type="submit"
									disabled={uploadedImages.length === 0 || formData.platform.length === 0 || isLoading || isUploading}
									className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
								>
									{isLoading || isUploading ? (
										<span className="flex items-center justify-center gap-2">
											<svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Enhancing Image with AI...
										</span>
									) : (
										<span className="flex items-center justify-center gap-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
											</svg>
											Enhance Image with AI
										</span>
									)}
								</button>
								{uploadedImages.length > 0 ? (
									<p className="mt-2 text-xs text-center text-blue-600">
										✨ Preview your enhanced image before posting
									</p>
								) : (
									<p className="mt-2 text-xs text-center text-gray-500">
										📸 Please upload at least one image to continue
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</form>
		</div>
				
	);
}
