/*
 Highcharts JS v9.0.1 (2021-02-15)

 Highcharts Drilldown module

 Author: Torstein Honsi
 License: www.highcharts.com/license

*/
(function (c) {
  "object" === typeof module && module.exports
    ? ((c["default"] = c), (module.exports = c))
    : "function" === typeof define && define.amd
    ? define("highcharts/modules/drilldown", ["highcharts"], function (m) {
        c(m);
        c.Highcharts = m;
        return c;
      })
    : c("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (c) {
  function m(c, m, n, z) {
    c.hasOwnProperty(m) || (c[m] = z.apply(null, n));
  }
  c = c ? c._modules : {};
  m(
    c,
    "Extensions/Drilldown.js",
    [
      c["Core/Animation/AnimationUtilities.js"],
      c["Core/Axis/Axis.js"],
      c["Core/Chart/Chart.js"],
      c["Core/Color/Color.js"],
      c["Series/Column/ColumnSeries.js"],
      c["Core/Globals.js"],
      c["Core/Options.js"],
      c["Core/Color/Palette.js"],
      c["Core/Series/Point.js"],
      c["Core/Series/Series.js"],
      c["Core/Series/SeriesRegistry.js"],
      c["Core/Renderer/SVG/SVGRenderer.js"],
      c["Core/Axis/Tick.js"],
      c["Core/Utilities.js"],
    ],
    function (c, m, n, z, t, A, I, C, w, D, x, J, E, p) {
      var F = c.animObject,
        K = A.noop;
      c = I.defaultOptions;
      var k = p.addEvent,
        L = p.removeEvent,
        r = p.extend,
        y = p.fireEvent,
        M = p.format,
        u = p.merge,
        N = p.objectEach,
        v = p.pick,
        O = p.syncTimeout;
      x = x.seriesTypes.pie;
      var G = 1;
      r(c.lang, { drillUpText: "\u25c1 Back to {series.name}" });
      c.drilldown = {
        activeAxisLabelStyle: {
          cursor: "pointer",
          color: C.highlightColor100,
          fontWeight: "bold",
          textDecoration: "underline",
        },
        activeDataLabelStyle: {
          cursor: "pointer",
          color: C.highlightColor100,
          fontWeight: "bold",
          textDecoration: "underline",
        },
        animation: { duration: 500 },
        drillUpButton: { position: { align: "right", x: -10, y: 10 } },
      };
      J.prototype.Element.prototype.fadeIn = function (a) {
        this.attr({ opacity: 0.1, visibility: "inherit" }).animate(
          { opacity: v(this.newOpacity, 1) },
          a || { duration: 250 }
        );
      };
      n.prototype.addSeriesAsDrilldown = function (a, b) {
        this.addSingleSeriesAsDrilldown(a, b);
        this.applyDrilldown();
      };
      n.prototype.addSingleSeriesAsDrilldown = function (a, b) {
        var d = a.series,
          f = d.xAxis,
          e = d.yAxis,
          g = [],
          q = [],
          h;
        var l = this.styledMode
          ? { colorIndex: v(a.colorIndex, d.colorIndex) }
          : { color: a.color || d.color };
        this.drilldownLevels || (this.drilldownLevels = []);
        var c = d.options._levelNumber || 0;
        (h = this.drilldownLevels[this.drilldownLevels.length - 1]) &&
          h.levelNumber !== c &&
          (h = void 0);
        b = r(r({ _ddSeriesId: G++ }, l), b);
        var k = d.points.indexOf(a);
        d.chart.series.forEach(function (a) {
          a.xAxis !== f ||
            a.isDrilling ||
            ((a.options._ddSeriesId = a.options._ddSeriesId || G++),
            (a.options._colorIndex = a.userOptions._colorIndex),
            (a.options._levelNumber = a.options._levelNumber || c),
            h
              ? ((g = h.levelSeries), (q = h.levelSeriesOptions))
              : (g.push(a),
                (a.purgedOptions = u(
                  {
                    _ddSeriesId: a.options._ddSeriesId,
                    _levelNumber: a.options._levelNumber,
                    selected: a.options.selected,
                  },
                  a.userOptions
                )),
                q.push(a.purgedOptions)));
        });
        a = r(
          {
            levelNumber: c,
            seriesOptions: d.options,
            seriesPurgedOptions: d.purgedOptions,
            levelSeriesOptions: q,
            levelSeries: g,
            shapeArgs: a.shapeArgs,
            bBox: a.graphic ? a.graphic.getBBox() : {},
            color: a.isNull ? new z(l.color).setOpacity(0).get() : l.color,
            lowerSeriesOptions: b,
            pointOptions: d.options.data[k],
            pointIndex: k,
            oldExtremes: {
              xMin: f && f.userMin,
              xMax: f && f.userMax,
              yMin: e && e.userMin,
              yMax: e && e.userMax,
            },
            resetZoomButton: this.resetZoomButton,
          },
          l
        );
        this.drilldownLevels.push(a);
        f && f.names && (f.names.length = 0);
        b = a.lowerSeries = this.addSeries(b, !1);
        b.options._levelNumber = c + 1;
        f && ((f.oldPos = f.pos), (f.userMin = f.userMax = null), (e.userMin = e.userMax = null));
        d.type === b.type && ((b.animate = b.animateDrilldown || K), (b.options.animation = !0));
      };
      n.prototype.applyDrilldown = function () {
        var a = this.drilldownLevels;
        if (a && 0 < a.length) {
          var b = a[a.length - 1].levelNumber;
          this.drilldownLevels.forEach(function (a) {
            a.levelNumber === b &&
              a.levelSeries.forEach(function (a) {
                a.options && a.options._levelNumber === b && a.remove(!1);
              });
          });
        }
        this.resetZoomButton && (this.resetZoomButton.hide(), delete this.resetZoomButton);
        this.pointer.reset();
        this.redraw();
        this.showDrillUpButton();
        y(this, "afterDrilldown");
      };
      n.prototype.getDrilldownBackText = function () {
        var a = this.drilldownLevels;
        if (a && 0 < a.length)
          return (
            (a = a[a.length - 1]), (a.series = a.seriesOptions), M(this.options.lang.drillUpText, a)
          );
      };
      n.prototype.showDrillUpButton = function () {
        var a = this,
          b = this.getDrilldownBackText(),
          d = a.options.drilldown.drillUpButton,
          f;
        if (this.drillUpButton) this.drillUpButton.attr({ text: b }).align();
        else {
          var e = (f = d.theme) && f.states;
          this.drillUpButton = this.renderer
            .button(
              b,
              null,
              null,
              function () {
                a.drillUp();
              },
              f,
              e && e.hover,
              e && e.select
            )
            .addClass("highcharts-drillup-button")
            .attr({ align: d.position.align, zIndex: 7 })
            .add()
            .align(d.position, !1, d.relativeTo || "plotBox");
        }
      };
      n.prototype.drillUp = function () {
        if (this.drilldownLevels && 0 !== this.drilldownLevels.length) {
          for (
            var a = this,
              b = a.drilldownLevels,
              d = b[b.length - 1].levelNumber,
              f = b.length,
              e = a.series,
              g,
              c,
              h,
              l,
              k = function (b) {
                e.forEach(function (a) {
                  a.options._ddSeriesId === b._ddSeriesId && (d = a);
                });
                var d = d || a.addSeries(b, !1);
                d.type === h.type && d.animateDrillupTo && (d.animate = d.animateDrillupTo);
                b === c.seriesPurgedOptions && (l = d);
              };
            f--;

          )
            if (((c = b[f]), c.levelNumber === d)) {
              b.pop();
              h = c.lowerSeries;
              if (!h.chart)
                for (g = e.length; g--; )
                  if (
                    e[g].options.id === c.lowerSeriesOptions.id &&
                    e[g].options._levelNumber === d + 1
                  ) {
                    h = e[g];
                    break;
                  }
              h.xData = [];
              c.levelSeriesOptions.forEach(k);
              y(a, "drillup", { seriesOptions: c.seriesPurgedOptions || c.seriesOptions });
              this.resetZoomButton && this.resetZoomButton.destroy();
              l.type === h.type &&
                ((l.drilldownLevel = c),
                (l.options.animation = a.options.drilldown.animation),
                h.animateDrillupFrom && h.chart && h.animateDrillupFrom(c));
              l.options._levelNumber = d;
              h.remove(!1);
              l.xAxis &&
                ((g = c.oldExtremes),
                l.xAxis.setExtremes(g.xMin, g.xMax, !1),
                l.yAxis.setExtremes(g.yMin, g.yMax, !1));
              c.resetZoomButton &&
                ((a.resetZoomButton = c.resetZoomButton), a.resetZoomButton.show());
            }
          this.redraw();
          0 === this.drilldownLevels.length
            ? (this.drillUpButton = this.drillUpButton.destroy())
            : this.drillUpButton.attr({ text: this.getDrilldownBackText() }).align();
          this.ddDupes.length = [];
          y(a, "drillupall");
        }
      };
      k(n, "afterInit", function () {
        var a = this;
        a.drilldown = {
          update: function (b, d) {
            u(!0, a.options.drilldown, b);
            v(d, !0) && a.redraw();
          },
        };
      });
      k(n, "afterShowResetZoom", function () {
        var a = this.resetZoomButton && this.resetZoomButton.getBBox(),
          b = this.options.drilldown && this.options.drilldown.drillUpButton;
        this.drillUpButton &&
          a &&
          b &&
          b.position &&
          b.position.x &&
          this.drillUpButton.align(
            { x: b.position.x - a.width - 10, y: b.position.y, align: b.position.align },
            !1,
            b.relativeTo || "plotBox"
          );
      });
      k(n, "render", function () {
        (this.xAxis || []).forEach(function (a) {
          a.ddPoints = {};
          a.series.forEach(function (b) {
            var d,
              f = b.xData || [],
              e = b.points;
            for (d = 0; d < f.length; d++) {
              var c = b.options.data[d];
              "number" !== typeof c &&
                ((c = b.pointClass.prototype.optionsToObject.call({ series: b }, c)),
                c.drilldown &&
                  (a.ddPoints[f[d]] || (a.ddPoints[f[d]] = []),
                  a.ddPoints[f[d]].push(e ? e[d] : !0)));
            }
          });
          N(a.ticks, E.prototype.drillable);
        });
      });
      t.prototype.animateDrillupTo = function (a) {
        if (!a) {
          var b = this,
            d = b.drilldownLevel;
          this.points.forEach(function (a) {
            var b = a.dataLabel;
            a.graphic && a.graphic.hide();
            b &&
              ((b.hidden = "hidden" === b.attr("visibility")),
              b.hidden || (b.hide(), a.connector && a.connector.hide()));
          });
          O(function () {
            if (b.points) {
              var a = [];
              b.data.forEach(function (b) {
                a.push(b);
              });
              b.nodes && (a = a.concat(b.nodes));
              a.forEach(function (a, b) {
                b = b === (d && d.pointIndex) ? "show" : "fadeIn";
                var c = "show" === b ? !0 : void 0,
                  f = a.dataLabel;
                if (a.graphic) a.graphic[b](c);
                f && !f.hidden && (f.fadeIn(), a.connector && a.connector.fadeIn());
              });
            }
          }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));
          delete this.animate;
        }
      };
      t.prototype.animateDrilldown = function (a) {
        var b = this,
          d = this.chart,
          c = d.drilldownLevels,
          e,
          g = F(d.options.drilldown.animation),
          q = this.xAxis,
          h = d.styledMode;
        a ||
          (c.forEach(function (a) {
            b.options._ddSeriesId === a.lowerSeriesOptions._ddSeriesId &&
              ((e = a.shapeArgs), h || (e.fill = a.color));
          }),
          (e.x += v(q.oldPos, q.pos) - q.pos),
          this.points.forEach(function (a) {
            var d = a.shapeArgs;
            h || (d.fill = a.color);
            a.graphic && a.graphic.attr(e).animate(r(a.shapeArgs, { fill: a.color || b.color }), g);
            a.dataLabel && a.dataLabel.fadeIn(g);
          }),
          delete this.animate);
      };
      t.prototype.animateDrillupFrom = function (a) {
        var b = F(this.chart.options.drilldown.animation),
          d = this.group,
          c = d !== this.chart.columnGroup,
          e = this;
        e.trackerGroups.forEach(function (a) {
          if (e[a]) e[a].on("mouseover");
        });
        c && delete this.group;
        this.points.forEach(function (f) {
          var g = f.graphic,
            h = a.shapeArgs,
            l = function () {
              g.destroy();
              d && c && (d = d.destroy());
            };
          g &&
            h &&
            (delete f.graphic,
            e.chart.styledMode || (h.fill = a.color),
            b.duration ? g.animate(h, u(b, { complete: l })) : (g.attr(h), l()));
        });
      };
      x &&
        r(x.prototype, {
          animateDrillupTo: t.prototype.animateDrillupTo,
          animateDrillupFrom: t.prototype.animateDrillupFrom,
          animateDrilldown: function (a) {
            var b = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
              d = this.chart.options.drilldown.animation;
            this.is("item") && (d.duration = 0);
            if (this.center) {
              var c = b.shapeArgs,
                e = c.start,
                g = (c.end - e) / this.points.length,
                k = this.chart.styledMode;
              a ||
                (this.points.forEach(function (a, f) {
                  var h = a.shapeArgs;
                  k || ((c.fill = b.color), (h.fill = a.color));
                  if (a.graphic)
                    a.graphic
                      .attr(u(c, { start: e + f * g, end: e + (f + 1) * g }))
                      [d ? "animate" : "attr"](h, d);
                }),
                delete this.animate);
            }
          },
        });
      w.prototype.doDrilldown = function (a, b, d) {
        var c = this.series.chart,
          e = c.options.drilldown,
          g = (e.series || []).length;
        c.ddDupes || (c.ddDupes = []);
        for (; g-- && !k; )
          if (e.series[g].id === this.drilldown && -1 === c.ddDupes.indexOf(this.drilldown)) {
            var k = e.series[g];
            c.ddDupes.push(this.drilldown);
          }
        y(
          c,
          "drilldown",
          {
            point: this,
            seriesOptions: k,
            category: b,
            originalEvent: d,
            points: "undefined" !== typeof b && this.series.xAxis.getDDPoints(b).slice(0),
          },
          function (b) {
            var c = b.point.series && b.point.series.chart,
              d = b.seriesOptions;
            c &&
              d &&
              (a ? c.addSingleSeriesAsDrilldown(b.point, d) : c.addSeriesAsDrilldown(b.point, d));
          }
        );
      };
      m.prototype.drilldownCategory = function (a, b) {
        this.getDDPoints(a).forEach(function (c) {
          c && c.series && c.series.visible && c.doDrilldown && c.doDrilldown(!0, a, b);
        });
        this.chart.applyDrilldown();
      };
      m.prototype.getDDPoints = function (a) {
        return (this.ddPoints && this.ddPoints[a]) || [];
      };
      E.prototype.drillable = function () {
        var a = this.pos,
          b = this.label,
          c = this.axis,
          f = "xAxis" === c.coll && c.getDDPoints,
          e = f && c.getDDPoints(a),
          g = c.chart.styledMode;
        f &&
          (b && e && e.length
            ? ((b.drillable = !0),
              b.basicStyles || g || (b.basicStyles = u(b.styles)),
              b.addClass("highcharts-drilldown-axis-label"),
              b.removeOnDrillableClick && L(b.element, "click"),
              (b.removeOnDrillableClick = k(b.element, "click", function (b) {
                b.preventDefault();
                c.drilldownCategory(a, b);
              })),
              g || b.css(c.chart.options.drilldown.activeAxisLabelStyle))
            : b &&
              b.drillable &&
              b.removeOnDrillableClick &&
              (g || ((b.styles = {}), b.css(b.basicStyles)),
              b.removeOnDrillableClick(),
              b.removeClass("highcharts-drilldown-axis-label")));
      };
      k(w, "afterInit", function () {
        this.drilldown &&
          !this.unbindDrilldownClick &&
          (this.unbindDrilldownClick = k(this, "click", H));
        return this;
      });
      k(w, "update", function (a) {
        a = a.options || {};
        a.drilldown && !this.unbindDrilldownClick
          ? (this.unbindDrilldownClick = k(this, "click", H))
          : !a.drilldown &&
            void 0 !== a.drilldown &&
            this.unbindDrilldownClick &&
            (this.unbindDrilldownClick = this.unbindDrilldownClick());
      });
      var H = function (a) {
        var b = this.series;
        b.xAxis && !1 === b.chart.options.drilldown.allowPointDrilldown
          ? b.xAxis.drilldownCategory(this.x, a)
          : this.doDrilldown(void 0, void 0, a);
      };
      k(D, "afterDrawDataLabels", function () {
        var a = this.chart.options.drilldown.activeDataLabelStyle,
          b = this.chart.renderer,
          c = this.chart.styledMode;
        this.points.forEach(function (d) {
          var e = d.options.dataLabels,
            f = v(d.dlOptions, e && e.style, {});
          d.drilldown &&
            d.dataLabel &&
            ("contrast" !== a.color || c || (f.color = b.getContrast(d.color || this.color)),
            e && e.color && (f.color = e.color),
            d.dataLabel.addClass("highcharts-drilldown-data-label"),
            c || d.dataLabel.css(a).css(f));
        }, this);
      });
      var B = function (a, b, c, f) {
        a[c ? "addClass" : "removeClass"]("highcharts-drilldown-point");
        f || a.css({ cursor: b });
      };
      k(D, "afterDrawTracker", function () {
        var a = this.chart.styledMode;
        this.points.forEach(function (b) {
          b.drilldown && b.graphic && B(b.graphic, "pointer", !0, a);
        });
      });
      k(w, "afterSetState", function () {
        var a = this.series.chart.styledMode;
        this.drilldown && this.series.halo && "hover" === this.state
          ? B(this.series.halo, "pointer", !0, a)
          : this.series.halo && B(this.series.halo, "auto", !1, a);
      });
      k(A.Chart, "selection", function (a) {
        !0 === a.resetSelection &&
          this.drillUpButton &&
          (a = this.options.drilldown && this.options.drilldown.drillUpButton) &&
          a.position &&
          this.drillUpButton.align(
            { x: a.position.x, y: a.position.y, align: a.position.align },
            !1,
            a.relativeTo || "plotBox"
          );
      });
      k(A.Chart, "drillup", function () {
        this.resetZoomButton && (this.resetZoomButton = this.resetZoomButton.destroy());
      });
    }
  );
  m(c, "masters/modules/drilldown.src.js", [], function () {});
});
//# sourceMappingURL=drilldown.js.map
