'use client';

import { useState, useEffect } from 'react';
import { LandingPage } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Paywall from '@/components/Paywall';
// ARCHIVED: Credits banner commented out for free mode (was showing confusing "no credits" message)
// import CreditsBanner from '@/components/CreditsBanner';
import { uploadLogo, validateImageFile } from '@/lib/image-upload';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    heroTitle: '',
    heroSubtitle: '',
    customPrompt: '',
    themeColor: '#3B82F6',
    logoFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPageForEmbed, setSelectedPageForEmbed] = useState<LandingPage | null>(null);
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchLandingPages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLandingPages = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/landing-pages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch landing pages');
      const data = await response.json();
      setLandingPages(data.landingPages);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      setMessage({ type: 'error', text: 'Failed to load landing pages' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getEmbedCode = (slug: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<!-- Movienta AI Voice Agent Widget -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.id = 'movienta-widget-iframe';
    iframe.src = '${baseUrl}/widget/${slug}';
    iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:112px;height:112px;border:none;z-index:9999;pointer-events:auto;background:transparent;transition:all 0.3s ease;';
    iframe.allow = 'microphone';
    iframe.setAttribute('allowtransparency', 'true');
    
    // Listen for widget state changes
    window.addEventListener('message', function(event) {
      if (event.data.type === 'movienta-widget-state') {
        if (event.data.isOpen) {
          // Widget is open - expand to show sidebar
          iframe.style.width = '416px';
          iframe.style.height = '672px';
          iframe.style.bottom = '0';
          iframe.style.right = '0';
        } else {
          // Widget is closed - shrink to button size
          iframe.style.width = '112px';
          iframe.style.height = '112px';
          iframe.style.bottom = '0';
          iframe.style.right = '0';
        }
      }
    });
    
    document.body.appendChild(iframe);
  })();
</script>`;
  };

  const copyEmbedCode = async (slug: string) => {
    const embedCode = getEmbedCode(slug);
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error || 'Invalid file' });
      return;
    }

    // Update form data
    setFormData({ ...formData, logoFile: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!user) return;

    try {
      let logoUrl = '';

      // Upload logo if provided
      if (formData.logoFile) {
        const uploadResult = await uploadLogo(formData.logoFile, user.uid, formData.brandName);
        if (!uploadResult.success) {
          setMessage({ type: 'error', text: uploadResult.error || 'Failed to upload logo' });
          setIsSubmitting(false);
          return;
        }
        logoUrl = uploadResult.url!;
      }

      const token = await user.getIdToken();
      const requestData = {
        ...formData,
        logoUrl,
        logoFile: undefined, // Don't send the file object
      };
      
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Failed to create landing page');

      const data = await response.json();
      setMessage({ 
        type: 'success', 
        text: `Landing page created! Access it at: /${data.slug}` 
      });
      
      // Reset form
      setFormData({
        brandName: '',
        heroTitle: '',
        heroSubtitle: '',
        customPrompt: '',
        themeColor: '#3B82F6',
        logoFile: null,
      });
      setLogoPreview(null);
      setShowForm(false);
      
      // Refresh list
      fetchLandingPages();
    } catch (error) {
      console.error('Error creating landing page:', error);
      setMessage({ type: 'error', text: 'Failed to create landing page' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const adminContent = (
    <div className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Admin Dashboard</h1>
            <p className="text-white/80">
              Create and manage AI-powered landing pages
            </p>
            <p className="text-sm text-white/60 mt-1">
              Logged in as: {user.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/credits"
              className="px-4 py-2 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
            >
              Credits
            </Link>
            <Link
              href="/calls"
              className="px-4 py-2 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
            >
              View Calls
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ARCHIVED: Credits Banner - Commented out for free mode */}
        {/* <CreditsBanner /> */}

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-900/30 border border-green-400/30 text-green-300'
                : 'bg-red-900/30 border border-red-400/30 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {showForm ? 'Cancel' : '+ Create Voice Agent'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-white">Create Voice Agent</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50"
                  placeholder="e.g., Acme Corp"
                  required
                />
                <p className="mt-1 text-xs text-white/60">
                  This will be used to generate the URL slug
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Hero Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50"
                  placeholder="e.g., Welcome to Our Service"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Hero Subtitle <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50"
                  placeholder="e.g., We're here to help you with..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  AI Chatbot Custom Prompt <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.customPrompt}
                  onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50"
                  placeholder="e.g., Ask about their moving needs, preferred dates, and any special requirements..."
                  rows={5}
                  required
                />
                <p className="mt-1 text-xs text-white/60">
                  Instructions for the AI chatbot on what information to gather from visitors
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Logo Image (Optional)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-xs text-white/60">
                    Upload a JPEG, PNG, or WebP image. Max size: 2MB. Will be resized to 200px max width/height.
                  </p>
                  
                  {/* Logo Preview */}
                  {logoPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2 text-white">Preview:</p>
                      <div className="inline-block p-2 border border-white/20 rounded-lg bg-white/5">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          width={64}
                          height={64}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Theme Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-20 h-10 border border-white/20 rounded cursor-pointer bg-white/10"
                  />
                  <span className="text-sm text-white/80">
                    {formData.themeColor}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Voice Agent'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-white/20 px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Landing Pages List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Your Landing Pages</h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-white/80">Loading...</p>
              </div>
            ) : landingPages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/80">
                  No landing pages yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {landingPages.map((page) => (
                  <div
                    key={page.id}
                    className="border border-white/20 rounded-lg p-6 hover:border-blue-400 transition-colors bg-white/5 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {page.logoUrl && (
                          <Image
                            src={page.logoUrl}
                            alt={`${page.brandName} logo`}
                            width={32}
                            height={32}
                            className="h-8 w-auto object-contain"
                          />
                        )}
                        <h3 className="text-xl font-semibold text-white">{page.brandName}</h3>
                      </div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: page.themeColor }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      {page.heroTitle}
                    </p>
                    <div className="flex flex-col gap-3">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium transition-colors"
                      >
                        View Landing Page: /{page.slug} →
                      </a>
                      <button
                        onClick={() => setSelectedPageForEmbed(page)}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Get Embed Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Embed Code Modal */}
        {selectedPageForEmbed && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Embed Code</h2>
                  <p className="text-sm text-white/70 mt-1">
                    Add this AI Voice Agent to any website
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPageForEmbed(null);
                    setEmbedCopied(false);
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Preview */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-sm text-white/80 mb-2">
                      <strong className="text-white">{selectedPageForEmbed.brandName}</strong> - AI Voice Agent Widget
                    </p>
                    <p className="text-xs text-white/60">
                      A floating chat button will appear in the bottom-right corner of your website. 
                      Visitors can click to start a voice conversation with your AI agent.
                    </p>
                  </div>
                </div>

                {/* Widget URL */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Widget URL
                  </h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <code className="text-sm break-all text-white/90">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/widget/{selectedPageForEmbed.slug}
                    </code>
                  </div>
                </div>

                {/* Embed Code */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Embed Code
                  </h3>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs border border-white/20">
                      <code>{getEmbedCode(selectedPageForEmbed.slug)}</code>
                    </pre>
                    <button
                      onClick={() => copyEmbedCode(selectedPageForEmbed.slug)}
                      className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-medium transition-all ${
                        embedCopied
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {embedCopied ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        'Copy Code'
                      )}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
                  <h3 className="font-semibold mb-3 text-white">
                    📋 How to Install
                  </h3>
                  <ol className="space-y-2 text-sm text-white/90">
                    <li className="flex gap-3">
                      <span className="font-bold text-white">1.</span>
                      <span>Copy the embed code above</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-white">2.</span>
                      <span>Paste it before the closing <code className="bg-white/20 px-1 rounded text-white">&lt;/body&gt;</code> tag on your website</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-white">3.</span>
                      <span>The AI voice agent will appear as a floating chat button on your site</span>
                    </li>
                  </ol>
                  <div className="mt-4 pt-4 border-t border-blue-400/30">
                    <p className="text-xs text-white/80">
                      <strong className="text-white">Note:</strong> The widget requires microphone permissions to work. 
                      Make sure your website is served over HTTPS for the best experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/20 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedPageForEmbed(null);
                    setEmbedCopied(false);
                  }}
                  className="px-6 py-2 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => copyEmbedCode(selectedPageForEmbed.slug)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {embedCopied ? 'Copied!' : 'Copy Embed Code'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // ARCHIVED: FREE MODE ENABLED
  // ============================================
  // Paywall check is temporarily disabled.
  // The app is now free to use. Paywall component
  // is modified to always grant access.
  // To re-enable: Uncomment Paywall wrapper below.
  // ============================================

  // ARCHIVED: Original paywall protection (kept for future use)
  // return (
  //   <Paywall>
  //     {adminContent}
  //   </Paywall>
  // );

  // FREE MODE: Direct access without paywall
  return adminContent;
}

