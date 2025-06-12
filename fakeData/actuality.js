const fakeActuality = [
    {
        id: "2",
        isEvent: true,
        title: "Journée de l'Innovation et de la Créativité",
        tags: [
            { id: 1, name: "#Blockchain", color: "#91990b", backgroundColor: "#FDFFD3" },
            { id: 2, name: "#Crypto", color: "#3D00E4", backgroundColor: "#E4E1FF" }
        ],
        
        description: "L’intelligence artificielle (IA) est en train de transformer le monde du travail d’une manière qui aurait été impensable il y a seulement quelques décennies. Son impact touche de nombreux domaines, allant de  \n l’industrie manufacturière aux services, en passant par la finance, l’éducation et même la santé. Grâce aux avancées technologiques en apprentissage automatique et en analyse des données, l’IA permet aujourd’hui d’automatiser de nombreuses tâches répétitives et d’optimiser les processus de production. Les entreprises investissent massivement dans ces solutions, cherchant à améliorer leur efficacité, à réduire leurs coûts et à gagner en compétitivité sur le marché mondial. \n L’adoption rapide de l’IA dans différents secteurs entraîne des changements significatifs dans la manière dont les tâches sont effectuées. Par exemple, dans l’industrie manufacturière, les robots assistés par IA remplacent de plus en plus les ouvriers sur les chaînes de montage. \n Ces machines sont capables de travailler 24 heures sur 24 sans pause et avec une précision inégalée. Dans le domaine du service client, les chatbots et les assistants virtuels, basés sur des modèles d’intelligence artificielle, répondent aux questions des clients et traitent leurs demandes sans intervention humaine. \n En finance, l’IA est utilisée pour analyser les tendances du marché et effectuer des transactions à haute fréquence bien plus rapidement qu’un être humain ne pourrait le faire. Dans le secteur de la santé, elle aide les médecins à poser des diagnostic.",
        commentsData : [
            {
                id: 1,
                user: {   
                    name: "John Doe",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgvtbGZaid9GYER_WaEI5pitR4W32IRwWsQ&s",
                },
                description: "This is a great post! I really enjoyed how you explained the impact of AI on the future of work.",
                time: "12/02/2025",
                numberOfSubComments: 2,
                subComments: [
                    {
                        id: 101,
                        user: {
                            name: "Alice Smith",
                            photo: "https://i.ytimg.com/vi/kz506sFHeJY/maxresdefault.jpg",
                        },
                        description: "I totally agree! The advancements in AI are truly revolutionary. I work in the healthcare sector, and I've already seen how AI.",
                        time: "12/02/2025",
                    },
                    {
                        id: 102,
                        user: {
                            name: "Bob Johnson",
                            photo: "https://upload.wikimedia.org/wikipedia/en/6/63/Bob_Johnson.jpg",
                        },
                        description: "Nice perspective! I think AI will also create new job opportunities in the long run.",
                        time: "12/02/2025",
                    },
                    {
                        id: 103,
                        user: {
                            name: "Jasmine Moro",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzT_hLS440szVrymfRm4HD-c9QF1RBXBg9w&s",
                        },
                        description: "Cannot agree more...",
                        time: "12/02/2025",
                    },
                ],
            },
            {
                id: 3,
                user: {
                    name: "Jhon Jonas",
                    photo: "https://static.wixstatic.com/media/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg/v1/fill/w_494,h_552,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg",
                },
                description: "Interesting point of view ! ",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [],
            },
            {
                id: 2,
                user: {
                    name: "Emma Brown",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnR-Ozq1AQmfUyxenGRv8yoYrBuh9ijxPRiw&s",
                },
                description: "Interesting point of view! I particularly liked your analysis of how AI is being used in the finance sector. High-frequency trading and market analysis are great examples of AI's capabilities.",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [
                    {
                        id: 103,
                        user: {
                            name: "Charlie Davis",
                            photo: "https://images.squarespace-cdn.com/content/v1/5540e682e4b0c2b9f03f1623/1450201710264-SVO35OIZIRUUVKIVWGA1/M00002786-0109.jpg",
                        },
                        description: "Thanks for sharing! I completely agree with your concerns about over-reliance on AI in finance. In my experience, AI is a powerful tool, but it should complement human decision-making, not replace it entirely.",
                        time: "12/02/2025",
                    },
                ],
            },
            
            
        ],
        isLiked: false,
        likes: 180,
        comments: 22,
        date: "Nov 5, 2025",
        image: "https://www.eventbookings.com/wp-content/uploads/2018/03/event-ideas-for-party-eventbookings.jpg"
    },

    {
        id: "1",
        isEvent: false,
        title: "L'IA et l'avenir du travail",
        tags: [
            { id: 1, name: "#conference", color: "#0A7965", backgroundColor: "#D3FFF7" },
            { id: 2, name: "#FuturDuTravail", color: "#E48100", backgroundColor: "#FFEBCC" }
        ],
        
        description: "L’intelligence artificielle (IA) est en train de transformer le monde du travail d’une manière qui aurait été impensable il y a seulement quelques décennies. Son impact touche de nombreux domaines, allant de  \n l’industrie manufacturière aux services, en passant par la finance, l’éducation et même la santé. Grâce aux avancées technologiques en apprentissage automatique et en analyse des données, l’IA permet aujourd’hui d’automatiser de nombreuses tâches répétitives et d’optimiser les processus de production. Les entreprises investissent massivement dans ces solutions, cherchant à améliorer leur efficacité, à réduire leurs coûts et à gagner en compétitivité sur le marché mondial. \n L’adoption rapide de l’IA dans différents secteurs entraîne des changements significatifs dans la manière dont les tâches sont effectuées. Par exemple, dans l’industrie manufacturière, les robots assistés par IA remplacent de plus en plus les ouvriers sur les chaînes de montage. \n Ces machines sont capables de travailler 24 heures sur 24 sans pause et avec une précision inégalée. Dans le domaine du service client, les chatbots et les assistants virtuels, basés sur des modèles d’intelligence artificielle, répondent aux questions des clients et traitent leurs demandes sans intervention humaine. \n En finance, l’IA est utilisée pour analyser les tendances du marché et effectuer des transactions à haute fréquence bien plus rapidement qu’un être humain ne pourrait le faire. Dans le secteur de la santé, elle aide les médecins à poser des diagnostic.",
        commentsData : [
            {
                id: 1,
                user: {
                    name: "John Doe",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgvtbGZaid9GYER_WaEI5pitR4W32IRwWsQ&s",
                },
                description: "This is a great post! I really enjoyed how you explained the impact of AI on the future of work.",
                time: "12/02/2025",
                numberOfSubComments: 2,
                subComments: [
                    {
                        id: 101,
                        user: {
                            name: "Alice Smith",
                            photo: "https://i.ytimg.com/vi/kz506sFHeJY/maxresdefault.jpg",
                        },
                        description: "I totally agree! The advancements in AI are truly revolutionary. I work in the healthcare sector, and I've already seen how AI.",
                        time: "12/02/2025",
                    },
                    {
                        id: 102,
                        user: {
                            name: "Bob Johnson",
                            photo: "https://upload.wikimedia.org/wikipedia/en/6/63/Bob_Johnson.jpg",
                        },
                        description: "Nice perspective! I think AI will also create new job opportunities in the long run.",
                        time: "12/02/2025",
                    },
                    {
                        id: 103,
                        user: {
                            name: "Jasmine Moro",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzT_hLS440szVrymfRm4HD-c9QF1RBXBg9w&s",
                        },
                        description: "Cannot agree more...",
                        time: "12/02/2025",
                    },
                ],
            },
            {
                id: 3,
                user: {
                    name: "Jhon Jonas",
                    photo: "https://static.wixstatic.com/media/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg/v1/fill/w_494,h_552,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg",
                },
                description: "Interesting point of view ! ",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [],
            },
            {
                id: 2,
                user: {
                    name: "Emma Brown",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnR-Ozq1AQmfUyxenGRv8yoYrBuh9ijxPRiw&s",
                },
                description: "Interesting point of view! I particularly liked your analysis of how AI is being used in the finance sector. High-frequency trading and market analysis are great examples of AI's capabilities.",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [
                    {
                        id: 103,
                        user: {
                            name: "Charlie Davis",
                            photo: "https://images.squarespace-cdn.com/content/v1/5540e682e4b0c2b9f03f1623/1450201710264-SVO35OIZIRUUVKIVWGA1/M00002786-0109.jpg",
                        },
                        description: "Thanks for sharing! I completely agree with your concerns about over-reliance on AI in finance. In my experience, AI is a powerful tool, but it should complement human decision-making, not replace it entirely.",
                        time: "12/02/2025",
                    },
                ],
            },
            
            
        ],
        isLiked: true,
        likes: 254,
        comments: 14,
        date: "Oct 19, 2025",
        image: "https://vflatworld.com/cdn/shop/articles/tuvyl_the_power_of_ai_fb7556ff-5fb9-4b1c-a1cd-ade15fc4f06b.jpg?v=1727430697&width=2048"
    },

    
    {
        id: "3",
        isEvent: false,
        title: "Le futur de l'éducation en ligne",
        tags: [
            { id: 2, name: "#Learning", color: "#9000E4", backgroundColor: "#FAE5FF" },
            { id: 1, name: "#EdTech", color: "#1CA518", backgroundColor: "#D5FFCC" }
        ],
        
        description: "L’intelligence artificielle (IA) est en train de transformer le monde du travail d’une manière qui aurait été impensable il y a seulement quelques décennies. Son impact touche de nombreux domaines, allant de  \n l’industrie manufacturière aux services, en passant par la finance, l’éducation et même la santé. Grâce aux avancées technologiques en apprentissage automatique et en analyse des données, l’IA permet aujourd’hui d’automatiser de nombreuses tâches répétitives et d’optimiser les processus de production. Les entreprises investissent massivement dans ces solutions, cherchant à améliorer leur efficacité, à réduire leurs coûts et à gagner en compétitivité sur le marché mondial. \n L’adoption rapide de l’IA dans différents secteurs entraîne des changements significatifs dans la manière dont les tâches sont effectuées. Par exemple, dans l’industrie manufacturière, les robots assistés par IA remplacent de plus en plus les ouvriers sur les chaînes de montage. \n Ces machines sont capables de travailler 24 heures sur 24 sans pause et avec une précision inégalée. Dans le domaine du service client, les chatbots et les assistants virtuels, basés sur des modèles d’intelligence artificielle, répondent aux questions des clients et traitent leurs demandes sans intervention humaine. \n En finance, l’IA est utilisée pour analyser les tendances du marché et effectuer des transactions à haute fréquence bien plus rapidement qu’un être humain ne pourrait le faire. Dans le secteur de la santé, elle aide les médecins à poser des diagnostic.",
        commentsData : [
            {
                id: 1,
                user: {
                    name: "John Doe",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgvtbGZaid9GYER_WaEI5pitR4W32IRwWsQ&s",
                },
                description: "This is a great post! I really enjoyed how you explained the impact of AI on the future of work.",
                time: "12/02/2025",
                numberOfSubComments: 2,
                subComments: [
                    {
                        id: 101,
                        user: {
                            name: "Alice Smith",
                            photo: "https://i.ytimg.com/vi/kz506sFHeJY/maxresdefault.jpg",
                        },
                        description: "I totally agree! The advancements in AI are truly revolutionary. I work in the healthcare sector, and I've already seen how AI.",
                        time: "12/02/2025",
                    },
                    {
                        id: 102,
                        user: {
                            name: "Bob Johnson",
                            photo: "https://upload.wikimedia.org/wikipedia/en/6/63/Bob_Johnson.jpg",
                        },
                        description: "Nice perspective! I think AI will also create new job opportunities in the long run.",
                        time: "12/02/2025",
                    },
                    {
                        id: 103,
                        user: {
                            name: "Jasmine Moro",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzT_hLS440szVrymfRm4HD-c9QF1RBXBg9w&s",
                        },
                        description: "Cannot agree more...",
                        time: "12/02/2025",
                    },
                ],
            },
            {
                id: 3,
                user: {
                    name: "Jhon Jonas",
                    photo: "https://static.wixstatic.com/media/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg/v1/fill/w_494,h_552,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg",
                },
                description: "Interesting point of view ! ",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [],
            },
            {
                id: 2,
                user: {
                    name: "Emma Brown",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnR-Ozq1AQmfUyxenGRv8yoYrBuh9ijxPRiw&s",
                },
                description: "Interesting point of view! I particularly liked your analysis of how AI is being used in the finance sector. High-frequency trading and market analysis are great examples of AI's capabilities.",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [
                    {
                        id: 103,
                        user: {
                            name: "Charlie Davis",
                            photo: "https://images.squarespace-cdn.com/content/v1/5540e682e4b0c2b9f03f1623/1450201710264-SVO35OIZIRUUVKIVWGA1/M00002786-0109.jpg",
                        },
                        description: "Thanks for sharing! I completely agree with your concerns about over-reliance on AI in finance. In my experience, AI is a powerful tool, but it should complement human decision-making, not replace it entirely.",
                        time: "12/02/2025",
                    },
                ],
            },
            
            
        ],
        isLiked: false,
        likes: 320,
        comments: 30,
        date: "Sep 12, 2025",
        image: "https://images.contentstack.io/v3/assets/blta486bbd056d89abd/blt1f697f399e329210/5fc4cfb3dcd1aa143e1eda13/Berlitz_Website_CyberTeachers_Home.png?auto=webp&format=pjpg&quality=80&width=900&height=500&fit=crop"
    },
    {
        id: "4",
        isEvent: false,
        title: "Les véhicules autonomes : entre mythe et réalité",
        tags: [
            { id: 1, name: "#Transport", color: "#007BFF", backgroundColor: "#CCE5FF" },
            { id: 2, name: "#Autonomie", color: "#E4007F", backgroundColor: "#FFCCE5" }
        ],
        
        description: "L’intelligence artificielle (IA) est en train de transformer le monde du travail d’une manière qui aurait été impensable il y a seulement quelques décennies. Son impact touche de nombreux domaines, allant de  \n l’industrie manufacturière aux services, en passant par la finance, l’éducation et même la santé. Grâce aux avancées technologiques en apprentissage automatique et en analyse des données, l’IA permet aujourd’hui d’automatiser de nombreuses tâches répétitives et d’optimiser les processus de production. Les entreprises investissent massivement dans ces solutions, cherchant à améliorer leur efficacité, à réduire leurs coûts et à gagner en compétitivité sur le marché mondial. \n L’adoption rapide de l’IA dans différents secteurs entraîne des changements significatifs dans la manière dont les tâches sont effectuées. Par exemple, dans l’industrie manufacturière, les robots assistés par IA remplacent de plus en plus les ouvriers sur les chaînes de montage. \n Ces machines sont capables de travailler 24 heures sur 24 sans pause et avec une précision inégalée. Dans le domaine du service client, les chatbots et les assistants virtuels, basés sur des modèles d’intelligence artificielle, répondent aux questions des clients et traitent leurs demandes sans intervention humaine. \n En finance, l’IA est utilisée pour analyser les tendances du marché et effectuer des transactions à haute fréquence bien plus rapidement qu’un être humain ne pourrait le faire. Dans le secteur de la santé, elle aide les médecins à poser des diagnostic.",
        commentsData : [
            {
                id: 1,
                user: {
                    name: "John Doe",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgvtbGZaid9GYER_WaEI5pitR4W32IRwWsQ&s",
                },
                description: "This is a great post! I really enjoyed how you explained the impact of AI on the future of work.",
                time: "12/02/2025",
                numberOfSubComments: 2,
                subComments: [
                    {
                        id: 101,
                        user: {
                            name: "Alice Smith",
                            photo: "https://i.ytimg.com/vi/kz506sFHeJY/maxresdefault.jpg",
                        },
                        description: "I totally agree! The advancements in AI are truly revolutionary. I work in the healthcare sector, and I've already seen how AI.",
                        time: "12/02/2025",
                    },
                    {
                        id: 102,
                        user: {
                            name: "Bob Johnson",
                            photo: "https://upload.wikimedia.org/wikipedia/en/6/63/Bob_Johnson.jpg",
                        },
                        description: "Nice perspective! I think AI will also create new job opportunities in the long run.",
                        time: "12/02/2025",
                    },
                    {
                        id: 103,
                        user: {
                            name: "Jasmine Moro",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzT_hLS440szVrymfRm4HD-c9QF1RBXBg9w&s",
                        },
                        description: "Cannot agree more...",
                        time: "12/02/2025",
                    },
                ],
            },
            {
                id: 3,
                user: {
                    name: "Jhon Jonas",
                    photo: "https://static.wixstatic.com/media/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg/v1/fill/w_494,h_552,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg",
                },
                description: "Interesting point of view ! ",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [],
            },
            {
                id: 2,
                user: {
                    name: "Emma Brown",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnR-Ozq1AQmfUyxenGRv8yoYrBuh9ijxPRiw&s",
                },
                description: "Interesting point of view! I particularly liked your analysis of how AI is being used in the finance sector. High-frequency trading and market analysis are great examples of AI's capabilities.",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [
                    {
                        id: 103,
                        user: {
                            name: "Charlie Davis",
                            photo: "https://images.squarespace-cdn.com/content/v1/5540e682e4b0c2b9f03f1623/1450201710264-SVO35OIZIRUUVKIVWGA1/M00002786-0109.jpg",
                        },
                        description: "Thanks for sharing! I completely agree with your concerns about over-reliance on AI in finance. In my experience, AI is a powerful tool, but it should complement human decision-making, not replace it entirely.",
                        time: "12/02/2025",
                    },
                ],
            },
            
            
        ],
        isLiked: true,
        likes: 210,
        comments: 18,
        date: "Dec 1, 2025",
        image: "https://cdn.group.renault.com/ren/master/renault-new-cars/product-plans/arkana/arkana-ljl-ph2/modals/price-offers/arkana-ljl-ph2-price-offers-03.jpg.ximg.xsmall.jpg/0ae9e48b94.jpg"
    },
    {
        id: "5",
        isEvent: false,
        title: "La cybersécurité à l’ère du numérique",
        tags: [
            { id: 1, name: "#CyberSecurity", color: "#FF5733", backgroundColor: "#FFE5CC" },
            { id: 2, name: "#Privacy", color: "#00A8E4", backgroundColor: "#CCF2FF" }
        ],
        
        description: "L’intelligence artificielle (IA) est en train de transformer le monde du travail d’une manière qui aurait été impensable il y a seulement quelques décennies. Son impact touche de nombreux domaines, allant de  \n l’industrie manufacturière aux services, en passant par la finance, l’éducation et même la santé. Grâce aux avancées technologiques en apprentissage automatique et en analyse des données, l’IA permet aujourd’hui d’automatiser de nombreuses tâches répétitives et d’optimiser les processus de production. Les entreprises investissent massivement dans ces solutions, cherchant à améliorer leur efficacité, à réduire leurs coûts et à gagner en compétitivité sur le marché mondial. \n L’adoption rapide de l’IA dans différents secteurs entraîne des changements significatifs dans la manière dont les tâches sont effectuées. Par exemple, dans l’industrie manufacturière, les robots assistés par IA remplacent de plus en plus les ouvriers sur les chaînes de montage. \n Ces machines sont capables de travailler 24 heures sur 24 sans pause et avec une précision inégalée. Dans le domaine du service client, les chatbots et les assistants virtuels, basés sur des modèles d’intelligence artificielle, répondent aux questions des clients et traitent leurs demandes sans intervention humaine. \n En finance, l’IA est utilisée pour analyser les tendances du marché et effectuer des transactions à haute fréquence bien plus rapidement qu’un être humain ne pourrait le faire. Dans le secteur de la santé, elle aide les médecins à poser des diagnostic.",
        commentsData : [
            {
                id: 1,
                user: {
                    name: "John Doe",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgvtbGZaid9GYER_WaEI5pitR4W32IRwWsQ&s",
                },
                description: "This is a great post! I really enjoyed how you explained the impact of AI on the future of work.",
                time: "12/02/2025",
                numberOfSubComments: 2,
                subComments: [
                    {
                        id: 101,
                        user: {
                            name: "Alice Smith",
                            photo: "https://i.ytimg.com/vi/kz506sFHeJY/maxresdefault.jpg",
                        },
                        description: "I totally agree! The advancements in AI are truly revolutionary. I work in the healthcare sector, and I've already seen how AI.",
                        time: "12/02/2025",
                    },
                    {
                        id: 102,
                        user: {
                            name: "Bob Johnson",
                            photo: "https://upload.wikimedia.org/wikipedia/en/6/63/Bob_Johnson.jpg",
                        },
                        description: "Nice perspective! I think AI will also create new job opportunities in the long run.",
                        time: "12/02/2025",
                    },
                    {
                        id: 103,
                        user: {
                            name: "Jasmine Moro",
                            photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFzT_hLS440szVrymfRm4HD-c9QF1RBXBg9w&s",
                        },
                        description: "Cannot agree more...",
                        time: "12/02/2025",
                    },
                ],
            },
            {
                id: 3,
                user: {
                    name: "Jhon Jonas",
                    photo: "https://static.wixstatic.com/media/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg/v1/fill/w_494,h_552,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a5434_b287879d6c0a45bb9a21c862ab9bc30f~mv2.jpg",
                },
                description: "Interesting point of view ! ",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [],
            },
            {
                id: 2,
                user: {
                    name: "Emma Brown",
                    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnR-Ozq1AQmfUyxenGRv8yoYrBuh9ijxPRiw&s",
                },
                description: "Interesting point of view! I particularly liked your analysis of how AI is being used in the finance sector. High-frequency trading and market analysis are great examples of AI's capabilities.",
                time: "12/02/2025",
                numberOfSubComments: 1,
                subComments: [
                    {
                        id: 103,
                        user: {
                            name: "Charlie Davis",
                            photo: "https://images.squarespace-cdn.com/content/v1/5540e682e4b0c2b9f03f1623/1450201710264-SVO35OIZIRUUVKIVWGA1/M00002786-0109.jpg",
                        },
                        description: "Thanks for sharing! I completely agree with your concerns about over-reliance on AI in finance. In my experience, AI is a powerful tool, but it should complement human decision-making, not replace it entirely.",
                        time: "12/02/2025",
                    },
                ],
            },
            
            
        ],
        isLiked: false,
        likes: 275,
        comments: 24,
        date: "Jan 15, 2026",
        image: "https://eu-images.contentstack.com/v3/assets/blt69509c9116440be8/blt8ffb90a2f64bacfa/6776f4544b281ca5e2bc465a/cybersecurity_NicoElNino-AlamyStockPhoto.jpg"
    }
];

export default fakeActuality;