# OCR Assignment Manager
This project is meant to provide students with an app to manage their assignments across all of their courses. This is meant to overcome the need to rely on outdated Learning Management Systems like D2L to manage their courses effectively. It also removes the barrier posed by manually entering every assignment and date into current assignment tackers or templates. Instead, the student only needs to upload a screenshot of their assignments page and the rest is handled by the app. 

This project extracts assignment names and due dates from educational screenshots using:
- OCR (via OCR.space)
- Line classification (using a local DistilBERT model)
- FastAPI backend
- Next.js frontend

## Features
- Authentication & Security: Auth0 integration for secure user login and JWT verification across Next.js backend routes.

- Server-Side Routing: Next.js API routes handle assignment/course actions and token verification.

- Data Persistence: Assignment and course data are stored in a Postgres database (via a Docker PostgreSQL image), managed with Prisma ORM.

- User-Specific Data: Courses and assignments are linked to logged-in users for personalized data management.

- Editing & Deletion: Users can update or delete course names and assignment details, allowing for easy correction of OCR mistakes with minimal manual input.

- Image Downscaling: PNG images are automatically downscaled (via downscaler.py) before submission to OCR.space, ensuring compatibility with their reduced file size limit (≤1MB).

- Structured Extraction: Screenshots are processed for assignment extraction, classifying lines as title, due, or noise, using a locally fine-tuned DistilBERT model.

## Setup Instructions
### **Clone the Repository**
```bash
git clone https://github.com/your-username/ocr-assignment-manager.git
cd ocr-assignment-manager
```
### **Backend Setup (FastAPI)**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate (MacOS)  # or .venv\Scripts\activate (Windows)
pip install -r requirements.txt
```
#### Start the Server
```bash
uvicorn main:app --reload
```
### **Frontend Setup (Next.js)**
```bash
cd ../frontend
npm install
npm run dev
```
### **Database Setup (Docker + Prisma)**
#### Start PostgreSQL (Docker):
```bash
docker run --name ocr-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```
#### Configure Prisma:

**Update DATABASE_URL in .env.**

**Run migrations:**

```bash
npx prisma migrate dev
```

## Notes
- Auth0 is used for authentication.
- The [GoFullPage](https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl) Chrome extension was used to ensure consistent assignment data collection.
- Assignment and course editing streamline correction of OCR errors.
- Data is securely persisted per user.
- OCR PNG images are downscaled automatically for compatibility.
- The classifier model uses only 3 labels: title, due, and noise.
- OCR is powered by OCR.space.
- Classification leverages a locally fine-tuned DistilBERT.

This is a POC for an assignment manager application that leverages two types of AI. It was primarily created for our TrendCon 2025 that highlighted projects that utilized emerging trends in technology. If fleshed out further, we would also include:
- The ability to set reminders for assignments
- A calendar view (monthly and weekly)
- Integration with Google Calendar and/or Outlook
- A more indepth progress tracker for each assignment
- All of the above for test tracking as well
- And much more..
