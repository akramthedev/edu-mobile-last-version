

const fakeStudents = [
  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", Matricule: "CS101-001", Nom: "Doe", Prenom: "John", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "john.doe@example.com" },

    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-001111",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-002222",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-003333",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-004324",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-005345",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-00634Z5",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-00457",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },
    { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", 
      Matricule: "CS101-003458",
      Nom: "Doe", Prenom: "John", 
      NombreAbsence : 0, 
      Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      Email: "john.doe@example.com" 
    },




  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", Matricule: "CS101-002234", Nom: "Smith", Prenom: "Alice", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "alice.smith@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Computer Science", Classe: "CS101", Matricule: "CS101-003245", Nom: "Johnson", Prenom: "Mike", 
    NombreAbsence : 3, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "mike.johnson@example.com" },
   
  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Mechanical Engineering", Classe: "ME101", Matricule: "ME101-001", Nom: "Green", Prenom: "Ava", 
    NombreAbsence : 6, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "ava.green@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Mechanical Engineering", Classe: "ME101", Matricule: "ME101-002", Nom: "Baker", Prenom: "Mason", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "mason.baker@example.com" },

  { AnneUniversitaire : "2025-2026" ,Annee: "3ème", Filiere: "Electrical Engineering", Classe: "EE301", Matricule: "EE301-001", Nom: "Nelson", Prenom: "Scarlett", 
    NombreAbsence : 1, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "scarlett.nelson@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "3ème", Filiere: "Electrical Engineering", Classe: "EE301", Matricule: "EE301-002", Nom: "Carter", Prenom: "Jacob", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "jacob.carter@example.com" },

  { AnneUniversitaire : "2025-2026" ,Annee: "2ème", Filiere: "Business", Classe: "BU301", Matricule: "BU301-001", Nom: "Mitchell", Prenom: "Emily", 
    NombreAbsence : 1, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "emily.mitchell@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "2ème", Filiere: "Business", Classe: "BU301", Matricule: "BU301-002", Nom: "Perez", Prenom: "Lucas", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "lucas.perez@example.com" },

  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Business", Classe: "BU101", Matricule: "BU101-001", Nom: "Roberts", Prenom: "Nora", 
    NombreAbsence : 2, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "nora.roberts@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "1ère", Filiere: "Business", Classe: "BU101", Matricule: "BU101-002", Nom: "Campbell", Prenom: "Leo", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "leo.campbell@example.com" },

  { AnneUniversitaire : "2025-2026" ,Annee: "3ème", Filiere: "Mechanical Engineering", Classe: "ME401", Matricule: "ME401-001", Nom: "Reed", Prenom: "Isla", 
    NombreAbsence : 3, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "isla.reed@example.com" },
  { AnneUniversitaire : "2025-2026" ,Annee: "3ème", Filiere: "Mechanical Engineering", Classe: "ME401", Matricule: "ME401-002", Nom: "Morgan", Prenom: "Henry", 
    NombreAbsence : 0, 
    Image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email : "henry@example.com" }
  ]


export default fakeStudents;