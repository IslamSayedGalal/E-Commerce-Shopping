class ApiFeatures {
    constructor(mongooseQuery, queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    // 1) Filtering
    filter(){
        const queryStringObj = {...this.queryString};
        const excludesFields = ['pages', 'sort', 'limit', 'fields'];
        excludesFields.forEach((field) => delete queryStringObj[field]);

        // Apply filtration Using (gte, gt, lte, lt) 
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        return this;
    }

    // 2) Sorting
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }
        else{
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }
        return this;
    }


    // 3) Select Fields
    selectFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        else{
            this.mongooseQuery = this.mongooseQuery.select('-_v');
        }
        return this;
    }

    // 4) Search
    search(nameModel){
        if(this.queryString.keyword){
            let query = {};
            if(nameModel === 'Products'){
                query.$or = [
                    {title: { $regex: this.queryString.keyword, $options: 'i'}},
                    {description: {$regex: this.queryString.keyword, $options: 'i'}},
                ];
            }
            else{
                query = {name: { $regex: this.queryString.keyword, $options: 'i'}};
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    // 5) pagination
    paginate(countDocuments){
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 5;
        const skip = (page -1)*limit;
        const endIndex = page * limit;

        // Pagination Results
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if(endIndex < countDocuments){
            pagination.next = page + 1;
        }

        // prev page
        if(skip > 0){
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        
        this.paginationResult = pagination;
        return this;
    }
}

module.exports = ApiFeatures;