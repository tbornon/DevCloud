/* Import required librairies */
const csv = require('csv-parser')
const fs = require('fs')
const { Transform } = require('stream');

/* List of transformations that will be done
 * inputFile : csv file that will be transformed
 * outputFile : json output file that will be created
 * transform : function that will select which field should be kept and which shouldn't (function (chunk, encoding callback))
 */
const TRANSFORMS = {
    calendar: {
        inputFile: "dataset/calendar.csv",
        outputFile: "model1/calendar.json",
        transform: function (chunk, enc, cb) {
            let _data = {
                listing_id: chunk.listing_id,
                date: chunk.date,
                available: chunk.available === "f" ? false : true,
                maximum_nights: chunk.maximum_nights,
                minimum_nights: chunk.minimum_nights,
                price: removeDollarAndParseFloat(chunk.price),
                adjusted_price: removeDollarAndParseFloat(chunk.adjusted_price),
            };

            // Push datas out of that streaming element
            this.push(JSON.stringify(_data) + ",\n");
            cb();
        }
    },
    reviews: {
        inputFile: "dataset/reviews_detailed.csv",
        outputFile: "model1/reviews_detailed.json",
        transform: function (chunk, enc, cb) {
            let _data = {
                comments: chunk.comments,
                date: chunk.date,
                id: chunk.id,
                listing_id: chunk.listing_id,
                reviewer_id: chunk.reviewer_id,
                reviewer_name: chunk.reviewer_name
            };

            // Push datas out of that streaming element
            this.push(JSON.stringify(_data) + ",\n");
            cb();
        }
    },
    listings: {
        inputFile: "dataset/listings_detailed.csv",
        outputFile: "model1/listings_detailed.json",
        transform: function (chunk, enc, cb) {
            let _data = {
                accomodates: parseInt(chunk.accomodates),
                amenities: chunk.amenities.match(/([\w\s\/]+)/g),
                availability_30: parseInt(chunk.availability_30),
                availability_365: parseInt(chunk.availability_365),
                availability_60: parseInt(chunk.availability_60),
                availability_90: parseInt(chunk.availability_90),
                bathrooms: parseFloat(chunk.bathrooms),
                bed_type: chunk.bed_type,
                bedrooms: parseInt(chunk.bedrooms),
                beds: parseInt(chunk.beds),
                calculated_host_listings_count: parseInt(chunk.calculated_host_listings_count),
                calculated_host_listings_count_entire_homes: parseInt(chunk.calculated_host_listings_count_entire_homes),
                calculated_host_listings_count_private_rooms: parseInt(chunk.calculated_host_listings_count_private_rooms),
                calculated_host_listings_count_shared_rooms: parseInt(chunk.calculated_host_listings_count_shared_rooms),
                calculated_host_listings_count: parseInt(chunk.calculated_host_listings_count),
                cancellation_policy: chunk.cancellation_policy,
                city: chunk.city,
                cleaning_fee: removeDollarAndParseFloat(chunk.cleaning_fee),
                extra_people: removeDollarAndParseFloat(chunk.extra_people),
                host_id: chunk.host_id,
                host_location: chunk.host_location,
                host_name: chunk.host_name,
                host_neighbourhood: chunk.host_neighbourhood,
                host_response_time: chunk.host_response_time,
                host_since: chunk.host_since,
                host_total_listings_count: chunk.host_total_listings_count,
                id: chunk.id,
                is_business_travel_ready: chunk.is_business_travel_ready === "f" ? false : true,
                first_review: chunk.first_review,
                last_review: chunk.first_review,
                maximum_nights: parseInt(chunk.maximum_nights),
                maximum_nights_avg_ntm: parseInt(chunk.maximum_nights_avg_ntm),
                minimum_nights_avg: parseInt(chunk.minimum_nights_avg),
                minimum_nights_avg_ntm: parseInt(chunk.minimum_nights_avg_ntm),
                name: chunk.name,
                neighbourhood_group: chunk.neighbourhood,
                neighbourhood: chunk.neighbourhood_cleansed,
                number_of_reviews: parseInt(chunk.number_of_reviews),
                number_of_reviews_ltm: parseInt(chunk.number_of_reviews),
                price: removeDollarAndParseFloat(chunk.price),
                monthly_price: removeDollarAndParseFloat(chunk.monthly_price)
            };

            // Push datas out of that streaming element
            this.push(JSON.stringify(_data) + ",\n");
            cb();
        }
    }
}

// Remove dollar sign from a string and parse it into float
const removeDollarAndParseFloat = data => parseFloat(data.replace('$', ''));

// Flow for transforming data
let csvTransform = options =>
    new Promise(resolve => {
        // Create csv read stream
        let readable = fs.createReadStream(options.inputFile)
        // Create json write stream
        let writable = fs.createWriteStream(options.outputFile)

        // Data stored as json array so beginning of array
        writable.write("[");

        console.log(`Starting transformation of ${options.inputFile} data`);
        let start = Date.now()
        // Pipe data from csv file -> csv parser -> select data to keep -> write to file
        readable
            .pipe(csv())
            .pipe(new Transform({ objectMode: true, transform: options.transform }))
            .pipe(writable)
            .once("close", () => {
                // When data are all written, close the JSON array
                fs.appendFile(options.outputFile, "{}]", () => {
                    console.log("All datas transormed in " + (Date.now() - start) + "ms");
                    resolve();
                });
            });
    });

function main() {
    // Flow for transforming all files one by one. Could maybe be done in parallel for faster results ?
    fs.mkdir("model1", err => {
        csvTransform(TRANSFORMS.calendar)
            .then(() => csvTransform(TRANSFORMS.reviews))
            .then(() => csvTransform(TRANSFORMS.listings))
            .then(() => {
                console.log("All datas transformed. Exit");
                process.exit(0)
            })
            .catch(err => console.error(err));
    })
}

main()