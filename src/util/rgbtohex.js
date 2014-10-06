module.exports = function(obj) {
  function componentToHex(n) {
    var res = n.toString(16);
    if (res.length === 1) {
      res = "0" + res;
    }
    return res;
  }

  return '#' + componentToHex(obj.r) + componentToHex(obj.g) + componentToHex(obj.b);
};