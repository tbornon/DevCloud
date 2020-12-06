use model1;
db.listings_detailed.explain("executionStats").aggregate([{ $unwind: "$amenities" }, { $group: { _id: "$amenities", total: { $sum: 1 } } }, { $sort: { total: -1 } }]);
