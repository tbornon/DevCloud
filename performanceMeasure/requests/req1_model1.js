use model1;
db.listings_detailed.find().sort({"review_scores_rating":1}).limit(100).explain("executionStats");
