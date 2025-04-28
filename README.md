# SplitSmart - AI Bill Splitter

SplitSmart is an AI-powered bill splitting application that makes it easy to split receipts between people. Simply upload a photo of your receipt, and the app will automatically detect items and split the bill evenly.

## Features

- Image upload and preview
- AI-powered text extraction from receipt images
- Automatic identification of bill items and prices
- Equal bill splitting between two people
- Detailed breakdown of each person's share
- Manual item adjustment if needed

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Tesseract.js for OCR (client-side text recognition)
- React Dropzone for file uploads

### Backend (Optional)
- Flask API
- Python-based OCR with pytesseract

## Running the Application

### Frontend Only (Client-side OCR)
```
npm install
npm run dev
```

### With Backend API
```
# Terminal 1 - Frontend
npm install
npm run dev

# Terminal 2 - Backend
cd flask-api
pip install -r requirements.txt
python app.py
```

## Deployment Options

### Frontend Deployment
- **Netlify**: Connect to your GitHub repo for automatic deployments
- **Vercel**: Similar to Netlify with React project support
- **GitHub Pages**: Free hosting for static sites

### Backend Deployment
- **PythonAnywhere**: Free tier available for Flask apps
- **Render**: Free tier for web services
- **Heroku**: Paid option with more resources

## Setting up OCR

### Client-side (Tesseract.js)
The application is configured to use Tesseract.js for client-side OCR, which runs directly in the browser.

### Server-side (Optional)
For server-side OCR with Python:
1. Install Tesseract OCR on your system:
   - Ubuntu: `sudo apt install tesseract-ocr`
   - macOS: `brew install tesseract`
   - Windows: Download installer from GitHub
2. Ensure the pytesseract package is installed

## Known Limitations

- OCR accuracy depends on receipt image quality
- Simple bill splitting (equal parts only in current version)
- Processing may be slower on mobile devices with client-side OCR

## Future Enhancements

- Custom split ratios (percentage or item-based)
- Support for more than two people
- Ability to save and share splits
- Receipt history
- Mobile app versions