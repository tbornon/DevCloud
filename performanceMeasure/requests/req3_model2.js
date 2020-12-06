use model2;
db.listings_detailed.find({"neighbourhood_group": "Barajas"}).sort({"availability365": -1}).limit(10).explain("executionStats");
