import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr', fr);
import { UploadIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import { postsApi, uploadApi } from '../lib/api';
import postsL from '../assets/postsL.png';
import {
	getBestScheduledAtForDate,
	mapPostTypeToBestTimeCategory,
} from '../lib/bestTimeToPost';
import {
	getDayOrder,
	getBestTimesWeekForCategory,
} from '../lib/bestTimeToPostWeek';
import type { BestTimeCategoryKey } from '../lib/bestTimeToPost';




// Scene images from Cloudinary (single source of truth for UI + API)
const SCENE_MAP: Record<string, { url: string; ext: string; mime: string }> = {
	// accessoires (16)
	acc_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333451/autosocial/scenes/accessoires/xMu3k8fn_s1qt1p.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333439/autosocial/scenes/accessoires/ZAD4fi4T_yw6ljg.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333438/autosocial/scenes/accessoires/y4Rep5A8_o2g4xi.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333436/autosocial/scenes/accessoires/0c2DDQGz_vz0jef.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333435/autosocial/scenes/accessoires/4Q4I8o8n_wkwo2m.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_6: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333427/autosocial/scenes/accessoires/2VBwg4xZ_nxwjti.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_7: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333410/autosocial/scenes/accessoires/RMbMfq31_fhkh8w.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_8: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333064/autosocial/scenes/accessoires/QGn2i9A0_sdrzxx.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_9: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333061/autosocial/scenes/accessoires/OUBHt0GX_ayiifc.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_10: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333061/autosocial/scenes/accessoires/b3v5cGLF_tdm3o6.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_11: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333058/autosocial/scenes/accessoires/Dmytq0bQ_ed82hx.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_12: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333056/autosocial/scenes/accessoires/oAen44WA_se7o97.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_13: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333050/autosocial/scenes/accessoires/in1f3qsc_mzqgle.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_14: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333049/autosocial/scenes/accessoires/KdPUQSFg_z2xazi.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_15: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333039/autosocial/scenes/accessoires/5PQDSMqB_jlg54e.jpg', ext: 'jpg', mime: 'image/jpeg' },
	acc_16: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333038/autosocial/scenes/accessoires/IhD6r4et_n79wix.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// beauty (4)
	beauty_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333504/autosocial/scenes/beauty/LexVFJbO_ve2dww.jpg', ext: 'jpg', mime: 'image/jpeg' },
	beauty_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333503/autosocial/scenes/beauty/CUMLIsXT_llhp7x.jpg', ext: 'jpg', mime: 'image/jpeg' },
	beauty_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333502/autosocial/scenes/beauty/Cb21SxXO_ndgzbi.jpg', ext: 'jpg', mime: 'image/jpeg' },
	beauty_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771333468/autosocial/scenes/beauty/O786gBCI_z6pnf1.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// books (6)
	books_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337001/autosocial/scenes/books/xiZ6o9UI_nhy78r.jpg', ext: 'jpg', mime: 'image/jpeg' },
	books_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337000/autosocial/scenes/books/JJQFlRkw_kwkk7s.jpg', ext: 'jpg', mime: 'image/jpeg' },
	books_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771336998/autosocial/scenes/books/iat41m4Q_vtupmt.jpg', ext: 'jpg', mime: 'image/jpeg' },
	books_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771336995/autosocial/scenes/books/Fq0KuXeA_l2db6z.jpg', ext: 'jpg', mime: 'image/jpeg' },
	books_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771336992/autosocial/scenes/books/sFPQkWG1_qz6zxb.jpg', ext: 'jpg', mime: 'image/jpeg' },
	books_6: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771335239/autosocial/scenes/books/MOIXBLT8_gtyiju.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// clothes (12)
	cloth_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337157/autosocial/scenes/clothes/9bJvDy0Z_cfmfl5.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337141/autosocial/scenes/clothes/uMBM8BxS_mzacqm.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337141/autosocial/scenes/clothes/qFNFu2qv_qcbzno.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337139/autosocial/scenes/clothes/ZwbhWXwa_silbhj.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337139/autosocial/scenes/clothes/kLkKwTSZ_uvzcov.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_6: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337134/autosocial/scenes/clothes/ttEosMnJ_kr2fed.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_7: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337133/autosocial/scenes/clothes/Oag4TWAW_bbgmya.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_8: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337133/autosocial/scenes/clothes/g9TsaZhO_hvlpsu.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_9: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337131/autosocial/scenes/clothes/P2ZeqIyz_nnwkyp.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_10: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337127/autosocial/scenes/clothes/lb50sB3h_cmc9uj.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_11: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337125/autosocial/scenes/clothes/D14IWa6W_iyju3d.jpg', ext: 'jpg', mime: 'image/jpeg' },
	cloth_12: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337127/autosocial/scenes/clothes/lb50sB3h_cmc9uj.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// electronics (5)
	elec_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337395/autosocial/scenes/electronics/3fffpOFJ_erfzrn.jpg', ext: 'jpg', mime: 'image/jpeg' },
	elec_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337394/autosocial/scenes/electronics/qYad2deQ_bu0vmp.jpg', ext: 'jpg', mime: 'image/jpeg' },
	elec_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337391/autosocial/scenes/electronics/GTuFEFhh_ivo1c4.jpg', ext: 'jpg', mime: 'image/jpeg' },
	elec_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337391/autosocial/scenes/electronics/f1lTGU5D_yaz2do.jpg', ext: 'jpg', mime: 'image/jpeg' },
	elec_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337387/autosocial/scenes/electronics/KD6HM2K1_qad5dr.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// furniture (3)
	fourn_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337546/autosocial/scenes/furnitures/INPUT_IMAGE_FURNITURE_PRODUCT_You_are_a_profess-1770156549651_z3raia.png', ext: 'png', mime: 'image/png' },
	fourn_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337538/autosocial/scenes/furnitures/IPLD8qQP_iphl5l.jpg', ext: 'jpg', mime: 'image/jpeg' },
	fourn_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337538/autosocial/scenes/furnitures/cZQiXFp5_bwatbr.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// sport (6)
	sport_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337612/autosocial/scenes/sport/98EyWzgG_rkqm3k.jpg', ext: 'jpg', mime: 'image/jpeg' },
	sport_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337611/autosocial/scenes/sport/pDlErmLM_sxxqes.jpg', ext: 'jpg', mime: 'image/jpeg' },
	sport_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337610/autosocial/scenes/sport/26eR7ex2_l5q3ct.jpg', ext: 'jpg', mime: 'image/jpeg' },
	sport_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337609/autosocial/scenes/sport/0Y19KPim_dk9mdh.jpg', ext: 'jpg', mime: 'image/jpeg' },
	sport_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337606/autosocial/scenes/sport/nNqFLq4P_jfilhz.jpg', ext: 'jpg', mime: 'image/jpeg' },
	sport_6: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337605/autosocial/scenes/sport/K7L71UFQ_teuqi2.jpg', ext: 'jpg', mime: 'image/jpeg' },
	// toys (6)
	toys_1: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337650/autosocial/scenes/toys/BiQhIAex_ljd3nz.jpg', ext: 'jpg', mime: 'image/jpeg' },
	toys_2: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337648/autosocial/scenes/toys/XLCZIdlg_jrluan.jpg', ext: 'jpg', mime: 'image/jpeg' },
	toys_3: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337647/autosocial/scenes/toys/fw09Dwxs_ddsib3.jpg', ext: 'jpg', mime: 'image/jpeg' },
	toys_4: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337646/autosocial/scenes/toys/1NsodZ2g_ko600o.jpg', ext: 'jpg', mime: 'image/jpeg' },
	toys_5: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337645/autosocial/scenes/toys/FnWk4Hfw_hblcr7.jpg', ext: 'jpg', mime: 'image/jpeg' },
	toys_6: { url: 'https://res.cloudinary.com/ddcsuzef0/image/upload/v1771337641/autosocial/scenes/toys/8NoFaC8I_cfdmhy.jpg', ext: 'jpg', mime: 'image/jpeg' },
};
import { useAuthStore } from '../stores/authStore';

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
		currency: 'DT',
		caption: '',
		platform: [] as string[],
		scheduledAt: '',
		backgroundType: 'color',
		backgroundColor: '#ffffff',
		sceneId: '',
		useModel: 'no',
		modelType: 'ai',
		modelEthnicity: 'european',
		modelGender: 'female',
		addText: 'no',
		addPrice: 'no',
	});
	
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [uploadedImages, setUploadedImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
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
	const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);
	const [backgroundTab, setBackgroundTab] = useState<'color' | 'scene' | 'personnaliser'>('color');
	const [bestTimeAutoMessage, setBestTimeAutoMessage] = useState<string>('');
	const [bestTimesWeek, setBestTimesWeek] = useState<Record<string, string | null> | null>(null);
	const [isBestTimesLoading, setIsBestTimesLoading] = useState(false);

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

	const applyBestTimeForPostType = async (postType: string) => {
		const bestCat = mapPostTypeToBestTimeCategory(postType);
		if (!bestCat) return;

		const now = new Date();
		const { scheduledAtUtc } = await getBestScheduledAtForDate(bestCat, now);

		setSelectedDate(scheduledAtUtc);
		setFormData(prev => ({
			...prev,
			scheduledAt: scheduledAtUtc.toISOString(),
		}));
	};

	const loadBestTimesWeekForPostType = async (postType: string) => {
		const bestCat = mapPostTypeToBestTimeCategory(postType);
		if (!bestCat) {
			setBestTimesWeek(null);
			return;
		}

		setIsBestTimesLoading(true);
		try {
			const weekTimes = await getBestTimesWeekForCategory(bestCat);
			setBestTimesWeek(weekTimes);
		} catch {
			setBestTimesWeek(null);
		} finally {
			setIsBestTimesLoading(false);
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

		// Use only the first image
		const file = imageFiles[0];

		
		try {
			// Create blob URL
			const objectURL = URL.createObjectURL(file);
			setUploadedImages([file]);
			setImagePreviews([objectURL]);
			
		} catch (error) {
			console.error('ERROR creating object URL:', error);
			alert('Failed to load image preview. Please try again.');
		}

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

		// Use only the first image
		const file = imageFiles[0];
		
		try {
			const objectURL = URL.createObjectURL(file);
			setUploadedImages([file]);
			setImagePreviews([objectURL]);
		} catch (error) {
			console.error('Error creating object URL for dropped file:', file.name, error);
		}
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

	const handleRemoveCurrentImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (enhancedImagePreview) {
			if (enhancedImagePreview.startsWith('blob:')) {
				URL.revokeObjectURL(enhancedImagePreview);
			}
			setEnhancedImagePreview(null);
		}
		removeImage(0);
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
		

			// Create FormData for genai.py endpoint
			const formDataAI = new FormData();
			formDataAI.append('file', file);
			formDataAI.append('background_type', formData.backgroundType);
			formDataAI.append('background_color', formData.backgroundColor);
			formDataAI.append('scene_id', formData.sceneId || '');
			// Scene reference: fetch from Cloudinary and send to API
			if (formData.backgroundType === 'scene' && formData.sceneId) {
				const scene = SCENE_MAP[formData.sceneId];
				if (scene) {
					const sceneRes = await fetch(scene.url);
					const sceneBlob = await sceneRes.blob();
					const sceneFile = new File([sceneBlob], `scene-ref-${formData.sceneId}.${scene.ext}`, { type: sceneBlob.type || scene.mime });
					formDataAI.append('scene_reference', sceneFile);
				}
			}
			formDataAI.append('use_model', formData.useModel);
			formDataAI.append('model_type', formData.modelType);
			
			
			// Only send ethnicity and gender for AI models
			if (formData.modelType === 'ai') {
				formDataAI.append('model_ethnicity', formData.modelEthnicity);
				formDataAI.append('model_gender', formData.modelGender);
			} else {
				console.log('❌ CUSTOM MODEL - Skipping ethnicity and gender');
			}
			
			// Send custom model image for custom models
			if (customModelImage && formData.modelType === 'custom') {
				formDataAI.append('custom_model_image', customModelImage);
			}
			
			formDataAI.append('add_text', formData.addText);
			formDataAI.append('add_price', formData.addPrice || 'no');
			formDataAI.append('price', formData.addPrice === 'yes' ? (formData.price || '') : '');
			formDataAI.append('currency', formData.addPrice === 'yes' ? (formData.currency || 'DT') : '');
			formDataAI.append('generate_caption', generateCaption ? 'yes' : 'no');
			formDataAI.append('caption_language', captionLanguage || 'french');
			formDataAI.append('post_type', formData.postType || 'other');
		

			// Convert uploaded image to base64
			const imageBase64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					const result = reader.result as string;
					// Remove the data:image/...;base64, prefix
					resolve(result.split(',')[1]);
				};
				reader.onerror = reject;
				reader.readAsDataURL(uploadedImages[0]);
			});

			// Convert custom model image to base64 if provided
			let customModelBase64: string | undefined;
			if (customModelImage && formData.modelType === 'custom') {
				customModelBase64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						const result = reader.result as string;
						resolve(result.split(',')[1]);
					};
					reader.onerror = reject;
					reader.readAsDataURL(customModelImage);
				});
			}

			// Get scene reference base64 if needed
			let sceneReferenceBase64: string | undefined;
			if (formData.backgroundType === 'scene' && formData.sceneId) {
				const scene = SCENE_MAP[formData.sceneId];
				if (scene) {
					// Fetch the scene image from Cloudinary and convert to base64
					const sceneResponse = await fetch(scene.url);
					const sceneBlob = await sceneResponse.blob();
					sceneReferenceBase64 = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							const result = reader.result as string;
							resolve(result.split(',')[1]);
						};
						reader.onerror = reject;
						reader.readAsDataURL(sceneBlob);
					});
				} else {
					console.warn(`⚠️ Scene ID '${formData.sceneId}' not found in sceneMap`);
				}
			}

		
			
			const response = await postsApi.generateAndCreatePost({
				imageBase64,
				postType: formData.postType || undefined,
				currency: formData.currency || undefined,
				price: formData.price || undefined,
				backgroundType: formData.backgroundType,
				backgroundColor: formData.backgroundColor,
				useModel: formData.useModel,
				modelType: formData.modelType,
				modelEthnicity: formData.modelType === 'ai' ? formData.modelEthnicity : undefined,
				modelGender: formData.modelType === 'ai' ? formData.modelGender : undefined,
				customModelImage: customModelBase64,
				sceneReference: sceneReferenceBase64,
				addText: formData.addText,
				addPrice: formData.addPrice,
				generateCaption: generateCaption ? 'yes' : 'no',
				captionLanguage: captionLanguage || 'french',
			});


			// Get the base64 image and caption from response
			const responseData = response.data.data;
			const generatedImageBase64 = responseData.image;
			const generatedCaption = responseData.caption || '';

			// Convert base64 image to blob
			const imageData = atob(generatedImageBase64);
			const imageArray = new Uint8Array(imageData.length);
			for (let i = 0; i < imageData.length; i++) {
				imageArray[i] = imageData.charCodeAt(i);
			}
			const enhancedBlob = new Blob([imageArray], { type: 'image/png' });

			// Create preview URL
			const previewUrl = URL.createObjectURL(enhancedBlob);
			setEnhancedImageBlob(enhancedBlob);
			setEnhancedImagePreview(prev => {
				if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
				return previewUrl;
			});
			
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
			

		} catch (aiError: any) {
			console.error('Failed to generate image:', aiError);
			const errorMessage = aiError.response?.data?.message || aiError.message || 'Failed to generate image';
			alert(`Failed to generate image: ${errorMessage}. Please try again or adjust settings.`);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSaveAndCreatePost = async () => {
		const hasEnhanced = Boolean(enhancedImageBlob);
		const sourceFile = hasEnhanced
			? new File([enhancedImageBlob as Blob], 'enhanced.png', { type: 'image/png' })
			: uploadedImages[0];

		if (!sourceFile) {
			alert('No image available');
			return;
		}

		if (formData.platform.length === 0) {
			alert('Please select at least one platform');
			return;
		}

		setIsUploading(true);
		
		try {

			// Upload selected image to Cloudinary (generated image if available, otherwise uploaded image)
			const formDataUpload = new FormData();
			formDataUpload.append('images', sourceFile);

			const uploadResponse = await uploadApi.uploadImages(formDataUpload);
			const uploadedImageUrls = uploadResponse.data.data.images.map((img: any) => img.url);


			// Create post with uploaded image
			await createPost({
				caption: formData.caption || '',
				aiPrompt: '',
				platform: formData.platform,
				scheduledAt: formData.scheduledAt || undefined,
				images: uploadedImageUrls,
				postType: formData.postType || undefined,
				currency: formData.currency || undefined,
				price: formData.price as any,
				productName: formData.productName || undefined,
				description: formData.description || undefined,
				backgroundType: formData.backgroundType,
				backgroundColor: formData.backgroundColor,
				useModel: formData.useModel,
				modelType: formData.modelType,
				modelEthnicity: formData.modelEthnicity,
				modelGender: formData.modelGender,
				addText: formData.addText,
			});
			
			console.log('✅ Post created successfully');
			navigate('/posts');
		} catch (err: any) {
			console.error('Failed to create post:', err);
			const errorMessage = err.response?.data?.message || err.message;
			alert(`Failed to create post: ${errorMessage}`);
		} finally {
			setIsUploading(false);
		}
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Temporary mode: skip generation and post uploaded image directly
		await handleSaveAndCreatePost();
	};

	return (
		<div className="w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden" style={{ background: '#000000', zoom: 0.85 }}>
			<style>{`
				/* Remove number input spinners for price field */
				.no-spinner::-webkit-outer-spin-button,
				.no-spinner::-webkit-inner-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				.no-spinner[type=number] {
					-moz-appearance: textfield;
				}
			`}</style>
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

			<form onSubmit={handleSubmit} className="create-post-form flex-1 flex flex-col lg:flex-row lg:items-stretch w-full h-full min-h-0 min-w-0 overflow-hidden relative">
				{/* Left gradient image */}
				<img 
					src={postsL} 
					alt="" 
					className="absolute left-0 top-0 h-full pointer-events-none hidden lg:block"
					style={{ zIndex: 0,transform: 'scaleX(4)' }}
				/>

				<input
					id="file-upload"
					type="file"
					accept="image/*"
					onChange={handleFileUpload}
					className="hidden"
				/>

				{/* Left/Center: Feed preview card */}
				<div className="flex-1 flex flex-col items-center min-w-0 min-h-0 overflow-y-auto px-4 md:px-6 lg:px-8 pt-12 pb-6 relative" style={{ zIndex: 1 }}>
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] sm:max-w-md md:max-w-xl min-h-[650px] sm:min-h-[700px] md:min-h-[720px] max-h-[750px] sm:max-h-[800px] md:max-h-[860px] flex flex-col overflow-hidden">
						<div className="p-4 border-b border-gray-100 rounded-t-2xl shrink-0">
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
							<p className="text-black text-sm mt-1">
								{formData.caption || 'Votre légende apparaîtra ici...'}
							</p>
						</div>
						<div
							className="relative min-h-[320px] lg:min-h-0 lg:flex-1 bg-gray-50 border-b border-gray-100 cursor-pointer rounded-b-2xl flex flex-col items-stretch"
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							{enhancedImagePreview ? (
								<>
									<div className="w-full flex justify-center bg-gray-100 min-h-0 lg:h-full lg:flex-1">
										<div className="relative inline-block max-w-full lg:w-full lg:h-full lg:flex lg:items-center lg:justify-center">
											<img src={enhancedImagePreview} alt="" className="max-w-full h-auto block lg:h-full lg:w-full lg:object-contain" />
										</div>
									</div>
									<button
										type="button"
										onClick={handleRemoveCurrentImage}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-10"
									>
										×
									</button>
								</>
							) : imagePreviews[0] ? (
								<>
									<div className="w-full flex justify-center bg-gray-100 min-h-0 lg:h-full lg:flex-1">
										<div className="relative inline-block max-w-full lg:w-full lg:h-full lg:flex lg:items-center lg:justify-center">
											<img src={imagePreviews[0]} alt="" className="max-w-full h-auto block lg:h-full lg:w-full lg:object-contain" />
										</div>
									</div>
									<button
										type="button"
										onClick={handleRemoveCurrentImage}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-10"
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

				{/* Mobile toggle button for right sidebar (icon under left sidebar) */}
				<button
					type="button"
					onClick={() => setIsMobileRightOpen(true)}
					className="fixed left-4 top-20 z-30 lg:hidden w-12 h-12 mt-2 rounded-full shadow-lg flex items-center justify-center"
					style={{ background: '#9747FF', color: '#FFFFFF' }}
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h10M4 18h7"
						/>
					</svg>
				</button>

				{/* Mobile overlay for right sidebar */}
				{isMobileRightOpen && (
					<div
						className="fixed inset-0 bg-black/60 z-20 lg:hidden"
						onClick={() => setIsMobileRightOpen(false)}
					/>
				)}

				{/* Right: Sidebar with accordion */}
				<aside
					className={`w-full lg:w-[380px] shrink-0 rounded-2xl overflow-hidden flex flex-col min-h-0 lg:max-h-full lg:static lg:flex transition-transform duration-300 ${
						isMobileRightOpen 
							? 'fixed bottom-0 left-0 right-0 z-30 max-h-[85vh] rounded-t-2xl translate-y-0' 
							: 'hidden lg:flex translate-y-full lg:translate-y-0'
					}`}
					style={{ background: '#0E0E13', borderRight: '0.89px solid #FFFFFF0D' }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Mobile close button */}
					{isMobileRightOpen && (
						<div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
							<span className="text-white font-semibold text-sm uppercase tracking-wider">Paramètres</span>
							<button
								type="button"
								onClick={() => setIsMobileRightOpen(false)}
								className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
								style={{ color: '#FFFFFF' }}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					)}
					<div className="p-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 space-y-1">
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
											onChange={async (e) => {
												const value = e.target.value;
												setFormData(prev => ({ ...prev, postType: value, sceneId: prev.postType !== value ? '' : prev.sceneId }));
												setBestTimeAutoMessage('');
												setBestTimesWeek(null);

												const mappedCategory = mapPostTypeToBestTimeCategory(value);
												if (!mappedCategory) return;

												try {
													await loadBestTimesWeekForPostType(value);
													await applyBestTimeForPostType(value);
													setBestTimeAutoMessage('Horaires recommandes charges et heure optimale appliquee automatiquement.');
												} catch {
													setBestTimeAutoMessage('Impossible de charger les horaires recommandes automatiquement.');
												}
											}}
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
												type="number"
												name="price"
												min={0}
												value={formData.price}
												onChange={handleInputChange}
												placeholder="0"
												className="flex-1 min-w-0 px-4 py-2.5 text-sm border-0 border-r border-white/10 focus:ring-0 focus:outline-none placeholder-gray-500 no-spinner"
												style={{ background: '#0E0E13', color: '#E0E0E0' }}
											/>
											<select
												name="currency"
												value={formData.currency}
												onChange={handleInputChange}
												className="px-4 py-2.5 text-sm font-semibold uppercase border-0 border-l focus:ring-0 focus:outline-none cursor-pointer rounded-r-lg"
												style={{ background: '#0E0E13', color: '#E0E0E0', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
											>
												<option value="DT">DT</option>
												<option value="$">USD</option>
												<option value="€">EUR</option>
											</select>
										</div>
									</div>
									
										{/* Best time (liste par jour) */}
										{(formData.postType && mapPostTypeToBestTimeCategory(formData.postType) !== null) && (
											<div className="mt-3 space-y-3">
												<div>
													<p className="text-xs text-gray-400 mb-2">Horaires recommandes pour chaque jour selon la categorie</p>
													{bestTimeAutoMessage && (
														<p className="text-[11px] text-[#C6A7FF] mb-2">{bestTimeAutoMessage}</p>
													)}
													{isBestTimesLoading && (
														<p className="text-[11px] text-gray-500 mb-2">Chargement des horaires recommandes...</p>
													)}
													<ul className="grid grid-cols-2 gap-2">
														{getDayOrder().map((day) => (
															<li key={day}>
																<button
																	type="button"
																	className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
																	style={{ background: '#111118', color: '#FFFFFF', border: '1px solid rgba(151,71,255,0.22)' }}
																	onClick={async () => {
																		const timeHHmm = bestTimesWeek?.[day] ?? null;
																		if (!timeHHmm) return;

																		// set scheduledAt to the next occurrence of that weekday (UTC)
																		const now = new Date();
																		const currentDay = now.getUTCDay();
																		const targetIndex = getDayOrder().indexOf(day as any);
																		const diffDays = (targetIndex - currentDay + 7) % 7;
																		const [hh, mm] = timeHHmm.split(':');

																		const y = now.getUTCFullYear();
																		const m = now.getUTCMonth();
																		const d = now.getUTCDate() + diffDays;
																		const scheduledAtUtc = new Date(Date.UTC(y, m, d, Number(hh), Number(mm), 0, 0));
																		setSelectedDate(scheduledAtUtc);
																		setFormData(prev => ({ ...prev, scheduledAt: scheduledAtUtc.toISOString() }));
																	}}
																>
																	{day}
																	<span className="block text-[11px] font-semibold opacity-90">{bestTimesWeek?.[day] ?? '--:--'}</span>
																</button>
															</li>
														))}
													</ul>
												</div>
											</div>
										)}
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
										<label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Type de fond</label>
										{/* Segmented control: COULEURS (default) / SCÈNES / PERSONNALISER */}
										<div
											className="flex items-center gap-0 p-1 rounded-xl w-full flex-wrap"
											style={{ background: '#1A1A1A' }}
										>
											<button
												type="button"
												onClick={() => { setBackgroundTab('color'); setFormData(prev => ({ ...prev, backgroundType: 'color' })); }}
												className="flex-1 min-w-0 py-2 px-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
												style={{
													fontFamily: 'Inter, sans-serif',
													background: backgroundTab === 'color' ? '#9747FF' : 'transparent',
													color: backgroundTab === 'color' ? '#FFFFFF' : '#A0A0A0',
													boxShadow: backgroundTab === 'color' ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
												}}
											>
												Couleurs
											</button>
											<button
												type="button"
												onClick={() => { setBackgroundTab('scene'); setFormData(prev => ({ ...prev, backgroundType: 'scene' })); }}
												className="flex-1 min-w-0 py-2 px-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
												style={{
													fontFamily: 'Inter, sans-serif',
													background: backgroundTab === 'scene' ? '#9747FF' : 'transparent',
													color: backgroundTab === 'scene' ? '#FFFFFF' : '#A0A0A0',
													boxShadow: backgroundTab === 'scene' ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
												}}
											>
												Scènes
											</button>
											<button
												type="button"
												onClick={() => { setBackgroundTab('personnaliser'); setFormData(prev => ({ ...prev, backgroundType: 'color' })); }}
												className="flex-1 min-w-0 py-2 px-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
												style={{
													fontFamily: 'Inter, sans-serif',
													background: backgroundTab === 'personnaliser' ? '#9747FF' : 'transparent',
													color: backgroundTab === 'personnaliser' ? '#FFFFFF' : '#A0A0A0',
													boxShadow: backgroundTab === 'personnaliser' ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
												}}
											>
												Personnaliser
											</button>
										</div>
										
										{backgroundTab === 'scene' && (
											<div className="space-y-4">
												<p className="text-xs text-gray-400 mb-2">Choisissez une scène</p>
												{formData.postType === 'clothing' && (
													<div>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('cloth_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Vêtements ${id.replace('cloth_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'accessories' && (
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Accessoires</p>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('acc_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Accessoires ${id.replace('acc_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'beauty' && (
													<div>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('beauty_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Beauté ${id.replace('beauty_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'electronics' && (
													<div>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('elec_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Électronique ${id.replace('elec_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'furniture' && (
													<div>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('fourn_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Meubles ${id.replace('fourn_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'sports' && (
													<div>
														<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('sport_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Sports ${id.replace('sport_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'books' && (
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Livres</p>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('books_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Livres ${id.replace('books_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType === 'toys' && (
													<div>
														<p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Jouets</p>
														<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
															{Object.entries(SCENE_MAP).filter(([k]) => k.startsWith('toys_')).map(([id, { url }]) => (
																<button
																	key={id}
																	type="button"
																	onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'scene', sceneId: prev.sceneId === id ? '' : id }))}
																	className="relative rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
																	style={{
																		borderColor: formData.sceneId === id ? '#9747FF' : 'rgba(255,255,255,0.1)',
																		boxShadow: formData.sceneId === id ? '0 0 0 1px rgba(187, 134, 252, 0.3)' : 'none',
																	}}
																>
																	<img src={url} alt={`Jouets ${id.replace('toys_', '')}`} className="w-full aspect-square object-cover" />
																	{formData.sceneId === id && (
																		<div className="absolute inset-0 flex items-center justify-center bg-black/40">
																			<span className="text-white text-xs font-semibold uppercase">Sélectionné</span>
																		</div>
																	)}
																</button>
															))}
														</div>
													</div>
												)}
												{formData.postType && formData.postType !== 'clothing' && formData.postType !== 'accessories' && formData.postType !== 'beauty' && formData.postType !== 'electronics' && formData.postType !== 'furniture' && formData.postType !== 'sports' && formData.postType !== 'books' && formData.postType !== 'toys' && (
													<p className="text-xs text-gray-500">Les scènes sont disponibles pour les types Vêtements, Accessoires, Beauté, Électronique, Meubles, Sports, Livres et Jouets.</p>
												)}
												{!formData.postType && (
													<p className="text-xs text-gray-500">Sélectionnez un type de post pour afficher les scènes.</p>
												)}
											</div>
										)}
										{backgroundTab === 'color' && (
											<div className="flex gap-2">
												<input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleInputChange} className="h-9 w-14 rounded cursor-pointer border border-white/20" />
												<input type="text" name="backgroundColor" value={formData.backgroundColor} onChange={handleInputChange} placeholder="#ffffff" className="flex-1 px-3 py-2 rounded-lg text-white text-sm border border-white/20 bg-black/30 placeholder-gray-500" />
											</div>
										)}
										{backgroundTab === 'personnaliser' && (
											<div className="space-y-3 pt-1">
												<p className="text-xs text-gray-400 uppercase tracking-wider">Configuration IA / modèle</p>
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
											</div>
										)}
										{/* Texte / Prix sur l'image — visibles pour tous les types de fond */}
										<div className="grid grid-cols-2 gap-3 pt-1">
											<div>
												<label className="block text-xs font-medium text-gray-300 mb-1">Texte sur l’image</label>
												<button
													type="button"
													onClick={() =>
														setFormData(prev => ({
															...prev,
															addText: prev.addText === 'yes' ? 'no' : 'yes',
														}))
													}
													className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
													style={{
														background: formData.addText === 'yes' ? '#9747FF' : '#0E0E13',
														color: '#FFFFFF',
														border: '1px solid rgba(255,255,255,0.1)',
													}}
												>
													{formData.addText === 'yes' ? 'Oui' : 'Non'}
												</button>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-300 mb-1">Prix sur l'image</label>
												<button
													type="button"
													onClick={() =>
														setFormData(prev => ({
															...prev,
															addPrice: prev.addPrice === 'yes' ? 'no' : 'yes',
														}))
													}
													className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
													style={{
														background: formData.addPrice === 'yes' ? '#9747FF' : '#0E0E13',
														color: '#FFFFFF',
														border: '1px solid rgba(255,255,255,0.1)',
													}}
												>
													{formData.addPrice === 'yes' ? 'Oui' : 'Non'}
												</button>
											</div>
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

						{/* Planification - placed after LÉGENDE so it's the last control */}
						<div className="rounded-xl overflow-hidden" style={{ background: '#0E0E13' }}>
							<div className="p-4 space-y-3 border-t border-white/10" style={{ background: '#0E0E13' }}>
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
								<div>
									<label className="block text-xs font-medium text-gray-300 mb-1">Plateformes</label>
									<div className="flex gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid #FFFFFF1A' }}>
										<button
											type="button"
											onClick={() => {
												setFormData(prev => ({
													...prev,
													platform: prev.platform.includes('facebook')
														? prev.platform.filter(p => p !== 'facebook')
														: [...prev.platform, 'facebook'],
												}));
											}}
											className="flex-1 py-2 text-sm font-medium transition-colors"
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
												setFormData(prev => ({
													...prev,
													platform: prev.platform.includes('instagram')
														? prev.platform.filter(p => p !== 'instagram')
														: [...prev.platform, 'instagram'],
												}));
											}}
											className="flex-1 py-2 text-sm font-medium transition-colors"
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
							</div>
						</div>
					</div>

					{/* Sidebar footer: direct post button (generation disabled temporarily) */}
					<div className="p-4 border-t border-white/10 space-y-3 lg:mt-0" style={{ background: '#0E0E13' }}>
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
									Publication...
								</span>
							) : (
								'PUBLIER LE POST'
							)}
						</button>
					</div>
				</aside>
			</form>
		</div>
				
	);
}
