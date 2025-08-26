# Physical Menu Migration with AI - Setup Guide

This feature allows users to convert physical menu images into digital QR menus using Google's Gemini AI.

## Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
# Google Gemini AI Configuration
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

## How to Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

## Features

### 🤖 AI-Powered Menu Migration
- **Smart Image Analysis**: Uses Google's Gemini Vision model to analyze menu images
- **Multi-language Support**: Automatically detects and separates English and Turkish text
- **Category Organization**: Intelligently groups menu items into logical categories
- **Price Extraction**: Accurately extracts prices and converts them to proper format

### 📱 Flexible Image Input
- **Camera Capture**: Take photos directly using device camera (prefers back camera for better menu photos)
- **File Upload**: Upload multiple menu images from device storage
- **Multiple Pages**: Process multiple menu pages in a single migration

### 🔄 Seamless Integration
- **Database Integration**: Automatically creates categories and menu items in your existing Supabase database
- **Progress Tracking**: Real-time progress indicators during the migration process
- **Error Handling**: Comprehensive error handling with user-friendly messages

## How It Works

### 1. Image Processing
- Users can either capture photos using their camera or upload image files
- The system accepts multiple images for multi-page menus
- Images are converted to base64 format for API transmission

### 2. AI Analysis
- Images are sent to Google's Gemini 1.5 Flash model
- The AI analyzes the images to extract:
  - Menu categories
  - Item names (English and Turkish if available)
  - Item descriptions
  - Prices
  - Availability status

### 3. Data Structure
The AI returns a structured JSON response:
```json
{
  "categories": [
    {
      "name_en": "English category name",
      "name_tr": "Turkish category name",
      "description_en": "English description",
      "description_tr": "Turkish description",
      "items": [
        {
          "name_en": "English item name",
          "name_tr": "Turkish item name",
          "description_en": "English description",
          "description_tr": "Turkish description",
          "price": 25.50,
          "is_available": true
        }
      ]
    }
  ]
}
```

### 4. Database Creation
- Creates menu categories in the `menu_categories` table
- Creates menu items in the `menu_items` table
- Maintains proper relationships between cafes, categories, and items
- Preserves multilingual content using JSON fields

## Usage

1. **Access the Feature**: Click the AI bot button (🤖) on any cafe card in your dashboard
2. **Upload Images**: Choose to either take photos or upload files of your physical menu
3. **Start Migration**: Click "Start Migration" to begin the AI analysis
4. **Monitor Progress**: Watch the progress indicators as the system processes your menu
5. **Review Results**: Once complete, your digital menu will be automatically created

## Technical Implementation

### Components
- **MenuMigrationModal**: React component for the migration interface
- **API Route**: `/api/migrate-menu` handles the Gemini API integration
- **Database Functions**: Existing Supabase functions create the menu structure

### Security
- API key is stored securely as an environment variable
- Image data is processed temporarily and not stored
- All database operations respect existing RLS policies

### Performance
- Optimized for mobile and desktop use
- Efficient image processing and API calls
- Real-time progress feedback

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Ensure your `GEMINI_API_KEY` is set in `.env.local`
   - Restart your development server after adding the environment variable

2. **"Unable to access camera"**
   - Grant camera permissions in your browser
   - Use file upload as an alternative

3. **"Failed to parse menu data"**
   - Ensure menu images are clear and readable
   - Try uploading higher quality images
   - Make sure text in images is not too small or blurry

4. **Migration fails**
   - Check your internet connection
   - Verify your Gemini API key is valid
   - Try with fewer or different images

### Support
If you encounter issues, check:
- Browser console for detailed error messages
- Network tab for API call failures
- Ensure all environment variables are properly configured
