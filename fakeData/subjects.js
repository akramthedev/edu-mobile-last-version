const subjects = [
  {
    id: "SUBJ101X",
    name: "Introduction to Computer Science",
    code: "CS101",
    credits: 6,
    semester: 1,
    year: 1,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF001",
      name: "Dr. Alice Bennani",
      email: "alice.bennani@university.edu"
    },
    schedule: {
      day: "Monday",
      time: "09:00 - 11:00",
      location: "Room B102"
    },
    type: "Core",
    description: "Basics of programming, algorithms, and problem solving using Python.",
    prerequisites: [],
    assessment: {
      exam: 60,
      coursework: 40
    },
    language: "English",
    maxStudents: 80,
    currentEnrollment: 72,
    status: "Open"
  },
  {
    id: "SUBJ20222f",
    name: "Linear Algebra",
    code: "MAT201",
    credits: 5,
    semester: 2,
    year: 1,
    department: "Mathematics",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF002",
      name: "Prof. Karim El Malki",
      email: "karim.elmalki@university.edu"
    },
    schedule: {
      day: "Wednesday",
      time: "13:00 - 15:00",
      location: "Room C204"
    },
    type: "Core",
    description: "Vectors, matrices, linear systems, eigenvalues and their applications.",
    prerequisites: ["MAT101"],
    assessment: {
      exam: 70,
      coursework: 30
    },
    language: "French",
    maxStudents: 60,
    currentEnrollment: 58,
    status: "Open"
  },
  {
    id: "SUBJ30322z",
    name: "Mobile App Development",
    code: "CS303",
    credits: 4,
    semester: 1,
    year: 3,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF003",
      name: "Dr. Nabila Zahra",
      email: "nabila.zahra@university.edu"
    },
    schedule: {
      day: "Friday",
      time: "10:00 - 12:00",
      location: "Room A109"
    },
    type: "Elective",
    description: "Building native and cross-platform apps using Flutter and React Native.",
    prerequisites: ["CS201", "CS204"],
    assessment: {
      project: 60,
      presentation: 20,
      report: 20
    },
    language: "English",
    maxStudents: 40,
    currentEnrollment: 40,
    status: "Full"
  },

  {
    id: "SUBJ10122h",
    name: "Introduction to Computer Science",
    code: "CS101",
    credits: 6,
    semester: 1,
    year: 1,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF001",
      name: "Dr. Alice Bennani",
      email: "alice.bennani@university.edu"
    },
    schedule: {
      day: "Monday",
      time: "09:00 - 11:00",
      location: "Room B102"
    },
    type: "Core",
    description: "Basics of programming, algorithms, and problem solving using Python.",
    prerequisites: [],
    assessment: {
      exam: 60,
      coursework: 40
    },
    language: "English",
    maxStudents: 80,
    currentEnrollment: 72,
    status: "Open"
  },
  {
    id: "22222tt",
    name: "Linear Algebra",
    code: "MAT201",
    credits: 5,
    semester: 2,
    year: 1,
    department: "Mathematics",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF002",
      name: "Prof. Karim El Malki",
      email: "karim.elmalki@university.edu"
    },
    schedule: {
      day: "Wednesday",
      time: "13:00 - 15:00",
      location: "Room C204"
    },
    type: "Core",
    description: "Vectors, matrices, linear systems, eigenvalues and their applications.",
    prerequisites: ["MAT101"],
    assessment: {
      exam: 70,
      coursework: 30
    },
    language: "French",
    maxStudents: 60,
    currentEnrollment: 58,
    status: "Open"
  },
  {
    id: "SUBJ30322eee",
    name: "Mobile App Development",
    code: "CS303",
    credits: 4,
    semester: 1,
    year: 3,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF003",
      name: "Dr. Nabila Zahra",
      email: "nabila.zahra@university.edu"
    },
    schedule: {
      day: "Friday",
      time: "10:00 - 12:00",
      location: "Room A109"
    },
    type: "Elective",
    description: "Building native and cross-platform apps using Flutter and React Native.",
    prerequisites: ["CS201", "CS204"],
    assessment: {
      project: 60,
      presentation: 20,
      report: 20
    },
    language: "English",
    maxStudents: 40,
    currentEnrollment: 40,
    status: "Full"
  },



  {
    id: "SUBJ10101tz",
    name: "Introduction to Computer Science",
    code: "CS101",
    credits: 6,
    semester: 1,
    year: 1,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF001",
      name: "Dr. Alice Bennani",
      email: "alice.bennani@university.edu"
    },
    schedule: {
      day: "Monday",
      time: "09:00 - 11:00",
      location: "Room B102"
    },
    type: "Core",
    description: "Basics of programming, algorithms, and problem solving using Python.",
    prerequisites: [],
    assessment: {
      exam: 60,
      coursework: 40
    },
    language: "English",
    maxStudents: 80,
    currentEnrollment: 72,
    status: "Open"
  },
  {
    id: "2209ersgf",
    name: "Linear Algebra",
    code: "MAT201",
    credits: 5,
    semester: 2,
    year: 1,
    department: "Mathematics",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF002",
      name: "Prof. Karim El Malki",
      email: "karim.elmalki@university.edu"
    },
    schedule: {
      day: "Wednesday",
      time: "13:00 - 15:00",
      location: "Room C204"
    },
    type: "Core",
    description: "Vectors, matrices, linear systems, eigenvalues and their applications.",
    prerequisites: ["MAT101"],
    assessment: {
      exam: 70,
      coursework: 30
    },
    language: "French",
    maxStudents: 60,
    currentEnrollment: 58,
    status: "Open"
  },
  {
    id: "SUBJ30322srdf",
    name: "Mobile App Development",
    code: "CS303",
    credits: 4,
    semester: 1,
    year: 3,
    department: "Computer Science",
    faculty: "Faculty of Science",
    professor: {
      id: "PROF003",
      name: "Dr. Nabila Zahra",
      email: "nabila.zahra@university.edu"
    },
    schedule: {
      day: "Friday",
      time: "10:00 - 12:00",
      location: "Room A109"
    },
    type: "Elective",
    description: "Building native and cross-platform apps using Flutter and React Native.",
    prerequisites: ["CS201", "CS204"],
    assessment: {
      project: 60,
      presentation: 20,
      report: 20
    },
    language: "English",
    maxStudents: 40,
    currentEnrollment: 40,
    status: "Full"
  },


];



export default subjects;