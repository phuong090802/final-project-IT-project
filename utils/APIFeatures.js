class UserAPIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const search = this.queryStr.search ? {
            $or: [
                {
                    name: {
                        $regex: this.queryStr.search,
                        $options: 'i'
                    }
                },
                {
                    username: {
                        $regex: this.queryStr.search,
                        $options: 'i'
                    }
                }
            ]
        } : {}

        this.query = this.query.find({ ...search });
        return this;
    }

    pagination(size) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }

    sort() {
        const sortStr = this.queryStr.sort;
        if (sortStr) {
            if (sortStr.includes(',')) {
                const sortQuery = extractSortQuery(sortStr);
                if (sortStr) {
                    this.query = this.query.sort(sortQuery);
                }
            }
            else {
                this.queryStr.sort.forEach(sortField => {
                    const sortQuery = extractSortQuery(sortField);
                    if (sortQuery) {
                        this.query = this.query.sort(sortQuery);
                    }
                });
            }
        } else {
            this.query = this.query.sort('name');
        }
        return this;
    }

}

function extractSortQuery(sortField) {
    const [field, order] = sortField.split(',');
    if (field && order) {
        return { [field]: order === 'desc' ? -1 : 1 };
    }
    return null;
}

class TopicAPIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const search = this.queryStr.search ? {
            $or: [
                {
                    name: {
                        $regex: this.queryStr.search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: this.queryStr.search,
                        $options: 'i'
                    }
                }
            ]
        } : {}

        this.query = this.query.find({ ...search });
        return this;
    }

    pagination(size) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }

    sort() {
        const sortStr = this.queryStr.sort;
        if (sortStr) {
            if (sortStr.includes(',')) {
                const sortQuery = extractSortQuery(sortStr);
                if (sortStr) {
                    this.query = this.query.sort(sortQuery);
                }
            }
            else {
                this.queryStr.sort.forEach(sortField => {
                    const sortQuery = extractSortQuery(sortField);
                    if (sortQuery) {
                        this.query = this.query.sort(sortQuery);
                    }
                });
            }
        } else {
            this.query = this.query.sort('name');
        }
        return this;
    }

}

export { UserAPIFeatures, TopicAPIFeatures };