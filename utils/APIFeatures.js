class UserAPIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const value = this.queryStr.value ? {
            $or: [
                {
                    name: {
                        $regex: this.queryStr.value,
                        $options: 'i'
                    }
                },
                {
                    username: {
                        $regex: this.queryStr.value,
                        $options: 'i'
                    }
                }
            ]
        } : {}

        this.query = this.query.find({ ...value });
        return this;
    }

    pagination(size) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }

}

class TopicAPIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const value = this.queryStr.value ? {
            $or: [
                {
                    name: {
                        $regex: this.queryStr.value,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: this.queryStr.value,
                        $options: 'i'
                    }
                }
            ]
        } : {}

        this.query = this.query.find({ ...value });
        return this;
    }

    pagination(size) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }

}

export { UserAPIFeatures, TopicAPIFeatures };