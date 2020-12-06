use model2;
db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: "$neighbourhood", avgPrice: { $avg: "$price" }}}, { $sort: { avgPrice: -1 }}]); 
