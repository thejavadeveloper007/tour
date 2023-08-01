class APIFeature {
    constructor(query, queryString){
        this.queryString = queryString;
        this.query = query;
    }

    filter(){
        console.log('filter');
        const queryObj = {...this.queryString}
        let excludedFields = ['description','durationInHours','cityCode'];
        excludedFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt||gte||lt||lte)\b/g, match => `$${match}`);
    
       this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
        console.log('sort', this.queryString);
        if(this.queryString?.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
       this.query = this.query.sort(sortBy);
        }else{
           this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    fieldLimit(){
        console.log('field limit');
       if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
       }else{
        this.query = this.query.select('-__v');
       }
       return this;
    }

    paginate(){
        console.log('paginate');
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 10;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    } 
}

module.exports = APIFeature;