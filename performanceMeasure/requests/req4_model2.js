use model2;
db.listings_detailed.explain("executionStats").aggregate([ { $group: { _id: "$neighbourhood", avgScore: { $avg: "$review_scores_location" } } }, { $sort: { avgScore: -1 } } ]);