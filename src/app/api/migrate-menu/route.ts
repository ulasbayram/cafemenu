import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * API route to process physical menu images using Gemini Vision API
 * and return structured menu data for database insertion
 */
export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Convert images to base64 format for Gemini API
    const imagePromises = images.map(async (image) => {
      const arrayBuffer = await image.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return {
        inlineData: {
          data: base64,
          mimeType: image.type,
        },
      };
    });

    const imageData = await Promise.all(imagePromises);

    // Initialize Gemini model for vision tasks
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create detailed prompt for menu extraction
    const prompt = `
Please analyze these menu images and extract all menu information. Return the data as a JSON object with the following structure:

{
  "categories": [
    {
      "name_en": "English category name",
      "name_tr": "Turkish category name (if available, otherwise use English)",
      "description_en": "English description (optional)",
      "description_tr": "Turkish description (optional)",
      "items": [
        {
          "name_en": "English item name",
          "name_tr": "Turkish item name (if available, otherwise use English)",
          "description_en": "English description",
          "description_tr": "Turkish description (if available, otherwise use English)",
          "price": 25.50,
          "is_available": true
        }
      ]
    }
  ]
}

Important guidelines:
- Extract ALL menu items, categories, and prices visible in the images
- If text is in multiple languages, separate them into _en and _tr fields
- If only one language is available, use that language for both _en and _tr fields
- Convert all prices to decimal numbers (remove currency symbols)
- Set is_available to true for all items unless clearly marked as unavailable
- Group items into logical categories (e.g., "Beverages", "Main Dishes", "Desserts")
- If categories are not clearly defined, create appropriate ones based on the items
- Be thorough and capture all visible menu information
- Return ONLY the JSON object, no additional text or formatting

Please process all images as parts of the same menu and consolidate the information.
`;

    // Generate content using Gemini Vision API
    const result = await model.generateContent([prompt, ...imageData]);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    let menuData;
    try {
      menuData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedText);
      return NextResponse.json(
        { error: 'Failed to parse menu data from AI response' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!menuData.categories || !Array.isArray(menuData.categories)) {
      return NextResponse.json(
        { error: 'Invalid menu data structure returned by AI' },
        { status: 500 }
      );
    }

    // Return the structured menu data
    return NextResponse.json({
      success: true,
      data: menuData,
      message: `Successfully processed ${images.length} image(s) and extracted ${menuData.categories.length} categories`,
    });

  } catch (error) {
    console.error('Error processing menu migration:', error);
    return NextResponse.json(
      { error: 'Failed to process menu images' },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests - return API information
 */
export async function GET() {
  return NextResponse.json({
    message: 'Menu Migration API',
    description: 'POST images to this endpoint to extract menu data using AI',
    requiredFields: ['images'],
  });
}
