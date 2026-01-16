
# 🧠 AI Vision - Intelligent Image Recognition

A sophisticated web application that classifies images into 10 categories using a deep learning model trained on the CIFAR-10 dataset.

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/35c0ee24-9bfd-4d56-a4b2-fe122cbf179a" />

## 🌟 Features
- Advanced CNN Model: Custom deep learning architecture with 85%+ accuracy
- Beautiful UI: Modern, responsive design with particle effects
- Real-time Analysis: Get instant predictions with confidence scores
- Interactive Charts: Visualize probability distributions
- Dark/Light Theme: Toggle between themes
- Drag & Drop: Easy image upload with progress indicator
- Sample Images: Test with pre-loaded sample images
- Detailed Insights: View top 3 predictions with descriptions

## 🏗️ Project Structure

```
AI-Vision-Intelligent-Image-Recognition/
├── static/                    
│   ├── style.css             # Styling
│   └── main.js               # Frontend logic
├── train_cifar10.py          # Model training script
├── cifar10_model.h5          # Trained model file
├── main.py                   # Main script to run the filter
├── uploads/                  # Temporary image storage
├── requirements.txt          # Project dependencies
└── README.md
```


---


## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

---

### Installation
Clone the repository:
```bash
git clone https://github.com/yourusername/vision-ai-main.git
cd vision-ai-main
```

Create and activate virtual environment (optional but recommended):
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Ensure the model is trained:
```bash
python train_cifar10.py
```

Start the Flask server:
```bash
python main.py
```

Open your browser:
http://localhost:5000
---

## 📁 File Descriptions
- **Backend (main.py)**: Flask server, image preprocessing, model inference, API responses
- **Frontend (templates/index.html & static/)**: Drag-and-drop upload, interactive UI, theme switching
- **Model (train_cifar10.py)**: CNN training, data augmentation, saving/loading utilities

---

## 🧪 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /        | GET    | Main web interface |
| /api/model-info | GET | Get model info and classes |
| /api/upload     | POST | Upload image for classification |
| /api/test-prediction | GET | Test endpoint with random prediction |

---

## 🖼️ Supported Image Classes
| Class      | Emoji | Description | Color |
|-----------|-------|-------------|-------|
| Airplane  | ✈️    | Flying vehicle | #f97316 |
| Automobile| 🚗    | Car            | #10b981 |
| Bird      | 🐦    | Bird           | #8b5cf6 |
| Cat       | 🐱    | Cat            | #ec4899 |
| Deer      | 🦌    | Deer           | #facc15 |
| Dog       | 🐶    | Dog            | #3b82f6 |
| Frog      | 🐸    | Frog           | #22c55e |
| Horse     | 🐴    | Horse          | #f43f5e |
| Ship      | 🚢    | Ship           | #0ea5e9 |
| Truck     | 🚚    | Truck          | #14b8a6 |

---

## 🛠️ Development
- Retrain model: `python train_cifar10.py --epochs 50 --batch_size 32`
- Add features: Update main.py, index.html, main.js, style.css

---

## 📊 Model Performance
- Accuracy: 85%+ on CIFAR-10 test set
- Architecture: Custom CNN with multiple convolutional layers
- Input Size: 32x32 pixels (3 channels)
- Output: 10-class probability distribution

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License
MIT License

---

## 🙏 Acknowledgments
- CIFAR-10 dataset creators
- TensorFlow/Keras team
- Flask development team
- Contributors and users

---

## 🐛 Troubleshooting
- Model not found: Run `python train_cifar10.py`
- Import errors: Ensure dependencies installed `pip install -r requirements.txt`
- Upload fails: Check `uploads` directory permissions

---

## 👤 Author

**Himanshu Patle**  

[![Instagram](https://img.shields.io/badge/Instagram-000000?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/h_imanshu_01/?next=%2F)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-000000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/himanshu-patle-2b563730b/)
[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/imanshu-01)

