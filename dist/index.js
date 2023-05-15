import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

var TaskType;
(function (TaskType) {
    TaskType[TaskType["loadFFmeg"] = 0] = "loadFFmeg";
    TaskType[TaskType["parseM3u8"] = 1] = "parseM3u8";
    TaskType[TaskType["downloadTs"] = 2] = "downloadTs";
    TaskType[TaskType["mergeTs"] = 3] = "mergeTs";
})(TaskType || (TaskType = {}));
function createFileUrlRegExp(ext, flags) {
    return new RegExp('(https?://)?[\\w:\\.\\-\\/]+?\\.' + ext, flags);
}
function parseUrl(url, path) {
    if (path.startsWith('http')) {
        return path;
    }
    return new URL(path, url).href;
}
function parseM3u8File(url, customFetch) {
    return __awaiter(this, void 0, void 0, function () {
        var playList, matchedM3u8, parsedUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playList = '';
                    if (!customFetch) return [3 /*break*/, 2];
                    return [4 /*yield*/, customFetch(url)];
                case 1:
                    playList = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetchFile(url).then(function (data) { return new Blob([data.buffer]).text(); })];
                case 3:
                    playList = _a.sent();
                    _a.label = 4;
                case 4:
                    matchedM3u8 = playList.match(createFileUrlRegExp('m3u8', 'i'));
                    if (matchedM3u8) {
                        parsedUrl = parseUrl(url, matchedM3u8[0]);
                        return [2 /*return*/, parseM3u8File(parsedUrl, customFetch)];
                    }
                    return [2 /*return*/, {
                            url: url,
                            content: playList
                        }];
            }
        });
    });
}
var Hls2Mp4 = /** @class */ (function () {
    function Hls2Mp4(_a, onProgress) {
        var _b = _a.maxRetry, maxRetry = _b === void 0 ? 3 : _b, _c = _a.tsDownloadConcurrency, tsDownloadConcurrency = _c === void 0 ? 10 : _c, options = __rest(_a, ["maxRetry", "tsDownloadConcurrency"]);
        this.ffmpegLoaded = false;
        this.loadRetryTime = 0;
        this.totalSegments = 0;
        this.savedSegments = 0;
        this.instance = createFFmpeg(options);
        this.maxRetry = maxRetry;
        this.onProgress = onProgress;
        this.tsDownloadConcurrency = tsDownloadConcurrency;
    }
    Hls2Mp4.prototype.transformBuffer = function (buffer) {
        if (buffer[0] === 0x47) {
            return buffer;
        }
        var bufferOffset = 0;
        for (var i = 0; i < buffer.length; i++) {
            if (buffer[i] === 0x47 && buffer[i + 1] === 0x40) {
                bufferOffset = i;
                break;
            }
        }
        return buffer.slice(bufferOffset);
    };
    Hls2Mp4.prototype.parseM3u8 = function (url) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, done, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.parseM3u8, 0);
                        return [4 /*yield*/, this.loopLoadFile(function () { return parseM3u8File(url); })];
                    case 1:
                        _c = _d.sent(), done = _c.done, data = _c.data;
                        if (done) {
                            (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.parseM3u8, 1);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Hls2Mp4.prototype.downloadTs = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, done, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loopLoadFile(function () { return fetchFile(url); })];
                    case 1:
                        _a = _b.sent(), done = _a.done, data = _a.data;
                        if (done) {
                            return [2 /*return*/, data];
                        }
                        throw new Error('ts download failed');
                }
            });
        });
    };
    Hls2Mp4.prototype.downloadSegments = function (segs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(segs.map(function (_a) {
                        var name = _a.name, url = _a.url, source = _a.source;
                        return __awaiter(_this, void 0, void 0, function () {
                            var tsData, buffer;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, this.downloadTs(url)];
                                    case 1:
                                        tsData = _c.sent();
                                        buffer = this.transformBuffer(tsData);
                                        this.instance.FS('writeFile', name, buffer);
                                        this.savedSegments += 1;
                                        (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.downloadTs, this.savedSegments / this.totalSegments);
                                        return [2 /*return*/, {
                                                source: source,
                                                url: url,
                                                name: name
                                            }];
                                }
                            });
                        });
                    }))];
            });
        });
    };
    Hls2Mp4.prototype.downloadM3u8 = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, content, parsedUrl, keyMatch, segs, total, batch, _loop_1, this_1, i, m3u8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.parseM3u8(url)];
                    case 1:
                        _a = _b.sent(), content = _a.content, parsedUrl = _a.url;
                        keyMatch = content.match(createFileUrlRegExp('key', 'i'));
                        if (keyMatch) {
                            throw new Error('video encrypted did not supported for now');
                            /*
                            const key = keyMatch[0]
                            const keyUrl = parseUrl(parsedUrl, key)
                            const keyName = 'key.key'
                            this.instance.FS('writeFile', keyName, await fetchFile(keyUrl))
                            content = content.replace(key, keyName)
                            */
                        }
                        segs = content.match(createFileUrlRegExp('ts', 'gi'));
                        if (!segs) {
                            throw new Error('Invalid m3u8 file, no ts file found');
                        }
                        total = this.totalSegments = segs.length;
                        batch = this.tsDownloadConcurrency;
                        _loop_1 = function (i) {
                            var downloadSegs, downloadSegs_1, downloadSegs_1_1, _c, source, name_1;
                            var e_1, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, this_1.downloadSegments(segs.slice(i * batch, Math.min(total, (i + 1) * batch)).map(function (seg, j) {
                                            var url = parseUrl(parsedUrl, seg);
                                            var name = "seg-".concat(i * batch + j, ".ts");
                                            return {
                                                source: seg,
                                                url: url,
                                                name: name
                                            };
                                        }))];
                                    case 1:
                                        downloadSegs = _e.sent();
                                        try {
                                            for (downloadSegs_1 = (e_1 = void 0, __values(downloadSegs)), downloadSegs_1_1 = downloadSegs_1.next(); !downloadSegs_1_1.done; downloadSegs_1_1 = downloadSegs_1.next()) {
                                                _c = downloadSegs_1_1.value, source = _c.source, name_1 = _c.name;
                                                content = content.replace(source, name_1);
                                            }
                                        }
                                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                        finally {
                                            try {
                                                if (downloadSegs_1_1 && !downloadSegs_1_1.done && (_d = downloadSegs_1.return)) _d.call(downloadSegs_1);
                                            }
                                            finally { if (e_1) throw e_1.error; }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i <= Math.floor((total / batch)))) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        m3u8 = 'temp.m3u8';
                        this.instance.FS('writeFile', m3u8, content);
                        return [2 /*return*/, m3u8];
                }
            });
        });
    };
    Hls2Mp4.prototype.loopLoadFile = function (startLoad) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, startLoad()];
                    case 1:
                        result = _a.sent();
                        this.loadRetryTime = 0;
                        return [2 /*return*/, {
                                done: true,
                                data: result
                            }];
                    case 2:
                        _a.sent();
                        this.loadRetryTime += 1;
                        if (this.loadRetryTime < this.maxRetry) {
                            return [2 /*return*/, this.loopLoadFile(startLoad)];
                        }
                        return [2 /*return*/, {
                                done: false,
                                data: null
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Hls2Mp4.prototype.loadFFmpeg = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var done;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.loadFFmeg, 0);
                        return [4 /*yield*/, this.loopLoadFile(function () { return _this.instance.load(); })];
                    case 1:
                        done = (_c.sent()).done;
                        if (done) {
                            (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.loadFFmeg, done ? 1 : -1);
                        }
                        else {
                            throw new Error('FFmpeg load failed');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Hls2Mp4.prototype.download = function (url) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var m3u8, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.ffmpegLoaded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadFFmpeg()];
                    case 1:
                        _c.sent();
                        this.ffmpegLoaded = true;
                        _c.label = 2;
                    case 2: return [4 /*yield*/, this.downloadM3u8(url)];
                    case 3:
                        m3u8 = _c.sent();
                        (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.mergeTs, 0);
                        return [4 /*yield*/, this.instance.run('-i', m3u8, '-c', 'copy', 'temp.mp4', '-loglevel', 'debug')];
                    case 4:
                        _c.sent();
                        data = this.instance.FS('readFile', 'temp.mp4');
                        this.instance.exit();
                        (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.mergeTs, 1);
                        return [2 /*return*/, data.buffer];
                }
            });
        });
    };
    Hls2Mp4.prototype.saveToFile = function (buffer, filename) {
        var objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));
        var anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
        setTimeout(function () { return URL.revokeObjectURL(objectUrl); }, 100);
    };
    Hls2Mp4.version = '1.0.9';
    return Hls2Mp4;
}());

export { TaskType, createFileUrlRegExp, Hls2Mp4 as default, parseM3u8File };
