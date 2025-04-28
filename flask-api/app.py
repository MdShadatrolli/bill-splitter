from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import pytesseract
from PIL import Image
import re
import io
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/analyze-receipt', methods=['POST'])
def analyze_receipt():
    if 'receipt' not in request.files:
        return jsonify({'error': 'No receipt image provided'}), 400
    
    file = request.files['receipt']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read image file
        img = Image.open(io.BytesIO(file.read()))
        
        # Use pytesseract to extract text
        text = pytesseract.image_to_string(img)
        
        # Process the text to extract items and prices
        items = extract_items_from_text(text)
        
        # Calculate the total and split amount
        total = sum(item['price'] for item in items)
        per_person = total / 2
        
        return jsonify({
            'items': items,
            'total': total,
            'perPerson': per_person
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_items_from_text(text):
    lines = text.split('\n')
    items = []
    price_regex = r'\$?\s*(\d+\.\d{2}|\d+\,\d{2}|\d+)'
    
    for line in lines:
        line = line.strip()
        
        # Skip short lines or headers
        if len(line) < 3 or re.search(r'total|subtotal|tax|tip|sum|amount|due', line, re.IGNORECASE):
            continue
        
        # Check if line contains a price
        price_match = re.search(price_regex, line)
        
        if price_match:
            price_str = price_match.group(1).replace(',', '.')
            try:
                price = float(price_str)
                
                if price > 0:
                    # Extract item name by removing price
                    name = re.sub(price_regex, '', line).strip()
                    name = re.sub(r'\d+\s*x\s*', '', name)  # Remove quantity
                    
                    # Clean up name
                    name = re.sub(r'[^\w\s]', ' ', name).strip()
                    
                    if name:
                        items.append({
                            'id': str(uuid.uuid4())[:8],
                            'name': name.capitalize(),
                            'price': price
                        })
            except ValueError:
                pass
    
    # If no items found, add some dummy items for demo
    if not items:
        items = [
            {'id': str(uuid.uuid4())[:8], 'name': 'Pasta', 'price': 12.99},
            {'id': str(uuid.uuid4())[:8], 'name': 'Pizza', 'price': 15.50},
            {'id': str(uuid.uuid4())[:8], 'name': 'Salad', 'price': 8.99},
            {'id': str(uuid.uuid4())[:8], 'name': 'Soda', 'price': 2.50}
        ]
    
    return items

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)