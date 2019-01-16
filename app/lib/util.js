class Util {
  static removeDuplicateSpaces(value) {
    return value.replace(/\s\s/g, '');
  }

  static formatDecimal(value) {
    if (!value || value.toString().length === 0 || value.trim().length === 0) {
      return null;
    }
    value = value.trim();
    value = value.replace(/(.*),0*$/g, '$1');
    value = value.replace(/([.])/g, '');
    value = value.replace(',', '.');
    return parseFloat(value);
  }

  static formatDate(value) {
    if (!value || value.toString().length === 0 || value.trim().length === 0) {
      return null;
    }
    return value.replace(/^([0-9]{4}-[0-9]{2}-[0-9]{2})T([0-9]{2}:[0-9]{2}).*/g, '$1 $2');
  }

  static formatNumber(value) {
    if (!value || value.toString().length === 0 || value.trim().length === 0) {
      return null;
    }
    value = value.trim();
    return parseInt(value, 10);
  }
}

export default Util;
