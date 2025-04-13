# Union Bank AI-Driven Service Assistant 🚀

This project revolutionizes banking customer service using Artificial Intelligence. Customers can record a video describing their queries, which are categorized by AI into departments like Loan, Credit/Debit Card, Cheque Book, Nominee Registration, etc. A service ticket is auto-generated and routed to the appropriate department.

---

## 📁 Repository Structure

```
📁 AI-ML-Backend   → AI models & backend logic (run `app.py`)
📁 demo-server     → Contains test Aadhaar/PAN datasets
📁 backend         → Node.js backend managing database & APIs
📁 AI              → Research/reference AI materials
```

---

## 🧠 Core Features

- 🎥 **Video Query Submission**
- 🧾 **Speech-to-Text Conversion** using Vosk / Whisper
- 🧠 **AI Query Classification**
- 🪪 **Face Recognition with Aadhaar-based Verification**
- 🎫 **Service Ticket Generation**
- 🌐 **Multilingual Vernacular Language Support**
- 🔐 **Fraud Detection via Voice Stress & Behavior**
- 🔁 **Zero Third-Party Dependencies (Offline-Capable)**

---

## 🧪 Tech Stack

- **AI/ML Backend**: Python, Flask, TensorFlow Lite, Vosk, Whisper, spaCy, OpenCV
- **Database**: PostgreSQL, SQLite
- **Backend**: Node.js (Express.js), Redis, Supabase
- **Frontend**: Android App (Kotlin/Java), React + TypeScript (for employees)

---

## 🖥️ How to Run the Project on Windows

### 🔧 Prerequisites

- Python (v3.8 or higher)
- Node.js & npm
- PostgreSQL
- Android Studio (for mobile app)
- Git
- Redis (Windows binaries or WSL)

---

### 🚀 Steps to Run the AI Backend (Python)

```bash
cd AI-ML-Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

- Backend will run at: `http://127.0.0.1:5000/`

---

### 🛠️ Steps to Run the Node.js Backend

```bash
cd backend
npm install
```

- Create `.env` file with the following content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db_name
```

```bash
npm start
```

---

### 📲 Steps to Run Android App

1. Open the project in Android Studio
2. Sync Gradle
3. Run on emulator or physical device

---

## 🧑‍💻 Team Members

| Name          | Role              |
|---------------|-------------------|
| Harish Lukare | AI/ML (Team Lead) |
| Kishan Mali   | Android Dev       |
| Ishan Jawale  | AI/ML             |
| Tanmay Tambat | Web Dev           |

---

## 🔗 Resources & Links

- 💻 [GitHub Repo](https://github.com/hlukare/IDEA-Hackathon.git)
- 📹 [Video Demo](https://drive.google.com/drive/folders/1sqSezMd3wVayeotc4GjtVheXX2aeYRwP?usp=sharing)
- 📄 [Research & Flowchart](https://drive.google.com/drive/folders/1_daZShTdgOwwy1Hf2JCDrXtBUTH7T4gb)
- 📊 [Architecture Flow](https://drive.google.com/drive/folders/1ScI4Nlp8XQlnHtNZ0L56eic655QKHEHM?usp=sharing)

---

## 💼 Impact & Benefits

- Enhances financial inclusion for rural users
- Reduces fraud and operational costs
- Personalized banking with voice + vernacular AI
- Eco-friendly: Less paper usage

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

> 💡 Built for Union Bank of India to revolutionize customer service through AI.
