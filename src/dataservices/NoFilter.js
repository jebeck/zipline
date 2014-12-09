var NoFilter = function(data) {
  this.filter = function() {
    return data;
  };

  return this;
};

module.exports = NoFilter;