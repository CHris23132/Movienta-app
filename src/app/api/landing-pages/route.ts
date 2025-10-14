import { NextRequest, NextResponse } from 'next/server';
import { createLandingPage, getAllLandingPages } from '@/lib/db';

// Helper function to generate slug from brand name
function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const landingPages = await getAllLandingPages();
    return NextResponse.json({ landingPages });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { brandName, heroTitle, heroSubtitle, customPrompt, themeColor } = data;

    if (!brandName || !heroTitle || !heroSubtitle || !customPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = generateSlug(brandName);

    const id = await createLandingPage({
      slug,
      brandName,
      heroTitle,
      heroSubtitle,
      customPrompt,
      themeColor,
    });

    return NextResponse.json({ 
      id, 
      slug,
      message: 'Landing page created successfully' 
    });
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json(
      { error: 'Failed to create landing page' },
      { status: 500 }
    );
  }
}

