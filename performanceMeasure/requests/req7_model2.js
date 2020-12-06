use model2;
db.listings_detailed.explain("executionStats").aggregate([{ $group: { _id: { "property_type": "$property_type", "beds": "$beds" }, total: { $sum: 1 } } }, { $group: { _id: "$_id.property_type", beds: { $push: { nbBeds: "$_id.beds", total: "$total" } } } }]); 
