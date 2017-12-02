/**
 * Object to sort an array by date
 */
const sort = {
  /**
   * Sorts an array by date from old to most recent
   * @param theArray The array to sort
   * @returns {*} The sorted array by date from old to most recent
   */
  sortDateTimeOldToNew(theArray) {
    let sortedArray = null;

    if (theArray.length === 0) {
      console.log('The array has no entries to sort');
    } else if (theArray[0].tweetDate) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(a.tweetDate) - new Date(b.tweetDate);
      });
    }

    console.log('The sorted array old to new:', sortedArray);
    return sortedArray;
  },

  /**
   * Sorts an array by date from most recent to old
   * @param theArray The array to sort
   * @returns {*} The sorted array by date from most recent to old
   */
  sortDateTimeNewToOld(theArray) {
    let sortedArray = null;

    if (theArray.length === 0) {
      console.log('The array has no entries to sort');
    } else if (theArray[0].tweetDate) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(b.tweetDate) - new Date(a.tweetDate);
      });
    }

    console.log('The sorted array new to old: ', sortedArray);
    return sortedArray;
  },
};

module.exports = sort;
