import {select} from "d3-selection";

import {stylize} from "d3plus-common";

/**
    @class Message
    @desc Displays a message using plain HTML.
    @private
*/
export default class Message {

  /**
      @memberof Message
      @desc Removes the message from the page.
      @chainable
  */
  exit(elem, duration) {

    elem
      .transition().duration(duration).style("opacity", 0)
      .transition().remove();

  }

  /**
      @memberof Message
      @desc Removes the message from the page.
      @chainable
  */
  hide({duration = 600, callback} = {}) {

    this.mask.call(this.exit, duration);
    this.elem.call(this.exit, duration);

    if (callback) setTimeout(callback, duration + 100);

    return this;

  }

  /**
      @memberof Message
      @desc Draws the message given the specified configuration.
      @param {Object} [*config*]
      @chainable
  */
  render({
    callback,
    container = "body",
    duration = 600,
    html = "Please Wait",
    mask = "rgba(0, 0, 0, 0.1)",
    style = {}
  } = {}) {

    const parent = select(container)
      .style("position", "relative");

    this.mask = parent.selectAll("div.d3plus-Mask").data(mask ? [mask] : []);

    this.mask = this.mask.enter().append("div")
      .attr("class", "d3plus-Mask")
      .style("opacity", 1)
      .merge(this.mask);

    this.mask.exit().call(this.exit, duration);

    stylize(this.mask, {
      "background-color": String,
      "bottom": "0px",
      "left": "0px",
      "position": "absolute",
      "right": "0px",
      "top": "0px"
    });

    this.elem = parent.selectAll("div.d3plus-Message").data([html]);

    this.elem = this.elem.enter().append("div")
      .attr("class", "d3plus-Message")
      .style("opacity", 1)
      .merge(this.elem)
      .html(String);

    stylize(this.elem, style);

    if (callback) setTimeout(callback, 100);

    return this;

  }

}
