export const adminStudents = [
  { id: "STU-2026-001", name: "Rahul Sharma", email: "rahul.sharma@campus.edu", phone: "+91 98765 42100", course: "B.Sc Computer Science", batch: "BSC-CS-2026-A", joined: "12 Jul 2026", status: "Active", lastActive: "4 min ago", attendance: 92, performance: 84 },
  { id: "STU-2026-014", name: "Priya Rao", email: "priya.rao@campus.edu", phone: "+91 98765 42114", course: "B.Com", batch: "BCOM-2026-A", joined: "13 Jul 2026", status: "Active", lastActive: "18 min ago", attendance: 88, performance: 79 },
  { id: "STU-2026-027", name: "Kiran Kumar", email: "kiran.kumar@campus.edu", phone: "+91 98765 42127", course: "PUC Science", batch: "PUC-SCI-2026-B", joined: "15 Jul 2026", status: "Inactive", lastActive: "8 days ago", attendance: 67, performance: 61 },
  { id: "STU-2026-039", name: "Aisha Khan", email: "aisha.khan@campus.edu", phone: "+91 98765 42139", course: "PUC Commerce", batch: "PUC-COM-2026-A", joined: "16 Jul 2026", status: "Active", lastActive: "1 hour ago", attendance: 95, performance: 91 },
  { id: "STU-2026-052", name: "Nikhil Shetty", email: "nikhil.shetty@campus.edu", phone: "+91 98765 42152", course: "B.Sc Computer Science", batch: "BSC-CS-2026-A", joined: "18 Jul 2026", status: "Suspended", lastActive: "12 days ago", attendance: 58, performance: 54 },
];

export const adminFaculty = [
  { id: "FAC-1012", name: "Dr. Anil Kumar", email: "anil.kumar@campus.edu", department: "Computer Science", subjects: "Data Structures, DBMS", classes: 4, students: 186, workload: "18 hrs", status: "Active", lastActive: "Now" },
  { id: "FAC-1028", name: "Prof. Meera Rao", email: "meera.rao@campus.edu", department: "Commerce", subjects: "Accounting, Finance", classes: 3, students: 142, workload: "16 hrs", status: "Active", lastActive: "12 min ago" },
  { id: "FAC-1042", name: "Dr. Kavya Rao", email: "kavya.rao@campus.edu", department: "Physics", subjects: "Mechanics, Physics", classes: 4, students: 148, workload: "18 hrs", status: "Active", lastActive: "6 min ago" },
  { id: "FAC-1051", name: "Dr. Rajesh Shetty", email: "rajesh.shetty@campus.edu", department: "Mathematics", subjects: "Calculus, Statistics", classes: 3, students: 124, workload: "14 hrs", status: "On leave", lastActive: "2 days ago" },
];

export const departments = [
  { code: "CS", name: "Computer Science", head: "Dr. Anil Kumar", faculty: 18, students: 486, courses: 4, status: "Active" },
  { code: "COM", name: "Commerce", head: "Prof. Meera Rao", faculty: 14, students: 392, courses: 3, status: "Active" },
  { code: "PHY", name: "Physics", head: "Dr. Kavya Rao", faculty: 11, students: 268, courses: 3, status: "Active" },
  { code: "MAT", name: "Mathematics", head: "Dr. Rajesh Shetty", faculty: 12, students: 314, courses: 4, status: "Active" },
];

export const courses = [
  { code: "BSC-CS", name: "B.Sc Computer Science", department: "Computer Science", duration: "3 Years", students: 486, faculty: 18, subjects: 24, batches: 6, status: "Active" },
  { code: "BCOM", name: "Bachelor of Commerce", department: "Commerce", duration: "3 Years", students: 392, faculty: 14, subjects: 22, batches: 5, status: "Active" },
  { code: "PUC-SCI", name: "PUC Science", department: "Science", duration: "2 Years", students: 318, faculty: 16, subjects: 12, batches: 4, status: "Active" },
  { code: "PUC-COM", name: "PUC Commerce", department: "Commerce", duration: "2 Years", students: 236, faculty: 10, subjects: 10, batches: 3, status: "Draft" },
];

export const subjects = [
  { code: "CS204", name: "Data Structures", course: "B.Sc Computer Science", department: "Computer Science", faculty: "Dr. Anil Kumar", students: 164, semester: "Semester 2", status: "Active" },
  { code: "PHY202", name: "Classical Mechanics", course: "PUC Science", department: "Physics", faculty: "Dr. Kavya Rao", students: 148, semester: "Semester 2", status: "Active" },
  { code: "COM112", name: "Financial Accounting", course: "B.Com", department: "Commerce", faculty: "Prof. Meera Rao", students: 142, semester: "Semester 1", status: "Active" },
  { code: "MAT205", name: "Applied Statistics", course: "B.Sc Computer Science", department: "Mathematics", faculty: "Dr. Rajesh Shetty", students: 124, semester: "Semester 2", status: "Draft" },
];

export const batches = [
  { code: "BSC-CS-2026-A", name: "B.Sc CS · Section A", course: "B.Sc Computer Science", year: "2026–27", students: 82, faculty: 8, start: "12 Jul 2026", end: "30 Apr 2027", status: "Active" },
  { code: "BCOM-2026-A", name: "B.Com · Section A", course: "B.Com", year: "2026–27", students: 76, faculty: 7, start: "12 Jul 2026", end: "30 Apr 2027", status: "Active" },
  { code: "PUC-SCI-2026-B", name: "PUC Science · Section B", course: "PUC Science", year: "2026–27", students: 64, faculty: 6, start: "15 Jul 2026", end: "15 Mar 2027", status: "Active" },
  { code: "PUC-COM-2026-A", name: "PUC Commerce · Section A", course: "PUC Commerce", year: "2026–27", students: 58, faculty: 6, start: "15 Jul 2026", end: "15 Mar 2027", status: "Planned" },
];

export const assignments = [
  { title: "Laws of Motion – Problem Set", subject: "Classical Mechanics", course: "PUC Science", faculty: "Dr. Kavya Rao", batch: "PUC-SCI-2026-B", due: "22 Aug 2026", submissions: 54, pending: 10, status: "Active" },
  { title: "Data Structures Lab 04", subject: "Data Structures", course: "B.Sc Computer Science", faculty: "Dr. Anil Kumar", batch: "BSC-CS-2026-A", due: "24 Aug 2026", submissions: 61, pending: 21, status: "Active" },
  { title: "Balance Sheet Analysis", subject: "Financial Accounting", course: "B.Com", faculty: "Prof. Meera Rao", batch: "BCOM-2026-A", due: "28 Aug 2026", submissions: 32, pending: 44, status: "Upcoming" },
];

export const exams = [
  { name: "Mid-Semester Examination", course: "B.Sc Computer Science", subject: "Data Structures", batch: "BSC-CS-2026-A", faculty: "Dr. Anil Kumar", date: "02 Sep 2026", duration: "90 min", marks: 50, status: "Scheduled" },
  { name: "Unit Test 02", course: "PUC Science", subject: "Classical Mechanics", batch: "PUC-SCI-2026-B", faculty: "Dr. Kavya Rao", date: "24 Aug 2026", duration: "60 min", marks: 50, status: "Upcoming" },
  { name: "Accounting Quiz 01", course: "B.Com", subject: "Financial Accounting", batch: "BCOM-2026-A", faculty: "Prof. Meera Rao", date: "17 Aug 2026", duration: "30 min", marks: 20, status: "Completed" },
];

export const contentItems = [
  { title: "Introduction to Binary Trees", type: "Video", course: "B.Sc Computer Science", subject: "Data Structures", faculty: "Dr. Anil Kumar", created: "19 Aug 2026", status: "Published" },
  { title: "Newton’s Laws – Lecture Notes", type: "Document", course: "PUC Science", subject: "Classical Mechanics", faculty: "Dr. Kavya Rao", created: "18 Aug 2026", status: "Review" },
  { title: "Ledger Posting Practice", type: "Quiz", course: "B.Com", subject: "Financial Accounting", faculty: "Prof. Meera Rao", created: "17 Aug 2026", status: "Published" },
];

export const approvals = [
  { id: "REQ-2081", from: "Dr. Kavya Rao", type: "Syllabus change", description: "Move Rotational Dynamics to Unit 4", date: "20 Aug 2026", status: "Pending" },
  { id: "REQ-2074", from: "Prof. Meera Rao", type: "Batch transfer", description: "Transfer 3 students to BCOM-2026-B", date: "19 Aug 2026", status: "Pending" },
  { id: "REQ-2069", from: "Rahul Sharma", type: "Enrollment", description: "Change elective to Applied Statistics", date: "18 Aug 2026", status: "Approved" },
];

export const auditLogs = [
  { user: "Ananya Desai", role: "Administrator", action: "Added student", module: "Students", description: "Created STU-2026-052", date: "20 Aug 2026", time: "14:32" },
  { user: "Vikram Jain", role: "Academic Admin", action: "Updated faculty", module: "Faculty", description: "Changed teaching assignment", date: "20 Aug 2026", time: "13:18" },
  { user: "Ananya Desai", role: "Administrator", action: "Created course", module: "Courses", description: "Created PUC Commerce", date: "20 Aug 2026", time: "11:05" },
  { user: "Dr. Kavya Rao", role: "Faculty", action: "Published announcement", module: "Communication", description: "Unit Test 02 reminder", date: "20 Aug 2026", time: "09:45" },
];
