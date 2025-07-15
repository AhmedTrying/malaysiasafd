# Development Malaysia Scam and Fraud Dashboard 

<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/9c1e08dc-49ef-4940-a21c-b8a73e387119" />

An interactive web-based platform designed to **monitor, analyze, and predict scam activities in Malaysia**, integrating descriptive and predictive analytics to combat digital fraud effectively.
<img width="746" height="380" alt="System Architecture  drawio" src="https://github.com/user-attachments/assets/c8f00aef-78f1-4888-b7db-d9697de56ade" />


---

## 📌 Overview
<img width="1913" height="942" alt="image" src="https://github.com/user-attachments/assets/a0537ff1-7350-4821-94a4-379500aaa011" />

The **Malaysia Scam and Fraud Dashboard** centralizes scam reports, social media mentions, and official data sources like **MyCERT reports**, enabling users, analysts, and organizations to:

* Submit and review scam reports
* Detect scam trends and hotspots
* Predict scam likelihood using a **Logistic Regression model**
* Visualize scam analytics with **Power BI**

---

## 🚀 Features

✅ **User Features**

* Scam report submission
* Fraud classification (scam/non-scam)
* Downloadable report summaries

✅ **Admin Features**

* Manage scam types
* Approve/reject submitted reports
* Monitor dashboard statistics
* Export data to CSV

✅ **Machine Learning Integration**

* Logistic Regression model for scam classification
* 85% prediction accuracy

✅ **Visual Analytics**

* Real-time Power BI dashboards
* Geographic scam hotspots
* Trends over time

---

## 🛠️ Tech Stack

* **Frontend**: React + Tailwind CSS
* **Backend**: Next.js API Routes + Flask ML API
* **Database**: Supabase (PostgreSQL)
* **Machine Learning**: Python (scikit-learn, Logistic Regression)
* **Visualization**: Power BI

---

## 📸 Screenshots

| Dashboard     
<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/7b6bda50-5a17-4b9a-85f5-52b069cf12fb" />

| Report Submission    
<img width="1905" height="992" alt="image" src="https://github.com/user-attachments/assets/c6f4a164-6cfb-4ffc-a033-6649cb140c10" />

| Scam Prediction        
<img width="856" height="368" alt="image" src="https://github.com/user-attachments/assets/84f28659-3074-4bb4-b79f-edce78759b78" />


## 🔄 System Architecture
<img width="1103" height="631" alt="Page navigation diagram drawio" src="https://github.com/user-attachments/assets/12319762-7d7e-49f7-8ca9-0286fc143c32" />


---

## 📥 Installation

1️⃣ **Clone Repository**

```bash
git clone https://github.com/AhmedTrying/malaysiasafd.git
cd malaysiasafd
```

2️⃣ **Install Frontend Dependencies**

```bash
npm install
npm run dev
```

3️⃣ **Setup Backend ML API**

```bash
cd python/
pip install -r requirements.txt
python predict_scam.py
```

4️⃣ **Connect Supabase**

* Add your Supabase keys in `.env.local`

5️⃣ **Access Dashboard**

```bash
http://localhost:3000
```

---

## 📊 Dataset

The ML model was trained on **300+ scam & non-scam cases** from MyCERT reports, covering:

* Investment scams
* Employment scams
* Phishing attacks
* Romance scams
* Loan scams

---

## ✅ Evaluation

* **Prediction Accuracy**: 85%
* **Processing Time**: < 3 seconds
* **User Feedback**: 4.7/5

---

## 📖 References

* CyberSecurity Malaysia (2023)
* Bank Negara Malaysia (2023)
* MyCERT Reports

---

## 🙌 Acknowledgments

This project was developed as part of **UTM Final Year Project (PSM2)** under the guidance of **PM Dr. Anazida Zainal**.

Special thanks to **Magnifi Machines** for stakeholder collaboration in fraud analytics.


