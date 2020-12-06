# Requête 1. Liste des 100 logements les mieux notés, triés par note (review_score)  
Modèle 1 : db.listings_detailed.find().sort({"review_scores_rating":1}).limit(100).explain("executionStats");
Modèle 2 : db.listings_detailed.find().sort({"review_scores_rating":1}).limit(100).explain("executionStats");

# Requête 2. Top 3 des logements les mieux notés pour les propriétés de type « House »  
Modèle 1 : db.listings_detailed.find({"property_type": "House"}).sort({"review_scores_rating":-1}).limit(3).explain("executionStats");
Modèle 2 : db.listings_detailed.find({"property_type": "House"}).sort({"review_scores_rating":-1}).limit(3).explain("executionStats");

# Requête 3. Liste des 10 logements les plus réservés dans le quartier de Barajas 
Modèle 1 : db.listings_detailed.find({"neighbourhood_group": "Barajas"}).sort({"availability365": -1}).limit(10).explain("executionStats");
Modèle 2 : db.listings_detailed.find({"neighbourhood_group": "Barajas"}).sort({"availability365": -1}).limit(10).explain("executionStats");

# Requête 4. Note moyenne des quartiers calculées grâce aux commentaires des utlisateurs 
Modèle 1 : db.listings_detailed.aggregate([ { $group: { _id: "$neighbourhood", avgScore: { $avg: "$review_scores_location" } } }, { $sort: { avgScore: -1 } } ]).explain("executionStats");
Modèle 2 : db.listings_detailed.aggregate([ { $group: { _id: "$neighbourhood", avgScore: { $avg: "$review_scores_location" } } }, { $sort: { avgScore: -1 } } ]).explain("executionStats");

# Requête 5. Distribution du prix des locations en fonction des quartiers
Modèle 1 : db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: "$neighbourhood", avgPrice: { $avg: "$price" }}}, { $sort: { avgPrice: -1 }}]);  
Modèle 2 : db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: "$neighbourhood", avgPrice: { $avg: "$price" }}}, { $sort: { avgPrice: -1 }}]);  

# Requête 6. Nombre de locations occupées chaque jour de l’année
Modèle 1 : db.calendar.aggregate([{ $match: { available: true } }, { $group: { _id: "$date", count: { $sum: 1 } } }, { $set: { day: { $dayOfYear: { $toDate: "$date" } } } }, { $sort: { day: 1 } }, { $project: { day: 0 } }]); 
Modèle 2 : 

# Requête 7. Répartition du nombre de couchages en fonction du type de logement
Modèle 1 : db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: { "property_type": "$property_type", "beds": "$beds" }, total: { $sum: 1 } } }, { $group: { _id: "$_id.property_type", beds: { $push: { nbBeds: "$_id.beds", total: "$total" } } } }]); 
Modèle 2 : db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: { "property_type": "$property_type", "beds": "$beds" }, total: { $sum: 1 } } }, { $group: { _id: "$_id.property_type", beds: { $push: { nbBeds: "$_id.beds", total: "$total" } } } }]); 

# Requête 8. Quantité de chaque aménagement dans chaque location 
Modèle 1 : db.listings_detailed.explain("executionStats").aggregate([{ $unwind: "$amenities" }, { $group: { _id: "$amenities", total: { $sum: 1 } } }, { $sort: { total: -1 } }]);
Modèle 2 : db.listings_detailed.explain("executionStats").aggregate([{ $unwind: "$amenities" }, { $group: { _id: "$amenities", total: { $sum: 1 } } }, { $sort: { total: -1 } }]);
