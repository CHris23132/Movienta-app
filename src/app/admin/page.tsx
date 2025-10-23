'use client';

import { useState, useEffect } from 'react';
import { LandingPage } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Paywall from '@/components/Paywall';
import CreditsBanner from '@/components/CreditsBanner';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const adminContent = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage AI-powered landing pages
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Logged in as: {user.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/credits"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Credits
            </Link>
            <Link
              href="/calls"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View Calls
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Credits Banner */}
        <CreditsBanner />

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
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
            {showForm ? 'Cancel' : '+ Create New Landing Page'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Create Landing Page</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="e.g., Acme Corp"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be used to generate the URL slug
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="e.g., Welcome to Our Service"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero Subtitle <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="e.g., We're here to help you with..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  AI Chatbot Custom Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.customPrompt}
                  onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="e.g., Ask about their moving needs, preferred dates, and any special requirements..."
                  rows={5}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Instructions for the AI chatbot on what information to gather from visitors
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo Image (Optional)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500">
                    Upload a JPEG, PNG, or WebP image. Max size: 2MB. Will be resized to 200px max width/height.
                  </p>
                  
                  {/* Logo Preview */}
                  {logoPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="inline-block p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                <label className="block text-sm font-medium mb-2">
                  Theme Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-20 h-10 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
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
                  {isSubmitting ? 'Creating...' : 'Create Landing Page'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-300 dark:border-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Landing Pages List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Landing Pages</h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : landingPages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No landing pages yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {landingPages.map((page) => (
                  <div
                    key={page.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
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
                        <h3 className="text-xl font-semibold">{page.brandName}</h3>
                      </div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: page.themeColor }}
                      ></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {page.heroTitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        /{page.slug} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Paywall>
      {adminContent}
    </Paywall>
  );
}

