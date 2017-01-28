import {csv, json, text, tsv} from "d3-request";
import {default as datafold} from "./datafold";

/**
  @desc Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.
  @param {String} key The key in the `this` context to save the resulting data to.
  @param {Array|String} path The path to the file or url to be loaded. If an Array is passed, the xhr request logic is skipped.
  @param {Function} [*formatter*] An optional formatter function that is run on the loaded data.
  @param {Function} callback A function that is called when the final data is loaded. It is passed 2 variables, any error present and the data loaded.
  @private
*/
export default function(key, path, formatter, callback) {

  if (typeof path !== "string") {

    const data = formatter ? formatter(path) : path;
    if (`_${key}` in this) this[`_${key}`] = data;
    callback(null, data);

  }
  else {

    const parser = path.slice(path.length - 4) === ".csv" ? csv
                 : path.slice(path.length - 4) === ".tsv" ? tsv
                 : path.slice(path.length - 4) === ".txt" ? text
                 : json;

    parser(path, (err, data) => {

      if (parser !== json && !err && data && data instanceof Array) {
        data.forEach(d => {
          for (const k in d) {
            if (!isNaN(d[k])) d[k] = parseFloat(d[k]);
            else if (d[k].toLowerCase() === "false") d[k] = false;
            else if (d[k].toLowerCase() === "true") d[k] = true;
            else if (d[k].toLowerCase() === "null") d[k] = null;
            else if (d[k].toLowerCase() === "undefined") d[k] = undefined;
          }
        });
      }

      data = err ? [] : formatter ? formatter(data) : data;
      if (data && !(data instanceof Array) && data.data && data.headers) data = datafold(data);
      if (`_${key}` in this) this[`_${key}`] = data;
      callback(err, data);

    });

  }

}
