'use strict';

/**
 * A "private" object
 */

class Helper {

    constructor(repLogs) {

        this.repLogs = repLogs;
    }

    static _calculateWeights(repLogs) {

        let totalWeight = 0;

        //$elements.each( (index, element) => {
        for (let repLog of repLogs) {
            totalWeight += repLog.totalWeightLifted;
        }
        //});

        return totalWeight;
    }

    calculateTotalWeight() {
        return Helper._calculateWeights(
            this.repLogs
            //this.$wrapper.find('tbody tr')
        );
    }

    getTotalWeightString(maxWeight = 500) {
        let weight = this.calculateTotalWeight();

        if (weight > maxWeight) {
            weight = maxWeight + '+';
        }

        return weight + ' lbs';
    }
}

module.exports = Helper;