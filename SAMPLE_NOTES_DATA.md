# Sample Notes Data for Testing

Use these sample notes to test the Notes Management system. Follow the steps in ADMIN_NOTES_GUIDE.md to upload files to Google Drive and get the links.

## Sample Note 1: Data Structures
- **Title**: Data Structures Complete Notes
- **Category**: BCA
- **Semester**: Semester 3
- **Subject**: Programming
- **Description**: Complete notes covering Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs with examples
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

## Sample Note 2: DBMS Interview Questions
- **Title**: DBMS Interview Questions & Answers
- **Category**: Interview Q&A
- **Semester**: (leave empty)
- **Subject**: Database
- **Description**: 100+ commonly asked DBMS interview questions with detailed answers
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

## Sample Note 3: Computer Networks
- **Title**: Computer Networks Complete Guide
- **Category**: MCA
- **Semester**: Semester 2
- **Subject**: Networks
- **Description**: OSI Model, TCP/IP, Routing, Switching, Network Security
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

## Sample Note 4: TCS NQT Preparation
- **Title**: TCS NQT Preparation Guide 2025
- **Category**: Placement Prep
- **Semester**: (leave empty)
- **Subject**: Aptitude
- **Description**: Complete preparation guide with practice questions, tips, and previous year papers
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 3

## Sample Note 5: Java Programming
- **Title**: Java Programming Full Course
- **Category**: BCA
- **Semester**: Semester 4
- **Subject**: Programming
- **Description**: Java basics to advanced - OOP, Collections, Exception Handling, Multithreading
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 2

## Sample Note 6: Web Development
- **Title**: HTML CSS JavaScript Complete Notes
- **Category**: BCA
- **Semester**: Semester 5
- **Subject**: Web Development
- **Description**: Full stack web development notes with practical examples and projects
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

## Sample Note 7: Python Interview Questions
- **Title**: Python Interview Questions 2025
- **Category**: Interview Q&A
- **Semester**: (leave empty)
- **Subject**: Programming
- **Description**: 150+ Python interview questions covering basics, OOP, data structures, and frameworks
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

## Sample Note 8: Operating Systems
- **Title**: Operating Systems Complete Notes
- **Category**: MCA
- **Semester**: Semester 1
- **Subject**: OS
- **Description**: Process Management, Memory Management, File Systems, Deadlocks, CPU Scheduling
- **Google Drive Link**: [Upload your PDF and paste link here]
- **File Count**: 1

---

## Quick Test with Dummy Links

If you want to test the system immediately without uploading real PDFs, you can use these placeholder Google Drive links:

```
https://drive.google.com/uc?export=download&id=1ABC123XYZ
```

Just replace `1ABC123XYZ` with any random string. The system will accept it and save to database. You can replace with real links later.

---

## How to Add Notes via Admin Panel

1. Login to admin panel: http://localhost:5000/admin.html
2. Click "Notes" in sidebar
3. Click "Upload Notes" button
4. Fill in the form with data from above
5. Paste Google Drive link (follow ADMIN_NOTES_GUIDE.md to get link)
6. Click "Add Notes"
7. Notes will appear in the notes section and on notes.html page

---

## Verify Notes are Working

1. Go to http://localhost:5000/notes.html
2. You should see notes grouped by category (BCA, MCA, Placement, Interview)
3. Click download button - it should open Google Drive link and increment download count
4. Refresh page - download count should be updated
