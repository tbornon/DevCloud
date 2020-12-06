use model1;
db.listings_detailed.aggregate([ { $group: { _id: "$neighbourhood", avgScore: { $avg: "$review_scores_location" } } }, { $sort: { avgScore: -1 } } ]).explain("executionStats");
