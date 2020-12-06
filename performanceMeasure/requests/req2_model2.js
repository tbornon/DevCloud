use model2;
db.listings_detailed.find({"property_type": "House"}).sort({"review_scores_rating":-1}).limit(3).explain("executionStats");
