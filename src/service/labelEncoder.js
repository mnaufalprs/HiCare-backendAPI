class LabelEncoder {
    constructor() {
        this.classes_ = [];
    }

    fit(labels) {
        this.classes_ = Array.from(new Set(labels));
    }

    transform(labels) {
        if (this.classes_.length === 0) {
            throw new Error('LabelEncoder not fitted yet.');
        }
        return labels.map(label => this.classes_.indexOf(label));
    }

    fit_transform(labels) {
        this.fit(labels);
        return this.transform(labels);
    }

    inverse_transform(indices) {
        if (this.classes_.length === 0) {
            throw new Error('LabelEncoder not fitted yet.');
        }
        return indices.map(index => this.classes_[index]);
    }
}

module.exports = LabelEncoder;
