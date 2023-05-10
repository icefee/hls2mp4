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
    function Hls2Mp4(options, onProgress) {
        this.instance = createFFmpeg(options);
        this.onProgress = onProgress;
    }
    Hls2Mp4.prototype.downloadM3u8 = function (url) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, content, parsedUrl, keyMatch, key, keyUrl, keyName, _e, _f, _g, segs, i, tsUrl, segName, _h, _j, _k, m3u8;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.parseM3u8, 0);
                        return [4 /*yield*/, parseM3u8File(url)];
                    case 1:
                        _d = _l.sent(), content = _d.content, parsedUrl = _d.url;
                        keyMatch = content.match(createFileUrlRegExp('key', 'i'));
                        if (!keyMatch) return [3 /*break*/, 3];
                        key = keyMatch[0];
                        keyUrl = parseUrl(parsedUrl, key);
                        keyName = 'key.key';
                        _f = (_e = this.instance).FS;
                        _g = ['writeFile', keyName];
                        return [4 /*yield*/, fetchFile(keyUrl)];
                    case 2:
                        _f.apply(_e, _g.concat([_l.sent()]));
                        content = content.replace(key, keyName);
                        _l.label = 3;
                    case 3:
                        (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.parseM3u8, 1);
                        segs = content.match(createFileUrlRegExp('ts', 'gi'));
                        i = 0;
                        _l.label = 4;
                    case 4:
                        if (!(i < segs.length)) return [3 /*break*/, 7];
                        tsUrl = parseUrl(parsedUrl, segs[i]);
                        segName = "seg-".concat(i, ".ts");
                        _j = (_h = this.instance).FS;
                        _k = ['writeFile', segName];
                        return [4 /*yield*/, fetchFile(tsUrl)];
                    case 5:
                        _j.apply(_h, _k.concat([_l.sent()]));
                        (_c = this.onProgress) === null || _c === void 0 ? void 0 : _c.call(this, TaskType.downloadTs, (i + 1) / segs.length);
                        content = content.replace(segs[i], segName);
                        _l.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7:
                        m3u8 = 'temp.m3u8';
                        this.instance.FS('writeFile', m3u8, content);
                        return [2 /*return*/, m3u8];
                }
            });
        });
    };
    Hls2Mp4.prototype.download = function (url) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var m3u8, data;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.loadFFmeg, 0);
                        return [4 /*yield*/, this.instance.load()];
                    case 1:
                        _e.sent();
                        (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.loadFFmeg, 1);
                        return [4 /*yield*/, this.downloadM3u8(url)];
                    case 2:
                        m3u8 = _e.sent();
                        (_c = this.onProgress) === null || _c === void 0 ? void 0 : _c.call(this, TaskType.mergeTs, 0);
                        return [4 /*yield*/, this.instance.run('-i', m3u8, '-c', 'copy', 'temp.mp4', '-loglevel', 'debug')];
                    case 3:
                        _e.sent();
                        data = this.instance.FS('readFile', 'temp.mp4');
                        this.instance.exit();
                        (_d = this.onProgress) === null || _d === void 0 ? void 0 : _d.call(this, TaskType.mergeTs, 1);
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
    return Hls2Mp4;
}());

export { TaskType, createFileUrlRegExp, Hls2Mp4 as default, parseM3u8File };
