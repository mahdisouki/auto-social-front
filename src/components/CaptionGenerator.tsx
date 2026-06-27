import { useState, useEffect } from 'react';
import { postsApi } from '../lib/api';
import { getErrorMessage } from '../lib/getErrorMessage';

interface CaptionGeneratorProps {
  onCaptionGenerated: (caption: string) => void;
  initialPrompt?: string;
  initialPlatform?: string;
}

export function CaptionGenerator({ 
  onCaptionGenerated, 
  initialPrompt = '', 
  initialPlatform = 'instagram'
}: CaptionGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [platform, setPlatform] = useState(initialPlatform);
  const [language, setLanguage] = useState<'english' | 'french' | 'tunisian' | 'arabic'>('english');
  const [tone, setTone] = useState<'luxury' | 'friendly' | 'funny' | 'professional' | 'casual'>('friendly');
  const [audience, setAudience] = useState<'men' | 'women' | 'teens' | 'general' | 'luxury_buyers'>('general');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update prompt when initialPrompt changes
  useEffect(() => {
    if (initialPrompt && initialPrompt !== prompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // Update platform when initialPlatform changes
  useEffect(() => {
    if (initialPlatform && initialPlatform !== platform) {
      setPlatform(initialPlatform);
    }
  }, [initialPlatform]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCaptions([]);

    try {
      let response;
      
      if (language === 'tunisian') {
        response = await postsApi.generateTunisianCaption({
          prompt,
          platform,
          tone: tone as 'luxury' | 'friendly' | 'funny' | 'casual',
          audience: audience as 'men' | 'women' | 'teens' | 'general'
        });
      } else if (count > 1) {
        response = await postsApi.generateMultipleCaptions({
          prompt,
          platform,
          count,
          language,
          tone,
          audience
        });
      } else {
        response = await postsApi.generateCaption({
          prompt,
          platform,
          language,
          tone,
          audience,
          length,
          count
        });
      }

      if (response.data.success) {
        if (count > 1 || language === 'tunisian') {
          const captions = response.data.data.captions || [response.data.data.caption];
          setGeneratedCaptions(captions);
          onCaptionGenerated(captions[0]);
        } else {
          const caption = response.data.data.caption;
          setGeneratedCaptions([caption]);
          onCaptionGenerated(caption);
        }
      } else {
        setError('Failed to generate caption');
      }
    } catch (err: unknown) {
      console.error('Error generating caption:', err);
      setError(getErrorMessage(err, 'Failed to generate caption'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCaptionSelect = (caption: string) => {
    onCaptionGenerated(caption);
  };

  return (
    <div className="space-y-4">
      {/* Basic Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Launching our new summer collection with eco-friendly materials..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="tunisian">Tunisian Arabic (Darija)</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="friendly">Friendly</option>
              <option value="luxury">Luxury</option>
              <option value="funny">Funny</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="general">General</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="teens">Teens</option>
                  <option value="luxury_buyers">Luxury Buyers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value={1}>1 Option</option>
                <option value={2}>2 Options</option>
                <option value={3}>3 Options</option>
                <option value={4}>4 Options</option>
                <option value={5}>5 Options</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Caption
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Generated Captions */}
      {generatedCaptions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">
            Generated Caption{generatedCaptions.length > 1 ? 's' : ''}:
          </h4>
          {generatedCaptions.map((caption, index) => (
            <div
              key={index}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleCaptionSelect(caption)}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-blue-800 flex-1">{caption}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCaptionSelect(caption);
                  }}
                  className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex-shrink-0"
                >
                  Use This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
