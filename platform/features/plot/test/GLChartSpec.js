/*global define,Promise,describe,it,expect,beforeEach,waitsFor,jasmine*/

/**
 * MergeModelsSpec. Created by vwoeltje on 11/6/14.
 */
define(
    ["../src/GLChart"],
    function (GLChart) {
        "use strict";

        describe("A WebGL chart", function () {
            var mockCanvas,
                mockGL,
                glChart;

            beforeEach(function () {
                mockCanvas = jasmine.createSpyObj("canvas", [ "getContext" ]);
                mockGL = jasmine.createSpyObj(
                    "gl",
                    [
                        "createShader",
                        "compileShader",
                        "shaderSource",
                        "attachShader",
                        "createProgram",
                        "linkProgram",
                        "useProgram",
                        "enableVertexAttribArray",
                        "getAttribLocation",
                        "getUniformLocation",
                        "createBuffer",
                        "lineWidth",
                        "enable",
                        "blendFunc",
                        "viewport",
                        "clear",
                        "uniform2fv",
                        "uniform4fv",
                        "bufferData",
                        "bindBuffer",
                        "vertexAttribPointer",
                        "drawArrays"
                    ]
                );
                mockGL.ARRAY_BUFFER = "ARRAY_BUFFER";
                mockGL.DYNAMIC_DRAW = "DYNAMIC_DRAW";
                mockGL.TRIANGLE_FAN = "TRIANGLE_FAN";
                mockGL.LINE_STRIP = "LINE_STRIP";

                // Echo back names for uniform locations, so we can
                // test which of these are set for certain operations.
                mockGL.getUniformLocation.andCallFake(function (a, name) {
                    return name;
                });

                mockCanvas.getContext.andReturn(mockGL);

                glChart = new GLChart(mockCanvas);
            });

            it("allows the canvas to be cleared", function () {
                glChart.clear();
                expect(mockGL.clear).toHaveBeenCalled();
            });

            it("doees not construct if WebGL is unavailable", function () {
                mockCanvas.getContext.andReturn(undefined);
                expect(function () {
                    return new GLChart(mockCanvas);
                }).toThrow();
            });

            it("allows dimensions to be set", function () {
                glChart.setDimensions([120, 120], [0, 10]);
                expect(mockGL.uniform2fv)
                    .toHaveBeenCalledWith("uDimensions", [120, 120]);
                expect(mockGL.uniform2fv)
                    .toHaveBeenCalledWith("uOrigin", [0, 10]);
            });

            it("allows lines to be drawn", function () {
                var testBuffer = [ 0, 1, 3, 8 ],
                    testColor = [ 0.25, 0.33, 0.66, 1.0 ],
                    testPoints = 2;
                glChart.drawLine(testBuffer, testColor, testPoints);
                expect(mockGL.bufferData).toHaveBeenCalledWith(
                    mockGL.ARRAY_BUFFER,
                    testBuffer,
                    mockGL.DYNAMIC_DRAW
                );
                expect(mockGL.uniform4fv)
                    .toHaveBeenCalledWith("uColor", testColor);
                expect(mockGL.drawArrays)
                    .toHaveBeenCalledWith("LINE_STRIP", 0, testPoints);
            });

            it("allows squares to be drawn", function () {
                var testMin = [0, 1],
                    testMax = [10, 10],
                    testColor = [ 0.25, 0.33, 0.66, 1.0 ];

                glChart.drawSquare(testMin, testMax, testColor);

                expect(mockGL.uniform4fv)
                    .toHaveBeenCalledWith("uColor", testColor);
                expect(mockGL.drawArrays)
                    .toHaveBeenCalledWith("TRIANGLE_FAN", 0, 4);
            });
        });
    }
);