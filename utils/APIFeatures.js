class UserAPIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const value = this.queryStr.value ? {
            username: {
                $regex: this.queryStr.value,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...value });
        return this;
    }

    filter() {
        const { status } = this.queryStr;
        if (status) {
            this.query = this.query.find({ status });
        }
        return this;
    }


    pagination(size) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }

}

export { UserAPIFeatures };