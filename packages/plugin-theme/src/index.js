import baseCss from "./lib/base.css.js";
import notch from "./lib/notch";
import gridMetric from "./lib/grid-metric";
import gridImperial from "./lib/grid-imperial";
import { version, name } from "../package.json";

export default {
  name: name,
  version: version,
  hooks: {
    preRender: function(next) {
      this.style += baseCss;
      this.defs += notch;
      this.attributes.add("freesewing:plugin-theme", version);
      if (this.pattern.settings.paperless) {
        if (this.pattern.settings.units === "imperial")
          this.defs += gridImperial;
        else this.defs += gridMetric;
        for (let key in this.pattern.parts) {
          let part = this.pattern.parts[key];
          if (part.render && this.pattern.needs(key)) {
            let anchor = new this.pattern.Point(0, 0);
            if (typeof part.points.gridAnchor !== "undefined")
              anchor = part.points.gridAnchor;
            else if (typeof part.points.anchor !== "undefined")
              anchor = part.points.anchor;
            this.defs += `<pattern id="grid_${key}" `;
            this.defs += `xlink:href="#grid" x="${anchor.x}" y="${anchor.y}">`;
            this.defs += "</pattern>";
            part.paths[part.getId()] = new this.pattern.Path()
              .move(part.topLeft)
              .line(new this.pattern.Point(part.topLeft.x, part.bottomRight.y))
              .line(part.bottomRight)
              .line(new this.pattern.Point(part.bottomRight.x, part.topLeft.y))
              .close()
              .attr("class", "grid")
              .attr("style", `fill: url(#grid_${key})`);
          }
        }
      }
      next();
    }
  }
};