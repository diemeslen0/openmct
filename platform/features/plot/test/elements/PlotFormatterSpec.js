/*global define,Promise,describe,it,expect,beforeEach,waitsFor,jasmine*/

/**
 * MergeModelsSpec. Created by vwoeltje on 11/6/14.
 */
define(
    ["../../src/elements/PlotFormatter"],
    function (PlotFormatter) {
        "use strict";

        describe("The plot formatter", function () {
            var formatter;

            beforeEach(function () {
                formatter = new PlotFormatter();
            });

            it("formats domains using YYYY-DDD style", function () {
                expect(formatter.formatDomainValue(402513731000)).toEqual(
                    "1982-276 17:22:11"
                );
            });

            it("formats ranges as values", function () {
                expect(formatter.formatRangeValue(10)).toEqual("10.0");
            });
        });
    }
);