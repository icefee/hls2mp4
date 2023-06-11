var Hls2Mp4 = (function () {
    'use strict';

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
    /* global Reflect, Promise */


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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var mp4Transmuxer = {exports: {}};

    /*! @name mux.js @version 6.3.0 @license Apache-2.0 */

    (function (module, exports) {
    	(function (global, factory) {
    	  module.exports = factory() ;
    	})(commonjsGlobal, (function () {
    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   *
    	   * A lightweight readable stream implemention that handles event dispatching.
    	   * Objects that inherit from streams should call init in their constructors.
    	   */

    	  var Stream = function Stream() {
    	    this.init = function () {
    	      var listeners = {};
    	      /**
    	       * Add a listener for a specified event type.
    	       * @param type {string} the event name
    	       * @param listener {function} the callback to be invoked when an event of
    	       * the specified type occurs
    	       */
    	      this.on = function (type, listener) {
    	        if (!listeners[type]) {
    	          listeners[type] = [];
    	        }
    	        listeners[type] = listeners[type].concat(listener);
    	      };
    	      /**
    	       * Remove a listener for a specified event type.
    	       * @param type {string} the event name
    	       * @param listener {function} a function previously registered for this
    	       * type of event through `on`
    	       */
    	      this.off = function (type, listener) {
    	        var index;
    	        if (!listeners[type]) {
    	          return false;
    	        }
    	        index = listeners[type].indexOf(listener);
    	        listeners[type] = listeners[type].slice();
    	        listeners[type].splice(index, 1);
    	        return index > -1;
    	      };
    	      /**
    	       * Trigger an event of the specified type on this stream. Any additional
    	       * arguments to this function are passed as parameters to event listeners.
    	       * @param type {string} the event name
    	       */
    	      this.trigger = function (type) {
    	        var callbacks, i, length, args;
    	        callbacks = listeners[type];
    	        if (!callbacks) {
    	          return;
    	        }
    	        // Slicing the arguments on every invocation of this method
    	        // can add a significant amount of overhead. Avoid the
    	        // intermediate object creation for the common case of a
    	        // single callback argument
    	        if (arguments.length === 2) {
    	          length = callbacks.length;
    	          for (i = 0; i < length; ++i) {
    	            callbacks[i].call(this, arguments[1]);
    	          }
    	        } else {
    	          args = [];
    	          i = arguments.length;
    	          for (i = 1; i < arguments.length; ++i) {
    	            args.push(arguments[i]);
    	          }
    	          length = callbacks.length;
    	          for (i = 0; i < length; ++i) {
    	            callbacks[i].apply(this, args);
    	          }
    	        }
    	      };
    	      /**
    	       * Destroys the stream and cleans up.
    	       */
    	      this.dispose = function () {
    	        listeners = {};
    	      };
    	    };
    	  };

    	  /**
    	   * Forwards all `data` events on this stream to the destination stream. The
    	   * destination stream should provide a method `push` to receive the data
    	   * events as they arrive.
    	   * @param destination {stream} the stream that will receive all `data` events
    	   * @param autoFlush {boolean} if false, we will not call `flush` on the destination
    	   *                            when the current stream emits a 'done' event
    	   * @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
    	   */
    	  Stream.prototype.pipe = function (destination) {
    	    this.on('data', function (data) {
    	      destination.push(data);
    	    });
    	    this.on('done', function (flushSource) {
    	      destination.flush(flushSource);
    	    });
    	    this.on('partialdone', function (flushSource) {
    	      destination.partialFlush(flushSource);
    	    });
    	    this.on('endedtimeline', function (flushSource) {
    	      destination.endTimeline(flushSource);
    	    });
    	    this.on('reset', function (flushSource) {
    	      destination.reset(flushSource);
    	    });
    	    return destination;
    	  };

    	  // Default stream functions that are expected to be overridden to perform
    	  // actual work. These are provided by the prototype as a sort of no-op
    	  // implementation so that we don't have to check for their existence in the
    	  // `pipe` function above.
    	  Stream.prototype.push = function (data) {
    	    this.trigger('data', data);
    	  };
    	  Stream.prototype.flush = function (flushSource) {
    	    this.trigger('done', flushSource);
    	  };
    	  Stream.prototype.partialFlush = function (flushSource) {
    	    this.trigger('partialdone', flushSource);
    	  };
    	  Stream.prototype.endTimeline = function (flushSource) {
    	    this.trigger('endedtimeline', flushSource);
    	  };
    	  Stream.prototype.reset = function (flushSource) {
    	    this.trigger('reset', flushSource);
    	  };
    	  var stream = Stream;

    	  var MAX_UINT32$1 = Math.pow(2, 32);
    	  var getUint64 = function getUint64(uint8) {
    	    var dv = new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
    	    var value;
    	    if (dv.getBigUint64) {
    	      value = dv.getBigUint64(0);
    	      if (value < Number.MAX_SAFE_INTEGER) {
    	        return Number(value);
    	      }
    	      return value;
    	    }
    	    return dv.getUint32(0) * MAX_UINT32$1 + dv.getUint32(4);
    	  };
    	  var numbers = {
    	    getUint64: getUint64,
    	    MAX_UINT32: MAX_UINT32$1
    	  };

    	  var MAX_UINT32 = numbers.MAX_UINT32;
    	  var box, dinf, esds, ftyp, mdat, mfhd, minf, moof, moov, mvex, mvhd, trak, tkhd, mdia, mdhd, hdlr, sdtp, stbl, stsd, traf, trex, trun, types, MAJOR_BRAND, MINOR_VERSION, AVC1_BRAND, VIDEO_HDLR, AUDIO_HDLR, HDLR_TYPES, VMHD, SMHD, DREF, STCO, STSC, STSZ, STTS;

    	  // pre-calculate constants
    	  (function () {
    	    var i;
    	    types = {
    	      avc1: [],
    	      // codingname
    	      avcC: [],
    	      btrt: [],
    	      dinf: [],
    	      dref: [],
    	      esds: [],
    	      ftyp: [],
    	      hdlr: [],
    	      mdat: [],
    	      mdhd: [],
    	      mdia: [],
    	      mfhd: [],
    	      minf: [],
    	      moof: [],
    	      moov: [],
    	      mp4a: [],
    	      // codingname
    	      mvex: [],
    	      mvhd: [],
    	      pasp: [],
    	      sdtp: [],
    	      smhd: [],
    	      stbl: [],
    	      stco: [],
    	      stsc: [],
    	      stsd: [],
    	      stsz: [],
    	      stts: [],
    	      styp: [],
    	      tfdt: [],
    	      tfhd: [],
    	      traf: [],
    	      trak: [],
    	      trun: [],
    	      trex: [],
    	      tkhd: [],
    	      vmhd: []
    	    };

    	    // In environments where Uint8Array is undefined (e.g., IE8), skip set up so that we
    	    // don't throw an error
    	    if (typeof Uint8Array === 'undefined') {
    	      return;
    	    }
    	    for (i in types) {
    	      if (types.hasOwnProperty(i)) {
    	        types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
    	      }
    	    }
    	    MAJOR_BRAND = new Uint8Array(['i'.charCodeAt(0), 's'.charCodeAt(0), 'o'.charCodeAt(0), 'm'.charCodeAt(0)]);
    	    AVC1_BRAND = new Uint8Array(['a'.charCodeAt(0), 'v'.charCodeAt(0), 'c'.charCodeAt(0), '1'.charCodeAt(0)]);
    	    MINOR_VERSION = new Uint8Array([0, 0, 0, 1]);
    	    VIDEO_HDLR = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x00,
    	    // pre_defined
    	    0x76, 0x69, 0x64, 0x65,
    	    // handler_type: 'vide'
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
    	    ]);

    	    AUDIO_HDLR = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x00,
    	    // pre_defined
    	    0x73, 0x6f, 0x75, 0x6e,
    	    // handler_type: 'soun'
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
    	    ]);

    	    HDLR_TYPES = {
    	      video: VIDEO_HDLR,
    	      audio: AUDIO_HDLR
    	    };
    	    DREF = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x01,
    	    // entry_count
    	    0x00, 0x00, 0x00, 0x0c,
    	    // entry_size
    	    0x75, 0x72, 0x6c, 0x20,
    	    // 'url' type
    	    0x00,
    	    // version 0
    	    0x00, 0x00, 0x01 // entry_flags
    	    ]);

    	    SMHD = new Uint8Array([0x00,
    	    // version
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00,
    	    // balance, 0 means centered
    	    0x00, 0x00 // reserved
    	    ]);

    	    STCO = new Uint8Array([0x00,
    	    // version
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x00 // entry_count
    	    ]);

    	    STSC = STCO;
    	    STSZ = new Uint8Array([0x00,
    	    // version
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x00,
    	    // sample_size
    	    0x00, 0x00, 0x00, 0x00 // sample_count
    	    ]);

    	    STTS = STCO;
    	    VMHD = new Uint8Array([0x00,
    	    // version
    	    0x00, 0x00, 0x01,
    	    // flags
    	    0x00, 0x00,
    	    // graphicsmode
    	    0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
    	    ]);
    	  })();

    	  box = function box(type) {
    	    var payload = [],
    	      size = 0,
    	      i,
    	      result,
    	      view;
    	    for (i = 1; i < arguments.length; i++) {
    	      payload.push(arguments[i]);
    	    }
    	    i = payload.length;

    	    // calculate the total size we need to allocate
    	    while (i--) {
    	      size += payload[i].byteLength;
    	    }
    	    result = new Uint8Array(size + 8);
    	    view = new DataView(result.buffer, result.byteOffset, result.byteLength);
    	    view.setUint32(0, result.byteLength);
    	    result.set(type, 4);

    	    // copy the payload into the result
    	    for (i = 0, size = 8; i < payload.length; i++) {
    	      result.set(payload[i], size);
    	      size += payload[i].byteLength;
    	    }
    	    return result;
    	  };
    	  dinf = function dinf() {
    	    return box(types.dinf, box(types.dref, DREF));
    	  };
    	  esds = function esds(track) {
    	    return box(types.esds, new Uint8Array([0x00,
    	    // version
    	    0x00, 0x00, 0x00,
    	    // flags

    	    // ES_Descriptor
    	    0x03,
    	    // tag, ES_DescrTag
    	    0x19,
    	    // length
    	    0x00, 0x00,
    	    // ES_ID
    	    0x00,
    	    // streamDependenceFlag, URL_flag, reserved, streamPriority

    	    // DecoderConfigDescriptor
    	    0x04,
    	    // tag, DecoderConfigDescrTag
    	    0x11,
    	    // length
    	    0x40,
    	    // object type
    	    0x15,
    	    // streamType
    	    0x00, 0x06, 0x00,
    	    // bufferSizeDB
    	    0x00, 0x00, 0xda, 0xc0,
    	    // maxBitrate
    	    0x00, 0x00, 0xda, 0xc0,
    	    // avgBitrate

    	    // DecoderSpecificInfo
    	    0x05,
    	    // tag, DecoderSpecificInfoTag
    	    0x02,
    	    // length
    	    // ISO/IEC 14496-3, AudioSpecificConfig
    	    // for samplingFrequencyIndex see ISO/IEC 13818-7:2006, 8.1.3.2.2, Table 35
    	    track.audioobjecttype << 3 | track.samplingfrequencyindex >>> 1, track.samplingfrequencyindex << 7 | track.channelcount << 3, 0x06, 0x01, 0x02 // GASpecificConfig
    	    ]));
    	  };

    	  ftyp = function ftyp() {
    	    return box(types.ftyp, MAJOR_BRAND, MINOR_VERSION, MAJOR_BRAND, AVC1_BRAND);
    	  };
    	  hdlr = function hdlr(type) {
    	    return box(types.hdlr, HDLR_TYPES[type]);
    	  };
    	  mdat = function mdat(data) {
    	    return box(types.mdat, data);
    	  };
    	  mdhd = function mdhd(track) {
    	    var result = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x02,
    	    // creation_time
    	    0x00, 0x00, 0x00, 0x03,
    	    // modification_time
    	    0x00, 0x01, 0x5f, 0x90,
    	    // timescale, 90,000 "ticks" per second

    	    track.duration >>> 24 & 0xFF, track.duration >>> 16 & 0xFF, track.duration >>> 8 & 0xFF, track.duration & 0xFF,
    	    // duration
    	    0x55, 0xc4,
    	    // 'und' language (undetermined)
    	    0x00, 0x00]);

    	    // Use the sample rate from the track metadata, when it is
    	    // defined. The sample rate can be parsed out of an ADTS header, for
    	    // instance.
    	    if (track.samplerate) {
    	      result[12] = track.samplerate >>> 24 & 0xFF;
    	      result[13] = track.samplerate >>> 16 & 0xFF;
    	      result[14] = track.samplerate >>> 8 & 0xFF;
    	      result[15] = track.samplerate & 0xFF;
    	    }
    	    return box(types.mdhd, result);
    	  };
    	  mdia = function mdia(track) {
    	    return box(types.mdia, mdhd(track), hdlr(track.type), minf(track));
    	  };
    	  mfhd = function mfhd(sequenceNumber) {
    	    return box(types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00,
    	    // flags
    	    (sequenceNumber & 0xFF000000) >> 24, (sequenceNumber & 0xFF0000) >> 16, (sequenceNumber & 0xFF00) >> 8, sequenceNumber & 0xFF // sequence_number
    	    ]));
    	  };

    	  minf = function minf(track) {
    	    return box(types.minf, track.type === 'video' ? box(types.vmhd, VMHD) : box(types.smhd, SMHD), dinf(), stbl(track));
    	  };
    	  moof = function moof(sequenceNumber, tracks) {
    	    var trackFragments = [],
    	      i = tracks.length;
    	    // build traf boxes for each track fragment
    	    while (i--) {
    	      trackFragments[i] = traf(tracks[i]);
    	    }
    	    return box.apply(null, [types.moof, mfhd(sequenceNumber)].concat(trackFragments));
    	  };
    	  /**
    	   * Returns a movie box.
    	   * @param tracks {array} the tracks associated with this movie
    	   * @see ISO/IEC 14496-12:2012(E), section 8.2.1
    	   */
    	  moov = function moov(tracks, duration) {
    	    var i = tracks.length,
    	      boxes = [];
    	    while (i--) {
    	      boxes[i] = trak(tracks[i]);
    	    }
    	    return box.apply(null, [types.moov, mvhd(duration || 0xffffffff)].concat(boxes).concat(mvex(tracks)));
    	  };
    	  mvex = function mvex(tracks) {
    	    var i = tracks.length,
    	      boxes = [];
    	    while (i--) {
    	      boxes[i] = trex(tracks[i]);
    	    }
    	    return box.apply(null, [types.mvex].concat(boxes));
    	  };
    	  mvhd = function mvhd(duration) {
    	    var bytes = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    0x00, 0x00, 0x00, 0x01,
    	    // creation_time
    	    0x00, 0x00, 0x00, 0x02,
    	    // modification_time
    	    0x00, 0x01, 0x5f, 0x90,
    	    // timescale, 90,000 "ticks" per second
    	    (duration & 0xFF000000) >> 24, (duration & 0xFF0000) >> 16, (duration & 0xFF00) >> 8, duration & 0xFF,
    	    // duration
    	    0x00, 0x01, 0x00, 0x00,
    	    // 1.0 rate
    	    0x01, 0x00,
    	    // 1.0 volume
    	    0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
    	    // transformation: unity matrix
    	    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	    // pre_defined
    	    0xff, 0xff, 0xff, 0xff // next_track_ID
    	    ]);

    	    return box(types.mvhd, bytes);
    	  };
    	  sdtp = function sdtp(track) {
    	    var samples = track.samples || [],
    	      bytes = new Uint8Array(4 + samples.length),
    	      flags,
    	      i;

    	    // leave the full box header (4 bytes) all zero

    	    // write the sample table
    	    for (i = 0; i < samples.length; i++) {
    	      flags = samples[i].flags;
    	      bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
    	    }
    	    return box(types.sdtp, bytes);
    	  };
    	  stbl = function stbl(track) {
    	    return box(types.stbl, stsd(track), box(types.stts, STTS), box(types.stsc, STSC), box(types.stsz, STSZ), box(types.stco, STCO));
    	  };
    	  (function () {
    	    var videoSample, audioSample;
    	    stsd = function stsd(track) {
    	      return box(types.stsd, new Uint8Array([0x00,
    	      // version 0
    	      0x00, 0x00, 0x00,
    	      // flags
    	      0x00, 0x00, 0x00, 0x01]), track.type === 'video' ? videoSample(track) : audioSample(track));
    	    };
    	    videoSample = function videoSample(track) {
    	      var sps = track.sps || [],
    	        pps = track.pps || [],
    	        sequenceParameterSets = [],
    	        pictureParameterSets = [],
    	        i,
    	        avc1Box;

    	      // assemble the SPSs
    	      for (i = 0; i < sps.length; i++) {
    	        sequenceParameterSets.push((sps[i].byteLength & 0xFF00) >>> 8);
    	        sequenceParameterSets.push(sps[i].byteLength & 0xFF); // sequenceParameterSetLength
    	        sequenceParameterSets = sequenceParameterSets.concat(Array.prototype.slice.call(sps[i])); // SPS
    	      }

    	      // assemble the PPSs
    	      for (i = 0; i < pps.length; i++) {
    	        pictureParameterSets.push((pps[i].byteLength & 0xFF00) >>> 8);
    	        pictureParameterSets.push(pps[i].byteLength & 0xFF);
    	        pictureParameterSets = pictureParameterSets.concat(Array.prototype.slice.call(pps[i]));
    	      }
    	      avc1Box = [types.avc1, new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	      // reserved
    	      0x00, 0x01,
    	      // data_reference_index
    	      0x00, 0x00,
    	      // pre_defined
    	      0x00, 0x00,
    	      // reserved
    	      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	      // pre_defined
    	      (track.width & 0xff00) >> 8, track.width & 0xff,
    	      // width
    	      (track.height & 0xff00) >> 8, track.height & 0xff,
    	      // height
    	      0x00, 0x48, 0x00, 0x00,
    	      // horizresolution
    	      0x00, 0x48, 0x00, 0x00,
    	      // vertresolution
    	      0x00, 0x00, 0x00, 0x00,
    	      // reserved
    	      0x00, 0x01,
    	      // frame_count
    	      0x13, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x6a, 0x73, 0x2d, 0x63, 0x6f, 0x6e, 0x74, 0x72, 0x69, 0x62, 0x2d, 0x68, 0x6c, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	      // compressorname
    	      0x00, 0x18,
    	      // depth = 24
    	      0x11, 0x11 // pre_defined = -1
    	      ]), box(types.avcC, new Uint8Array([0x01,
    	      // configurationVersion
    	      track.profileIdc,
    	      // AVCProfileIndication
    	      track.profileCompatibility,
    	      // profile_compatibility
    	      track.levelIdc,
    	      // AVCLevelIndication
    	      0xff // lengthSizeMinusOne, hard-coded to 4 bytes
    	      ].concat([sps.length],
    	      // numOfSequenceParameterSets
    	      sequenceParameterSets,
    	      // "SPS"
    	      [pps.length],
    	      // numOfPictureParameterSets
    	      pictureParameterSets // "PPS"
    	      ))), box(types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80,
    	      // bufferSizeDB
    	      0x00, 0x2d, 0xc6, 0xc0,
    	      // maxBitrate
    	      0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
    	      ]))];

    	      if (track.sarRatio) {
    	        var hSpacing = track.sarRatio[0],
    	          vSpacing = track.sarRatio[1];
    	        avc1Box.push(box(types.pasp, new Uint8Array([(hSpacing & 0xFF000000) >> 24, (hSpacing & 0xFF0000) >> 16, (hSpacing & 0xFF00) >> 8, hSpacing & 0xFF, (vSpacing & 0xFF000000) >> 24, (vSpacing & 0xFF0000) >> 16, (vSpacing & 0xFF00) >> 8, vSpacing & 0xFF])));
    	      }
    	      return box.apply(null, avc1Box);
    	    };
    	    audioSample = function audioSample(track) {
    	      return box(types.mp4a, new Uint8Array([
    	      // SampleEntry, ISO/IEC 14496-12
    	      0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	      // reserved
    	      0x00, 0x01,
    	      // data_reference_index

    	      // AudioSampleEntry, ISO/IEC 14496-12
    	      0x00, 0x00, 0x00, 0x00,
    	      // reserved
    	      0x00, 0x00, 0x00, 0x00,
    	      // reserved
    	      (track.channelcount & 0xff00) >> 8, track.channelcount & 0xff,
    	      // channelcount

    	      (track.samplesize & 0xff00) >> 8, track.samplesize & 0xff,
    	      // samplesize
    	      0x00, 0x00,
    	      // pre_defined
    	      0x00, 0x00,
    	      // reserved

    	      (track.samplerate & 0xff00) >> 8, track.samplerate & 0xff, 0x00, 0x00 // samplerate, 16.16

    	      // MP4AudioSampleEntry, ISO/IEC 14496-14
    	      ]), esds(track));
    	    };
    	  })();
    	  tkhd = function tkhd(track) {
    	    var result = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x07,
    	    // flags
    	    0x00, 0x00, 0x00, 0x00,
    	    // creation_time
    	    0x00, 0x00, 0x00, 0x00,
    	    // modification_time
    	    (track.id & 0xFF000000) >> 24, (track.id & 0xFF0000) >> 16, (track.id & 0xFF00) >> 8, track.id & 0xFF,
    	    // track_ID
    	    0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    (track.duration & 0xFF000000) >> 24, (track.duration & 0xFF0000) >> 16, (track.duration & 0xFF00) >> 8, track.duration & 0xFF,
    	    // duration
    	    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    	    // reserved
    	    0x00, 0x00,
    	    // layer
    	    0x00, 0x00,
    	    // alternate_group
    	    0x01, 0x00,
    	    // non-audio track volume
    	    0x00, 0x00,
    	    // reserved
    	    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
    	    // transformation: unity matrix
    	    (track.width & 0xFF00) >> 8, track.width & 0xFF, 0x00, 0x00,
    	    // width
    	    (track.height & 0xFF00) >> 8, track.height & 0xFF, 0x00, 0x00 // height
    	    ]);

    	    return box(types.tkhd, result);
    	  };

    	  /**
    	   * Generate a track fragment (traf) box. A traf box collects metadata
    	   * about tracks in a movie fragment (moof) box.
    	   */
    	  traf = function traf(track) {
    	    var trackFragmentHeader, trackFragmentDecodeTime, trackFragmentRun, sampleDependencyTable, dataOffset, upperWordBaseMediaDecodeTime, lowerWordBaseMediaDecodeTime;
    	    trackFragmentHeader = box(types.tfhd, new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x3a,
    	    // flags
    	    (track.id & 0xFF000000) >> 24, (track.id & 0xFF0000) >> 16, (track.id & 0xFF00) >> 8, track.id & 0xFF,
    	    // track_ID
    	    0x00, 0x00, 0x00, 0x01,
    	    // sample_description_index
    	    0x00, 0x00, 0x00, 0x00,
    	    // default_sample_duration
    	    0x00, 0x00, 0x00, 0x00,
    	    // default_sample_size
    	    0x00, 0x00, 0x00, 0x00 // default_sample_flags
    	    ]));

    	    upperWordBaseMediaDecodeTime = Math.floor(track.baseMediaDecodeTime / MAX_UINT32);
    	    lowerWordBaseMediaDecodeTime = Math.floor(track.baseMediaDecodeTime % MAX_UINT32);
    	    trackFragmentDecodeTime = box(types.tfdt, new Uint8Array([0x01,
    	    // version 1
    	    0x00, 0x00, 0x00,
    	    // flags
    	    // baseMediaDecodeTime
    	    upperWordBaseMediaDecodeTime >>> 24 & 0xFF, upperWordBaseMediaDecodeTime >>> 16 & 0xFF, upperWordBaseMediaDecodeTime >>> 8 & 0xFF, upperWordBaseMediaDecodeTime & 0xFF, lowerWordBaseMediaDecodeTime >>> 24 & 0xFF, lowerWordBaseMediaDecodeTime >>> 16 & 0xFF, lowerWordBaseMediaDecodeTime >>> 8 & 0xFF, lowerWordBaseMediaDecodeTime & 0xFF]));

    	    // the data offset specifies the number of bytes from the start of
    	    // the containing moof to the first payload byte of the associated
    	    // mdat
    	    dataOffset = 32 +
    	    // tfhd
    	    20 +
    	    // tfdt
    	    8 +
    	    // traf header
    	    16 +
    	    // mfhd
    	    8 +
    	    // moof header
    	    8; // mdat header

    	    // audio tracks require less metadata
    	    if (track.type === 'audio') {
    	      trackFragmentRun = trun(track, dataOffset);
    	      return box(types.traf, trackFragmentHeader, trackFragmentDecodeTime, trackFragmentRun);
    	    }

    	    // video tracks should contain an independent and disposable samples
    	    // box (sdtp)
    	    // generate one and adjust offsets to match
    	    sampleDependencyTable = sdtp(track);
    	    trackFragmentRun = trun(track, sampleDependencyTable.length + dataOffset);
    	    return box(types.traf, trackFragmentHeader, trackFragmentDecodeTime, trackFragmentRun, sampleDependencyTable);
    	  };

    	  /**
    	   * Generate a track box.
    	   * @param track {object} a track definition
    	   * @return {Uint8Array} the track box
    	   */
    	  trak = function trak(track) {
    	    track.duration = track.duration || 0xffffffff;
    	    return box(types.trak, tkhd(track), mdia(track));
    	  };
    	  trex = function trex(track) {
    	    var result = new Uint8Array([0x00,
    	    // version 0
    	    0x00, 0x00, 0x00,
    	    // flags
    	    (track.id & 0xFF000000) >> 24, (track.id & 0xFF0000) >> 16, (track.id & 0xFF00) >> 8, track.id & 0xFF,
    	    // track_ID
    	    0x00, 0x00, 0x00, 0x01,
    	    // default_sample_description_index
    	    0x00, 0x00, 0x00, 0x00,
    	    // default_sample_duration
    	    0x00, 0x00, 0x00, 0x00,
    	    // default_sample_size
    	    0x00, 0x01, 0x00, 0x01 // default_sample_flags
    	    ]);
    	    // the last two bytes of default_sample_flags is the sample
    	    // degradation priority, a hint about the importance of this sample
    	    // relative to others. Lower the degradation priority for all sample
    	    // types other than video.
    	    if (track.type !== 'video') {
    	      result[result.length - 1] = 0x00;
    	    }
    	    return box(types.trex, result);
    	  };
    	  (function () {
    	    var audioTrun, videoTrun, trunHeader;

    	    // This method assumes all samples are uniform. That is, if a
    	    // duration is present for the first sample, it will be present for
    	    // all subsequent samples.
    	    // see ISO/IEC 14496-12:2012, Section 8.8.8.1
    	    trunHeader = function trunHeader(samples, offset) {
    	      var durationPresent = 0,
    	        sizePresent = 0,
    	        flagsPresent = 0,
    	        compositionTimeOffset = 0;

    	      // trun flag constants
    	      if (samples.length) {
    	        if (samples[0].duration !== undefined) {
    	          durationPresent = 0x1;
    	        }
    	        if (samples[0].size !== undefined) {
    	          sizePresent = 0x2;
    	        }
    	        if (samples[0].flags !== undefined) {
    	          flagsPresent = 0x4;
    	        }
    	        if (samples[0].compositionTimeOffset !== undefined) {
    	          compositionTimeOffset = 0x8;
    	        }
    	      }
    	      return [0x00,
    	      // version 0
    	      0x00, durationPresent | sizePresent | flagsPresent | compositionTimeOffset, 0x01,
    	      // flags
    	      (samples.length & 0xFF000000) >>> 24, (samples.length & 0xFF0000) >>> 16, (samples.length & 0xFF00) >>> 8, samples.length & 0xFF,
    	      // sample_count
    	      (offset & 0xFF000000) >>> 24, (offset & 0xFF0000) >>> 16, (offset & 0xFF00) >>> 8, offset & 0xFF // data_offset
    	      ];
    	    };

    	    videoTrun = function videoTrun(track, offset) {
    	      var bytesOffest, bytes, header, samples, sample, i;
    	      samples = track.samples || [];
    	      offset += 8 + 12 + 16 * samples.length;
    	      header = trunHeader(samples, offset);
    	      bytes = new Uint8Array(header.length + samples.length * 16);
    	      bytes.set(header);
    	      bytesOffest = header.length;
    	      for (i = 0; i < samples.length; i++) {
    	        sample = samples[i];
    	        bytes[bytesOffest++] = (sample.duration & 0xFF000000) >>> 24;
    	        bytes[bytesOffest++] = (sample.duration & 0xFF0000) >>> 16;
    	        bytes[bytesOffest++] = (sample.duration & 0xFF00) >>> 8;
    	        bytes[bytesOffest++] = sample.duration & 0xFF; // sample_duration
    	        bytes[bytesOffest++] = (sample.size & 0xFF000000) >>> 24;
    	        bytes[bytesOffest++] = (sample.size & 0xFF0000) >>> 16;
    	        bytes[bytesOffest++] = (sample.size & 0xFF00) >>> 8;
    	        bytes[bytesOffest++] = sample.size & 0xFF; // sample_size
    	        bytes[bytesOffest++] = sample.flags.isLeading << 2 | sample.flags.dependsOn;
    	        bytes[bytesOffest++] = sample.flags.isDependedOn << 6 | sample.flags.hasRedundancy << 4 | sample.flags.paddingValue << 1 | sample.flags.isNonSyncSample;
    	        bytes[bytesOffest++] = sample.flags.degradationPriority & 0xF0 << 8;
    	        bytes[bytesOffest++] = sample.flags.degradationPriority & 0x0F; // sample_flags
    	        bytes[bytesOffest++] = (sample.compositionTimeOffset & 0xFF000000) >>> 24;
    	        bytes[bytesOffest++] = (sample.compositionTimeOffset & 0xFF0000) >>> 16;
    	        bytes[bytesOffest++] = (sample.compositionTimeOffset & 0xFF00) >>> 8;
    	        bytes[bytesOffest++] = sample.compositionTimeOffset & 0xFF; // sample_composition_time_offset
    	      }

    	      return box(types.trun, bytes);
    	    };
    	    audioTrun = function audioTrun(track, offset) {
    	      var bytes, bytesOffest, header, samples, sample, i;
    	      samples = track.samples || [];
    	      offset += 8 + 12 + 8 * samples.length;
    	      header = trunHeader(samples, offset);
    	      bytes = new Uint8Array(header.length + samples.length * 8);
    	      bytes.set(header);
    	      bytesOffest = header.length;
    	      for (i = 0; i < samples.length; i++) {
    	        sample = samples[i];
    	        bytes[bytesOffest++] = (sample.duration & 0xFF000000) >>> 24;
    	        bytes[bytesOffest++] = (sample.duration & 0xFF0000) >>> 16;
    	        bytes[bytesOffest++] = (sample.duration & 0xFF00) >>> 8;
    	        bytes[bytesOffest++] = sample.duration & 0xFF; // sample_duration
    	        bytes[bytesOffest++] = (sample.size & 0xFF000000) >>> 24;
    	        bytes[bytesOffest++] = (sample.size & 0xFF0000) >>> 16;
    	        bytes[bytesOffest++] = (sample.size & 0xFF00) >>> 8;
    	        bytes[bytesOffest++] = sample.size & 0xFF; // sample_size
    	      }

    	      return box(types.trun, bytes);
    	    };
    	    trun = function trun(track, offset) {
    	      if (track.type === 'audio') {
    	        return audioTrun(track, offset);
    	      }
    	      return videoTrun(track, offset);
    	    };
    	  })();
    	  var mp4Generator = {
    	    ftyp: ftyp,
    	    mdat: mdat,
    	    moof: moof,
    	    moov: moov,
    	    initSegment: function initSegment(tracks) {
    	      var duration = 0;
    	      for (var i = 0; i < tracks.length; i++) {
    	        if (tracks[i].type === 'video') {
    	          duration = tracks[i].duration;
    	        }
    	      }
    	      var fileType = ftyp(),
    	        movie = moov(tracks, duration),
    	        result;
    	      result = new Uint8Array(fileType.byteLength + movie.byteLength);
    	      result.set(fileType);
    	      result.set(movie, fileType.byteLength);
    	      return result;
    	    }
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */
    	  // Convert an array of nal units into an array of frames with each frame being
    	  // composed of the nal units that make up that frame
    	  // Also keep track of cummulative data about the frame from the nal units such
    	  // as the frame duration, starting pts, etc.
    	  var groupNalsIntoFrames = function groupNalsIntoFrames(nalUnits) {
    	    var i,
    	      currentNal,
    	      currentFrame = [],
    	      frames = [];

    	    // TODO added for LHLS, make sure this is OK
    	    frames.byteLength = 0;
    	    frames.nalCount = 0;
    	    frames.duration = 0;
    	    currentFrame.byteLength = 0;
    	    for (i = 0; i < nalUnits.length; i++) {
    	      currentNal = nalUnits[i];

    	      // Split on 'aud'-type nal units
    	      if (currentNal.nalUnitType === 'access_unit_delimiter_rbsp') {
    	        // Since the very first nal unit is expected to be an AUD
    	        // only push to the frames array when currentFrame is not empty
    	        if (currentFrame.length) {
    	          currentFrame.duration = currentNal.dts - currentFrame.dts;
    	          // TODO added for LHLS, make sure this is OK
    	          frames.byteLength += currentFrame.byteLength;
    	          frames.nalCount += currentFrame.length;
    	          frames.duration += currentFrame.duration;
    	          frames.push(currentFrame);
    	        }
    	        currentFrame = [currentNal];
    	        currentFrame.byteLength = currentNal.data.byteLength;
    	        currentFrame.pts = currentNal.pts;
    	        currentFrame.dts = currentNal.dts;
    	      } else {
    	        // Specifically flag key frames for ease of use later
    	        if (currentNal.nalUnitType === 'slice_layer_without_partitioning_rbsp_idr') {
    	          currentFrame.keyFrame = true;
    	        }
    	        currentFrame.duration = currentNal.dts - currentFrame.dts;
    	        currentFrame.byteLength += currentNal.data.byteLength;
    	        currentFrame.push(currentNal);
    	      }
    	    }

    	    // For the last frame, use the duration of the previous frame if we
    	    // have nothing better to go on
    	    if (frames.length && (!currentFrame.duration || currentFrame.duration <= 0)) {
    	      currentFrame.duration = frames[frames.length - 1].duration;
    	    }

    	    // Push the final frame
    	    // TODO added for LHLS, make sure this is OK
    	    frames.byteLength += currentFrame.byteLength;
    	    frames.nalCount += currentFrame.length;
    	    frames.duration += currentFrame.duration;
    	    frames.push(currentFrame);
    	    return frames;
    	  };

    	  // Convert an array of frames into an array of Gop with each Gop being composed
    	  // of the frames that make up that Gop
    	  // Also keep track of cummulative data about the Gop from the frames such as the
    	  // Gop duration, starting pts, etc.
    	  var groupFramesIntoGops = function groupFramesIntoGops(frames) {
    	    var i,
    	      currentFrame,
    	      currentGop = [],
    	      gops = [];

    	    // We must pre-set some of the values on the Gop since we
    	    // keep running totals of these values
    	    currentGop.byteLength = 0;
    	    currentGop.nalCount = 0;
    	    currentGop.duration = 0;
    	    currentGop.pts = frames[0].pts;
    	    currentGop.dts = frames[0].dts;

    	    // store some metadata about all the Gops
    	    gops.byteLength = 0;
    	    gops.nalCount = 0;
    	    gops.duration = 0;
    	    gops.pts = frames[0].pts;
    	    gops.dts = frames[0].dts;
    	    for (i = 0; i < frames.length; i++) {
    	      currentFrame = frames[i];
    	      if (currentFrame.keyFrame) {
    	        // Since the very first frame is expected to be an keyframe
    	        // only push to the gops array when currentGop is not empty
    	        if (currentGop.length) {
    	          gops.push(currentGop);
    	          gops.byteLength += currentGop.byteLength;
    	          gops.nalCount += currentGop.nalCount;
    	          gops.duration += currentGop.duration;
    	        }
    	        currentGop = [currentFrame];
    	        currentGop.nalCount = currentFrame.length;
    	        currentGop.byteLength = currentFrame.byteLength;
    	        currentGop.pts = currentFrame.pts;
    	        currentGop.dts = currentFrame.dts;
    	        currentGop.duration = currentFrame.duration;
    	      } else {
    	        currentGop.duration += currentFrame.duration;
    	        currentGop.nalCount += currentFrame.length;
    	        currentGop.byteLength += currentFrame.byteLength;
    	        currentGop.push(currentFrame);
    	      }
    	    }
    	    if (gops.length && currentGop.duration <= 0) {
    	      currentGop.duration = gops[gops.length - 1].duration;
    	    }
    	    gops.byteLength += currentGop.byteLength;
    	    gops.nalCount += currentGop.nalCount;
    	    gops.duration += currentGop.duration;

    	    // push the final Gop
    	    gops.push(currentGop);
    	    return gops;
    	  };

    	  /*
    	   * Search for the first keyframe in the GOPs and throw away all frames
    	   * until that keyframe. Then extend the duration of the pulled keyframe
    	   * and pull the PTS and DTS of the keyframe so that it covers the time
    	   * range of the frames that were disposed.
    	   *
    	   * @param {Array} gops video GOPs
    	   * @returns {Array} modified video GOPs
    	   */
    	  var extendFirstKeyFrame = function extendFirstKeyFrame(gops) {
    	    var currentGop;
    	    if (!gops[0][0].keyFrame && gops.length > 1) {
    	      // Remove the first GOP
    	      currentGop = gops.shift();
    	      gops.byteLength -= currentGop.byteLength;
    	      gops.nalCount -= currentGop.nalCount;

    	      // Extend the first frame of what is now the
    	      // first gop to cover the time period of the
    	      // frames we just removed
    	      gops[0][0].dts = currentGop.dts;
    	      gops[0][0].pts = currentGop.pts;
    	      gops[0][0].duration += currentGop.duration;
    	    }
    	    return gops;
    	  };

    	  /**
    	   * Default sample object
    	   * see ISO/IEC 14496-12:2012, section 8.6.4.3
    	   */
    	  var createDefaultSample = function createDefaultSample() {
    	    return {
    	      size: 0,
    	      flags: {
    	        isLeading: 0,
    	        dependsOn: 1,
    	        isDependedOn: 0,
    	        hasRedundancy: 0,
    	        degradationPriority: 0,
    	        isNonSyncSample: 1
    	      }
    	    };
    	  };

    	  /*
    	   * Collates information from a video frame into an object for eventual
    	   * entry into an MP4 sample table.
    	   *
    	   * @param {Object} frame the video frame
    	   * @param {Number} dataOffset the byte offset to position the sample
    	   * @return {Object} object containing sample table info for a frame
    	   */
    	  var sampleForFrame = function sampleForFrame(frame, dataOffset) {
    	    var sample = createDefaultSample();
    	    sample.dataOffset = dataOffset;
    	    sample.compositionTimeOffset = frame.pts - frame.dts;
    	    sample.duration = frame.duration;
    	    sample.size = 4 * frame.length; // Space for nal unit size
    	    sample.size += frame.byteLength;
    	    if (frame.keyFrame) {
    	      sample.flags.dependsOn = 2;
    	      sample.flags.isNonSyncSample = 0;
    	    }
    	    return sample;
    	  };

    	  // generate the track's sample table from an array of gops
    	  var generateSampleTable$1 = function generateSampleTable(gops, baseDataOffset) {
    	    var h,
    	      i,
    	      sample,
    	      currentGop,
    	      currentFrame,
    	      dataOffset = baseDataOffset || 0,
    	      samples = [];
    	    for (h = 0; h < gops.length; h++) {
    	      currentGop = gops[h];
    	      for (i = 0; i < currentGop.length; i++) {
    	        currentFrame = currentGop[i];
    	        sample = sampleForFrame(currentFrame, dataOffset);
    	        dataOffset += sample.size;
    	        samples.push(sample);
    	      }
    	    }
    	    return samples;
    	  };

    	  // generate the track's raw mdat data from an array of gops
    	  var concatenateNalData = function concatenateNalData(gops) {
    	    var h,
    	      i,
    	      j,
    	      currentGop,
    	      currentFrame,
    	      currentNal,
    	      dataOffset = 0,
    	      nalsByteLength = gops.byteLength,
    	      numberOfNals = gops.nalCount,
    	      totalByteLength = nalsByteLength + 4 * numberOfNals,
    	      data = new Uint8Array(totalByteLength),
    	      view = new DataView(data.buffer);

    	    // For each Gop..
    	    for (h = 0; h < gops.length; h++) {
    	      currentGop = gops[h];

    	      // For each Frame..
    	      for (i = 0; i < currentGop.length; i++) {
    	        currentFrame = currentGop[i];

    	        // For each NAL..
    	        for (j = 0; j < currentFrame.length; j++) {
    	          currentNal = currentFrame[j];
    	          view.setUint32(dataOffset, currentNal.data.byteLength);
    	          dataOffset += 4;
    	          data.set(currentNal.data, dataOffset);
    	          dataOffset += currentNal.data.byteLength;
    	        }
    	      }
    	    }
    	    return data;
    	  };

    	  // generate the track's sample table from a frame
    	  var generateSampleTableForFrame = function generateSampleTableForFrame(frame, baseDataOffset) {
    	    var sample,
    	      dataOffset = baseDataOffset || 0,
    	      samples = [];
    	    sample = sampleForFrame(frame, dataOffset);
    	    samples.push(sample);
    	    return samples;
    	  };

    	  // generate the track's raw mdat data from a frame
    	  var concatenateNalDataForFrame = function concatenateNalDataForFrame(frame) {
    	    var i,
    	      currentNal,
    	      dataOffset = 0,
    	      nalsByteLength = frame.byteLength,
    	      numberOfNals = frame.length,
    	      totalByteLength = nalsByteLength + 4 * numberOfNals,
    	      data = new Uint8Array(totalByteLength),
    	      view = new DataView(data.buffer);

    	    // For each NAL..
    	    for (i = 0; i < frame.length; i++) {
    	      currentNal = frame[i];
    	      view.setUint32(dataOffset, currentNal.data.byteLength);
    	      dataOffset += 4;
    	      data.set(currentNal.data, dataOffset);
    	      dataOffset += currentNal.data.byteLength;
    	    }
    	    return data;
    	  };
    	  var frameUtils = {
    	    groupNalsIntoFrames: groupNalsIntoFrames,
    	    groupFramesIntoGops: groupFramesIntoGops,
    	    extendFirstKeyFrame: extendFirstKeyFrame,
    	    generateSampleTable: generateSampleTable$1,
    	    concatenateNalData: concatenateNalData,
    	    generateSampleTableForFrame: generateSampleTableForFrame,
    	    concatenateNalDataForFrame: concatenateNalDataForFrame
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */
    	  var highPrefix = [33, 16, 5, 32, 164, 27];
    	  var lowPrefix = [33, 65, 108, 84, 1, 2, 4, 8, 168, 2, 4, 8, 17, 191, 252];
    	  var zeroFill = function zeroFill(count) {
    	    var a = [];
    	    while (count--) {
    	      a.push(0);
    	    }
    	    return a;
    	  };
    	  var makeTable = function makeTable(metaTable) {
    	    return Object.keys(metaTable).reduce(function (obj, key) {
    	      obj[key] = new Uint8Array(metaTable[key].reduce(function (arr, part) {
    	        return arr.concat(part);
    	      }, []));
    	      return obj;
    	    }, {});
    	  };
    	  var silence;
    	  var silence_1 = function silence_1() {
    	    if (!silence) {
    	      // Frames-of-silence to use for filling in missing AAC frames
    	      var coneOfSilence = {
    	        96000: [highPrefix, [227, 64], zeroFill(154), [56]],
    	        88200: [highPrefix, [231], zeroFill(170), [56]],
    	        64000: [highPrefix, [248, 192], zeroFill(240), [56]],
    	        48000: [highPrefix, [255, 192], zeroFill(268), [55, 148, 128], zeroFill(54), [112]],
    	        44100: [highPrefix, [255, 192], zeroFill(268), [55, 163, 128], zeroFill(84), [112]],
    	        32000: [highPrefix, [255, 192], zeroFill(268), [55, 234], zeroFill(226), [112]],
    	        24000: [highPrefix, [255, 192], zeroFill(268), [55, 255, 128], zeroFill(268), [111, 112], zeroFill(126), [224]],
    	        16000: [highPrefix, [255, 192], zeroFill(268), [55, 255, 128], zeroFill(268), [111, 255], zeroFill(269), [223, 108], zeroFill(195), [1, 192]],
    	        12000: [lowPrefix, zeroFill(268), [3, 127, 248], zeroFill(268), [6, 255, 240], zeroFill(268), [13, 255, 224], zeroFill(268), [27, 253, 128], zeroFill(259), [56]],
    	        11025: [lowPrefix, zeroFill(268), [3, 127, 248], zeroFill(268), [6, 255, 240], zeroFill(268), [13, 255, 224], zeroFill(268), [27, 255, 192], zeroFill(268), [55, 175, 128], zeroFill(108), [112]],
    	        8000: [lowPrefix, zeroFill(268), [3, 121, 16], zeroFill(47), [7]]
    	      };
    	      silence = makeTable(coneOfSilence);
    	    }
    	    return silence;
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */
    	  var ONE_SECOND_IN_TS$3 = 90000,
    	    // 90kHz clock
    	    secondsToVideoTs,
    	    secondsToAudioTs,
    	    videoTsToSeconds,
    	    audioTsToSeconds,
    	    audioTsToVideoTs,
    	    videoTsToAudioTs,
    	    metadataTsToSeconds;
    	  secondsToVideoTs = function secondsToVideoTs(seconds) {
    	    return seconds * ONE_SECOND_IN_TS$3;
    	  };
    	  secondsToAudioTs = function secondsToAudioTs(seconds, sampleRate) {
    	    return seconds * sampleRate;
    	  };
    	  videoTsToSeconds = function videoTsToSeconds(timestamp) {
    	    return timestamp / ONE_SECOND_IN_TS$3;
    	  };
    	  audioTsToSeconds = function audioTsToSeconds(timestamp, sampleRate) {
    	    return timestamp / sampleRate;
    	  };
    	  audioTsToVideoTs = function audioTsToVideoTs(timestamp, sampleRate) {
    	    return secondsToVideoTs(audioTsToSeconds(timestamp, sampleRate));
    	  };
    	  videoTsToAudioTs = function videoTsToAudioTs(timestamp, sampleRate) {
    	    return secondsToAudioTs(videoTsToSeconds(timestamp), sampleRate);
    	  };

    	  /**
    	   * Adjust ID3 tag or caption timing information by the timeline pts values
    	   * (if keepOriginalTimestamps is false) and convert to seconds
    	   */
    	  metadataTsToSeconds = function metadataTsToSeconds(timestamp, timelineStartPts, keepOriginalTimestamps) {
    	    return videoTsToSeconds(keepOriginalTimestamps ? timestamp : timestamp - timelineStartPts);
    	  };
    	  var clock = {
    	    ONE_SECOND_IN_TS: ONE_SECOND_IN_TS$3,
    	    secondsToVideoTs: secondsToVideoTs,
    	    secondsToAudioTs: secondsToAudioTs,
    	    videoTsToSeconds: videoTsToSeconds,
    	    audioTsToSeconds: audioTsToSeconds,
    	    audioTsToVideoTs: audioTsToVideoTs,
    	    videoTsToAudioTs: videoTsToAudioTs,
    	    metadataTsToSeconds: metadataTsToSeconds
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */

    	  /**
    	   * Sum the `byteLength` properties of the data in each AAC frame
    	   */
    	  var sumFrameByteLengths = function sumFrameByteLengths(array) {
    	    var i,
    	      currentObj,
    	      sum = 0;

    	    // sum the byteLength's all each nal unit in the frame
    	    for (i = 0; i < array.length; i++) {
    	      currentObj = array[i];
    	      sum += currentObj.data.byteLength;
    	    }
    	    return sum;
    	  };

    	  // Possibly pad (prefix) the audio track with silence if appending this track
    	  // would lead to the introduction of a gap in the audio buffer
    	  var prefixWithSilence = function prefixWithSilence(track, frames, audioAppendStartTs, videoBaseMediaDecodeTime) {
    	    var baseMediaDecodeTimeTs,
    	      frameDuration = 0,
    	      audioGapDuration = 0,
    	      audioFillFrameCount = 0,
    	      audioFillDuration = 0,
    	      silentFrame,
    	      i,
    	      firstFrame;
    	    if (!frames.length) {
    	      return;
    	    }
    	    baseMediaDecodeTimeTs = clock.audioTsToVideoTs(track.baseMediaDecodeTime, track.samplerate);
    	    // determine frame clock duration based on sample rate, round up to avoid overfills
    	    frameDuration = Math.ceil(clock.ONE_SECOND_IN_TS / (track.samplerate / 1024));
    	    if (audioAppendStartTs && videoBaseMediaDecodeTime) {
    	      // insert the shortest possible amount (audio gap or audio to video gap)
    	      audioGapDuration = baseMediaDecodeTimeTs - Math.max(audioAppendStartTs, videoBaseMediaDecodeTime);
    	      // number of full frames in the audio gap
    	      audioFillFrameCount = Math.floor(audioGapDuration / frameDuration);
    	      audioFillDuration = audioFillFrameCount * frameDuration;
    	    }

    	    // don't attempt to fill gaps smaller than a single frame or larger
    	    // than a half second
    	    if (audioFillFrameCount < 1 || audioFillDuration > clock.ONE_SECOND_IN_TS / 2) {
    	      return;
    	    }
    	    silentFrame = silence_1()[track.samplerate];
    	    if (!silentFrame) {
    	      // we don't have a silent frame pregenerated for the sample rate, so use a frame
    	      // from the content instead
    	      silentFrame = frames[0].data;
    	    }
    	    for (i = 0; i < audioFillFrameCount; i++) {
    	      firstFrame = frames[0];
    	      frames.splice(0, 0, {
    	        data: silentFrame,
    	        dts: firstFrame.dts - frameDuration,
    	        pts: firstFrame.pts - frameDuration
    	      });
    	    }
    	    track.baseMediaDecodeTime -= Math.floor(clock.videoTsToAudioTs(audioFillDuration, track.samplerate));
    	    return audioFillDuration;
    	  };

    	  // If the audio segment extends before the earliest allowed dts
    	  // value, remove AAC frames until starts at or after the earliest
    	  // allowed DTS so that we don't end up with a negative baseMedia-
    	  // DecodeTime for the audio track
    	  var trimAdtsFramesByEarliestDts = function trimAdtsFramesByEarliestDts(adtsFrames, track, earliestAllowedDts) {
    	    if (track.minSegmentDts >= earliestAllowedDts) {
    	      return adtsFrames;
    	    }

    	    // We will need to recalculate the earliest segment Dts
    	    track.minSegmentDts = Infinity;
    	    return adtsFrames.filter(function (currentFrame) {
    	      // If this is an allowed frame, keep it and record it's Dts
    	      if (currentFrame.dts >= earliestAllowedDts) {
    	        track.minSegmentDts = Math.min(track.minSegmentDts, currentFrame.dts);
    	        track.minSegmentPts = track.minSegmentDts;
    	        return true;
    	      }
    	      // Otherwise, discard it
    	      return false;
    	    });
    	  };

    	  // generate the track's raw mdat data from an array of frames
    	  var generateSampleTable = function generateSampleTable(frames) {
    	    var i,
    	      currentFrame,
    	      samples = [];
    	    for (i = 0; i < frames.length; i++) {
    	      currentFrame = frames[i];
    	      samples.push({
    	        size: currentFrame.data.byteLength,
    	        duration: 1024 // For AAC audio, all samples contain 1024 samples
    	      });
    	    }

    	    return samples;
    	  };

    	  // generate the track's sample table from an array of frames
    	  var concatenateFrameData = function concatenateFrameData(frames) {
    	    var i,
    	      currentFrame,
    	      dataOffset = 0,
    	      data = new Uint8Array(sumFrameByteLengths(frames));
    	    for (i = 0; i < frames.length; i++) {
    	      currentFrame = frames[i];
    	      data.set(currentFrame.data, dataOffset);
    	      dataOffset += currentFrame.data.byteLength;
    	    }
    	    return data;
    	  };
    	  var audioFrameUtils = {
    	    prefixWithSilence: prefixWithSilence,
    	    trimAdtsFramesByEarliestDts: trimAdtsFramesByEarliestDts,
    	    generateSampleTable: generateSampleTable,
    	    concatenateFrameData: concatenateFrameData
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */
    	  var ONE_SECOND_IN_TS$2 = clock.ONE_SECOND_IN_TS;

    	  /**
    	   * Store information about the start and end of the track and the
    	   * duration for each frame/sample we process in order to calculate
    	   * the baseMediaDecodeTime
    	   */
    	  var collectDtsInfo = function collectDtsInfo(track, data) {
    	    if (typeof data.pts === 'number') {
    	      if (track.timelineStartInfo.pts === undefined) {
    	        track.timelineStartInfo.pts = data.pts;
    	      }
    	      if (track.minSegmentPts === undefined) {
    	        track.minSegmentPts = data.pts;
    	      } else {
    	        track.minSegmentPts = Math.min(track.minSegmentPts, data.pts);
    	      }
    	      if (track.maxSegmentPts === undefined) {
    	        track.maxSegmentPts = data.pts;
    	      } else {
    	        track.maxSegmentPts = Math.max(track.maxSegmentPts, data.pts);
    	      }
    	    }
    	    if (typeof data.dts === 'number') {
    	      if (track.timelineStartInfo.dts === undefined) {
    	        track.timelineStartInfo.dts = data.dts;
    	      }
    	      if (track.minSegmentDts === undefined) {
    	        track.minSegmentDts = data.dts;
    	      } else {
    	        track.minSegmentDts = Math.min(track.minSegmentDts, data.dts);
    	      }
    	      if (track.maxSegmentDts === undefined) {
    	        track.maxSegmentDts = data.dts;
    	      } else {
    	        track.maxSegmentDts = Math.max(track.maxSegmentDts, data.dts);
    	      }
    	    }
    	  };

    	  /**
    	   * Clear values used to calculate the baseMediaDecodeTime between
    	   * tracks
    	   */
    	  var clearDtsInfo = function clearDtsInfo(track) {
    	    delete track.minSegmentDts;
    	    delete track.maxSegmentDts;
    	    delete track.minSegmentPts;
    	    delete track.maxSegmentPts;
    	  };

    	  /**
    	   * Calculate the track's baseMediaDecodeTime based on the earliest
    	   * DTS the transmuxer has ever seen and the minimum DTS for the
    	   * current track
    	   * @param track {object} track metadata configuration
    	   * @param keepOriginalTimestamps {boolean} If true, keep the timestamps
    	   *        in the source; false to adjust the first segment to start at 0.
    	   */
    	  var calculateTrackBaseMediaDecodeTime = function calculateTrackBaseMediaDecodeTime(track, keepOriginalTimestamps) {
    	    var baseMediaDecodeTime,
    	      scale,
    	      minSegmentDts = track.minSegmentDts;

    	    // Optionally adjust the time so the first segment starts at zero.
    	    if (!keepOriginalTimestamps) {
    	      minSegmentDts -= track.timelineStartInfo.dts;
    	    }

    	    // track.timelineStartInfo.baseMediaDecodeTime is the location, in time, where
    	    // we want the start of the first segment to be placed
    	    baseMediaDecodeTime = track.timelineStartInfo.baseMediaDecodeTime;

    	    // Add to that the distance this segment is from the very first
    	    baseMediaDecodeTime += minSegmentDts;

    	    // baseMediaDecodeTime must not become negative
    	    baseMediaDecodeTime = Math.max(0, baseMediaDecodeTime);
    	    if (track.type === 'audio') {
    	      // Audio has a different clock equal to the sampling_rate so we need to
    	      // scale the PTS values into the clock rate of the track
    	      scale = track.samplerate / ONE_SECOND_IN_TS$2;
    	      baseMediaDecodeTime *= scale;
    	      baseMediaDecodeTime = Math.floor(baseMediaDecodeTime);
    	    }
    	    return baseMediaDecodeTime;
    	  };
    	  var trackDecodeInfo = {
    	    clearDtsInfo: clearDtsInfo,
    	    calculateTrackBaseMediaDecodeTime: calculateTrackBaseMediaDecodeTime,
    	    collectDtsInfo: collectDtsInfo
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   *
    	   * Reads in-band caption information from a video elementary
    	   * stream. Captions must follow the CEA-708 standard for injection
    	   * into an MPEG-2 transport streams.
    	   * @see https://en.wikipedia.org/wiki/CEA-708
    	   * @see https://www.gpo.gov/fdsys/pkg/CFR-2007-title47-vol1/pdf/CFR-2007-title47-vol1-sec15-119.pdf
    	   */

    	  // Supplemental enhancement information (SEI) NAL units have a
    	  // payload type field to indicate how they are to be
    	  // interpreted. CEAS-708 caption content is always transmitted with
    	  // payload type 0x04.
    	  var USER_DATA_REGISTERED_ITU_T_T35 = 4,
    	    RBSP_TRAILING_BITS = 128;

    	  /**
    	    * Parse a supplemental enhancement information (SEI) NAL unit.
    	    * Stops parsing once a message of type ITU T T35 has been found.
    	    *
    	    * @param bytes {Uint8Array} the bytes of a SEI NAL unit
    	    * @return {object} the parsed SEI payload
    	    * @see Rec. ITU-T H.264, 7.3.2.3.1
    	    */
    	  var parseSei = function parseSei(bytes) {
    	    var i = 0,
    	      result = {
    	        payloadType: -1,
    	        payloadSize: 0
    	      },
    	      payloadType = 0,
    	      payloadSize = 0;

    	    // go through the sei_rbsp parsing each each individual sei_message
    	    while (i < bytes.byteLength) {
    	      // stop once we have hit the end of the sei_rbsp
    	      if (bytes[i] === RBSP_TRAILING_BITS) {
    	        break;
    	      }

    	      // Parse payload type
    	      while (bytes[i] === 0xFF) {
    	        payloadType += 255;
    	        i++;
    	      }
    	      payloadType += bytes[i++];

    	      // Parse payload size
    	      while (bytes[i] === 0xFF) {
    	        payloadSize += 255;
    	        i++;
    	      }
    	      payloadSize += bytes[i++];

    	      // this sei_message is a 608/708 caption so save it and break
    	      // there can only ever be one caption message in a frame's sei
    	      if (!result.payload && payloadType === USER_DATA_REGISTERED_ITU_T_T35) {
    	        var userIdentifier = String.fromCharCode(bytes[i + 3], bytes[i + 4], bytes[i + 5], bytes[i + 6]);
    	        if (userIdentifier === 'GA94') {
    	          result.payloadType = payloadType;
    	          result.payloadSize = payloadSize;
    	          result.payload = bytes.subarray(i, i + payloadSize);
    	          break;
    	        } else {
    	          result.payload = void 0;
    	        }
    	      }

    	      // skip the payload and parse the next message
    	      i += payloadSize;
    	      payloadType = 0;
    	      payloadSize = 0;
    	    }
    	    return result;
    	  };

    	  // see ANSI/SCTE 128-1 (2013), section 8.1
    	  var parseUserData = function parseUserData(sei) {
    	    // itu_t_t35_contry_code must be 181 (United States) for
    	    // captions
    	    if (sei.payload[0] !== 181) {
    	      return null;
    	    }

    	    // itu_t_t35_provider_code should be 49 (ATSC) for captions
    	    if ((sei.payload[1] << 8 | sei.payload[2]) !== 49) {
    	      return null;
    	    }

    	    // the user_identifier should be "GA94" to indicate ATSC1 data
    	    if (String.fromCharCode(sei.payload[3], sei.payload[4], sei.payload[5], sei.payload[6]) !== 'GA94') {
    	      return null;
    	    }

    	    // finally, user_data_type_code should be 0x03 for caption data
    	    if (sei.payload[7] !== 0x03) {
    	      return null;
    	    }

    	    // return the user_data_type_structure and strip the trailing
    	    // marker bits
    	    return sei.payload.subarray(8, sei.payload.length - 1);
    	  };

    	  // see CEA-708-D, section 4.4
    	  var parseCaptionPackets = function parseCaptionPackets(pts, userData) {
    	    var results = [],
    	      i,
    	      count,
    	      offset,
    	      data;

    	    // if this is just filler, return immediately
    	    if (!(userData[0] & 0x40)) {
    	      return results;
    	    }

    	    // parse out the cc_data_1 and cc_data_2 fields
    	    count = userData[0] & 0x1f;
    	    for (i = 0; i < count; i++) {
    	      offset = i * 3;
    	      data = {
    	        type: userData[offset + 2] & 0x03,
    	        pts: pts
    	      };

    	      // capture cc data when cc_valid is 1
    	      if (userData[offset + 2] & 0x04) {
    	        data.ccData = userData[offset + 3] << 8 | userData[offset + 4];
    	        results.push(data);
    	      }
    	    }
    	    return results;
    	  };
    	  var discardEmulationPreventionBytes = function discardEmulationPreventionBytes(data) {
    	    var length = data.byteLength,
    	      emulationPreventionBytesPositions = [],
    	      i = 1,
    	      newLength,
    	      newData;

    	    // Find all `Emulation Prevention Bytes`
    	    while (i < length - 2) {
    	      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
    	        emulationPreventionBytesPositions.push(i + 2);
    	        i += 2;
    	      } else {
    	        i++;
    	      }
    	    }

    	    // If no Emulation Prevention Bytes were found just return the original
    	    // array
    	    if (emulationPreventionBytesPositions.length === 0) {
    	      return data;
    	    }

    	    // Create a new array to hold the NAL unit data
    	    newLength = length - emulationPreventionBytesPositions.length;
    	    newData = new Uint8Array(newLength);
    	    var sourceIndex = 0;
    	    for (i = 0; i < newLength; sourceIndex++, i++) {
    	      if (sourceIndex === emulationPreventionBytesPositions[0]) {
    	        // Skip this byte
    	        sourceIndex++;
    	        // Remove this position index
    	        emulationPreventionBytesPositions.shift();
    	      }
    	      newData[i] = data[sourceIndex];
    	    }
    	    return newData;
    	  };

    	  // exports
    	  var captionPacketParser = {
    	    parseSei: parseSei,
    	    parseUserData: parseUserData,
    	    parseCaptionPackets: parseCaptionPackets,
    	    discardEmulationPreventionBytes: discardEmulationPreventionBytes,
    	    USER_DATA_REGISTERED_ITU_T_T35: USER_DATA_REGISTERED_ITU_T_T35
    	  };

    	  // -----------------
    	  // Link To Transport
    	  // -----------------

    	  var CaptionStream = function CaptionStream(options) {
    	    options = options || {};
    	    CaptionStream.prototype.init.call(this);

    	    // parse708captions flag, default to true
    	    this.parse708captions_ = typeof options.parse708captions === 'boolean' ? options.parse708captions : true;
    	    this.captionPackets_ = [];
    	    this.ccStreams_ = [new Cea608Stream(0, 0),
    	    // eslint-disable-line no-use-before-define
    	    new Cea608Stream(0, 1),
    	    // eslint-disable-line no-use-before-define
    	    new Cea608Stream(1, 0),
    	    // eslint-disable-line no-use-before-define
    	    new Cea608Stream(1, 1) // eslint-disable-line no-use-before-define
    	    ];

    	    if (this.parse708captions_) {
    	      this.cc708Stream_ = new Cea708Stream({
    	        captionServices: options.captionServices
    	      }); // eslint-disable-line no-use-before-define
    	    }

    	    this.reset();

    	    // forward data and done events from CCs to this CaptionStream
    	    this.ccStreams_.forEach(function (cc) {
    	      cc.on('data', this.trigger.bind(this, 'data'));
    	      cc.on('partialdone', this.trigger.bind(this, 'partialdone'));
    	      cc.on('done', this.trigger.bind(this, 'done'));
    	    }, this);
    	    if (this.parse708captions_) {
    	      this.cc708Stream_.on('data', this.trigger.bind(this, 'data'));
    	      this.cc708Stream_.on('partialdone', this.trigger.bind(this, 'partialdone'));
    	      this.cc708Stream_.on('done', this.trigger.bind(this, 'done'));
    	    }
    	  };
    	  CaptionStream.prototype = new stream();
    	  CaptionStream.prototype.push = function (event) {
    	    var sei, userData, newCaptionPackets;

    	    // only examine SEI NALs
    	    if (event.nalUnitType !== 'sei_rbsp') {
    	      return;
    	    }

    	    // parse the sei
    	    sei = captionPacketParser.parseSei(event.escapedRBSP);

    	    // no payload data, skip
    	    if (!sei.payload) {
    	      return;
    	    }

    	    // ignore everything but user_data_registered_itu_t_t35
    	    if (sei.payloadType !== captionPacketParser.USER_DATA_REGISTERED_ITU_T_T35) {
    	      return;
    	    }

    	    // parse out the user data payload
    	    userData = captionPacketParser.parseUserData(sei);

    	    // ignore unrecognized userData
    	    if (!userData) {
    	      return;
    	    }

    	    // Sometimes, the same segment # will be downloaded twice. To stop the
    	    // caption data from being processed twice, we track the latest dts we've
    	    // received and ignore everything with a dts before that. However, since
    	    // data for a specific dts can be split across packets on either side of
    	    // a segment boundary, we need to make sure we *don't* ignore the packets
    	    // from the *next* segment that have dts === this.latestDts_. By constantly
    	    // tracking the number of packets received with dts === this.latestDts_, we
    	    // know how many should be ignored once we start receiving duplicates.
    	    if (event.dts < this.latestDts_) {
    	      // We've started getting older data, so set the flag.
    	      this.ignoreNextEqualDts_ = true;
    	      return;
    	    } else if (event.dts === this.latestDts_ && this.ignoreNextEqualDts_) {
    	      this.numSameDts_--;
    	      if (!this.numSameDts_) {
    	        // We've received the last duplicate packet, time to start processing again
    	        this.ignoreNextEqualDts_ = false;
    	      }
    	      return;
    	    }

    	    // parse out CC data packets and save them for later
    	    newCaptionPackets = captionPacketParser.parseCaptionPackets(event.pts, userData);
    	    this.captionPackets_ = this.captionPackets_.concat(newCaptionPackets);
    	    if (this.latestDts_ !== event.dts) {
    	      this.numSameDts_ = 0;
    	    }
    	    this.numSameDts_++;
    	    this.latestDts_ = event.dts;
    	  };
    	  CaptionStream.prototype.flushCCStreams = function (flushType) {
    	    this.ccStreams_.forEach(function (cc) {
    	      return flushType === 'flush' ? cc.flush() : cc.partialFlush();
    	    }, this);
    	  };
    	  CaptionStream.prototype.flushStream = function (flushType) {
    	    // make sure we actually parsed captions before proceeding
    	    if (!this.captionPackets_.length) {
    	      this.flushCCStreams(flushType);
    	      return;
    	    }

    	    // In Chrome, the Array#sort function is not stable so add a
    	    // presortIndex that we can use to ensure we get a stable-sort
    	    this.captionPackets_.forEach(function (elem, idx) {
    	      elem.presortIndex = idx;
    	    });

    	    // sort caption byte-pairs based on their PTS values
    	    this.captionPackets_.sort(function (a, b) {
    	      if (a.pts === b.pts) {
    	        return a.presortIndex - b.presortIndex;
    	      }
    	      return a.pts - b.pts;
    	    });
    	    this.captionPackets_.forEach(function (packet) {
    	      if (packet.type < 2) {
    	        // Dispatch packet to the right Cea608Stream
    	        this.dispatchCea608Packet(packet);
    	      } else {
    	        // Dispatch packet to the Cea708Stream
    	        this.dispatchCea708Packet(packet);
    	      }
    	    }, this);
    	    this.captionPackets_.length = 0;
    	    this.flushCCStreams(flushType);
    	  };
    	  CaptionStream.prototype.flush = function () {
    	    return this.flushStream('flush');
    	  };

    	  // Only called if handling partial data
    	  CaptionStream.prototype.partialFlush = function () {
    	    return this.flushStream('partialFlush');
    	  };
    	  CaptionStream.prototype.reset = function () {
    	    this.latestDts_ = null;
    	    this.ignoreNextEqualDts_ = false;
    	    this.numSameDts_ = 0;
    	    this.activeCea608Channel_ = [null, null];
    	    this.ccStreams_.forEach(function (ccStream) {
    	      ccStream.reset();
    	    });
    	  };

    	  // From the CEA-608 spec:
    	  /*
    	   * When XDS sub-packets are interleaved with other services, the end of each sub-packet shall be followed
    	   * by a control pair to change to a different service. When any of the control codes from 0x10 to 0x1F is
    	   * used to begin a control code pair, it indicates the return to captioning or Text data. The control code pair
    	   * and subsequent data should then be processed according to the FCC rules. It may be necessary for the
    	   * line 21 data encoder to automatically insert a control code pair (i.e. RCL, RU2, RU3, RU4, RDC, or RTD)
    	   * to switch to captioning or Text.
    	  */
    	  // With that in mind, we ignore any data between an XDS control code and a
    	  // subsequent closed-captioning control code.
    	  CaptionStream.prototype.dispatchCea608Packet = function (packet) {
    	    // NOTE: packet.type is the CEA608 field
    	    if (this.setsTextOrXDSActive(packet)) {
    	      this.activeCea608Channel_[packet.type] = null;
    	    } else if (this.setsChannel1Active(packet)) {
    	      this.activeCea608Channel_[packet.type] = 0;
    	    } else if (this.setsChannel2Active(packet)) {
    	      this.activeCea608Channel_[packet.type] = 1;
    	    }
    	    if (this.activeCea608Channel_[packet.type] === null) {
    	      // If we haven't received anything to set the active channel, or the
    	      // packets are Text/XDS data, discard the data; we don't want jumbled
    	      // captions
    	      return;
    	    }
    	    this.ccStreams_[(packet.type << 1) + this.activeCea608Channel_[packet.type]].push(packet);
    	  };
    	  CaptionStream.prototype.setsChannel1Active = function (packet) {
    	    return (packet.ccData & 0x7800) === 0x1000;
    	  };
    	  CaptionStream.prototype.setsChannel2Active = function (packet) {
    	    return (packet.ccData & 0x7800) === 0x1800;
    	  };
    	  CaptionStream.prototype.setsTextOrXDSActive = function (packet) {
    	    return (packet.ccData & 0x7100) === 0x0100 || (packet.ccData & 0x78fe) === 0x102a || (packet.ccData & 0x78fe) === 0x182a;
    	  };
    	  CaptionStream.prototype.dispatchCea708Packet = function (packet) {
    	    if (this.parse708captions_) {
    	      this.cc708Stream_.push(packet);
    	    }
    	  };

    	  // ----------------------
    	  // Session to Application
    	  // ----------------------

    	  // This hash maps special and extended character codes to their
    	  // proper Unicode equivalent. The first one-byte key is just a
    	  // non-standard character code. The two-byte keys that follow are
    	  // the extended CEA708 character codes, along with the preceding
    	  // 0x10 extended character byte to distinguish these codes from
    	  // non-extended character codes. Every CEA708 character code that
    	  // is not in this object maps directly to a standard unicode
    	  // character code.
    	  // The transparent space and non-breaking transparent space are
    	  // technically not fully supported since there is no code to
    	  // make them transparent, so they have normal non-transparent
    	  // stand-ins.
    	  // The special closed caption (CC) character isn't a standard
    	  // unicode character, so a fairly similar unicode character was
    	  // chosen in it's place.
    	  var CHARACTER_TRANSLATION_708 = {
    	    0x7f: 0x266a,
    	    // ♪
    	    0x1020: 0x20,
    	    // Transparent Space
    	    0x1021: 0xa0,
    	    // Nob-breaking Transparent Space
    	    0x1025: 0x2026,
    	    // …
    	    0x102a: 0x0160,
    	    // Š
    	    0x102c: 0x0152,
    	    // Œ
    	    0x1030: 0x2588,
    	    // █
    	    0x1031: 0x2018,
    	    // ‘
    	    0x1032: 0x2019,
    	    // ’
    	    0x1033: 0x201c,
    	    // “
    	    0x1034: 0x201d,
    	    // ”
    	    0x1035: 0x2022,
    	    // •
    	    0x1039: 0x2122,
    	    // ™
    	    0x103a: 0x0161,
    	    // š
    	    0x103c: 0x0153,
    	    // œ
    	    0x103d: 0x2120,
    	    // ℠
    	    0x103f: 0x0178,
    	    // Ÿ
    	    0x1076: 0x215b,
    	    // ⅛
    	    0x1077: 0x215c,
    	    // ⅜
    	    0x1078: 0x215d,
    	    // ⅝
    	    0x1079: 0x215e,
    	    // ⅞
    	    0x107a: 0x23d0,
    	    // ⏐
    	    0x107b: 0x23a4,
    	    // ⎤
    	    0x107c: 0x23a3,
    	    // ⎣
    	    0x107d: 0x23af,
    	    // ⎯
    	    0x107e: 0x23a6,
    	    // ⎦
    	    0x107f: 0x23a1,
    	    // ⎡
    	    0x10a0: 0x3138 // ㄸ (CC char)
    	  };

    	  var get708CharFromCode = function get708CharFromCode(code) {
    	    var newCode = CHARACTER_TRANSLATION_708[code] || code;
    	    if (code & 0x1000 && code === newCode) {
    	      // Invalid extended code
    	      return '';
    	    }
    	    return String.fromCharCode(newCode);
    	  };
    	  var within708TextBlock = function within708TextBlock(b) {
    	    return 0x20 <= b && b <= 0x7f || 0xa0 <= b && b <= 0xff;
    	  };
    	  var Cea708Window = function Cea708Window(windowNum) {
    	    this.windowNum = windowNum;
    	    this.reset();
    	  };
    	  Cea708Window.prototype.reset = function () {
    	    this.clearText();
    	    this.pendingNewLine = false;
    	    this.winAttr = {};
    	    this.penAttr = {};
    	    this.penLoc = {};
    	    this.penColor = {};

    	    // These default values are arbitrary,
    	    // defineWindow will usually override them
    	    this.visible = 0;
    	    this.rowLock = 0;
    	    this.columnLock = 0;
    	    this.priority = 0;
    	    this.relativePositioning = 0;
    	    this.anchorVertical = 0;
    	    this.anchorHorizontal = 0;
    	    this.anchorPoint = 0;
    	    this.rowCount = 1;
    	    this.virtualRowCount = this.rowCount + 1;
    	    this.columnCount = 41;
    	    this.windowStyle = 0;
    	    this.penStyle = 0;
    	  };
    	  Cea708Window.prototype.getText = function () {
    	    return this.rows.join('\n');
    	  };
    	  Cea708Window.prototype.clearText = function () {
    	    this.rows = [''];
    	    this.rowIdx = 0;
    	  };
    	  Cea708Window.prototype.newLine = function (pts) {
    	    if (this.rows.length >= this.virtualRowCount && typeof this.beforeRowOverflow === 'function') {
    	      this.beforeRowOverflow(pts);
    	    }
    	    if (this.rows.length > 0) {
    	      this.rows.push('');
    	      this.rowIdx++;
    	    }

    	    // Show all virtual rows since there's no visible scrolling
    	    while (this.rows.length > this.virtualRowCount) {
    	      this.rows.shift();
    	      this.rowIdx--;
    	    }
    	  };
    	  Cea708Window.prototype.isEmpty = function () {
    	    if (this.rows.length === 0) {
    	      return true;
    	    } else if (this.rows.length === 1) {
    	      return this.rows[0] === '';
    	    }
    	    return false;
    	  };
    	  Cea708Window.prototype.addText = function (text) {
    	    this.rows[this.rowIdx] += text;
    	  };
    	  Cea708Window.prototype.backspace = function () {
    	    if (!this.isEmpty()) {
    	      var row = this.rows[this.rowIdx];
    	      this.rows[this.rowIdx] = row.substr(0, row.length - 1);
    	    }
    	  };
    	  var Cea708Service = function Cea708Service(serviceNum, encoding, stream) {
    	    this.serviceNum = serviceNum;
    	    this.text = '';
    	    this.currentWindow = new Cea708Window(-1);
    	    this.windows = [];
    	    this.stream = stream;

    	    // Try to setup a TextDecoder if an `encoding` value was provided
    	    if (typeof encoding === 'string') {
    	      this.createTextDecoder(encoding);
    	    }
    	  };

    	  /**
    	   * Initialize service windows
    	   * Must be run before service use
    	   *
    	   * @param  {Integer}  pts               PTS value
    	   * @param  {Function} beforeRowOverflow Function to execute before row overflow of a window
    	   */
    	  Cea708Service.prototype.init = function (pts, beforeRowOverflow) {
    	    this.startPts = pts;
    	    for (var win = 0; win < 8; win++) {
    	      this.windows[win] = new Cea708Window(win);
    	      if (typeof beforeRowOverflow === 'function') {
    	        this.windows[win].beforeRowOverflow = beforeRowOverflow;
    	      }
    	    }
    	  };

    	  /**
    	   * Set current window of service to be affected by commands
    	   *
    	   * @param  {Integer} windowNum Window number
    	   */
    	  Cea708Service.prototype.setCurrentWindow = function (windowNum) {
    	    this.currentWindow = this.windows[windowNum];
    	  };

    	  /**
    	   * Try to create a TextDecoder if it is natively supported
    	   */
    	  Cea708Service.prototype.createTextDecoder = function (encoding) {
    	    if (typeof TextDecoder === 'undefined') {
    	      this.stream.trigger('log', {
    	        level: 'warn',
    	        message: 'The `encoding` option is unsupported without TextDecoder support'
    	      });
    	    } else {
    	      try {
    	        this.textDecoder_ = new TextDecoder(encoding);
    	      } catch (error) {
    	        this.stream.trigger('log', {
    	          level: 'warn',
    	          message: 'TextDecoder could not be created with ' + encoding + ' encoding. ' + error
    	        });
    	      }
    	    }
    	  };
    	  var Cea708Stream = function Cea708Stream(options) {
    	    options = options || {};
    	    Cea708Stream.prototype.init.call(this);
    	    var self = this;
    	    var captionServices = options.captionServices || {};
    	    var captionServiceEncodings = {};
    	    var serviceProps;

    	    // Get service encodings from captionServices option block
    	    Object.keys(captionServices).forEach(function (serviceName) {
    	      serviceProps = captionServices[serviceName];
    	      if (/^SERVICE/.test(serviceName)) {
    	        captionServiceEncodings[serviceName] = serviceProps.encoding;
    	      }
    	    });
    	    this.serviceEncodings = captionServiceEncodings;
    	    this.current708Packet = null;
    	    this.services = {};
    	    this.push = function (packet) {
    	      if (packet.type === 3) {
    	        // 708 packet start
    	        self.new708Packet();
    	        self.add708Bytes(packet);
    	      } else {
    	        if (self.current708Packet === null) {
    	          // This should only happen at the start of a file if there's no packet start.
    	          self.new708Packet();
    	        }
    	        self.add708Bytes(packet);
    	      }
    	    };
    	  };
    	  Cea708Stream.prototype = new stream();

    	  /**
    	   * Push current 708 packet, create new 708 packet.
    	   */
    	  Cea708Stream.prototype.new708Packet = function () {
    	    if (this.current708Packet !== null) {
    	      this.push708Packet();
    	    }
    	    this.current708Packet = {
    	      data: [],
    	      ptsVals: []
    	    };
    	  };

    	  /**
    	   * Add pts and both bytes from packet into current 708 packet.
    	   */
    	  Cea708Stream.prototype.add708Bytes = function (packet) {
    	    var data = packet.ccData;
    	    var byte0 = data >>> 8;
    	    var byte1 = data & 0xff;

    	    // I would just keep a list of packets instead of bytes, but it isn't clear in the spec
    	    // that service blocks will always line up with byte pairs.
    	    this.current708Packet.ptsVals.push(packet.pts);
    	    this.current708Packet.data.push(byte0);
    	    this.current708Packet.data.push(byte1);
    	  };

    	  /**
    	   * Parse completed 708 packet into service blocks and push each service block.
    	   */
    	  Cea708Stream.prototype.push708Packet = function () {
    	    var packet708 = this.current708Packet;
    	    var packetData = packet708.data;
    	    var serviceNum = null;
    	    var blockSize = null;
    	    var i = 0;
    	    var b = packetData[i++];
    	    packet708.seq = b >> 6;
    	    packet708.sizeCode = b & 0x3f; // 0b00111111;

    	    for (; i < packetData.length; i++) {
    	      b = packetData[i++];
    	      serviceNum = b >> 5;
    	      blockSize = b & 0x1f; // 0b00011111

    	      if (serviceNum === 7 && blockSize > 0) {
    	        // Extended service num
    	        b = packetData[i++];
    	        serviceNum = b;
    	      }
    	      this.pushServiceBlock(serviceNum, i, blockSize);
    	      if (blockSize > 0) {
    	        i += blockSize - 1;
    	      }
    	    }
    	  };

    	  /**
    	   * Parse service block, execute commands, read text.
    	   *
    	   * Note: While many of these commands serve important purposes,
    	   * many others just parse out the parameters or attributes, but
    	   * nothing is done with them because this is not a full and complete
    	   * implementation of the entire 708 spec.
    	   *
    	   * @param  {Integer} serviceNum Service number
    	   * @param  {Integer} start      Start index of the 708 packet data
    	   * @param  {Integer} size       Block size
    	   */
    	  Cea708Stream.prototype.pushServiceBlock = function (serviceNum, start, size) {
    	    var b;
    	    var i = start;
    	    var packetData = this.current708Packet.data;
    	    var service = this.services[serviceNum];
    	    if (!service) {
    	      service = this.initService(serviceNum, i);
    	    }
    	    for (; i < start + size && i < packetData.length; i++) {
    	      b = packetData[i];
    	      if (within708TextBlock(b)) {
    	        i = this.handleText(i, service);
    	      } else if (b === 0x18) {
    	        i = this.multiByteCharacter(i, service);
    	      } else if (b === 0x10) {
    	        i = this.extendedCommands(i, service);
    	      } else if (0x80 <= b && b <= 0x87) {
    	        i = this.setCurrentWindow(i, service);
    	      } else if (0x98 <= b && b <= 0x9f) {
    	        i = this.defineWindow(i, service);
    	      } else if (b === 0x88) {
    	        i = this.clearWindows(i, service);
    	      } else if (b === 0x8c) {
    	        i = this.deleteWindows(i, service);
    	      } else if (b === 0x89) {
    	        i = this.displayWindows(i, service);
    	      } else if (b === 0x8a) {
    	        i = this.hideWindows(i, service);
    	      } else if (b === 0x8b) {
    	        i = this.toggleWindows(i, service);
    	      } else if (b === 0x97) {
    	        i = this.setWindowAttributes(i, service);
    	      } else if (b === 0x90) {
    	        i = this.setPenAttributes(i, service);
    	      } else if (b === 0x91) {
    	        i = this.setPenColor(i, service);
    	      } else if (b === 0x92) {
    	        i = this.setPenLocation(i, service);
    	      } else if (b === 0x8f) {
    	        service = this.reset(i, service);
    	      } else if (b === 0x08) {
    	        // BS: Backspace
    	        service.currentWindow.backspace();
    	      } else if (b === 0x0c) {
    	        // FF: Form feed
    	        service.currentWindow.clearText();
    	      } else if (b === 0x0d) {
    	        // CR: Carriage return
    	        service.currentWindow.pendingNewLine = true;
    	      } else if (b === 0x0e) {
    	        // HCR: Horizontal carriage return
    	        service.currentWindow.clearText();
    	      } else if (b === 0x8d) {
    	        // DLY: Delay, nothing to do
    	        i++;
    	      } else ;
    	    }
    	  };

    	  /**
    	   * Execute an extended command
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.extendedCommands = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    if (within708TextBlock(b)) {
    	      i = this.handleText(i, service, {
    	        isExtended: true
    	      });
    	    }
    	    return i;
    	  };

    	  /**
    	   * Get PTS value of a given byte index
    	   *
    	   * @param  {Integer} byteIndex  Index of the byte
    	   * @return {Integer}            PTS
    	   */
    	  Cea708Stream.prototype.getPts = function (byteIndex) {
    	    // There's 1 pts value per 2 bytes
    	    return this.current708Packet.ptsVals[Math.floor(byteIndex / 2)];
    	  };

    	  /**
    	   * Initializes a service
    	   *
    	   * @param  {Integer} serviceNum Service number
    	   * @return {Service}            Initialized service object
    	   */
    	  Cea708Stream.prototype.initService = function (serviceNum, i) {
    	    var serviceName = 'SERVICE' + serviceNum;
    	    var self = this;
    	    var serviceName;
    	    var encoding;
    	    if (serviceName in this.serviceEncodings) {
    	      encoding = this.serviceEncodings[serviceName];
    	    }
    	    this.services[serviceNum] = new Cea708Service(serviceNum, encoding, self);
    	    this.services[serviceNum].init(this.getPts(i), function (pts) {
    	      self.flushDisplayed(pts, self.services[serviceNum]);
    	    });
    	    return this.services[serviceNum];
    	  };

    	  /**
    	   * Execute text writing to current window
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.handleText = function (i, service, options) {
    	    var isExtended = options && options.isExtended;
    	    var isMultiByte = options && options.isMultiByte;
    	    var packetData = this.current708Packet.data;
    	    var extended = isExtended ? 0x1000 : 0x0000;
    	    var currentByte = packetData[i];
    	    var nextByte = packetData[i + 1];
    	    var win = service.currentWindow;
    	    var char;
    	    var charCodeArray;

    	    // Use the TextDecoder if one was created for this service
    	    if (service.textDecoder_ && !isExtended) {
    	      if (isMultiByte) {
    	        charCodeArray = [currentByte, nextByte];
    	        i++;
    	      } else {
    	        charCodeArray = [currentByte];
    	      }
    	      char = service.textDecoder_.decode(new Uint8Array(charCodeArray));
    	    } else {
    	      char = get708CharFromCode(extended | currentByte);
    	    }
    	    if (win.pendingNewLine && !win.isEmpty()) {
    	      win.newLine(this.getPts(i));
    	    }
    	    win.pendingNewLine = false;
    	    win.addText(char);
    	    return i;
    	  };

    	  /**
    	   * Handle decoding of multibyte character
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.multiByteCharacter = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var firstByte = packetData[i + 1];
    	    var secondByte = packetData[i + 2];
    	    if (within708TextBlock(firstByte) && within708TextBlock(secondByte)) {
    	      i = this.handleText(++i, service, {
    	        isMultiByte: true
    	      });
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the CW# command.
    	   *
    	   * Set the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.setCurrentWindow = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var windowNum = b & 0x07;
    	    service.setCurrentWindow(windowNum);
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the DF# command.
    	   *
    	   * Define a window and set it as the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.defineWindow = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var windowNum = b & 0x07;
    	    service.setCurrentWindow(windowNum);
    	    var win = service.currentWindow;
    	    b = packetData[++i];
    	    win.visible = (b & 0x20) >> 5; // v
    	    win.rowLock = (b & 0x10) >> 4; // rl
    	    win.columnLock = (b & 0x08) >> 3; // cl
    	    win.priority = b & 0x07; // p

    	    b = packetData[++i];
    	    win.relativePositioning = (b & 0x80) >> 7; // rp
    	    win.anchorVertical = b & 0x7f; // av

    	    b = packetData[++i];
    	    win.anchorHorizontal = b; // ah

    	    b = packetData[++i];
    	    win.anchorPoint = (b & 0xf0) >> 4; // ap
    	    win.rowCount = b & 0x0f; // rc

    	    b = packetData[++i];
    	    win.columnCount = b & 0x3f; // cc

    	    b = packetData[++i];
    	    win.windowStyle = (b & 0x38) >> 3; // ws
    	    win.penStyle = b & 0x07; // ps

    	    // The spec says there are (rowCount+1) "virtual rows"
    	    win.virtualRowCount = win.rowCount + 1;
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the SWA command.
    	   *
    	   * Set attributes of the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.setWindowAttributes = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var winAttr = service.currentWindow.winAttr;
    	    b = packetData[++i];
    	    winAttr.fillOpacity = (b & 0xc0) >> 6; // fo
    	    winAttr.fillRed = (b & 0x30) >> 4; // fr
    	    winAttr.fillGreen = (b & 0x0c) >> 2; // fg
    	    winAttr.fillBlue = b & 0x03; // fb

    	    b = packetData[++i];
    	    winAttr.borderType = (b & 0xc0) >> 6; // bt
    	    winAttr.borderRed = (b & 0x30) >> 4; // br
    	    winAttr.borderGreen = (b & 0x0c) >> 2; // bg
    	    winAttr.borderBlue = b & 0x03; // bb

    	    b = packetData[++i];
    	    winAttr.borderType += (b & 0x80) >> 5; // bt
    	    winAttr.wordWrap = (b & 0x40) >> 6; // ww
    	    winAttr.printDirection = (b & 0x30) >> 4; // pd
    	    winAttr.scrollDirection = (b & 0x0c) >> 2; // sd
    	    winAttr.justify = b & 0x03; // j

    	    b = packetData[++i];
    	    winAttr.effectSpeed = (b & 0xf0) >> 4; // es
    	    winAttr.effectDirection = (b & 0x0c) >> 2; // ed
    	    winAttr.displayEffect = b & 0x03; // de

    	    return i;
    	  };

    	  /**
    	   * Gather text from all displayed windows and push a caption to output.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   */
    	  Cea708Stream.prototype.flushDisplayed = function (pts, service) {
    	    var displayedText = [];

    	    // TODO: Positioning not supported, displaying multiple windows will not necessarily
    	    // display text in the correct order, but sample files so far have not shown any issue.
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (service.windows[winId].visible && !service.windows[winId].isEmpty()) {
    	        displayedText.push(service.windows[winId].getText());
    	      }
    	    }
    	    service.endPts = pts;
    	    service.text = displayedText.join('\n\n');
    	    this.pushCaption(service);
    	    service.startPts = pts;
    	  };

    	  /**
    	   * Push a caption to output if the caption contains text.
    	   *
    	   * @param  {Service} service  The service object to be affected
    	   */
    	  Cea708Stream.prototype.pushCaption = function (service) {
    	    if (service.text !== '') {
    	      this.trigger('data', {
    	        startPts: service.startPts,
    	        endPts: service.endPts,
    	        text: service.text,
    	        stream: 'cc708_' + service.serviceNum
    	      });
    	      service.text = '';
    	      service.startPts = service.endPts;
    	    }
    	  };

    	  /**
    	   * Parse and execute the DSW command.
    	   *
    	   * Set visible property of windows based on the parsed bitmask.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.displayWindows = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (b & 0x01 << winId) {
    	        service.windows[winId].visible = 1;
    	      }
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the HDW command.
    	   *
    	   * Set visible property of windows based on the parsed bitmask.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.hideWindows = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (b & 0x01 << winId) {
    	        service.windows[winId].visible = 0;
    	      }
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the TGW command.
    	   *
    	   * Set visible property of windows based on the parsed bitmask.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.toggleWindows = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (b & 0x01 << winId) {
    	        service.windows[winId].visible ^= 1;
    	      }
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the CLW command.
    	   *
    	   * Clear text of windows based on the parsed bitmask.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.clearWindows = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (b & 0x01 << winId) {
    	        service.windows[winId].clearText();
    	      }
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the DLW command.
    	   *
    	   * Re-initialize windows based on the parsed bitmask.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.deleteWindows = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[++i];
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    for (var winId = 0; winId < 8; winId++) {
    	      if (b & 0x01 << winId) {
    	        service.windows[winId].reset();
    	      }
    	    }
    	    return i;
    	  };

    	  /**
    	   * Parse and execute the SPA command.
    	   *
    	   * Set pen attributes of the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.setPenAttributes = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var penAttr = service.currentWindow.penAttr;
    	    b = packetData[++i];
    	    penAttr.textTag = (b & 0xf0) >> 4; // tt
    	    penAttr.offset = (b & 0x0c) >> 2; // o
    	    penAttr.penSize = b & 0x03; // s

    	    b = packetData[++i];
    	    penAttr.italics = (b & 0x80) >> 7; // i
    	    penAttr.underline = (b & 0x40) >> 6; // u
    	    penAttr.edgeType = (b & 0x38) >> 3; // et
    	    penAttr.fontStyle = b & 0x07; // fs

    	    return i;
    	  };

    	  /**
    	   * Parse and execute the SPC command.
    	   *
    	   * Set pen color of the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.setPenColor = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var penColor = service.currentWindow.penColor;
    	    b = packetData[++i];
    	    penColor.fgOpacity = (b & 0xc0) >> 6; // fo
    	    penColor.fgRed = (b & 0x30) >> 4; // fr
    	    penColor.fgGreen = (b & 0x0c) >> 2; // fg
    	    penColor.fgBlue = b & 0x03; // fb

    	    b = packetData[++i];
    	    penColor.bgOpacity = (b & 0xc0) >> 6; // bo
    	    penColor.bgRed = (b & 0x30) >> 4; // br
    	    penColor.bgGreen = (b & 0x0c) >> 2; // bg
    	    penColor.bgBlue = b & 0x03; // bb

    	    b = packetData[++i];
    	    penColor.edgeRed = (b & 0x30) >> 4; // er
    	    penColor.edgeGreen = (b & 0x0c) >> 2; // eg
    	    penColor.edgeBlue = b & 0x03; // eb

    	    return i;
    	  };

    	  /**
    	   * Parse and execute the SPL command.
    	   *
    	   * Set pen location of the current window.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Integer}          New index after parsing
    	   */
    	  Cea708Stream.prototype.setPenLocation = function (i, service) {
    	    var packetData = this.current708Packet.data;
    	    var b = packetData[i];
    	    var penLoc = service.currentWindow.penLoc;

    	    // Positioning isn't really supported at the moment, so this essentially just inserts a linebreak
    	    service.currentWindow.pendingNewLine = true;
    	    b = packetData[++i];
    	    penLoc.row = b & 0x0f; // r

    	    b = packetData[++i];
    	    penLoc.column = b & 0x3f; // c

    	    return i;
    	  };

    	  /**
    	   * Execute the RST command.
    	   *
    	   * Reset service to a clean slate. Re-initialize.
    	   *
    	   * @param  {Integer} i        Current index in the 708 packet
    	   * @param  {Service} service  The service object to be affected
    	   * @return {Service}          Re-initialized service
    	   */
    	  Cea708Stream.prototype.reset = function (i, service) {
    	    var pts = this.getPts(i);
    	    this.flushDisplayed(pts, service);
    	    return this.initService(service.serviceNum, i);
    	  };

    	  // This hash maps non-ASCII, special, and extended character codes to their
    	  // proper Unicode equivalent. The first keys that are only a single byte
    	  // are the non-standard ASCII characters, which simply map the CEA608 byte
    	  // to the standard ASCII/Unicode. The two-byte keys that follow are the CEA608
    	  // character codes, but have their MSB bitmasked with 0x03 so that a lookup
    	  // can be performed regardless of the field and data channel on which the
    	  // character code was received.
    	  var CHARACTER_TRANSLATION = {
    	    0x2a: 0xe1,
    	    // á
    	    0x5c: 0xe9,
    	    // é
    	    0x5e: 0xed,
    	    // í
    	    0x5f: 0xf3,
    	    // ó
    	    0x60: 0xfa,
    	    // ú
    	    0x7b: 0xe7,
    	    // ç
    	    0x7c: 0xf7,
    	    // ÷
    	    0x7d: 0xd1,
    	    // Ñ
    	    0x7e: 0xf1,
    	    // ñ
    	    0x7f: 0x2588,
    	    // █
    	    0x0130: 0xae,
    	    // ®
    	    0x0131: 0xb0,
    	    // °
    	    0x0132: 0xbd,
    	    // ½
    	    0x0133: 0xbf,
    	    // ¿
    	    0x0134: 0x2122,
    	    // ™
    	    0x0135: 0xa2,
    	    // ¢
    	    0x0136: 0xa3,
    	    // £
    	    0x0137: 0x266a,
    	    // ♪
    	    0x0138: 0xe0,
    	    // à
    	    0x0139: 0xa0,
    	    //
    	    0x013a: 0xe8,
    	    // è
    	    0x013b: 0xe2,
    	    // â
    	    0x013c: 0xea,
    	    // ê
    	    0x013d: 0xee,
    	    // î
    	    0x013e: 0xf4,
    	    // ô
    	    0x013f: 0xfb,
    	    // û
    	    0x0220: 0xc1,
    	    // Á
    	    0x0221: 0xc9,
    	    // É
    	    0x0222: 0xd3,
    	    // Ó
    	    0x0223: 0xda,
    	    // Ú
    	    0x0224: 0xdc,
    	    // Ü
    	    0x0225: 0xfc,
    	    // ü
    	    0x0226: 0x2018,
    	    // ‘
    	    0x0227: 0xa1,
    	    // ¡
    	    0x0228: 0x2a,
    	    // *
    	    0x0229: 0x27,
    	    // '
    	    0x022a: 0x2014,
    	    // —
    	    0x022b: 0xa9,
    	    // ©
    	    0x022c: 0x2120,
    	    // ℠
    	    0x022d: 0x2022,
    	    // •
    	    0x022e: 0x201c,
    	    // “
    	    0x022f: 0x201d,
    	    // ”
    	    0x0230: 0xc0,
    	    // À
    	    0x0231: 0xc2,
    	    // Â
    	    0x0232: 0xc7,
    	    // Ç
    	    0x0233: 0xc8,
    	    // È
    	    0x0234: 0xca,
    	    // Ê
    	    0x0235: 0xcb,
    	    // Ë
    	    0x0236: 0xeb,
    	    // ë
    	    0x0237: 0xce,
    	    // Î
    	    0x0238: 0xcf,
    	    // Ï
    	    0x0239: 0xef,
    	    // ï
    	    0x023a: 0xd4,
    	    // Ô
    	    0x023b: 0xd9,
    	    // Ù
    	    0x023c: 0xf9,
    	    // ù
    	    0x023d: 0xdb,
    	    // Û
    	    0x023e: 0xab,
    	    // «
    	    0x023f: 0xbb,
    	    // »
    	    0x0320: 0xc3,
    	    // Ã
    	    0x0321: 0xe3,
    	    // ã
    	    0x0322: 0xcd,
    	    // Í
    	    0x0323: 0xcc,
    	    // Ì
    	    0x0324: 0xec,
    	    // ì
    	    0x0325: 0xd2,
    	    // Ò
    	    0x0326: 0xf2,
    	    // ò
    	    0x0327: 0xd5,
    	    // Õ
    	    0x0328: 0xf5,
    	    // õ
    	    0x0329: 0x7b,
    	    // {
    	    0x032a: 0x7d,
    	    // }
    	    0x032b: 0x5c,
    	    // \
    	    0x032c: 0x5e,
    	    // ^
    	    0x032d: 0x5f,
    	    // _
    	    0x032e: 0x7c,
    	    // |
    	    0x032f: 0x7e,
    	    // ~
    	    0x0330: 0xc4,
    	    // Ä
    	    0x0331: 0xe4,
    	    // ä
    	    0x0332: 0xd6,
    	    // Ö
    	    0x0333: 0xf6,
    	    // ö
    	    0x0334: 0xdf,
    	    // ß
    	    0x0335: 0xa5,
    	    // ¥
    	    0x0336: 0xa4,
    	    // ¤
    	    0x0337: 0x2502,
    	    // │
    	    0x0338: 0xc5,
    	    // Å
    	    0x0339: 0xe5,
    	    // å
    	    0x033a: 0xd8,
    	    // Ø
    	    0x033b: 0xf8,
    	    // ø
    	    0x033c: 0x250c,
    	    // ┌
    	    0x033d: 0x2510,
    	    // ┐
    	    0x033e: 0x2514,
    	    // └
    	    0x033f: 0x2518 // ┘
    	  };

    	  var getCharFromCode = function getCharFromCode(code) {
    	    if (code === null) {
    	      return '';
    	    }
    	    code = CHARACTER_TRANSLATION[code] || code;
    	    return String.fromCharCode(code);
    	  };

    	  // the index of the last row in a CEA-608 display buffer
    	  var BOTTOM_ROW = 14;

    	  // This array is used for mapping PACs -> row #, since there's no way of
    	  // getting it through bit logic.
    	  var ROWS = [0x1100, 0x1120, 0x1200, 0x1220, 0x1500, 0x1520, 0x1600, 0x1620, 0x1700, 0x1720, 0x1000, 0x1300, 0x1320, 0x1400, 0x1420];

    	  // CEA-608 captions are rendered onto a 34x15 matrix of character
    	  // cells. The "bottom" row is the last element in the outer array.
    	  var createDisplayBuffer = function createDisplayBuffer() {
    	    var result = [],
    	      i = BOTTOM_ROW + 1;
    	    while (i--) {
    	      result.push('');
    	    }
    	    return result;
    	  };
    	  var Cea608Stream = function Cea608Stream(field, dataChannel) {
    	    Cea608Stream.prototype.init.call(this);
    	    this.field_ = field || 0;
    	    this.dataChannel_ = dataChannel || 0;
    	    this.name_ = 'CC' + ((this.field_ << 1 | this.dataChannel_) + 1);
    	    this.setConstants();
    	    this.reset();
    	    this.push = function (packet) {
    	      var data, swap, char0, char1, text;
    	      // remove the parity bits
    	      data = packet.ccData & 0x7f7f;

    	      // ignore duplicate control codes; the spec demands they're sent twice
    	      if (data === this.lastControlCode_) {
    	        this.lastControlCode_ = null;
    	        return;
    	      }

    	      // Store control codes
    	      if ((data & 0xf000) === 0x1000) {
    	        this.lastControlCode_ = data;
    	      } else if (data !== this.PADDING_) {
    	        this.lastControlCode_ = null;
    	      }
    	      char0 = data >>> 8;
    	      char1 = data & 0xff;
    	      if (data === this.PADDING_) {
    	        return;
    	      } else if (data === this.RESUME_CAPTION_LOADING_) {
    	        this.mode_ = 'popOn';
    	      } else if (data === this.END_OF_CAPTION_) {
    	        // If an EOC is received while in paint-on mode, the displayed caption
    	        // text should be swapped to non-displayed memory as if it was a pop-on
    	        // caption. Because of that, we should explicitly switch back to pop-on
    	        // mode
    	        this.mode_ = 'popOn';
    	        this.clearFormatting(packet.pts);
    	        // if a caption was being displayed, it's gone now
    	        this.flushDisplayed(packet.pts);

    	        // flip memory
    	        swap = this.displayed_;
    	        this.displayed_ = this.nonDisplayed_;
    	        this.nonDisplayed_ = swap;

    	        // start measuring the time to display the caption
    	        this.startPts_ = packet.pts;
    	      } else if (data === this.ROLL_UP_2_ROWS_) {
    	        this.rollUpRows_ = 2;
    	        this.setRollUp(packet.pts);
    	      } else if (data === this.ROLL_UP_3_ROWS_) {
    	        this.rollUpRows_ = 3;
    	        this.setRollUp(packet.pts);
    	      } else if (data === this.ROLL_UP_4_ROWS_) {
    	        this.rollUpRows_ = 4;
    	        this.setRollUp(packet.pts);
    	      } else if (data === this.CARRIAGE_RETURN_) {
    	        this.clearFormatting(packet.pts);
    	        this.flushDisplayed(packet.pts);
    	        this.shiftRowsUp_();
    	        this.startPts_ = packet.pts;
    	      } else if (data === this.BACKSPACE_) {
    	        if (this.mode_ === 'popOn') {
    	          this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1);
    	        } else {
    	          this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1);
    	        }
    	      } else if (data === this.ERASE_DISPLAYED_MEMORY_) {
    	        this.flushDisplayed(packet.pts);
    	        this.displayed_ = createDisplayBuffer();
    	      } else if (data === this.ERASE_NON_DISPLAYED_MEMORY_) {
    	        this.nonDisplayed_ = createDisplayBuffer();
    	      } else if (data === this.RESUME_DIRECT_CAPTIONING_) {
    	        if (this.mode_ !== 'paintOn') {
    	          // NOTE: This should be removed when proper caption positioning is
    	          // implemented
    	          this.flushDisplayed(packet.pts);
    	          this.displayed_ = createDisplayBuffer();
    	        }
    	        this.mode_ = 'paintOn';
    	        this.startPts_ = packet.pts;

    	        // Append special characters to caption text
    	      } else if (this.isSpecialCharacter(char0, char1)) {
    	        // Bitmask char0 so that we can apply character transformations
    	        // regardless of field and data channel.
    	        // Then byte-shift to the left and OR with char1 so we can pass the
    	        // entire character code to `getCharFromCode`.
    	        char0 = (char0 & 0x03) << 8;
    	        text = getCharFromCode(char0 | char1);
    	        this[this.mode_](packet.pts, text);
    	        this.column_++;

    	        // Append extended characters to caption text
    	      } else if (this.isExtCharacter(char0, char1)) {
    	        // Extended characters always follow their "non-extended" equivalents.
    	        // IE if a "è" is desired, you'll always receive "eè"; non-compliant
    	        // decoders are supposed to drop the "è", while compliant decoders
    	        // backspace the "e" and insert "è".

    	        // Delete the previous character
    	        if (this.mode_ === 'popOn') {
    	          this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1);
    	        } else {
    	          this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1);
    	        }

    	        // Bitmask char0 so that we can apply character transformations
    	        // regardless of field and data channel.
    	        // Then byte-shift to the left and OR with char1 so we can pass the
    	        // entire character code to `getCharFromCode`.
    	        char0 = (char0 & 0x03) << 8;
    	        text = getCharFromCode(char0 | char1);
    	        this[this.mode_](packet.pts, text);
    	        this.column_++;

    	        // Process mid-row codes
    	      } else if (this.isMidRowCode(char0, char1)) {
    	        // Attributes are not additive, so clear all formatting
    	        this.clearFormatting(packet.pts);

    	        // According to the standard, mid-row codes
    	        // should be replaced with spaces, so add one now
    	        this[this.mode_](packet.pts, ' ');
    	        this.column_++;
    	        if ((char1 & 0xe) === 0xe) {
    	          this.addFormatting(packet.pts, ['i']);
    	        }
    	        if ((char1 & 0x1) === 0x1) {
    	          this.addFormatting(packet.pts, ['u']);
    	        }

    	        // Detect offset control codes and adjust cursor
    	      } else if (this.isOffsetControlCode(char0, char1)) {
    	        // Cursor position is set by indent PAC (see below) in 4-column
    	        // increments, with an additional offset code of 1-3 to reach any
    	        // of the 32 columns specified by CEA-608. So all we need to do
    	        // here is increment the column cursor by the given offset.
    	        this.column_ += char1 & 0x03;

    	        // Detect PACs (Preamble Address Codes)
    	      } else if (this.isPAC(char0, char1)) {
    	        // There's no logic for PAC -> row mapping, so we have to just
    	        // find the row code in an array and use its index :(
    	        var row = ROWS.indexOf(data & 0x1f20);

    	        // Configure the caption window if we're in roll-up mode
    	        if (this.mode_ === 'rollUp') {
    	          // This implies that the base row is incorrectly set.
    	          // As per the recommendation in CEA-608(Base Row Implementation), defer to the number
    	          // of roll-up rows set.
    	          if (row - this.rollUpRows_ + 1 < 0) {
    	            row = this.rollUpRows_ - 1;
    	          }
    	          this.setRollUp(packet.pts, row);
    	        }
    	        if (row !== this.row_) {
    	          // formatting is only persistent for current row
    	          this.clearFormatting(packet.pts);
    	          this.row_ = row;
    	        }
    	        // All PACs can apply underline, so detect and apply
    	        // (All odd-numbered second bytes set underline)
    	        if (char1 & 0x1 && this.formatting_.indexOf('u') === -1) {
    	          this.addFormatting(packet.pts, ['u']);
    	        }
    	        if ((data & 0x10) === 0x10) {
    	          // We've got an indent level code. Each successive even number
    	          // increments the column cursor by 4, so we can get the desired
    	          // column position by bit-shifting to the right (to get n/2)
    	          // and multiplying by 4.
    	          this.column_ = ((data & 0xe) >> 1) * 4;
    	        }
    	        if (this.isColorPAC(char1)) {
    	          // it's a color code, though we only support white, which
    	          // can be either normal or italicized. white italics can be
    	          // either 0x4e or 0x6e depending on the row, so we just
    	          // bitwise-and with 0xe to see if italics should be turned on
    	          if ((char1 & 0xe) === 0xe) {
    	            this.addFormatting(packet.pts, ['i']);
    	          }
    	        }

    	        // We have a normal character in char0, and possibly one in char1
    	      } else if (this.isNormalChar(char0)) {
    	        if (char1 === 0x00) {
    	          char1 = null;
    	        }
    	        text = getCharFromCode(char0);
    	        text += getCharFromCode(char1);
    	        this[this.mode_](packet.pts, text);
    	        this.column_ += text.length;
    	      } // finish data processing
    	    };
    	  };

    	  Cea608Stream.prototype = new stream();
    	  // Trigger a cue point that captures the current state of the
    	  // display buffer
    	  Cea608Stream.prototype.flushDisplayed = function (pts) {
    	    var content = this.displayed_
    	    // remove spaces from the start and end of the string
    	    .map(function (row, index) {
    	      try {
    	        return row.trim();
    	      } catch (e) {
    	        // Ordinarily, this shouldn't happen. However, caption
    	        // parsing errors should not throw exceptions and
    	        // break playback.
    	        this.trigger('log', {
    	          level: 'warn',
    	          message: 'Skipping a malformed 608 caption at index ' + index + '.'
    	        });
    	        return '';
    	      }
    	    }, this)
    	    // combine all text rows to display in one cue
    	    .join('\n')
    	    // and remove blank rows from the start and end, but not the middle
    	    .replace(/^\n+|\n+$/g, '');
    	    if (content.length) {
    	      this.trigger('data', {
    	        startPts: this.startPts_,
    	        endPts: pts,
    	        text: content,
    	        stream: this.name_
    	      });
    	    }
    	  };

    	  /**
    	   * Zero out the data, used for startup and on seek
    	   */
    	  Cea608Stream.prototype.reset = function () {
    	    this.mode_ = 'popOn';
    	    // When in roll-up mode, the index of the last row that will
    	    // actually display captions. If a caption is shifted to a row
    	    // with a lower index than this, it is cleared from the display
    	    // buffer
    	    this.topRow_ = 0;
    	    this.startPts_ = 0;
    	    this.displayed_ = createDisplayBuffer();
    	    this.nonDisplayed_ = createDisplayBuffer();
    	    this.lastControlCode_ = null;

    	    // Track row and column for proper line-breaking and spacing
    	    this.column_ = 0;
    	    this.row_ = BOTTOM_ROW;
    	    this.rollUpRows_ = 2;

    	    // This variable holds currently-applied formatting
    	    this.formatting_ = [];
    	  };

    	  /**
    	   * Sets up control code and related constants for this instance
    	   */
    	  Cea608Stream.prototype.setConstants = function () {
    	    // The following attributes have these uses:
    	    // ext_ :    char0 for mid-row codes, and the base for extended
    	    //           chars (ext_+0, ext_+1, and ext_+2 are char0s for
    	    //           extended codes)
    	    // control_: char0 for control codes, except byte-shifted to the
    	    //           left so that we can do this.control_ | CONTROL_CODE
    	    // offset_:  char0 for tab offset codes
    	    //
    	    // It's also worth noting that control codes, and _only_ control codes,
    	    // differ between field 1 and field2. Field 2 control codes are always
    	    // their field 1 value plus 1. That's why there's the "| field" on the
    	    // control value.
    	    if (this.dataChannel_ === 0) {
    	      this.BASE_ = 0x10;
    	      this.EXT_ = 0x11;
    	      this.CONTROL_ = (0x14 | this.field_) << 8;
    	      this.OFFSET_ = 0x17;
    	    } else if (this.dataChannel_ === 1) {
    	      this.BASE_ = 0x18;
    	      this.EXT_ = 0x19;
    	      this.CONTROL_ = (0x1c | this.field_) << 8;
    	      this.OFFSET_ = 0x1f;
    	    }

    	    // Constants for the LSByte command codes recognized by Cea608Stream. This
    	    // list is not exhaustive. For a more comprehensive listing and semantics see
    	    // http://www.gpo.gov/fdsys/pkg/CFR-2010-title47-vol1/pdf/CFR-2010-title47-vol1-sec15-119.pdf
    	    // Padding
    	    this.PADDING_ = 0x0000;
    	    // Pop-on Mode
    	    this.RESUME_CAPTION_LOADING_ = this.CONTROL_ | 0x20;
    	    this.END_OF_CAPTION_ = this.CONTROL_ | 0x2f;
    	    // Roll-up Mode
    	    this.ROLL_UP_2_ROWS_ = this.CONTROL_ | 0x25;
    	    this.ROLL_UP_3_ROWS_ = this.CONTROL_ | 0x26;
    	    this.ROLL_UP_4_ROWS_ = this.CONTROL_ | 0x27;
    	    this.CARRIAGE_RETURN_ = this.CONTROL_ | 0x2d;
    	    // paint-on mode
    	    this.RESUME_DIRECT_CAPTIONING_ = this.CONTROL_ | 0x29;
    	    // Erasure
    	    this.BACKSPACE_ = this.CONTROL_ | 0x21;
    	    this.ERASE_DISPLAYED_MEMORY_ = this.CONTROL_ | 0x2c;
    	    this.ERASE_NON_DISPLAYED_MEMORY_ = this.CONTROL_ | 0x2e;
    	  };

    	  /**
    	   * Detects if the 2-byte packet data is a special character
    	   *
    	   * Special characters have a second byte in the range 0x30 to 0x3f,
    	   * with the first byte being 0x11 (for data channel 1) or 0x19 (for
    	   * data channel 2).
    	   *
    	   * @param  {Integer} char0 The first byte
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the 2 bytes are an special character
    	   */
    	  Cea608Stream.prototype.isSpecialCharacter = function (char0, char1) {
    	    return char0 === this.EXT_ && char1 >= 0x30 && char1 <= 0x3f;
    	  };

    	  /**
    	   * Detects if the 2-byte packet data is an extended character
    	   *
    	   * Extended characters have a second byte in the range 0x20 to 0x3f,
    	   * with the first byte being 0x12 or 0x13 (for data channel 1) or
    	   * 0x1a or 0x1b (for data channel 2).
    	   *
    	   * @param  {Integer} char0 The first byte
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the 2 bytes are an extended character
    	   */
    	  Cea608Stream.prototype.isExtCharacter = function (char0, char1) {
    	    return (char0 === this.EXT_ + 1 || char0 === this.EXT_ + 2) && char1 >= 0x20 && char1 <= 0x3f;
    	  };

    	  /**
    	   * Detects if the 2-byte packet is a mid-row code
    	   *
    	   * Mid-row codes have a second byte in the range 0x20 to 0x2f, with
    	   * the first byte being 0x11 (for data channel 1) or 0x19 (for data
    	   * channel 2).
    	   *
    	   * @param  {Integer} char0 The first byte
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the 2 bytes are a mid-row code
    	   */
    	  Cea608Stream.prototype.isMidRowCode = function (char0, char1) {
    	    return char0 === this.EXT_ && char1 >= 0x20 && char1 <= 0x2f;
    	  };

    	  /**
    	   * Detects if the 2-byte packet is an offset control code
    	   *
    	   * Offset control codes have a second byte in the range 0x21 to 0x23,
    	   * with the first byte being 0x17 (for data channel 1) or 0x1f (for
    	   * data channel 2).
    	   *
    	   * @param  {Integer} char0 The first byte
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the 2 bytes are an offset control code
    	   */
    	  Cea608Stream.prototype.isOffsetControlCode = function (char0, char1) {
    	    return char0 === this.OFFSET_ && char1 >= 0x21 && char1 <= 0x23;
    	  };

    	  /**
    	   * Detects if the 2-byte packet is a Preamble Address Code
    	   *
    	   * PACs have a first byte in the range 0x10 to 0x17 (for data channel 1)
    	   * or 0x18 to 0x1f (for data channel 2), with the second byte in the
    	   * range 0x40 to 0x7f.
    	   *
    	   * @param  {Integer} char0 The first byte
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the 2 bytes are a PAC
    	   */
    	  Cea608Stream.prototype.isPAC = function (char0, char1) {
    	    return char0 >= this.BASE_ && char0 < this.BASE_ + 8 && char1 >= 0x40 && char1 <= 0x7f;
    	  };

    	  /**
    	   * Detects if a packet's second byte is in the range of a PAC color code
    	   *
    	   * PAC color codes have the second byte be in the range 0x40 to 0x4f, or
    	   * 0x60 to 0x6f.
    	   *
    	   * @param  {Integer} char1 The second byte
    	   * @return {Boolean}       Whether the byte is a color PAC
    	   */
    	  Cea608Stream.prototype.isColorPAC = function (char1) {
    	    return char1 >= 0x40 && char1 <= 0x4f || char1 >= 0x60 && char1 <= 0x7f;
    	  };

    	  /**
    	   * Detects if a single byte is in the range of a normal character
    	   *
    	   * Normal text bytes are in the range 0x20 to 0x7f.
    	   *
    	   * @param  {Integer} char  The byte
    	   * @return {Boolean}       Whether the byte is a normal character
    	   */
    	  Cea608Stream.prototype.isNormalChar = function (char) {
    	    return char >= 0x20 && char <= 0x7f;
    	  };

    	  /**
    	   * Configures roll-up
    	   *
    	   * @param  {Integer} pts         Current PTS
    	   * @param  {Integer} newBaseRow  Used by PACs to slide the current window to
    	   *                               a new position
    	   */
    	  Cea608Stream.prototype.setRollUp = function (pts, newBaseRow) {
    	    // Reset the base row to the bottom row when switching modes
    	    if (this.mode_ !== 'rollUp') {
    	      this.row_ = BOTTOM_ROW;
    	      this.mode_ = 'rollUp';
    	      // Spec says to wipe memories when switching to roll-up
    	      this.flushDisplayed(pts);
    	      this.nonDisplayed_ = createDisplayBuffer();
    	      this.displayed_ = createDisplayBuffer();
    	    }
    	    if (newBaseRow !== undefined && newBaseRow !== this.row_) {
    	      // move currently displayed captions (up or down) to the new base row
    	      for (var i = 0; i < this.rollUpRows_; i++) {
    	        this.displayed_[newBaseRow - i] = this.displayed_[this.row_ - i];
    	        this.displayed_[this.row_ - i] = '';
    	      }
    	    }
    	    if (newBaseRow === undefined) {
    	      newBaseRow = this.row_;
    	    }
    	    this.topRow_ = newBaseRow - this.rollUpRows_ + 1;
    	  };

    	  // Adds the opening HTML tag for the passed character to the caption text,
    	  // and keeps track of it for later closing
    	  Cea608Stream.prototype.addFormatting = function (pts, format) {
    	    this.formatting_ = this.formatting_.concat(format);
    	    var text = format.reduce(function (text, format) {
    	      return text + '<' + format + '>';
    	    }, '');
    	    this[this.mode_](pts, text);
    	  };

    	  // Adds HTML closing tags for current formatting to caption text and
    	  // clears remembered formatting
    	  Cea608Stream.prototype.clearFormatting = function (pts) {
    	    if (!this.formatting_.length) {
    	      return;
    	    }
    	    var text = this.formatting_.reverse().reduce(function (text, format) {
    	      return text + '</' + format + '>';
    	    }, '');
    	    this.formatting_ = [];
    	    this[this.mode_](pts, text);
    	  };

    	  // Mode Implementations
    	  Cea608Stream.prototype.popOn = function (pts, text) {
    	    var baseRow = this.nonDisplayed_[this.row_];

    	    // buffer characters
    	    baseRow += text;
    	    this.nonDisplayed_[this.row_] = baseRow;
    	  };
    	  Cea608Stream.prototype.rollUp = function (pts, text) {
    	    var baseRow = this.displayed_[this.row_];
    	    baseRow += text;
    	    this.displayed_[this.row_] = baseRow;
    	  };
    	  Cea608Stream.prototype.shiftRowsUp_ = function () {
    	    var i;
    	    // clear out inactive rows
    	    for (i = 0; i < this.topRow_; i++) {
    	      this.displayed_[i] = '';
    	    }
    	    for (i = this.row_ + 1; i < BOTTOM_ROW + 1; i++) {
    	      this.displayed_[i] = '';
    	    }
    	    // shift displayed rows up
    	    for (i = this.topRow_; i < this.row_; i++) {
    	      this.displayed_[i] = this.displayed_[i + 1];
    	    }
    	    // clear out the bottom row
    	    this.displayed_[this.row_] = '';
    	  };
    	  Cea608Stream.prototype.paintOn = function (pts, text) {
    	    var baseRow = this.displayed_[this.row_];
    	    baseRow += text;
    	    this.displayed_[this.row_] = baseRow;
    	  };

    	  // exports
    	  var captionStream = {
    	    CaptionStream: CaptionStream,
    	    Cea608Stream: Cea608Stream,
    	    Cea708Stream: Cea708Stream
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */

    	  var streamTypes = {
    	    H264_STREAM_TYPE: 0x1B,
    	    ADTS_STREAM_TYPE: 0x0F,
    	    METADATA_STREAM_TYPE: 0x15
    	  };

    	  var MAX_TS = 8589934592;
    	  var RO_THRESH = 4294967296;
    	  var TYPE_SHARED = 'shared';
    	  var handleRollover = function handleRollover(value, reference) {
    	    var direction = 1;
    	    if (value > reference) {
    	      // If the current timestamp value is greater than our reference timestamp and we detect a
    	      // timestamp rollover, this means the roll over is happening in the opposite direction.
    	      // Example scenario: Enter a long stream/video just after a rollover occurred. The reference
    	      // point will be set to a small number, e.g. 1. The user then seeks backwards over the
    	      // rollover point. In loading this segment, the timestamp values will be very large,
    	      // e.g. 2^33 - 1. Since this comes before the data we loaded previously, we want to adjust
    	      // the time stamp to be `value - 2^33`.
    	      direction = -1;
    	    }

    	    // Note: A seek forwards or back that is greater than the RO_THRESH (2^32, ~13 hours) will
    	    // cause an incorrect adjustment.
    	    while (Math.abs(reference - value) > RO_THRESH) {
    	      value += direction * MAX_TS;
    	    }
    	    return value;
    	  };
    	  var TimestampRolloverStream$1 = function TimestampRolloverStream(type) {
    	    var lastDTS, referenceDTS;
    	    TimestampRolloverStream.prototype.init.call(this);

    	    // The "shared" type is used in cases where a stream will contain muxed
    	    // video and audio. We could use `undefined` here, but having a string
    	    // makes debugging a little clearer.
    	    this.type_ = type || TYPE_SHARED;
    	    this.push = function (data) {
    	      // Any "shared" rollover streams will accept _all_ data. Otherwise,
    	      // streams will only accept data that matches their type.
    	      if (this.type_ !== TYPE_SHARED && data.type !== this.type_) {
    	        return;
    	      }
    	      if (referenceDTS === undefined) {
    	        referenceDTS = data.dts;
    	      }
    	      data.dts = handleRollover(data.dts, referenceDTS);
    	      data.pts = handleRollover(data.pts, referenceDTS);
    	      lastDTS = data.dts;
    	      this.trigger('data', data);
    	    };
    	    this.flush = function () {
    	      referenceDTS = lastDTS;
    	      this.trigger('done');
    	    };
    	    this.endTimeline = function () {
    	      this.flush();
    	      this.trigger('endedtimeline');
    	    };
    	    this.discontinuity = function () {
    	      referenceDTS = void 0;
    	      lastDTS = void 0;
    	    };
    	    this.reset = function () {
    	      this.discontinuity();
    	      this.trigger('reset');
    	    };
    	  };
    	  TimestampRolloverStream$1.prototype = new stream();
    	  var timestampRolloverStream = {
    	    TimestampRolloverStream: TimestampRolloverStream$1,
    	    handleRollover: handleRollover
    	  };

    	  // IE11 doesn't support indexOf for TypedArrays.
    	  // Once IE11 support is dropped, this function should be removed.
    	  var typedArrayIndexOf$1 = function typedArrayIndexOf(typedArray, element, fromIndex) {
    	    if (!typedArray) {
    	      return -1;
    	    }
    	    var currentIndex = fromIndex;
    	    for (; currentIndex < typedArray.length; currentIndex++) {
    	      if (typedArray[currentIndex] === element) {
    	        return currentIndex;
    	      }
    	    }
    	    return -1;
    	  };
    	  var typedArray = {
    	    typedArrayIndexOf: typedArrayIndexOf$1
    	  };

    	  var typedArrayIndexOf = typedArray.typedArrayIndexOf,
    	    // Frames that allow different types of text encoding contain a text
    	    // encoding description byte [ID3v2.4.0 section 4.]
    	    textEncodingDescriptionByte = {
    	      Iso88591: 0x00,
    	      // ISO-8859-1, terminated with \0.
    	      Utf16: 0x01,
    	      // UTF-16 encoded Unicode BOM, terminated with \0\0
    	      Utf16be: 0x02,
    	      // UTF-16BE encoded Unicode, without BOM, terminated with \0\0
    	      Utf8: 0x03 // UTF-8 encoded Unicode, terminated with \0
    	    },
    	    // return a percent-encoded representation of the specified byte range
    	    // @see http://en.wikipedia.org/wiki/Percent-encoding 
    	    percentEncode$1 = function percentEncode(bytes, start, end) {
    	      var i,
    	        result = '';
    	      for (i = start; i < end; i++) {
    	        result += '%' + ('00' + bytes[i].toString(16)).slice(-2);
    	      }
    	      return result;
    	    },
    	    // return the string representation of the specified byte range,
    	    // interpreted as UTf-8.
    	    parseUtf8 = function parseUtf8(bytes, start, end) {
    	      return decodeURIComponent(percentEncode$1(bytes, start, end));
    	    },
    	    // return the string representation of the specified byte range,
    	    // interpreted as ISO-8859-1.
    	    parseIso88591$1 = function parseIso88591(bytes, start, end) {
    	      return unescape(percentEncode$1(bytes, start, end)); // jshint ignore:line
    	    },
    	    parseSyncSafeInteger$1 = function parseSyncSafeInteger(data) {
    	      return data[0] << 21 | data[1] << 14 | data[2] << 7 | data[3];
    	    },
    	    frameParsers = {
    	      'APIC': function APIC(frame) {
    	        var i = 1,
    	          mimeTypeEndIndex,
    	          descriptionEndIndex,
    	          LINK_MIME_TYPE = '-->';
    	        if (frame.data[0] !== textEncodingDescriptionByte.Utf8) {
    	          // ignore frames with unrecognized character encodings
    	          return;
    	        }

    	        // parsing fields [ID3v2.4.0 section 4.14.]
    	        mimeTypeEndIndex = typedArrayIndexOf(frame.data, 0, i);
    	        if (mimeTypeEndIndex < 0) {
    	          // malformed frame
    	          return;
    	        }

    	        // parsing Mime type field (terminated with \0)
    	        frame.mimeType = parseIso88591$1(frame.data, i, mimeTypeEndIndex);
    	        i = mimeTypeEndIndex + 1;

    	        // parsing 1-byte Picture Type field
    	        frame.pictureType = frame.data[i];
    	        i++;
    	        descriptionEndIndex = typedArrayIndexOf(frame.data, 0, i);
    	        if (descriptionEndIndex < 0) {
    	          // malformed frame
    	          return;
    	        }

    	        // parsing Description field (terminated with \0)
    	        frame.description = parseUtf8(frame.data, i, descriptionEndIndex);
    	        i = descriptionEndIndex + 1;
    	        if (frame.mimeType === LINK_MIME_TYPE) {
    	          // parsing Picture Data field as URL (always represented as ISO-8859-1 [ID3v2.4.0 section 4.])
    	          frame.url = parseIso88591$1(frame.data, i, frame.data.length);
    	        } else {
    	          // parsing Picture Data field as binary data
    	          frame.pictureData = frame.data.subarray(i, frame.data.length);
    	        }
    	      },
    	      'T*': function T(frame) {
    	        if (frame.data[0] !== textEncodingDescriptionByte.Utf8) {
    	          // ignore frames with unrecognized character encodings
    	          return;
    	        }

    	        // parse text field, do not include null terminator in the frame value
    	        // frames that allow different types of encoding contain terminated text [ID3v2.4.0 section 4.]
    	        frame.value = parseUtf8(frame.data, 1, frame.data.length).replace(/\0*$/, '');
    	        // text information frames supports multiple strings, stored as a terminator separated list [ID3v2.4.0 section 4.2.]
    	        frame.values = frame.value.split('\0');
    	      },
    	      'TXXX': function TXXX(frame) {
    	        var descriptionEndIndex;
    	        if (frame.data[0] !== textEncodingDescriptionByte.Utf8) {
    	          // ignore frames with unrecognized character encodings
    	          return;
    	        }
    	        descriptionEndIndex = typedArrayIndexOf(frame.data, 0, 1);
    	        if (descriptionEndIndex === -1) {
    	          return;
    	        }

    	        // parse the text fields
    	        frame.description = parseUtf8(frame.data, 1, descriptionEndIndex);
    	        // do not include the null terminator in the tag value
    	        // frames that allow different types of encoding contain terminated text
    	        // [ID3v2.4.0 section 4.]
    	        frame.value = parseUtf8(frame.data, descriptionEndIndex + 1, frame.data.length).replace(/\0*$/, '');
    	        frame.data = frame.value;
    	      },
    	      'W*': function W(frame) {
    	        // parse URL field; URL fields are always represented as ISO-8859-1 [ID3v2.4.0 section 4.]
    	        // if the value is followed by a string termination all the following information should be ignored [ID3v2.4.0 section 4.3]
    	        frame.url = parseIso88591$1(frame.data, 0, frame.data.length).replace(/\0.*$/, '');
    	      },
    	      'WXXX': function WXXX(frame) {
    	        var descriptionEndIndex;
    	        if (frame.data[0] !== textEncodingDescriptionByte.Utf8) {
    	          // ignore frames with unrecognized character encodings
    	          return;
    	        }
    	        descriptionEndIndex = typedArrayIndexOf(frame.data, 0, 1);
    	        if (descriptionEndIndex === -1) {
    	          return;
    	        }

    	        // parse the description and URL fields
    	        frame.description = parseUtf8(frame.data, 1, descriptionEndIndex);
    	        // URL fields are always represented as ISO-8859-1 [ID3v2.4.0 section 4.]
    	        // if the value is followed by a string termination all the following information
    	        // should be ignored [ID3v2.4.0 section 4.3]
    	        frame.url = parseIso88591$1(frame.data, descriptionEndIndex + 1, frame.data.length).replace(/\0.*$/, '');
    	      },
    	      'PRIV': function PRIV(frame) {
    	        var i;
    	        for (i = 0; i < frame.data.length; i++) {
    	          if (frame.data[i] === 0) {
    	            // parse the description and URL fields
    	            frame.owner = parseIso88591$1(frame.data, 0, i);
    	            break;
    	          }
    	        }
    	        frame.privateData = frame.data.subarray(i + 1);
    	        frame.data = frame.privateData;
    	      }
    	    };
    	  var parseId3Frames = function parseId3Frames(data) {
    	    var frameSize,
    	      frameHeader,
    	      frameStart = 10,
    	      tagSize = 0,
    	      frames = [];

    	    // If we don't have enough data for a header, 10 bytes, 
    	    // or 'ID3' in the first 3 bytes this is not a valid ID3 tag.
    	    if (data.length < 10 || data[0] !== 'I'.charCodeAt(0) || data[1] !== 'D'.charCodeAt(0) || data[2] !== '3'.charCodeAt(0)) {
    	      return;
    	    }
    	    // the frame size is transmitted as a 28-bit integer in the
    	    // last four bytes of the ID3 header.
    	    // The most significant bit of each byte is dropped and the
    	    // results concatenated to recover the actual value.
    	    tagSize = parseSyncSafeInteger$1(data.subarray(6, 10));

    	    // ID3 reports the tag size excluding the header but it's more
    	    // convenient for our comparisons to include it
    	    tagSize += 10;
    	    // check bit 6 of byte 5 for the extended header flag.
    	    var hasExtendedHeader = data[5] & 0x40;
    	    if (hasExtendedHeader) {
    	      // advance the frame start past the extended header
    	      frameStart += 4; // header size field
    	      frameStart += parseSyncSafeInteger$1(data.subarray(10, 14));
    	      tagSize -= parseSyncSafeInteger$1(data.subarray(16, 20)); // clip any padding off the end
    	    }

    	    // parse one or more ID3 frames
    	    // http://id3.org/id3v2.3.0#ID3v2_frame_overview
    	    do {
    	      // determine the number of bytes in this frame
    	      frameSize = parseSyncSafeInteger$1(data.subarray(frameStart + 4, frameStart + 8));
    	      if (frameSize < 1) {
    	        break;
    	      }
    	      frameHeader = String.fromCharCode(data[frameStart], data[frameStart + 1], data[frameStart + 2], data[frameStart + 3]);
    	      var frame = {
    	        id: frameHeader,
    	        data: data.subarray(frameStart + 10, frameStart + frameSize + 10)
    	      };
    	      frame.key = frame.id;

    	      // parse frame values
    	      if (frameParsers[frame.id]) {
    	        // use frame specific parser
    	        frameParsers[frame.id](frame);
    	      } else if (frame.id[0] === 'T') {
    	        // use text frame generic parser
    	        frameParsers['T*'](frame);
    	      } else if (frame.id[0] === 'W') {
    	        // use URL link frame generic parser
    	        frameParsers['W*'](frame);
    	      }
    	      frames.push(frame);
    	      frameStart += 10; // advance past the frame header
    	      frameStart += frameSize; // advance past the frame body
    	    } while (frameStart < tagSize);
    	    return frames;
    	  };
    	  var parseId3 = {
    	    parseId3Frames: parseId3Frames,
    	    parseSyncSafeInteger: parseSyncSafeInteger$1,
    	    frameParsers: frameParsers
    	  };

    	  var _MetadataStream;
    	  _MetadataStream = function MetadataStream(options) {
    	    var settings = {
    	        // the bytes of the program-level descriptor field in MP2T
    	        // see ISO/IEC 13818-1:2013 (E), section 2.6 "Program and
    	        // program element descriptors"
    	        descriptor: options && options.descriptor
    	      },
    	      // the total size in bytes of the ID3 tag being parsed
    	      tagSize = 0,
    	      // tag data that is not complete enough to be parsed
    	      buffer = [],
    	      // the total number of bytes currently in the buffer
    	      bufferSize = 0,
    	      i;
    	    _MetadataStream.prototype.init.call(this);

    	    // calculate the text track in-band metadata track dispatch type
    	    // https://html.spec.whatwg.org/multipage/embedded-content.html#steps-to-expose-a-media-resource-specific-text-track
    	    this.dispatchType = streamTypes.METADATA_STREAM_TYPE.toString(16);
    	    if (settings.descriptor) {
    	      for (i = 0; i < settings.descriptor.length; i++) {
    	        this.dispatchType += ('00' + settings.descriptor[i].toString(16)).slice(-2);
    	      }
    	    }
    	    this.push = function (chunk) {
    	      var tag, frameStart, frameSize, frame, i, frameHeader;
    	      if (chunk.type !== 'timed-metadata') {
    	        return;
    	      }

    	      // if data_alignment_indicator is set in the PES header,
    	      // we must have the start of a new ID3 tag. Assume anything
    	      // remaining in the buffer was malformed and throw it out
    	      if (chunk.dataAlignmentIndicator) {
    	        bufferSize = 0;
    	        buffer.length = 0;
    	      }

    	      // ignore events that don't look like ID3 data
    	      if (buffer.length === 0 && (chunk.data.length < 10 || chunk.data[0] !== 'I'.charCodeAt(0) || chunk.data[1] !== 'D'.charCodeAt(0) || chunk.data[2] !== '3'.charCodeAt(0))) {
    	        this.trigger('log', {
    	          level: 'warn',
    	          message: 'Skipping unrecognized metadata packet'
    	        });
    	        return;
    	      }

    	      // add this chunk to the data we've collected so far

    	      buffer.push(chunk);
    	      bufferSize += chunk.data.byteLength;

    	      // grab the size of the entire frame from the ID3 header
    	      if (buffer.length === 1) {
    	        // the frame size is transmitted as a 28-bit integer in the
    	        // last four bytes of the ID3 header.
    	        // The most significant bit of each byte is dropped and the
    	        // results concatenated to recover the actual value.
    	        tagSize = parseId3.parseSyncSafeInteger(chunk.data.subarray(6, 10));

    	        // ID3 reports the tag size excluding the header but it's more
    	        // convenient for our comparisons to include it
    	        tagSize += 10;
    	      }

    	      // if the entire frame has not arrived, wait for more data
    	      if (bufferSize < tagSize) {
    	        return;
    	      }

    	      // collect the entire frame so it can be parsed
    	      tag = {
    	        data: new Uint8Array(tagSize),
    	        frames: [],
    	        pts: buffer[0].pts,
    	        dts: buffer[0].dts
    	      };
    	      for (i = 0; i < tagSize;) {
    	        tag.data.set(buffer[0].data.subarray(0, tagSize - i), i);
    	        i += buffer[0].data.byteLength;
    	        bufferSize -= buffer[0].data.byteLength;
    	        buffer.shift();
    	      }

    	      // find the start of the first frame and the end of the tag
    	      frameStart = 10;
    	      if (tag.data[5] & 0x40) {
    	        // advance the frame start past the extended header
    	        frameStart += 4; // header size field
    	        frameStart += parseId3.parseSyncSafeInteger(tag.data.subarray(10, 14));

    	        // clip any padding off the end
    	        tagSize -= parseId3.parseSyncSafeInteger(tag.data.subarray(16, 20));
    	      }

    	      // parse one or more ID3 frames
    	      // http://id3.org/id3v2.3.0#ID3v2_frame_overview
    	      do {
    	        // determine the number of bytes in this frame
    	        frameSize = parseId3.parseSyncSafeInteger(tag.data.subarray(frameStart + 4, frameStart + 8));
    	        if (frameSize < 1) {
    	          this.trigger('log', {
    	            level: 'warn',
    	            message: 'Malformed ID3 frame encountered. Skipping remaining metadata parsing.'
    	          });
    	          // If the frame is malformed, don't parse any further frames but allow previous valid parsed frames
    	          // to be sent along.
    	          break;
    	        }
    	        frameHeader = String.fromCharCode(tag.data[frameStart], tag.data[frameStart + 1], tag.data[frameStart + 2], tag.data[frameStart + 3]);
    	        frame = {
    	          id: frameHeader,
    	          data: tag.data.subarray(frameStart + 10, frameStart + frameSize + 10)
    	        };
    	        frame.key = frame.id;

    	        // parse frame values
    	        if (parseId3.frameParsers[frame.id]) {
    	          // use frame specific parser
    	          parseId3.frameParsers[frame.id](frame);
    	        } else if (frame.id[0] === 'T') {
    	          // use text frame generic parser
    	          parseId3.frameParsers['T*'](frame);
    	        } else if (frame.id[0] === 'W') {
    	          // use URL link frame generic parser
    	          parseId3.frameParsers['W*'](frame);
    	        }

    	        // handle the special PRIV frame used to indicate the start
    	        // time for raw AAC data
    	        if (frame.owner === 'com.apple.streaming.transportStreamTimestamp') {
    	          var d = frame.data,
    	            size = (d[3] & 0x01) << 30 | d[4] << 22 | d[5] << 14 | d[6] << 6 | d[7] >>> 2;
    	          size *= 4;
    	          size += d[7] & 0x03;
    	          frame.timeStamp = size;
    	          // in raw AAC, all subsequent data will be timestamped based
    	          // on the value of this frame
    	          // we couldn't have known the appropriate pts and dts before
    	          // parsing this ID3 tag so set those values now
    	          if (tag.pts === undefined && tag.dts === undefined) {
    	            tag.pts = frame.timeStamp;
    	            tag.dts = frame.timeStamp;
    	          }
    	          this.trigger('timestamp', frame);
    	        }
    	        tag.frames.push(frame);
    	        frameStart += 10; // advance past the frame header
    	        frameStart += frameSize; // advance past the frame body
    	      } while (frameStart < tagSize);
    	      this.trigger('data', tag);
    	    };
    	  };
    	  _MetadataStream.prototype = new stream();
    	  var metadataStream = _MetadataStream;

    	  var TimestampRolloverStream = timestampRolloverStream.TimestampRolloverStream;

    	  // object types
    	  var _TransportPacketStream, _TransportParseStream, _ElementaryStream;

    	  // constants
    	  var MP2T_PACKET_LENGTH = 188,
    	    // bytes
    	    SYNC_BYTE = 0x47;

    	  /**
    	   * Splits an incoming stream of binary data into MPEG-2 Transport
    	   * Stream packets.
    	   */
    	  _TransportPacketStream = function TransportPacketStream() {
    	    var buffer = new Uint8Array(MP2T_PACKET_LENGTH),
    	      bytesInBuffer = 0;
    	    _TransportPacketStream.prototype.init.call(this);

    	    // Deliver new bytes to the stream.

    	    /**
    	     * Split a stream of data into M2TS packets
    	    **/
    	    this.push = function (bytes) {
    	      var startIndex = 0,
    	        endIndex = MP2T_PACKET_LENGTH,
    	        everything;

    	      // If there are bytes remaining from the last segment, prepend them to the
    	      // bytes that were pushed in
    	      if (bytesInBuffer) {
    	        everything = new Uint8Array(bytes.byteLength + bytesInBuffer);
    	        everything.set(buffer.subarray(0, bytesInBuffer));
    	        everything.set(bytes, bytesInBuffer);
    	        bytesInBuffer = 0;
    	      } else {
    	        everything = bytes;
    	      }

    	      // While we have enough data for a packet
    	      while (endIndex < everything.byteLength) {
    	        // Look for a pair of start and end sync bytes in the data..
    	        if (everything[startIndex] === SYNC_BYTE && everything[endIndex] === SYNC_BYTE) {
    	          // We found a packet so emit it and jump one whole packet forward in
    	          // the stream
    	          this.trigger('data', everything.subarray(startIndex, endIndex));
    	          startIndex += MP2T_PACKET_LENGTH;
    	          endIndex += MP2T_PACKET_LENGTH;
    	          continue;
    	        }
    	        // If we get here, we have somehow become de-synchronized and we need to step
    	        // forward one byte at a time until we find a pair of sync bytes that denote
    	        // a packet
    	        startIndex++;
    	        endIndex++;
    	      }

    	      // If there was some data left over at the end of the segment that couldn't
    	      // possibly be a whole packet, keep it because it might be the start of a packet
    	      // that continues in the next segment
    	      if (startIndex < everything.byteLength) {
    	        buffer.set(everything.subarray(startIndex), 0);
    	        bytesInBuffer = everything.byteLength - startIndex;
    	      }
    	    };

    	    /**
    	     * Passes identified M2TS packets to the TransportParseStream to be parsed
    	    **/
    	    this.flush = function () {
    	      // If the buffer contains a whole packet when we are being flushed, emit it
    	      // and empty the buffer. Otherwise hold onto the data because it may be
    	      // important for decoding the next segment
    	      if (bytesInBuffer === MP2T_PACKET_LENGTH && buffer[0] === SYNC_BYTE) {
    	        this.trigger('data', buffer);
    	        bytesInBuffer = 0;
    	      }
    	      this.trigger('done');
    	    };
    	    this.endTimeline = function () {
    	      this.flush();
    	      this.trigger('endedtimeline');
    	    };
    	    this.reset = function () {
    	      bytesInBuffer = 0;
    	      this.trigger('reset');
    	    };
    	  };
    	  _TransportPacketStream.prototype = new stream();

    	  /**
    	   * Accepts an MP2T TransportPacketStream and emits data events with parsed
    	   * forms of the individual transport stream packets.
    	   */
    	  _TransportParseStream = function TransportParseStream() {
    	    var parsePsi, parsePat, parsePmt, self;
    	    _TransportParseStream.prototype.init.call(this);
    	    self = this;
    	    this.packetsWaitingForPmt = [];
    	    this.programMapTable = undefined;
    	    parsePsi = function parsePsi(payload, psi) {
    	      var offset = 0;

    	      // PSI packets may be split into multiple sections and those
    	      // sections may be split into multiple packets. If a PSI
    	      // section starts in this packet, the payload_unit_start_indicator
    	      // will be true and the first byte of the payload will indicate
    	      // the offset from the current position to the start of the
    	      // section.
    	      if (psi.payloadUnitStartIndicator) {
    	        offset += payload[offset] + 1;
    	      }
    	      if (psi.type === 'pat') {
    	        parsePat(payload.subarray(offset), psi);
    	      } else {
    	        parsePmt(payload.subarray(offset), psi);
    	      }
    	    };
    	    parsePat = function parsePat(payload, pat) {
    	      pat.section_number = payload[7]; // eslint-disable-line camelcase
    	      pat.last_section_number = payload[8]; // eslint-disable-line camelcase

    	      // skip the PSI header and parse the first PMT entry
    	      self.pmtPid = (payload[10] & 0x1F) << 8 | payload[11];
    	      pat.pmtPid = self.pmtPid;
    	    };

    	    /**
    	     * Parse out the relevant fields of a Program Map Table (PMT).
    	     * @param payload {Uint8Array} the PMT-specific portion of an MP2T
    	     * packet. The first byte in this array should be the table_id
    	     * field.
    	     * @param pmt {object} the object that should be decorated with
    	     * fields parsed from the PMT.
    	     */
    	    parsePmt = function parsePmt(payload, pmt) {
    	      var sectionLength, tableEnd, programInfoLength, offset;

    	      // PMTs can be sent ahead of the time when they should actually
    	      // take effect. We don't believe this should ever be the case
    	      // for HLS but we'll ignore "forward" PMT declarations if we see
    	      // them. Future PMT declarations have the current_next_indicator
    	      // set to zero.
    	      if (!(payload[5] & 0x01)) {
    	        return;
    	      }

    	      // overwrite any existing program map table
    	      self.programMapTable = {
    	        video: null,
    	        audio: null,
    	        'timed-metadata': {}
    	      };

    	      // the mapping table ends at the end of the current section
    	      sectionLength = (payload[1] & 0x0f) << 8 | payload[2];
    	      tableEnd = 3 + sectionLength - 4;

    	      // to determine where the table is, we have to figure out how
    	      // long the program info descriptors are
    	      programInfoLength = (payload[10] & 0x0f) << 8 | payload[11];

    	      // advance the offset to the first entry in the mapping table
    	      offset = 12 + programInfoLength;
    	      while (offset < tableEnd) {
    	        var streamType = payload[offset];
    	        var pid = (payload[offset + 1] & 0x1F) << 8 | payload[offset + 2];

    	        // only map a single elementary_pid for audio and video stream types
    	        // TODO: should this be done for metadata too? for now maintain behavior of
    	        //       multiple metadata streams
    	        if (streamType === streamTypes.H264_STREAM_TYPE && self.programMapTable.video === null) {
    	          self.programMapTable.video = pid;
    	        } else if (streamType === streamTypes.ADTS_STREAM_TYPE && self.programMapTable.audio === null) {
    	          self.programMapTable.audio = pid;
    	        } else if (streamType === streamTypes.METADATA_STREAM_TYPE) {
    	          // map pid to stream type for metadata streams
    	          self.programMapTable['timed-metadata'][pid] = streamType;
    	        }

    	        // move to the next table entry
    	        // skip past the elementary stream descriptors, if present
    	        offset += ((payload[offset + 3] & 0x0F) << 8 | payload[offset + 4]) + 5;
    	      }

    	      // record the map on the packet as well
    	      pmt.programMapTable = self.programMapTable;
    	    };

    	    /**
    	     * Deliver a new MP2T packet to the next stream in the pipeline.
    	     */
    	    this.push = function (packet) {
    	      var result = {},
    	        offset = 4;
    	      result.payloadUnitStartIndicator = !!(packet[1] & 0x40);

    	      // pid is a 13-bit field starting at the last bit of packet[1]
    	      result.pid = packet[1] & 0x1f;
    	      result.pid <<= 8;
    	      result.pid |= packet[2];

    	      // if an adaption field is present, its length is specified by the
    	      // fifth byte of the TS packet header. The adaptation field is
    	      // used to add stuffing to PES packets that don't fill a complete
    	      // TS packet, and to specify some forms of timing and control data
    	      // that we do not currently use.
    	      if ((packet[3] & 0x30) >>> 4 > 0x01) {
    	        offset += packet[offset] + 1;
    	      }

    	      // parse the rest of the packet based on the type
    	      if (result.pid === 0) {
    	        result.type = 'pat';
    	        parsePsi(packet.subarray(offset), result);
    	        this.trigger('data', result);
    	      } else if (result.pid === this.pmtPid) {
    	        result.type = 'pmt';
    	        parsePsi(packet.subarray(offset), result);
    	        this.trigger('data', result);

    	        // if there are any packets waiting for a PMT to be found, process them now
    	        while (this.packetsWaitingForPmt.length) {
    	          this.processPes_.apply(this, this.packetsWaitingForPmt.shift());
    	        }
    	      } else if (this.programMapTable === undefined) {
    	        // When we have not seen a PMT yet, defer further processing of
    	        // PES packets until one has been parsed
    	        this.packetsWaitingForPmt.push([packet, offset, result]);
    	      } else {
    	        this.processPes_(packet, offset, result);
    	      }
    	    };
    	    this.processPes_ = function (packet, offset, result) {
    	      // set the appropriate stream type
    	      if (result.pid === this.programMapTable.video) {
    	        result.streamType = streamTypes.H264_STREAM_TYPE;
    	      } else if (result.pid === this.programMapTable.audio) {
    	        result.streamType = streamTypes.ADTS_STREAM_TYPE;
    	      } else {
    	        // if not video or audio, it is timed-metadata or unknown
    	        // if unknown, streamType will be undefined
    	        result.streamType = this.programMapTable['timed-metadata'][result.pid];
    	      }
    	      result.type = 'pes';
    	      result.data = packet.subarray(offset);
    	      this.trigger('data', result);
    	    };
    	  };
    	  _TransportParseStream.prototype = new stream();
    	  _TransportParseStream.STREAM_TYPES = {
    	    h264: 0x1b,
    	    adts: 0x0f
    	  };

    	  /**
    	   * Reconsistutes program elementary stream (PES) packets from parsed
    	   * transport stream packets. That is, if you pipe an
    	   * mp2t.TransportParseStream into a mp2t.ElementaryStream, the output
    	   * events will be events which capture the bytes for individual PES
    	   * packets plus relevant metadata that has been extracted from the
    	   * container.
    	   */
    	  _ElementaryStream = function ElementaryStream() {
    	    var self = this,
    	      segmentHadPmt = false,
    	      // PES packet fragments
    	      video = {
    	        data: [],
    	        size: 0
    	      },
    	      audio = {
    	        data: [],
    	        size: 0
    	      },
    	      timedMetadata = {
    	        data: [],
    	        size: 0
    	      },
    	      programMapTable,
    	      parsePes = function parsePes(payload, pes) {
    	        var ptsDtsFlags;
    	        var startPrefix = payload[0] << 16 | payload[1] << 8 | payload[2];
    	        // default to an empty array
    	        pes.data = new Uint8Array();
    	        // In certain live streams, the start of a TS fragment has ts packets
    	        // that are frame data that is continuing from the previous fragment. This
    	        // is to check that the pes data is the start of a new pes payload
    	        if (startPrefix !== 1) {
    	          return;
    	        }
    	        // get the packet length, this will be 0 for video
    	        pes.packetLength = 6 + (payload[4] << 8 | payload[5]);

    	        // find out if this packets starts a new keyframe
    	        pes.dataAlignmentIndicator = (payload[6] & 0x04) !== 0;
    	        // PES packets may be annotated with a PTS value, or a PTS value
    	        // and a DTS value. Determine what combination of values is
    	        // available to work with.
    	        ptsDtsFlags = payload[7];

    	        // PTS and DTS are normally stored as a 33-bit number.  Javascript
    	        // performs all bitwise operations on 32-bit integers but javascript
    	        // supports a much greater range (52-bits) of integer using standard
    	        // mathematical operations.
    	        // We construct a 31-bit value using bitwise operators over the 31
    	        // most significant bits and then multiply by 4 (equal to a left-shift
    	        // of 2) before we add the final 2 least significant bits of the
    	        // timestamp (equal to an OR.)
    	        if (ptsDtsFlags & 0xC0) {
    	          // the PTS and DTS are not written out directly. For information
    	          // on how they are encoded, see
    	          // http://dvd.sourceforge.net/dvdinfo/pes-hdr.html
    	          pes.pts = (payload[9] & 0x0E) << 27 | (payload[10] & 0xFF) << 20 | (payload[11] & 0xFE) << 12 | (payload[12] & 0xFF) << 5 | (payload[13] & 0xFE) >>> 3;
    	          pes.pts *= 4; // Left shift by 2
    	          pes.pts += (payload[13] & 0x06) >>> 1; // OR by the two LSBs
    	          pes.dts = pes.pts;
    	          if (ptsDtsFlags & 0x40) {
    	            pes.dts = (payload[14] & 0x0E) << 27 | (payload[15] & 0xFF) << 20 | (payload[16] & 0xFE) << 12 | (payload[17] & 0xFF) << 5 | (payload[18] & 0xFE) >>> 3;
    	            pes.dts *= 4; // Left shift by 2
    	            pes.dts += (payload[18] & 0x06) >>> 1; // OR by the two LSBs
    	          }
    	        }
    	        // the data section starts immediately after the PES header.
    	        // pes_header_data_length specifies the number of header bytes
    	        // that follow the last byte of the field.
    	        pes.data = payload.subarray(9 + payload[8]);
    	      },
    	      /**
    	        * Pass completely parsed PES packets to the next stream in the pipeline
    	       **/
    	      flushStream = function flushStream(stream, type, forceFlush) {
    	        var packetData = new Uint8Array(stream.size),
    	          event = {
    	            type: type
    	          },
    	          i = 0,
    	          offset = 0,
    	          packetFlushable = false,
    	          fragment;

    	        // do nothing if there is not enough buffered data for a complete
    	        // PES header
    	        if (!stream.data.length || stream.size < 9) {
    	          return;
    	        }
    	        event.trackId = stream.data[0].pid;

    	        // reassemble the packet
    	        for (i = 0; i < stream.data.length; i++) {
    	          fragment = stream.data[i];
    	          packetData.set(fragment.data, offset);
    	          offset += fragment.data.byteLength;
    	        }

    	        // parse assembled packet's PES header
    	        parsePes(packetData, event);

    	        // non-video PES packets MUST have a non-zero PES_packet_length
    	        // check that there is enough stream data to fill the packet
    	        packetFlushable = type === 'video' || event.packetLength <= stream.size;

    	        // flush pending packets if the conditions are right
    	        if (forceFlush || packetFlushable) {
    	          stream.size = 0;
    	          stream.data.length = 0;
    	        }

    	        // only emit packets that are complete. this is to avoid assembling
    	        // incomplete PES packets due to poor segmentation
    	        if (packetFlushable) {
    	          self.trigger('data', event);
    	        }
    	      };
    	    _ElementaryStream.prototype.init.call(this);

    	    /**
    	     * Identifies M2TS packet types and parses PES packets using metadata
    	     * parsed from the PMT
    	     **/
    	    this.push = function (data) {
    	      ({
    	        pat: function pat() {
    	          // we have to wait for the PMT to arrive as well before we
    	          // have any meaningful metadata
    	        },
    	        pes: function pes() {
    	          var stream, streamType;
    	          switch (data.streamType) {
    	            case streamTypes.H264_STREAM_TYPE:
    	              stream = video;
    	              streamType = 'video';
    	              break;
    	            case streamTypes.ADTS_STREAM_TYPE:
    	              stream = audio;
    	              streamType = 'audio';
    	              break;
    	            case streamTypes.METADATA_STREAM_TYPE:
    	              stream = timedMetadata;
    	              streamType = 'timed-metadata';
    	              break;
    	            default:
    	              // ignore unknown stream types
    	              return;
    	          }

    	          // if a new packet is starting, we can flush the completed
    	          // packet
    	          if (data.payloadUnitStartIndicator) {
    	            flushStream(stream, streamType, true);
    	          }

    	          // buffer this fragment until we are sure we've received the
    	          // complete payload
    	          stream.data.push(data);
    	          stream.size += data.data.byteLength;
    	        },
    	        pmt: function pmt() {
    	          var event = {
    	            type: 'metadata',
    	            tracks: []
    	          };
    	          programMapTable = data.programMapTable;

    	          // translate audio and video streams to tracks
    	          if (programMapTable.video !== null) {
    	            event.tracks.push({
    	              timelineStartInfo: {
    	                baseMediaDecodeTime: 0
    	              },
    	              id: +programMapTable.video,
    	              codec: 'avc',
    	              type: 'video'
    	            });
    	          }
    	          if (programMapTable.audio !== null) {
    	            event.tracks.push({
    	              timelineStartInfo: {
    	                baseMediaDecodeTime: 0
    	              },
    	              id: +programMapTable.audio,
    	              codec: 'adts',
    	              type: 'audio'
    	            });
    	          }
    	          segmentHadPmt = true;
    	          self.trigger('data', event);
    	        }
    	      })[data.type]();
    	    };
    	    this.reset = function () {
    	      video.size = 0;
    	      video.data.length = 0;
    	      audio.size = 0;
    	      audio.data.length = 0;
    	      this.trigger('reset');
    	    };

    	    /**
    	     * Flush any remaining input. Video PES packets may be of variable
    	     * length. Normally, the start of a new video packet can trigger the
    	     * finalization of the previous packet. That is not possible if no
    	     * more video is forthcoming, however. In that case, some other
    	     * mechanism (like the end of the file) has to be employed. When it is
    	     * clear that no additional data is forthcoming, calling this method
    	     * will flush the buffered packets.
    	     */
    	    this.flushStreams_ = function () {
    	      // !!THIS ORDER IS IMPORTANT!!
    	      // video first then audio
    	      flushStream(video, 'video');
    	      flushStream(audio, 'audio');
    	      flushStream(timedMetadata, 'timed-metadata');
    	    };
    	    this.flush = function () {
    	      // if on flush we haven't had a pmt emitted
    	      // and we have a pmt to emit. emit the pmt
    	      // so that we trigger a trackinfo downstream.
    	      if (!segmentHadPmt && programMapTable) {
    	        var pmt = {
    	          type: 'metadata',
    	          tracks: []
    	        };
    	        // translate audio and video streams to tracks
    	        if (programMapTable.video !== null) {
    	          pmt.tracks.push({
    	            timelineStartInfo: {
    	              baseMediaDecodeTime: 0
    	            },
    	            id: +programMapTable.video,
    	            codec: 'avc',
    	            type: 'video'
    	          });
    	        }
    	        if (programMapTable.audio !== null) {
    	          pmt.tracks.push({
    	            timelineStartInfo: {
    	              baseMediaDecodeTime: 0
    	            },
    	            id: +programMapTable.audio,
    	            codec: 'adts',
    	            type: 'audio'
    	          });
    	        }
    	        self.trigger('data', pmt);
    	      }
    	      segmentHadPmt = false;
    	      this.flushStreams_();
    	      this.trigger('done');
    	    };
    	  };
    	  _ElementaryStream.prototype = new stream();
    	  var m2ts = {
    	    PAT_PID: 0x0000,
    	    MP2T_PACKET_LENGTH: MP2T_PACKET_LENGTH,
    	    TransportPacketStream: _TransportPacketStream,
    	    TransportParseStream: _TransportParseStream,
    	    ElementaryStream: _ElementaryStream,
    	    TimestampRolloverStream: TimestampRolloverStream,
    	    CaptionStream: captionStream.CaptionStream,
    	    Cea608Stream: captionStream.Cea608Stream,
    	    Cea708Stream: captionStream.Cea708Stream,
    	    MetadataStream: metadataStream
    	  };
    	  for (var type in streamTypes) {
    	    if (streamTypes.hasOwnProperty(type)) {
    	      m2ts[type] = streamTypes[type];
    	    }
    	  }
    	  var m2ts_1 = m2ts;

    	  var ONE_SECOND_IN_TS$1 = clock.ONE_SECOND_IN_TS;
    	  var _AdtsStream;
    	  var ADTS_SAMPLING_FREQUENCIES$1 = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];

    	  /*
    	   * Accepts a ElementaryStream and emits data events with parsed
    	   * AAC Audio Frames of the individual packets. Input audio in ADTS
    	   * format is unpacked and re-emitted as AAC frames.
    	   *
    	   * @see http://wiki.multimedia.cx/index.php?title=ADTS
    	   * @see http://wiki.multimedia.cx/?title=Understanding_AAC
    	   */
    	  _AdtsStream = function AdtsStream(handlePartialSegments) {
    	    var buffer,
    	      frameNum = 0;
    	    _AdtsStream.prototype.init.call(this);
    	    this.skipWarn_ = function (start, end) {
    	      this.trigger('log', {
    	        level: 'warn',
    	        message: "adts skiping bytes " + start + " to " + end + " in frame " + frameNum + " outside syncword"
    	      });
    	    };
    	    this.push = function (packet) {
    	      var i = 0,
    	        frameLength,
    	        protectionSkipBytes,
    	        oldBuffer,
    	        sampleCount,
    	        adtsFrameDuration;
    	      if (!handlePartialSegments) {
    	        frameNum = 0;
    	      }
    	      if (packet.type !== 'audio') {
    	        // ignore non-audio data
    	        return;
    	      }

    	      // Prepend any data in the buffer to the input data so that we can parse
    	      // aac frames the cross a PES packet boundary
    	      if (buffer && buffer.length) {
    	        oldBuffer = buffer;
    	        buffer = new Uint8Array(oldBuffer.byteLength + packet.data.byteLength);
    	        buffer.set(oldBuffer);
    	        buffer.set(packet.data, oldBuffer.byteLength);
    	      } else {
    	        buffer = packet.data;
    	      }

    	      // unpack any ADTS frames which have been fully received
    	      // for details on the ADTS header, see http://wiki.multimedia.cx/index.php?title=ADTS
    	      var skip;

    	      // We use i + 7 here because we want to be able to parse the entire header.
    	      // If we don't have enough bytes to do that, then we definitely won't have a full frame.
    	      while (i + 7 < buffer.length) {
    	        // Look for the start of an ADTS header..
    	        if (buffer[i] !== 0xFF || (buffer[i + 1] & 0xF6) !== 0xF0) {
    	          if (typeof skip !== 'number') {
    	            skip = i;
    	          }
    	          // If a valid header was not found,  jump one forward and attempt to
    	          // find a valid ADTS header starting at the next byte
    	          i++;
    	          continue;
    	        }
    	        if (typeof skip === 'number') {
    	          this.skipWarn_(skip, i);
    	          skip = null;
    	        }

    	        // The protection skip bit tells us if we have 2 bytes of CRC data at the
    	        // end of the ADTS header
    	        protectionSkipBytes = (~buffer[i + 1] & 0x01) * 2;

    	        // Frame length is a 13 bit integer starting 16 bits from the
    	        // end of the sync sequence
    	        // NOTE: frame length includes the size of the header
    	        frameLength = (buffer[i + 3] & 0x03) << 11 | buffer[i + 4] << 3 | (buffer[i + 5] & 0xe0) >> 5;
    	        sampleCount = ((buffer[i + 6] & 0x03) + 1) * 1024;
    	        adtsFrameDuration = sampleCount * ONE_SECOND_IN_TS$1 / ADTS_SAMPLING_FREQUENCIES$1[(buffer[i + 2] & 0x3c) >>> 2];

    	        // If we don't have enough data to actually finish this ADTS frame,
    	        // then we have to wait for more data
    	        if (buffer.byteLength - i < frameLength) {
    	          break;
    	        }

    	        // Otherwise, deliver the complete AAC frame
    	        this.trigger('data', {
    	          pts: packet.pts + frameNum * adtsFrameDuration,
    	          dts: packet.dts + frameNum * adtsFrameDuration,
    	          sampleCount: sampleCount,
    	          audioobjecttype: (buffer[i + 2] >>> 6 & 0x03) + 1,
    	          channelcount: (buffer[i + 2] & 1) << 2 | (buffer[i + 3] & 0xc0) >>> 6,
    	          samplerate: ADTS_SAMPLING_FREQUENCIES$1[(buffer[i + 2] & 0x3c) >>> 2],
    	          samplingfrequencyindex: (buffer[i + 2] & 0x3c) >>> 2,
    	          // assume ISO/IEC 14496-12 AudioSampleEntry default of 16
    	          samplesize: 16,
    	          // data is the frame without it's header
    	          data: buffer.subarray(i + 7 + protectionSkipBytes, i + frameLength)
    	        });
    	        frameNum++;
    	        i += frameLength;
    	      }
    	      if (typeof skip === 'number') {
    	        this.skipWarn_(skip, i);
    	        skip = null;
    	      }

    	      // remove processed bytes from the buffer.
    	      buffer = buffer.subarray(i);
    	    };
    	    this.flush = function () {
    	      frameNum = 0;
    	      this.trigger('done');
    	    };
    	    this.reset = function () {
    	      buffer = void 0;
    	      this.trigger('reset');
    	    };
    	    this.endTimeline = function () {
    	      buffer = void 0;
    	      this.trigger('endedtimeline');
    	    };
    	  };
    	  _AdtsStream.prototype = new stream();
    	  var adts = _AdtsStream;

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   */

    	  var ExpGolomb;

    	  /**
    	   * Parser for exponential Golomb codes, a variable-bitwidth number encoding
    	   * scheme used by h264.
    	   */
    	  ExpGolomb = function ExpGolomb(workingData) {
    	    var
    	      // the number of bytes left to examine in workingData
    	      workingBytesAvailable = workingData.byteLength,
    	      // the current word being examined
    	      workingWord = 0,
    	      // :uint

    	      // the number of bits left to examine in the current word
    	      workingBitsAvailable = 0; // :uint;

    	    // ():uint
    	    this.length = function () {
    	      return 8 * workingBytesAvailable;
    	    };

    	    // ():uint
    	    this.bitsAvailable = function () {
    	      return 8 * workingBytesAvailable + workingBitsAvailable;
    	    };

    	    // ():void
    	    this.loadWord = function () {
    	      var position = workingData.byteLength - workingBytesAvailable,
    	        workingBytes = new Uint8Array(4),
    	        availableBytes = Math.min(4, workingBytesAvailable);
    	      if (availableBytes === 0) {
    	        throw new Error('no bytes available');
    	      }
    	      workingBytes.set(workingData.subarray(position, position + availableBytes));
    	      workingWord = new DataView(workingBytes.buffer).getUint32(0);

    	      // track the amount of workingData that has been processed
    	      workingBitsAvailable = availableBytes * 8;
    	      workingBytesAvailable -= availableBytes;
    	    };

    	    // (count:int):void
    	    this.skipBits = function (count) {
    	      var skipBytes; // :int
    	      if (workingBitsAvailable > count) {
    	        workingWord <<= count;
    	        workingBitsAvailable -= count;
    	      } else {
    	        count -= workingBitsAvailable;
    	        skipBytes = Math.floor(count / 8);
    	        count -= skipBytes * 8;
    	        workingBytesAvailable -= skipBytes;
    	        this.loadWord();
    	        workingWord <<= count;
    	        workingBitsAvailable -= count;
    	      }
    	    };

    	    // (size:int):uint
    	    this.readBits = function (size) {
    	      var bits = Math.min(workingBitsAvailable, size),
    	        // :uint
    	        valu = workingWord >>> 32 - bits; // :uint
    	      // if size > 31, handle error
    	      workingBitsAvailable -= bits;
    	      if (workingBitsAvailable > 0) {
    	        workingWord <<= bits;
    	      } else if (workingBytesAvailable > 0) {
    	        this.loadWord();
    	      }
    	      bits = size - bits;
    	      if (bits > 0) {
    	        return valu << bits | this.readBits(bits);
    	      }
    	      return valu;
    	    };

    	    // ():uint
    	    this.skipLeadingZeros = function () {
    	      var leadingZeroCount; // :uint
    	      for (leadingZeroCount = 0; leadingZeroCount < workingBitsAvailable; ++leadingZeroCount) {
    	        if ((workingWord & 0x80000000 >>> leadingZeroCount) !== 0) {
    	          // the first bit of working word is 1
    	          workingWord <<= leadingZeroCount;
    	          workingBitsAvailable -= leadingZeroCount;
    	          return leadingZeroCount;
    	        }
    	      }

    	      // we exhausted workingWord and still have not found a 1
    	      this.loadWord();
    	      return leadingZeroCount + this.skipLeadingZeros();
    	    };

    	    // ():void
    	    this.skipUnsignedExpGolomb = function () {
    	      this.skipBits(1 + this.skipLeadingZeros());
    	    };

    	    // ():void
    	    this.skipExpGolomb = function () {
    	      this.skipBits(1 + this.skipLeadingZeros());
    	    };

    	    // ():uint
    	    this.readUnsignedExpGolomb = function () {
    	      var clz = this.skipLeadingZeros(); // :uint
    	      return this.readBits(clz + 1) - 1;
    	    };

    	    // ():int
    	    this.readExpGolomb = function () {
    	      var valu = this.readUnsignedExpGolomb(); // :int
    	      if (0x01 & valu) {
    	        // the number is odd if the low order bit is set
    	        return 1 + valu >>> 1; // add 1 to make it even, and divide by 2
    	      }

    	      return -1 * (valu >>> 1); // divide by two then make it negative
    	    };

    	    // Some convenience functions
    	    // :Boolean
    	    this.readBoolean = function () {
    	      return this.readBits(1) === 1;
    	    };

    	    // ():int
    	    this.readUnsignedByte = function () {
    	      return this.readBits(8);
    	    };
    	    this.loadWord();
    	  };
    	  var expGolomb = ExpGolomb;

    	  var _H264Stream, _NalByteStream;
    	  var PROFILES_WITH_OPTIONAL_SPS_DATA;

    	  /**
    	   * Accepts a NAL unit byte stream and unpacks the embedded NAL units.
    	   */
    	  _NalByteStream = function NalByteStream() {
    	    var syncPoint = 0,
    	      i,
    	      buffer;
    	    _NalByteStream.prototype.init.call(this);

    	    /*
    	     * Scans a byte stream and triggers a data event with the NAL units found.
    	     * @param {Object} data Event received from H264Stream
    	     * @param {Uint8Array} data.data The h264 byte stream to be scanned
    	     *
    	     * @see H264Stream.push
    	     */
    	    this.push = function (data) {
    	      var swapBuffer;
    	      if (!buffer) {
    	        buffer = data.data;
    	      } else {
    	        swapBuffer = new Uint8Array(buffer.byteLength + data.data.byteLength);
    	        swapBuffer.set(buffer);
    	        swapBuffer.set(data.data, buffer.byteLength);
    	        buffer = swapBuffer;
    	      }
    	      var len = buffer.byteLength;

    	      // Rec. ITU-T H.264, Annex B
    	      // scan for NAL unit boundaries

    	      // a match looks like this:
    	      // 0 0 1 .. NAL .. 0 0 1
    	      // ^ sync point        ^ i
    	      // or this:
    	      // 0 0 1 .. NAL .. 0 0 0
    	      // ^ sync point        ^ i

    	      // advance the sync point to a NAL start, if necessary
    	      for (; syncPoint < len - 3; syncPoint++) {
    	        if (buffer[syncPoint + 2] === 1) {
    	          // the sync point is properly aligned
    	          i = syncPoint + 5;
    	          break;
    	        }
    	      }
    	      while (i < len) {
    	        // look at the current byte to determine if we've hit the end of
    	        // a NAL unit boundary
    	        switch (buffer[i]) {
    	          case 0:
    	            // skip past non-sync sequences
    	            if (buffer[i - 1] !== 0) {
    	              i += 2;
    	              break;
    	            } else if (buffer[i - 2] !== 0) {
    	              i++;
    	              break;
    	            }

    	            // deliver the NAL unit if it isn't empty
    	            if (syncPoint + 3 !== i - 2) {
    	              this.trigger('data', buffer.subarray(syncPoint + 3, i - 2));
    	            }

    	            // drop trailing zeroes
    	            do {
    	              i++;
    	            } while (buffer[i] !== 1 && i < len);
    	            syncPoint = i - 2;
    	            i += 3;
    	            break;
    	          case 1:
    	            // skip past non-sync sequences
    	            if (buffer[i - 1] !== 0 || buffer[i - 2] !== 0) {
    	              i += 3;
    	              break;
    	            }

    	            // deliver the NAL unit
    	            this.trigger('data', buffer.subarray(syncPoint + 3, i - 2));
    	            syncPoint = i - 2;
    	            i += 3;
    	            break;
    	          default:
    	            // the current byte isn't a one or zero, so it cannot be part
    	            // of a sync sequence
    	            i += 3;
    	            break;
    	        }
    	      }
    	      // filter out the NAL units that were delivered
    	      buffer = buffer.subarray(syncPoint);
    	      i -= syncPoint;
    	      syncPoint = 0;
    	    };
    	    this.reset = function () {
    	      buffer = null;
    	      syncPoint = 0;
    	      this.trigger('reset');
    	    };
    	    this.flush = function () {
    	      // deliver the last buffered NAL unit
    	      if (buffer && buffer.byteLength > 3) {
    	        this.trigger('data', buffer.subarray(syncPoint + 3));
    	      }
    	      // reset the stream state
    	      buffer = null;
    	      syncPoint = 0;
    	      this.trigger('done');
    	    };
    	    this.endTimeline = function () {
    	      this.flush();
    	      this.trigger('endedtimeline');
    	    };
    	  };
    	  _NalByteStream.prototype = new stream();

    	  // values of profile_idc that indicate additional fields are included in the SPS
    	  // see Recommendation ITU-T H.264 (4/2013),
    	  // 7.3.2.1.1 Sequence parameter set data syntax
    	  PROFILES_WITH_OPTIONAL_SPS_DATA = {
    	    100: true,
    	    110: true,
    	    122: true,
    	    244: true,
    	    44: true,
    	    83: true,
    	    86: true,
    	    118: true,
    	    128: true,
    	    // TODO: the three profiles below don't
    	    // appear to have sps data in the specificiation anymore?
    	    138: true,
    	    139: true,
    	    134: true
    	  };

    	  /**
    	   * Accepts input from a ElementaryStream and produces H.264 NAL unit data
    	   * events.
    	   */
    	  _H264Stream = function H264Stream() {
    	    var nalByteStream = new _NalByteStream(),
    	      self,
    	      trackId,
    	      currentPts,
    	      currentDts,
    	      discardEmulationPreventionBytes,
    	      readSequenceParameterSet,
    	      skipScalingList;
    	    _H264Stream.prototype.init.call(this);
    	    self = this;

    	    /*
    	     * Pushes a packet from a stream onto the NalByteStream
    	     *
    	     * @param {Object} packet - A packet received from a stream
    	     * @param {Uint8Array} packet.data - The raw bytes of the packet
    	     * @param {Number} packet.dts - Decode timestamp of the packet
    	     * @param {Number} packet.pts - Presentation timestamp of the packet
    	     * @param {Number} packet.trackId - The id of the h264 track this packet came from
    	     * @param {('video'|'audio')} packet.type - The type of packet
    	     *
    	     */
    	    this.push = function (packet) {
    	      if (packet.type !== 'video') {
    	        return;
    	      }
    	      trackId = packet.trackId;
    	      currentPts = packet.pts;
    	      currentDts = packet.dts;
    	      nalByteStream.push(packet);
    	    };

    	    /*
    	     * Identify NAL unit types and pass on the NALU, trackId, presentation and decode timestamps
    	     * for the NALUs to the next stream component.
    	     * Also, preprocess caption and sequence parameter NALUs.
    	     *
    	     * @param {Uint8Array} data - A NAL unit identified by `NalByteStream.push`
    	     * @see NalByteStream.push
    	     */
    	    nalByteStream.on('data', function (data) {
    	      var event = {
    	        trackId: trackId,
    	        pts: currentPts,
    	        dts: currentDts,
    	        data: data,
    	        nalUnitTypeCode: data[0] & 0x1f
    	      };
    	      switch (event.nalUnitTypeCode) {
    	        case 0x05:
    	          event.nalUnitType = 'slice_layer_without_partitioning_rbsp_idr';
    	          break;
    	        case 0x06:
    	          event.nalUnitType = 'sei_rbsp';
    	          event.escapedRBSP = discardEmulationPreventionBytes(data.subarray(1));
    	          break;
    	        case 0x07:
    	          event.nalUnitType = 'seq_parameter_set_rbsp';
    	          event.escapedRBSP = discardEmulationPreventionBytes(data.subarray(1));
    	          event.config = readSequenceParameterSet(event.escapedRBSP);
    	          break;
    	        case 0x08:
    	          event.nalUnitType = 'pic_parameter_set_rbsp';
    	          break;
    	        case 0x09:
    	          event.nalUnitType = 'access_unit_delimiter_rbsp';
    	          break;
    	      }
    	      // This triggers data on the H264Stream
    	      self.trigger('data', event);
    	    });
    	    nalByteStream.on('done', function () {
    	      self.trigger('done');
    	    });
    	    nalByteStream.on('partialdone', function () {
    	      self.trigger('partialdone');
    	    });
    	    nalByteStream.on('reset', function () {
    	      self.trigger('reset');
    	    });
    	    nalByteStream.on('endedtimeline', function () {
    	      self.trigger('endedtimeline');
    	    });
    	    this.flush = function () {
    	      nalByteStream.flush();
    	    };
    	    this.partialFlush = function () {
    	      nalByteStream.partialFlush();
    	    };
    	    this.reset = function () {
    	      nalByteStream.reset();
    	    };
    	    this.endTimeline = function () {
    	      nalByteStream.endTimeline();
    	    };

    	    /**
    	     * Advance the ExpGolomb decoder past a scaling list. The scaling
    	     * list is optionally transmitted as part of a sequence parameter
    	     * set and is not relevant to transmuxing.
    	     * @param count {number} the number of entries in this scaling list
    	     * @param expGolombDecoder {object} an ExpGolomb pointed to the
    	     * start of a scaling list
    	     * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
    	     */
    	    skipScalingList = function skipScalingList(count, expGolombDecoder) {
    	      var lastScale = 8,
    	        nextScale = 8,
    	        j,
    	        deltaScale;
    	      for (j = 0; j < count; j++) {
    	        if (nextScale !== 0) {
    	          deltaScale = expGolombDecoder.readExpGolomb();
    	          nextScale = (lastScale + deltaScale + 256) % 256;
    	        }
    	        lastScale = nextScale === 0 ? lastScale : nextScale;
    	      }
    	    };

    	    /**
    	     * Expunge any "Emulation Prevention" bytes from a "Raw Byte
    	     * Sequence Payload"
    	     * @param data {Uint8Array} the bytes of a RBSP from a NAL
    	     * unit
    	     * @return {Uint8Array} the RBSP without any Emulation
    	     * Prevention Bytes
    	     */
    	    discardEmulationPreventionBytes = function discardEmulationPreventionBytes(data) {
    	      var length = data.byteLength,
    	        emulationPreventionBytesPositions = [],
    	        i = 1,
    	        newLength,
    	        newData;

    	      // Find all `Emulation Prevention Bytes`
    	      while (i < length - 2) {
    	        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
    	          emulationPreventionBytesPositions.push(i + 2);
    	          i += 2;
    	        } else {
    	          i++;
    	        }
    	      }

    	      // If no Emulation Prevention Bytes were found just return the original
    	      // array
    	      if (emulationPreventionBytesPositions.length === 0) {
    	        return data;
    	      }

    	      // Create a new array to hold the NAL unit data
    	      newLength = length - emulationPreventionBytesPositions.length;
    	      newData = new Uint8Array(newLength);
    	      var sourceIndex = 0;
    	      for (i = 0; i < newLength; sourceIndex++, i++) {
    	        if (sourceIndex === emulationPreventionBytesPositions[0]) {
    	          // Skip this byte
    	          sourceIndex++;
    	          // Remove this position index
    	          emulationPreventionBytesPositions.shift();
    	        }
    	        newData[i] = data[sourceIndex];
    	      }
    	      return newData;
    	    };

    	    /**
    	     * Read a sequence parameter set and return some interesting video
    	     * properties. A sequence parameter set is the H264 metadata that
    	     * describes the properties of upcoming video frames.
    	     * @param data {Uint8Array} the bytes of a sequence parameter set
    	     * @return {object} an object with configuration parsed from the
    	     * sequence parameter set, including the dimensions of the
    	     * associated video frames.
    	     */
    	    readSequenceParameterSet = function readSequenceParameterSet(data) {
    	      var frameCropLeftOffset = 0,
    	        frameCropRightOffset = 0,
    	        frameCropTopOffset = 0,
    	        frameCropBottomOffset = 0,
    	        expGolombDecoder,
    	        profileIdc,
    	        levelIdc,
    	        profileCompatibility,
    	        chromaFormatIdc,
    	        picOrderCntType,
    	        numRefFramesInPicOrderCntCycle,
    	        picWidthInMbsMinus1,
    	        picHeightInMapUnitsMinus1,
    	        frameMbsOnlyFlag,
    	        scalingListCount,
    	        sarRatio = [1, 1],
    	        aspectRatioIdc,
    	        i;
    	      expGolombDecoder = new expGolomb(data);
    	      profileIdc = expGolombDecoder.readUnsignedByte(); // profile_idc
    	      profileCompatibility = expGolombDecoder.readUnsignedByte(); // constraint_set[0-5]_flag
    	      levelIdc = expGolombDecoder.readUnsignedByte(); // level_idc u(8)
    	      expGolombDecoder.skipUnsignedExpGolomb(); // seq_parameter_set_id

    	      // some profiles have more optional data we don't need
    	      if (PROFILES_WITH_OPTIONAL_SPS_DATA[profileIdc]) {
    	        chromaFormatIdc = expGolombDecoder.readUnsignedExpGolomb();
    	        if (chromaFormatIdc === 3) {
    	          expGolombDecoder.skipBits(1); // separate_colour_plane_flag
    	        }

    	        expGolombDecoder.skipUnsignedExpGolomb(); // bit_depth_luma_minus8
    	        expGolombDecoder.skipUnsignedExpGolomb(); // bit_depth_chroma_minus8
    	        expGolombDecoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag
    	        if (expGolombDecoder.readBoolean()) {
    	          // seq_scaling_matrix_present_flag
    	          scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
    	          for (i = 0; i < scalingListCount; i++) {
    	            if (expGolombDecoder.readBoolean()) {
    	              // seq_scaling_list_present_flag[ i ]
    	              if (i < 6) {
    	                skipScalingList(16, expGolombDecoder);
    	              } else {
    	                skipScalingList(64, expGolombDecoder);
    	              }
    	            }
    	          }
    	        }
    	      }
    	      expGolombDecoder.skipUnsignedExpGolomb(); // log2_max_frame_num_minus4
    	      picOrderCntType = expGolombDecoder.readUnsignedExpGolomb();
    	      if (picOrderCntType === 0) {
    	        expGolombDecoder.readUnsignedExpGolomb(); // log2_max_pic_order_cnt_lsb_minus4
    	      } else if (picOrderCntType === 1) {
    	        expGolombDecoder.skipBits(1); // delta_pic_order_always_zero_flag
    	        expGolombDecoder.skipExpGolomb(); // offset_for_non_ref_pic
    	        expGolombDecoder.skipExpGolomb(); // offset_for_top_to_bottom_field
    	        numRefFramesInPicOrderCntCycle = expGolombDecoder.readUnsignedExpGolomb();
    	        for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
    	          expGolombDecoder.skipExpGolomb(); // offset_for_ref_frame[ i ]
    	        }
    	      }

    	      expGolombDecoder.skipUnsignedExpGolomb(); // max_num_ref_frames
    	      expGolombDecoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag

    	      picWidthInMbsMinus1 = expGolombDecoder.readUnsignedExpGolomb();
    	      picHeightInMapUnitsMinus1 = expGolombDecoder.readUnsignedExpGolomb();
    	      frameMbsOnlyFlag = expGolombDecoder.readBits(1);
    	      if (frameMbsOnlyFlag === 0) {
    	        expGolombDecoder.skipBits(1); // mb_adaptive_frame_field_flag
    	      }

    	      expGolombDecoder.skipBits(1); // direct_8x8_inference_flag
    	      if (expGolombDecoder.readBoolean()) {
    	        // frame_cropping_flag
    	        frameCropLeftOffset = expGolombDecoder.readUnsignedExpGolomb();
    	        frameCropRightOffset = expGolombDecoder.readUnsignedExpGolomb();
    	        frameCropTopOffset = expGolombDecoder.readUnsignedExpGolomb();
    	        frameCropBottomOffset = expGolombDecoder.readUnsignedExpGolomb();
    	      }
    	      if (expGolombDecoder.readBoolean()) {
    	        // vui_parameters_present_flag
    	        if (expGolombDecoder.readBoolean()) {
    	          // aspect_ratio_info_present_flag
    	          aspectRatioIdc = expGolombDecoder.readUnsignedByte();
    	          switch (aspectRatioIdc) {
    	            case 1:
    	              sarRatio = [1, 1];
    	              break;
    	            case 2:
    	              sarRatio = [12, 11];
    	              break;
    	            case 3:
    	              sarRatio = [10, 11];
    	              break;
    	            case 4:
    	              sarRatio = [16, 11];
    	              break;
    	            case 5:
    	              sarRatio = [40, 33];
    	              break;
    	            case 6:
    	              sarRatio = [24, 11];
    	              break;
    	            case 7:
    	              sarRatio = [20, 11];
    	              break;
    	            case 8:
    	              sarRatio = [32, 11];
    	              break;
    	            case 9:
    	              sarRatio = [80, 33];
    	              break;
    	            case 10:
    	              sarRatio = [18, 11];
    	              break;
    	            case 11:
    	              sarRatio = [15, 11];
    	              break;
    	            case 12:
    	              sarRatio = [64, 33];
    	              break;
    	            case 13:
    	              sarRatio = [160, 99];
    	              break;
    	            case 14:
    	              sarRatio = [4, 3];
    	              break;
    	            case 15:
    	              sarRatio = [3, 2];
    	              break;
    	            case 16:
    	              sarRatio = [2, 1];
    	              break;
    	            case 255:
    	              {
    	                sarRatio = [expGolombDecoder.readUnsignedByte() << 8 | expGolombDecoder.readUnsignedByte(), expGolombDecoder.readUnsignedByte() << 8 | expGolombDecoder.readUnsignedByte()];
    	                break;
    	              }
    	          }
    	          if (sarRatio) {
    	            sarRatio[0] / sarRatio[1];
    	          }
    	        }
    	      }
    	      return {
    	        profileIdc: profileIdc,
    	        levelIdc: levelIdc,
    	        profileCompatibility: profileCompatibility,
    	        width: (picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2,
    	        height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - frameCropTopOffset * 2 - frameCropBottomOffset * 2,
    	        // sar is sample aspect ratio
    	        sarRatio: sarRatio
    	      };
    	    };
    	  };
    	  _H264Stream.prototype = new stream();
    	  var h264 = {
    	    H264Stream: _H264Stream,
    	    NalByteStream: _NalByteStream
    	  };

    	  /**
    	   * mux.js
    	   *
    	   * Copyright (c) Brightcove
    	   * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
    	   *
    	   * Utilities to detect basic properties and metadata about Aac data.
    	   */

    	  var ADTS_SAMPLING_FREQUENCIES = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
    	  var parseId3TagSize = function parseId3TagSize(header, byteIndex) {
    	    var returnSize = header[byteIndex + 6] << 21 | header[byteIndex + 7] << 14 | header[byteIndex + 8] << 7 | header[byteIndex + 9],
    	      flags = header[byteIndex + 5],
    	      footerPresent = (flags & 16) >> 4;

    	    // if we get a negative returnSize clamp it to 0
    	    returnSize = returnSize >= 0 ? returnSize : 0;
    	    if (footerPresent) {
    	      return returnSize + 20;
    	    }
    	    return returnSize + 10;
    	  };
    	  var getId3Offset = function getId3Offset(data, offset) {
    	    if (data.length - offset < 10 || data[offset] !== 'I'.charCodeAt(0) || data[offset + 1] !== 'D'.charCodeAt(0) || data[offset + 2] !== '3'.charCodeAt(0)) {
    	      return offset;
    	    }
    	    offset += parseId3TagSize(data, offset);
    	    return getId3Offset(data, offset);
    	  };

    	  // TODO: use vhs-utils
    	  var isLikelyAacData$1 = function isLikelyAacData(data) {
    	    var offset = getId3Offset(data, 0);
    	    return data.length >= offset + 2 && (data[offset] & 0xFF) === 0xFF && (data[offset + 1] & 0xF0) === 0xF0 &&
    	    // verify that the 2 layer bits are 0, aka this
    	    // is not mp3 data but aac data.
    	    (data[offset + 1] & 0x16) === 0x10;
    	  };
    	  var parseSyncSafeInteger = function parseSyncSafeInteger(data) {
    	    return data[0] << 21 | data[1] << 14 | data[2] << 7 | data[3];
    	  };

    	  // return a percent-encoded representation of the specified byte range
    	  // @see http://en.wikipedia.org/wiki/Percent-encoding
    	  var percentEncode = function percentEncode(bytes, start, end) {
    	    var i,
    	      result = '';
    	    for (i = start; i < end; i++) {
    	      result += '%' + ('00' + bytes[i].toString(16)).slice(-2);
    	    }
    	    return result;
    	  };

    	  // return the string representation of the specified byte range,
    	  // interpreted as ISO-8859-1.
    	  var parseIso88591 = function parseIso88591(bytes, start, end) {
    	    return unescape(percentEncode(bytes, start, end)); // jshint ignore:line
    	  };

    	  var parseAdtsSize = function parseAdtsSize(header, byteIndex) {
    	    var lowThree = (header[byteIndex + 5] & 0xE0) >> 5,
    	      middle = header[byteIndex + 4] << 3,
    	      highTwo = header[byteIndex + 3] & 0x3 << 11;
    	    return highTwo | middle | lowThree;
    	  };
    	  var parseType = function parseType(header, byteIndex) {
    	    if (header[byteIndex] === 'I'.charCodeAt(0) && header[byteIndex + 1] === 'D'.charCodeAt(0) && header[byteIndex + 2] === '3'.charCodeAt(0)) {
    	      return 'timed-metadata';
    	    } else if (header[byteIndex] & 0xff === 0xff && (header[byteIndex + 1] & 0xf0) === 0xf0) {
    	      return 'audio';
    	    }
    	    return null;
    	  };
    	  var parseSampleRate = function parseSampleRate(packet) {
    	    var i = 0;
    	    while (i + 5 < packet.length) {
    	      if (packet[i] !== 0xFF || (packet[i + 1] & 0xF6) !== 0xF0) {
    	        // If a valid header was not found,  jump one forward and attempt to
    	        // find a valid ADTS header starting at the next byte
    	        i++;
    	        continue;
    	      }
    	      return ADTS_SAMPLING_FREQUENCIES[(packet[i + 2] & 0x3c) >>> 2];
    	    }
    	    return null;
    	  };
    	  var parseAacTimestamp = function parseAacTimestamp(packet) {
    	    var frameStart, frameSize, frame, frameHeader;

    	    // find the start of the first frame and the end of the tag
    	    frameStart = 10;
    	    if (packet[5] & 0x40) {
    	      // advance the frame start past the extended header
    	      frameStart += 4; // header size field
    	      frameStart += parseSyncSafeInteger(packet.subarray(10, 14));
    	    }

    	    // parse one or more ID3 frames
    	    // http://id3.org/id3v2.3.0#ID3v2_frame_overview
    	    do {
    	      // determine the number of bytes in this frame
    	      frameSize = parseSyncSafeInteger(packet.subarray(frameStart + 4, frameStart + 8));
    	      if (frameSize < 1) {
    	        return null;
    	      }
    	      frameHeader = String.fromCharCode(packet[frameStart], packet[frameStart + 1], packet[frameStart + 2], packet[frameStart + 3]);
    	      if (frameHeader === 'PRIV') {
    	        frame = packet.subarray(frameStart + 10, frameStart + frameSize + 10);
    	        for (var i = 0; i < frame.byteLength; i++) {
    	          if (frame[i] === 0) {
    	            var owner = parseIso88591(frame, 0, i);
    	            if (owner === 'com.apple.streaming.transportStreamTimestamp') {
    	              var d = frame.subarray(i + 1);
    	              var size = (d[3] & 0x01) << 30 | d[4] << 22 | d[5] << 14 | d[6] << 6 | d[7] >>> 2;
    	              size *= 4;
    	              size += d[7] & 0x03;
    	              return size;
    	            }
    	            break;
    	          }
    	        }
    	      }
    	      frameStart += 10; // advance past the frame header
    	      frameStart += frameSize; // advance past the frame body
    	    } while (frameStart < packet.byteLength);
    	    return null;
    	  };
    	  var utils = {
    	    isLikelyAacData: isLikelyAacData$1,
    	    parseId3TagSize: parseId3TagSize,
    	    parseAdtsSize: parseAdtsSize,
    	    parseType: parseType,
    	    parseSampleRate: parseSampleRate,
    	    parseAacTimestamp: parseAacTimestamp
    	  };

    	  // Constants
    	  var _AacStream;

    	  /**
    	   * Splits an incoming stream of binary data into ADTS and ID3 Frames.
    	   */

    	  _AacStream = function AacStream() {
    	    var everything = new Uint8Array(),
    	      timeStamp = 0;
    	    _AacStream.prototype.init.call(this);
    	    this.setTimestamp = function (timestamp) {
    	      timeStamp = timestamp;
    	    };
    	    this.push = function (bytes) {
    	      var frameSize = 0,
    	        byteIndex = 0,
    	        bytesLeft,
    	        chunk,
    	        packet,
    	        tempLength;

    	      // If there are bytes remaining from the last segment, prepend them to the
    	      // bytes that were pushed in
    	      if (everything.length) {
    	        tempLength = everything.length;
    	        everything = new Uint8Array(bytes.byteLength + tempLength);
    	        everything.set(everything.subarray(0, tempLength));
    	        everything.set(bytes, tempLength);
    	      } else {
    	        everything = bytes;
    	      }
    	      while (everything.length - byteIndex >= 3) {
    	        if (everything[byteIndex] === 'I'.charCodeAt(0) && everything[byteIndex + 1] === 'D'.charCodeAt(0) && everything[byteIndex + 2] === '3'.charCodeAt(0)) {
    	          // Exit early because we don't have enough to parse
    	          // the ID3 tag header
    	          if (everything.length - byteIndex < 10) {
    	            break;
    	          }

    	          // check framesize
    	          frameSize = utils.parseId3TagSize(everything, byteIndex);

    	          // Exit early if we don't have enough in the buffer
    	          // to emit a full packet
    	          // Add to byteIndex to support multiple ID3 tags in sequence
    	          if (byteIndex + frameSize > everything.length) {
    	            break;
    	          }
    	          chunk = {
    	            type: 'timed-metadata',
    	            data: everything.subarray(byteIndex, byteIndex + frameSize)
    	          };
    	          this.trigger('data', chunk);
    	          byteIndex += frameSize;
    	          continue;
    	        } else if ((everything[byteIndex] & 0xff) === 0xff && (everything[byteIndex + 1] & 0xf0) === 0xf0) {
    	          // Exit early because we don't have enough to parse
    	          // the ADTS frame header
    	          if (everything.length - byteIndex < 7) {
    	            break;
    	          }
    	          frameSize = utils.parseAdtsSize(everything, byteIndex);

    	          // Exit early if we don't have enough in the buffer
    	          // to emit a full packet
    	          if (byteIndex + frameSize > everything.length) {
    	            break;
    	          }
    	          packet = {
    	            type: 'audio',
    	            data: everything.subarray(byteIndex, byteIndex + frameSize),
    	            pts: timeStamp,
    	            dts: timeStamp
    	          };
    	          this.trigger('data', packet);
    	          byteIndex += frameSize;
    	          continue;
    	        }
    	        byteIndex++;
    	      }
    	      bytesLeft = everything.length - byteIndex;
    	      if (bytesLeft > 0) {
    	        everything = everything.subarray(byteIndex);
    	      } else {
    	        everything = new Uint8Array();
    	      }
    	    };
    	    this.reset = function () {
    	      everything = new Uint8Array();
    	      this.trigger('reset');
    	    };
    	    this.endTimeline = function () {
    	      everything = new Uint8Array();
    	      this.trigger('endedtimeline');
    	    };
    	  };
    	  _AacStream.prototype = new stream();
    	  var aac = _AacStream;

    	  // constants
    	  var AUDIO_PROPERTIES = ['audioobjecttype', 'channelcount', 'samplerate', 'samplingfrequencyindex', 'samplesize'];
    	  var audioProperties = AUDIO_PROPERTIES;

    	  var VIDEO_PROPERTIES = ['width', 'height', 'profileIdc', 'levelIdc', 'profileCompatibility', 'sarRatio'];
    	  var videoProperties = VIDEO_PROPERTIES;

    	  var H264Stream = h264.H264Stream;
    	  var isLikelyAacData = utils.isLikelyAacData;
    	  var ONE_SECOND_IN_TS = clock.ONE_SECOND_IN_TS;

    	  // object types
    	  var _VideoSegmentStream, _AudioSegmentStream, _Transmuxer, _CoalesceStream;
    	  var retriggerForStream = function retriggerForStream(key, event) {
    	    event.stream = key;
    	    this.trigger('log', event);
    	  };
    	  var addPipelineLogRetriggers = function addPipelineLogRetriggers(transmuxer, pipeline) {
    	    var keys = Object.keys(pipeline);
    	    for (var i = 0; i < keys.length; i++) {
    	      var key = keys[i];

    	      // skip non-stream keys and headOfPipeline
    	      // which is just a duplicate
    	      if (key === 'headOfPipeline' || !pipeline[key].on) {
    	        continue;
    	      }
    	      pipeline[key].on('log', retriggerForStream.bind(transmuxer, key));
    	    }
    	  };

    	  /**
    	   * Compare two arrays (even typed) for same-ness
    	   */
    	  var arrayEquals = function arrayEquals(a, b) {
    	    var i;
    	    if (a.length !== b.length) {
    	      return false;
    	    }

    	    // compare the value of each element in the array
    	    for (i = 0; i < a.length; i++) {
    	      if (a[i] !== b[i]) {
    	        return false;
    	      }
    	    }
    	    return true;
    	  };
    	  var generateSegmentTimingInfo = function generateSegmentTimingInfo(baseMediaDecodeTime, startDts, startPts, endDts, endPts, prependedContentDuration) {
    	    var ptsOffsetFromDts = startPts - startDts,
    	      decodeDuration = endDts - startDts,
    	      presentationDuration = endPts - startPts;

    	    // The PTS and DTS values are based on the actual stream times from the segment,
    	    // however, the player time values will reflect a start from the baseMediaDecodeTime.
    	    // In order to provide relevant values for the player times, base timing info on the
    	    // baseMediaDecodeTime and the DTS and PTS durations of the segment.
    	    return {
    	      start: {
    	        dts: baseMediaDecodeTime,
    	        pts: baseMediaDecodeTime + ptsOffsetFromDts
    	      },
    	      end: {
    	        dts: baseMediaDecodeTime + decodeDuration,
    	        pts: baseMediaDecodeTime + presentationDuration
    	      },
    	      prependedContentDuration: prependedContentDuration,
    	      baseMediaDecodeTime: baseMediaDecodeTime
    	    };
    	  };

    	  /**
    	   * Constructs a single-track, ISO BMFF media segment from AAC data
    	   * events. The output of this stream can be fed to a SourceBuffer
    	   * configured with a suitable initialization segment.
    	   * @param track {object} track metadata configuration
    	   * @param options {object} transmuxer options object
    	   * @param options.keepOriginalTimestamps {boolean} If true, keep the timestamps
    	   *        in the source; false to adjust the first segment to start at 0.
    	   */
    	  _AudioSegmentStream = function AudioSegmentStream(track, options) {
    	    var adtsFrames = [],
    	      sequenceNumber,
    	      earliestAllowedDts = 0,
    	      audioAppendStartTs = 0,
    	      videoBaseMediaDecodeTime = Infinity;
    	    options = options || {};
    	    sequenceNumber = options.firstSequenceNumber || 0;
    	    _AudioSegmentStream.prototype.init.call(this);
    	    this.push = function (data) {
    	      trackDecodeInfo.collectDtsInfo(track, data);
    	      if (track) {
    	        audioProperties.forEach(function (prop) {
    	          track[prop] = data[prop];
    	        });
    	      }

    	      // buffer audio data until end() is called
    	      adtsFrames.push(data);
    	    };
    	    this.setEarliestDts = function (earliestDts) {
    	      earliestAllowedDts = earliestDts;
    	    };
    	    this.setVideoBaseMediaDecodeTime = function (baseMediaDecodeTime) {
    	      videoBaseMediaDecodeTime = baseMediaDecodeTime;
    	    };
    	    this.setAudioAppendStart = function (timestamp) {
    	      audioAppendStartTs = timestamp;
    	    };
    	    this.flush = function () {
    	      var frames, moof, mdat, boxes, frameDuration, segmentDuration, videoClockCyclesOfSilencePrefixed;

    	      // return early if no audio data has been observed
    	      if (adtsFrames.length === 0) {
    	        this.trigger('done', 'AudioSegmentStream');
    	        return;
    	      }
    	      frames = audioFrameUtils.trimAdtsFramesByEarliestDts(adtsFrames, track, earliestAllowedDts);
    	      track.baseMediaDecodeTime = trackDecodeInfo.calculateTrackBaseMediaDecodeTime(track, options.keepOriginalTimestamps);

    	      // amount of audio filled but the value is in video clock rather than audio clock
    	      videoClockCyclesOfSilencePrefixed = audioFrameUtils.prefixWithSilence(track, frames, audioAppendStartTs, videoBaseMediaDecodeTime);

    	      // we have to build the index from byte locations to
    	      // samples (that is, adts frames) in the audio data
    	      track.samples = audioFrameUtils.generateSampleTable(frames);

    	      // concatenate the audio data to constuct the mdat
    	      mdat = mp4Generator.mdat(audioFrameUtils.concatenateFrameData(frames));
    	      adtsFrames = [];
    	      moof = mp4Generator.moof(sequenceNumber, [track]);
    	      boxes = new Uint8Array(moof.byteLength + mdat.byteLength);

    	      // bump the sequence number for next time
    	      sequenceNumber++;
    	      boxes.set(moof);
    	      boxes.set(mdat, moof.byteLength);
    	      trackDecodeInfo.clearDtsInfo(track);
    	      frameDuration = Math.ceil(ONE_SECOND_IN_TS * 1024 / track.samplerate);

    	      // TODO this check was added to maintain backwards compatibility (particularly with
    	      // tests) on adding the timingInfo event. However, it seems unlikely that there's a
    	      // valid use-case where an init segment/data should be triggered without associated
    	      // frames. Leaving for now, but should be looked into.
    	      if (frames.length) {
    	        segmentDuration = frames.length * frameDuration;
    	        this.trigger('segmentTimingInfo', generateSegmentTimingInfo(
    	        // The audio track's baseMediaDecodeTime is in audio clock cycles, but the
    	        // frame info is in video clock cycles. Convert to match expectation of
    	        // listeners (that all timestamps will be based on video clock cycles).
    	        clock.audioTsToVideoTs(track.baseMediaDecodeTime, track.samplerate),
    	        // frame times are already in video clock, as is segment duration
    	        frames[0].dts, frames[0].pts, frames[0].dts + segmentDuration, frames[0].pts + segmentDuration, videoClockCyclesOfSilencePrefixed || 0));
    	        this.trigger('timingInfo', {
    	          start: frames[0].pts,
    	          end: frames[0].pts + segmentDuration
    	        });
    	      }
    	      this.trigger('data', {
    	        track: track,
    	        boxes: boxes
    	      });
    	      this.trigger('done', 'AudioSegmentStream');
    	    };
    	    this.reset = function () {
    	      trackDecodeInfo.clearDtsInfo(track);
    	      adtsFrames = [];
    	      this.trigger('reset');
    	    };
    	  };
    	  _AudioSegmentStream.prototype = new stream();

    	  /**
    	   * Constructs a single-track, ISO BMFF media segment from H264 data
    	   * events. The output of this stream can be fed to a SourceBuffer
    	   * configured with a suitable initialization segment.
    	   * @param track {object} track metadata configuration
    	   * @param options {object} transmuxer options object
    	   * @param options.alignGopsAtEnd {boolean} If true, start from the end of the
    	   *        gopsToAlignWith list when attempting to align gop pts
    	   * @param options.keepOriginalTimestamps {boolean} If true, keep the timestamps
    	   *        in the source; false to adjust the first segment to start at 0.
    	   */
    	  _VideoSegmentStream = function VideoSegmentStream(track, options) {
    	    var sequenceNumber,
    	      nalUnits = [],
    	      gopsToAlignWith = [],
    	      config,
    	      pps;
    	    options = options || {};
    	    sequenceNumber = options.firstSequenceNumber || 0;
    	    _VideoSegmentStream.prototype.init.call(this);
    	    delete track.minPTS;
    	    this.gopCache_ = [];

    	    /**
    	      * Constructs a ISO BMFF segment given H264 nalUnits
    	      * @param {Object} nalUnit A data event representing a nalUnit
    	      * @param {String} nalUnit.nalUnitType
    	      * @param {Object} nalUnit.config Properties for a mp4 track
    	      * @param {Uint8Array} nalUnit.data The nalUnit bytes
    	      * @see lib/codecs/h264.js
    	     **/
    	    this.push = function (nalUnit) {
    	      trackDecodeInfo.collectDtsInfo(track, nalUnit);

    	      // record the track config
    	      if (nalUnit.nalUnitType === 'seq_parameter_set_rbsp' && !config) {
    	        config = nalUnit.config;
    	        track.sps = [nalUnit.data];
    	        videoProperties.forEach(function (prop) {
    	          track[prop] = config[prop];
    	        }, this);
    	      }
    	      if (nalUnit.nalUnitType === 'pic_parameter_set_rbsp' && !pps) {
    	        pps = nalUnit.data;
    	        track.pps = [nalUnit.data];
    	      }

    	      // buffer video until flush() is called
    	      nalUnits.push(nalUnit);
    	    };

    	    /**
    	      * Pass constructed ISO BMFF track and boxes on to the
    	      * next stream in the pipeline
    	     **/
    	    this.flush = function () {
    	      var frames,
    	        gopForFusion,
    	        gops,
    	        moof,
    	        mdat,
    	        boxes,
    	        prependedContentDuration = 0,
    	        firstGop,
    	        lastGop;

    	      // Throw away nalUnits at the start of the byte stream until
    	      // we find the first AUD
    	      while (nalUnits.length) {
    	        if (nalUnits[0].nalUnitType === 'access_unit_delimiter_rbsp') {
    	          break;
    	        }
    	        nalUnits.shift();
    	      }

    	      // Return early if no video data has been observed
    	      if (nalUnits.length === 0) {
    	        this.resetStream_();
    	        this.trigger('done', 'VideoSegmentStream');
    	        return;
    	      }

    	      // Organize the raw nal-units into arrays that represent
    	      // higher-level constructs such as frames and gops
    	      // (group-of-pictures)
    	      frames = frameUtils.groupNalsIntoFrames(nalUnits);
    	      gops = frameUtils.groupFramesIntoGops(frames);

    	      // If the first frame of this fragment is not a keyframe we have
    	      // a problem since MSE (on Chrome) requires a leading keyframe.
    	      //
    	      // We have two approaches to repairing this situation:
    	      // 1) GOP-FUSION:
    	      //    This is where we keep track of the GOPS (group-of-pictures)
    	      //    from previous fragments and attempt to find one that we can
    	      //    prepend to the current fragment in order to create a valid
    	      //    fragment.
    	      // 2) KEYFRAME-PULLING:
    	      //    Here we search for the first keyframe in the fragment and
    	      //    throw away all the frames between the start of the fragment
    	      //    and that keyframe. We then extend the duration and pull the
    	      //    PTS of the keyframe forward so that it covers the time range
    	      //    of the frames that were disposed of.
    	      //
    	      // #1 is far prefereable over #2 which can cause "stuttering" but
    	      // requires more things to be just right.
    	      if (!gops[0][0].keyFrame) {
    	        // Search for a gop for fusion from our gopCache
    	        gopForFusion = this.getGopForFusion_(nalUnits[0], track);
    	        if (gopForFusion) {
    	          // in order to provide more accurate timing information about the segment, save
    	          // the number of seconds prepended to the original segment due to GOP fusion
    	          prependedContentDuration = gopForFusion.duration;
    	          gops.unshift(gopForFusion);
    	          // Adjust Gops' metadata to account for the inclusion of the
    	          // new gop at the beginning
    	          gops.byteLength += gopForFusion.byteLength;
    	          gops.nalCount += gopForFusion.nalCount;
    	          gops.pts = gopForFusion.pts;
    	          gops.dts = gopForFusion.dts;
    	          gops.duration += gopForFusion.duration;
    	        } else {
    	          // If we didn't find a candidate gop fall back to keyframe-pulling
    	          gops = frameUtils.extendFirstKeyFrame(gops);
    	        }
    	      }

    	      // Trim gops to align with gopsToAlignWith
    	      if (gopsToAlignWith.length) {
    	        var alignedGops;
    	        if (options.alignGopsAtEnd) {
    	          alignedGops = this.alignGopsAtEnd_(gops);
    	        } else {
    	          alignedGops = this.alignGopsAtStart_(gops);
    	        }
    	        if (!alignedGops) {
    	          // save all the nals in the last GOP into the gop cache
    	          this.gopCache_.unshift({
    	            gop: gops.pop(),
    	            pps: track.pps,
    	            sps: track.sps
    	          });

    	          // Keep a maximum of 6 GOPs in the cache
    	          this.gopCache_.length = Math.min(6, this.gopCache_.length);

    	          // Clear nalUnits
    	          nalUnits = [];

    	          // return early no gops can be aligned with desired gopsToAlignWith
    	          this.resetStream_();
    	          this.trigger('done', 'VideoSegmentStream');
    	          return;
    	        }

    	        // Some gops were trimmed. clear dts info so minSegmentDts and pts are correct
    	        // when recalculated before sending off to CoalesceStream
    	        trackDecodeInfo.clearDtsInfo(track);
    	        gops = alignedGops;
    	      }
    	      trackDecodeInfo.collectDtsInfo(track, gops);

    	      // First, we have to build the index from byte locations to
    	      // samples (that is, frames) in the video data
    	      track.samples = frameUtils.generateSampleTable(gops);

    	      // Concatenate the video data and construct the mdat
    	      mdat = mp4Generator.mdat(frameUtils.concatenateNalData(gops));
    	      track.baseMediaDecodeTime = trackDecodeInfo.calculateTrackBaseMediaDecodeTime(track, options.keepOriginalTimestamps);
    	      this.trigger('processedGopsInfo', gops.map(function (gop) {
    	        return {
    	          pts: gop.pts,
    	          dts: gop.dts,
    	          byteLength: gop.byteLength
    	        };
    	      }));
    	      firstGop = gops[0];
    	      lastGop = gops[gops.length - 1];
    	      this.trigger('segmentTimingInfo', generateSegmentTimingInfo(track.baseMediaDecodeTime, firstGop.dts, firstGop.pts, lastGop.dts + lastGop.duration, lastGop.pts + lastGop.duration, prependedContentDuration));
    	      this.trigger('timingInfo', {
    	        start: gops[0].pts,
    	        end: gops[gops.length - 1].pts + gops[gops.length - 1].duration
    	      });

    	      // save all the nals in the last GOP into the gop cache
    	      this.gopCache_.unshift({
    	        gop: gops.pop(),
    	        pps: track.pps,
    	        sps: track.sps
    	      });

    	      // Keep a maximum of 6 GOPs in the cache
    	      this.gopCache_.length = Math.min(6, this.gopCache_.length);

    	      // Clear nalUnits
    	      nalUnits = [];
    	      this.trigger('baseMediaDecodeTime', track.baseMediaDecodeTime);
    	      this.trigger('timelineStartInfo', track.timelineStartInfo);
    	      moof = mp4Generator.moof(sequenceNumber, [track]);

    	      // it would be great to allocate this array up front instead of
    	      // throwing away hundreds of media segment fragments
    	      boxes = new Uint8Array(moof.byteLength + mdat.byteLength);

    	      // Bump the sequence number for next time
    	      sequenceNumber++;
    	      boxes.set(moof);
    	      boxes.set(mdat, moof.byteLength);
    	      this.trigger('data', {
    	        track: track,
    	        boxes: boxes
    	      });
    	      this.resetStream_();

    	      // Continue with the flush process now
    	      this.trigger('done', 'VideoSegmentStream');
    	    };
    	    this.reset = function () {
    	      this.resetStream_();
    	      nalUnits = [];
    	      this.gopCache_.length = 0;
    	      gopsToAlignWith.length = 0;
    	      this.trigger('reset');
    	    };
    	    this.resetStream_ = function () {
    	      trackDecodeInfo.clearDtsInfo(track);

    	      // reset config and pps because they may differ across segments
    	      // for instance, when we are rendition switching
    	      config = undefined;
    	      pps = undefined;
    	    };

    	    // Search for a candidate Gop for gop-fusion from the gop cache and
    	    // return it or return null if no good candidate was found
    	    this.getGopForFusion_ = function (nalUnit) {
    	      var halfSecond = 45000,
    	        // Half-a-second in a 90khz clock
    	        allowableOverlap = 10000,
    	        // About 3 frames @ 30fps
    	        nearestDistance = Infinity,
    	        dtsDistance,
    	        nearestGopObj,
    	        currentGop,
    	        currentGopObj,
    	        i;

    	      // Search for the GOP nearest to the beginning of this nal unit
    	      for (i = 0; i < this.gopCache_.length; i++) {
    	        currentGopObj = this.gopCache_[i];
    	        currentGop = currentGopObj.gop;

    	        // Reject Gops with different SPS or PPS
    	        if (!(track.pps && arrayEquals(track.pps[0], currentGopObj.pps[0])) || !(track.sps && arrayEquals(track.sps[0], currentGopObj.sps[0]))) {
    	          continue;
    	        }

    	        // Reject Gops that would require a negative baseMediaDecodeTime
    	        if (currentGop.dts < track.timelineStartInfo.dts) {
    	          continue;
    	        }

    	        // The distance between the end of the gop and the start of the nalUnit
    	        dtsDistance = nalUnit.dts - currentGop.dts - currentGop.duration;

    	        // Only consider GOPS that start before the nal unit and end within
    	        // a half-second of the nal unit
    	        if (dtsDistance >= -allowableOverlap && dtsDistance <= halfSecond) {
    	          // Always use the closest GOP we found if there is more than
    	          // one candidate
    	          if (!nearestGopObj || nearestDistance > dtsDistance) {
    	            nearestGopObj = currentGopObj;
    	            nearestDistance = dtsDistance;
    	          }
    	        }
    	      }
    	      if (nearestGopObj) {
    	        return nearestGopObj.gop;
    	      }
    	      return null;
    	    };

    	    // trim gop list to the first gop found that has a matching pts with a gop in the list
    	    // of gopsToAlignWith starting from the START of the list
    	    this.alignGopsAtStart_ = function (gops) {
    	      var alignIndex, gopIndex, align, gop, byteLength, nalCount, duration, alignedGops;
    	      byteLength = gops.byteLength;
    	      nalCount = gops.nalCount;
    	      duration = gops.duration;
    	      alignIndex = gopIndex = 0;
    	      while (alignIndex < gopsToAlignWith.length && gopIndex < gops.length) {
    	        align = gopsToAlignWith[alignIndex];
    	        gop = gops[gopIndex];
    	        if (align.pts === gop.pts) {
    	          break;
    	        }
    	        if (gop.pts > align.pts) {
    	          // this current gop starts after the current gop we want to align on, so increment
    	          // align index
    	          alignIndex++;
    	          continue;
    	        }

    	        // current gop starts before the current gop we want to align on. so increment gop
    	        // index
    	        gopIndex++;
    	        byteLength -= gop.byteLength;
    	        nalCount -= gop.nalCount;
    	        duration -= gop.duration;
    	      }
    	      if (gopIndex === 0) {
    	        // no gops to trim
    	        return gops;
    	      }
    	      if (gopIndex === gops.length) {
    	        // all gops trimmed, skip appending all gops
    	        return null;
    	      }
    	      alignedGops = gops.slice(gopIndex);
    	      alignedGops.byteLength = byteLength;
    	      alignedGops.duration = duration;
    	      alignedGops.nalCount = nalCount;
    	      alignedGops.pts = alignedGops[0].pts;
    	      alignedGops.dts = alignedGops[0].dts;
    	      return alignedGops;
    	    };

    	    // trim gop list to the first gop found that has a matching pts with a gop in the list
    	    // of gopsToAlignWith starting from the END of the list
    	    this.alignGopsAtEnd_ = function (gops) {
    	      var alignIndex, gopIndex, align, gop, alignEndIndex, matchFound;
    	      alignIndex = gopsToAlignWith.length - 1;
    	      gopIndex = gops.length - 1;
    	      alignEndIndex = null;
    	      matchFound = false;
    	      while (alignIndex >= 0 && gopIndex >= 0) {
    	        align = gopsToAlignWith[alignIndex];
    	        gop = gops[gopIndex];
    	        if (align.pts === gop.pts) {
    	          matchFound = true;
    	          break;
    	        }
    	        if (align.pts > gop.pts) {
    	          alignIndex--;
    	          continue;
    	        }
    	        if (alignIndex === gopsToAlignWith.length - 1) {
    	          // gop.pts is greater than the last alignment candidate. If no match is found
    	          // by the end of this loop, we still want to append gops that come after this
    	          // point
    	          alignEndIndex = gopIndex;
    	        }
    	        gopIndex--;
    	      }
    	      if (!matchFound && alignEndIndex === null) {
    	        return null;
    	      }
    	      var trimIndex;
    	      if (matchFound) {
    	        trimIndex = gopIndex;
    	      } else {
    	        trimIndex = alignEndIndex;
    	      }
    	      if (trimIndex === 0) {
    	        return gops;
    	      }
    	      var alignedGops = gops.slice(trimIndex);
    	      var metadata = alignedGops.reduce(function (total, gop) {
    	        total.byteLength += gop.byteLength;
    	        total.duration += gop.duration;
    	        total.nalCount += gop.nalCount;
    	        return total;
    	      }, {
    	        byteLength: 0,
    	        duration: 0,
    	        nalCount: 0
    	      });
    	      alignedGops.byteLength = metadata.byteLength;
    	      alignedGops.duration = metadata.duration;
    	      alignedGops.nalCount = metadata.nalCount;
    	      alignedGops.pts = alignedGops[0].pts;
    	      alignedGops.dts = alignedGops[0].dts;
    	      return alignedGops;
    	    };
    	    this.alignGopsWith = function (newGopsToAlignWith) {
    	      gopsToAlignWith = newGopsToAlignWith;
    	    };
    	  };
    	  _VideoSegmentStream.prototype = new stream();

    	  /**
    	   * A Stream that can combine multiple streams (ie. audio & video)
    	   * into a single output segment for MSE. Also supports audio-only
    	   * and video-only streams.
    	   * @param options {object} transmuxer options object
    	   * @param options.keepOriginalTimestamps {boolean} If true, keep the timestamps
    	   *        in the source; false to adjust the first segment to start at media timeline start.
    	   */
    	  _CoalesceStream = function CoalesceStream(options, metadataStream) {
    	    // Number of Tracks per output segment
    	    // If greater than 1, we combine multiple
    	    // tracks into a single segment
    	    this.numberOfTracks = 0;
    	    this.metadataStream = metadataStream;
    	    options = options || {};
    	    if (typeof options.remux !== 'undefined') {
    	      this.remuxTracks = !!options.remux;
    	    } else {
    	      this.remuxTracks = true;
    	    }
    	    if (typeof options.keepOriginalTimestamps === 'boolean') {
    	      this.keepOriginalTimestamps = options.keepOriginalTimestamps;
    	    } else {
    	      this.keepOriginalTimestamps = false;
    	    }
    	    this.pendingTracks = [];
    	    this.videoTrack = null;
    	    this.pendingBoxes = [];
    	    this.pendingCaptions = [];
    	    this.pendingMetadata = [];
    	    this.pendingBytes = 0;
    	    this.emittedTracks = 0;
    	    _CoalesceStream.prototype.init.call(this);

    	    // Take output from multiple
    	    this.push = function (output) {
    	      // buffer incoming captions until the associated video segment
    	      // finishes
    	      if (output.text) {
    	        return this.pendingCaptions.push(output);
    	      }
    	      // buffer incoming id3 tags until the final flush
    	      if (output.frames) {
    	        return this.pendingMetadata.push(output);
    	      }

    	      // Add this track to the list of pending tracks and store
    	      // important information required for the construction of
    	      // the final segment
    	      this.pendingTracks.push(output.track);
    	      this.pendingBytes += output.boxes.byteLength;

    	      // TODO: is there an issue for this against chrome?
    	      // We unshift audio and push video because
    	      // as of Chrome 75 when switching from
    	      // one init segment to another if the video
    	      // mdat does not appear after the audio mdat
    	      // only audio will play for the duration of our transmux.
    	      if (output.track.type === 'video') {
    	        this.videoTrack = output.track;
    	        this.pendingBoxes.push(output.boxes);
    	      }
    	      if (output.track.type === 'audio') {
    	        this.audioTrack = output.track;
    	        this.pendingBoxes.unshift(output.boxes);
    	      }
    	    };
    	  };
    	  _CoalesceStream.prototype = new stream();
    	  _CoalesceStream.prototype.flush = function (flushSource) {
    	    var offset = 0,
    	      event = {
    	        captions: [],
    	        captionStreams: {},
    	        metadata: [],
    	        info: {}
    	      },
    	      caption,
    	      id3,
    	      initSegment,
    	      timelineStartPts = 0,
    	      i;
    	    if (this.pendingTracks.length < this.numberOfTracks) {
    	      if (flushSource !== 'VideoSegmentStream' && flushSource !== 'AudioSegmentStream') {
    	        // Return because we haven't received a flush from a data-generating
    	        // portion of the segment (meaning that we have only recieved meta-data
    	        // or captions.)
    	        return;
    	      } else if (this.remuxTracks) {
    	        // Return until we have enough tracks from the pipeline to remux (if we
    	        // are remuxing audio and video into a single MP4)
    	        return;
    	      } else if (this.pendingTracks.length === 0) {
    	        // In the case where we receive a flush without any data having been
    	        // received we consider it an emitted track for the purposes of coalescing
    	        // `done` events.
    	        // We do this for the case where there is an audio and video track in the
    	        // segment but no audio data. (seen in several playlists with alternate
    	        // audio tracks and no audio present in the main TS segments.)
    	        this.emittedTracks++;
    	        if (this.emittedTracks >= this.numberOfTracks) {
    	          this.trigger('done');
    	          this.emittedTracks = 0;
    	        }
    	        return;
    	      }
    	    }
    	    if (this.videoTrack) {
    	      timelineStartPts = this.videoTrack.timelineStartInfo.pts;
    	      videoProperties.forEach(function (prop) {
    	        event.info[prop] = this.videoTrack[prop];
    	      }, this);
    	    } else if (this.audioTrack) {
    	      timelineStartPts = this.audioTrack.timelineStartInfo.pts;
    	      audioProperties.forEach(function (prop) {
    	        event.info[prop] = this.audioTrack[prop];
    	      }, this);
    	    }
    	    if (this.videoTrack || this.audioTrack) {
    	      if (this.pendingTracks.length === 1) {
    	        event.type = this.pendingTracks[0].type;
    	      } else {
    	        event.type = 'combined';
    	      }
    	      this.emittedTracks += this.pendingTracks.length;
    	      initSegment = mp4Generator.initSegment(this.pendingTracks);

    	      // Create a new typed array to hold the init segment
    	      event.initSegment = new Uint8Array(initSegment.byteLength);

    	      // Create an init segment containing a moov
    	      // and track definitions
    	      event.initSegment.set(initSegment);

    	      // Create a new typed array to hold the moof+mdats
    	      event.data = new Uint8Array(this.pendingBytes);

    	      // Append each moof+mdat (one per track) together
    	      for (i = 0; i < this.pendingBoxes.length; i++) {
    	        event.data.set(this.pendingBoxes[i], offset);
    	        offset += this.pendingBoxes[i].byteLength;
    	      }

    	      // Translate caption PTS times into second offsets to match the
    	      // video timeline for the segment, and add track info
    	      for (i = 0; i < this.pendingCaptions.length; i++) {
    	        caption = this.pendingCaptions[i];
    	        caption.startTime = clock.metadataTsToSeconds(caption.startPts, timelineStartPts, this.keepOriginalTimestamps);
    	        caption.endTime = clock.metadataTsToSeconds(caption.endPts, timelineStartPts, this.keepOriginalTimestamps);
    	        event.captionStreams[caption.stream] = true;
    	        event.captions.push(caption);
    	      }

    	      // Translate ID3 frame PTS times into second offsets to match the
    	      // video timeline for the segment
    	      for (i = 0; i < this.pendingMetadata.length; i++) {
    	        id3 = this.pendingMetadata[i];
    	        id3.cueTime = clock.metadataTsToSeconds(id3.pts, timelineStartPts, this.keepOriginalTimestamps);
    	        event.metadata.push(id3);
    	      }

    	      // We add this to every single emitted segment even though we only need
    	      // it for the first
    	      event.metadata.dispatchType = this.metadataStream.dispatchType;

    	      // Reset stream state
    	      this.pendingTracks.length = 0;
    	      this.videoTrack = null;
    	      this.pendingBoxes.length = 0;
    	      this.pendingCaptions.length = 0;
    	      this.pendingBytes = 0;
    	      this.pendingMetadata.length = 0;

    	      // Emit the built segment
    	      // We include captions and ID3 tags for backwards compatibility,
    	      // ideally we should send only video and audio in the data event
    	      this.trigger('data', event);
    	      // Emit each caption to the outside world
    	      // Ideally, this would happen immediately on parsing captions,
    	      // but we need to ensure that video data is sent back first
    	      // so that caption timing can be adjusted to match video timing
    	      for (i = 0; i < event.captions.length; i++) {
    	        caption = event.captions[i];
    	        this.trigger('caption', caption);
    	      }
    	      // Emit each id3 tag to the outside world
    	      // Ideally, this would happen immediately on parsing the tag,
    	      // but we need to ensure that video data is sent back first
    	      // so that ID3 frame timing can be adjusted to match video timing
    	      for (i = 0; i < event.metadata.length; i++) {
    	        id3 = event.metadata[i];
    	        this.trigger('id3Frame', id3);
    	      }
    	    }

    	    // Only emit `done` if all tracks have been flushed and emitted
    	    if (this.emittedTracks >= this.numberOfTracks) {
    	      this.trigger('done');
    	      this.emittedTracks = 0;
    	    }
    	  };
    	  _CoalesceStream.prototype.setRemux = function (val) {
    	    this.remuxTracks = val;
    	  };
    	  /**
    	   * A Stream that expects MP2T binary data as input and produces
    	   * corresponding media segments, suitable for use with Media Source
    	   * Extension (MSE) implementations that support the ISO BMFF byte
    	   * stream format, like Chrome.
    	   */
    	  _Transmuxer = function Transmuxer(options) {
    	    var self = this,
    	      hasFlushed = true,
    	      videoTrack,
    	      audioTrack;
    	    _Transmuxer.prototype.init.call(this);
    	    options = options || {};
    	    var duration = this.duration = options.duration || 0xffffffff;
    	    this.baseMediaDecodeTime = options.baseMediaDecodeTime || 0;
    	    this.transmuxPipeline_ = {};
    	    this.setupAacPipeline = function () {
    	      var pipeline = {};
    	      this.transmuxPipeline_ = pipeline;
    	      pipeline.type = 'aac';
    	      pipeline.metadataStream = new m2ts_1.MetadataStream();

    	      // set up the parsing pipeline
    	      pipeline.aacStream = new aac();
    	      pipeline.audioTimestampRolloverStream = new m2ts_1.TimestampRolloverStream('audio');
    	      pipeline.timedMetadataTimestampRolloverStream = new m2ts_1.TimestampRolloverStream('timed-metadata');
    	      pipeline.adtsStream = new adts();
    	      pipeline.coalesceStream = new _CoalesceStream(options, pipeline.metadataStream);
    	      pipeline.headOfPipeline = pipeline.aacStream;
    	      pipeline.aacStream.pipe(pipeline.audioTimestampRolloverStream).pipe(pipeline.adtsStream);
    	      pipeline.aacStream.pipe(pipeline.timedMetadataTimestampRolloverStream).pipe(pipeline.metadataStream).pipe(pipeline.coalesceStream);
    	      pipeline.metadataStream.on('timestamp', function (frame) {
    	        pipeline.aacStream.setTimestamp(frame.timeStamp);
    	      });
    	      pipeline.aacStream.on('data', function (data) {
    	        if (data.type !== 'timed-metadata' && data.type !== 'audio' || pipeline.audioSegmentStream) {
    	          return;
    	        }
    	        audioTrack = audioTrack || {
    	          timelineStartInfo: {
    	            baseMediaDecodeTime: self.baseMediaDecodeTime
    	          },
    	          codec: 'adts',
    	          type: 'audio'
    	        };
    	        // hook up the audio segment stream to the first track with aac data
    	        pipeline.coalesceStream.numberOfTracks++;
    	        pipeline.audioSegmentStream = new _AudioSegmentStream(audioTrack, options);
    	        pipeline.audioSegmentStream.on('log', self.getLogTrigger_('audioSegmentStream'));
    	        pipeline.audioSegmentStream.on('timingInfo', self.trigger.bind(self, 'audioTimingInfo'));

    	        // Set up the final part of the audio pipeline
    	        pipeline.adtsStream.pipe(pipeline.audioSegmentStream).pipe(pipeline.coalesceStream);

    	        // emit pmt info
    	        self.trigger('trackinfo', {
    	          hasAudio: !!audioTrack,
    	          hasVideo: !!videoTrack
    	        });
    	      });

    	      // Re-emit any data coming from the coalesce stream to the outside world
    	      pipeline.coalesceStream.on('data', this.trigger.bind(this, 'data'));
    	      // Let the consumer know we have finished flushing the entire pipeline
    	      pipeline.coalesceStream.on('done', this.trigger.bind(this, 'done'));
    	      addPipelineLogRetriggers(this, pipeline);
    	    };
    	    this.setupTsPipeline = function () {
    	      var pipeline = {};
    	      this.transmuxPipeline_ = pipeline;
    	      pipeline.type = 'ts';
    	      pipeline.duration = duration * 9e4;
    	      pipeline.metadataStream = new m2ts_1.MetadataStream();

    	      // set up the parsing pipeline
    	      pipeline.packetStream = new m2ts_1.TransportPacketStream();
    	      pipeline.parseStream = new m2ts_1.TransportParseStream();
    	      pipeline.elementaryStream = new m2ts_1.ElementaryStream();
    	      pipeline.timestampRolloverStream = new m2ts_1.TimestampRolloverStream();
    	      pipeline.adtsStream = new adts();
    	      pipeline.h264Stream = new H264Stream();
    	      pipeline.captionStream = new m2ts_1.CaptionStream(options);
    	      pipeline.coalesceStream = new _CoalesceStream(options, pipeline.metadataStream);
    	      pipeline.headOfPipeline = pipeline.packetStream;

    	      // disassemble MPEG2-TS packets into elementary streams
    	      pipeline.packetStream.pipe(pipeline.parseStream).pipe(pipeline.elementaryStream).pipe(pipeline.timestampRolloverStream);

    	      // !!THIS ORDER IS IMPORTANT!!
    	      // demux the streams
    	      pipeline.timestampRolloverStream.pipe(pipeline.h264Stream);
    	      pipeline.timestampRolloverStream.pipe(pipeline.adtsStream);
    	      pipeline.timestampRolloverStream.pipe(pipeline.metadataStream).pipe(pipeline.coalesceStream);

    	      // Hook up CEA-608/708 caption stream
    	      pipeline.h264Stream.pipe(pipeline.captionStream).pipe(pipeline.coalesceStream);
    	      pipeline.elementaryStream.on('data', function (data) {
    	        var i;
    	        if (data.type === 'metadata') {
    	          i = data.tracks.length;

    	          // scan the tracks listed in the metadata
    	          while (i--) {
    	            if (!videoTrack && data.tracks[i].type === 'video') {
    	              videoTrack = data.tracks[i];
    	              videoTrack.duration = pipeline.duration;
    	              videoTrack.timelineStartInfo.baseMediaDecodeTime = self.baseMediaDecodeTime;
    	            } else if (!audioTrack && data.tracks[i].type === 'audio') {
    	              audioTrack = data.tracks[i];
    	              audioTrack.duration = pipeline.duration;
    	              audioTrack.timelineStartInfo.baseMediaDecodeTime = self.baseMediaDecodeTime;
    	            }
    	          }

    	          // hook up the video segment stream to the first track with h264 data
    	          if (videoTrack && !pipeline.videoSegmentStream) {
    	            pipeline.coalesceStream.numberOfTracks++;
    	            pipeline.videoSegmentStream = new _VideoSegmentStream(videoTrack, options);
    	            pipeline.videoSegmentStream.on('log', self.getLogTrigger_('videoSegmentStream'));
    	            pipeline.videoSegmentStream.on('timelineStartInfo', function (timelineStartInfo) {
    	              // When video emits timelineStartInfo data after a flush, we forward that
    	              // info to the AudioSegmentStream, if it exists, because video timeline
    	              // data takes precedence.  Do not do this if keepOriginalTimestamps is set,
    	              // because this is a particularly subtle form of timestamp alteration.
    	              if (audioTrack && !options.keepOriginalTimestamps) {
    	                audioTrack.timelineStartInfo = timelineStartInfo;
    	                // On the first segment we trim AAC frames that exist before the
    	                // very earliest DTS we have seen in video because Chrome will
    	                // interpret any video track with a baseMediaDecodeTime that is
    	                // non-zero as a gap.
    	                pipeline.audioSegmentStream.setEarliestDts(timelineStartInfo.dts - self.baseMediaDecodeTime);
    	              }
    	            });
    	            pipeline.videoSegmentStream.on('processedGopsInfo', self.trigger.bind(self, 'gopInfo'));
    	            pipeline.videoSegmentStream.on('segmentTimingInfo', self.trigger.bind(self, 'videoSegmentTimingInfo'));
    	            pipeline.videoSegmentStream.on('baseMediaDecodeTime', function (baseMediaDecodeTime) {
    	              if (audioTrack) {
    	                pipeline.audioSegmentStream.setVideoBaseMediaDecodeTime(baseMediaDecodeTime);
    	              }
    	            });
    	            pipeline.videoSegmentStream.on('timingInfo', self.trigger.bind(self, 'videoTimingInfo'));

    	            // Set up the final part of the video pipeline
    	            pipeline.h264Stream.pipe(pipeline.videoSegmentStream).pipe(pipeline.coalesceStream);
    	          }
    	          if (audioTrack && !pipeline.audioSegmentStream) {
    	            // hook up the audio segment stream to the first track with aac data
    	            pipeline.coalesceStream.numberOfTracks++;
    	            pipeline.audioSegmentStream = new _AudioSegmentStream(audioTrack, options);
    	            pipeline.audioSegmentStream.on('log', self.getLogTrigger_('audioSegmentStream'));
    	            pipeline.audioSegmentStream.on('timingInfo', self.trigger.bind(self, 'audioTimingInfo'));
    	            pipeline.audioSegmentStream.on('segmentTimingInfo', self.trigger.bind(self, 'audioSegmentTimingInfo'));

    	            // Set up the final part of the audio pipeline
    	            pipeline.adtsStream.pipe(pipeline.audioSegmentStream).pipe(pipeline.coalesceStream);
    	          }

    	          // emit pmt info
    	          self.trigger('trackinfo', {
    	            hasAudio: !!audioTrack,
    	            hasVideo: !!videoTrack
    	          });
    	        }
    	      });

    	      // Re-emit any data coming from the coalesce stream to the outside world
    	      pipeline.coalesceStream.on('data', this.trigger.bind(this, 'data'));
    	      pipeline.coalesceStream.on('id3Frame', function (id3Frame) {
    	        id3Frame.dispatchType = pipeline.metadataStream.dispatchType;
    	        self.trigger('id3Frame', id3Frame);
    	      });
    	      pipeline.coalesceStream.on('caption', this.trigger.bind(this, 'caption'));
    	      // Let the consumer know we have finished flushing the entire pipeline
    	      pipeline.coalesceStream.on('done', this.trigger.bind(this, 'done'));
    	      addPipelineLogRetriggers(this, pipeline);
    	    };

    	    // hook up the segment streams once track metadata is delivered
    	    this.setBaseMediaDecodeTime = function (baseMediaDecodeTime) {
    	      var pipeline = this.transmuxPipeline_;
    	      if (!options.keepOriginalTimestamps) {
    	        this.baseMediaDecodeTime = baseMediaDecodeTime;
    	      }
    	      if (audioTrack) {
    	        audioTrack.timelineStartInfo.dts = undefined;
    	        audioTrack.timelineStartInfo.pts = undefined;
    	        trackDecodeInfo.clearDtsInfo(audioTrack);
    	        if (pipeline.audioTimestampRolloverStream) {
    	          pipeline.audioTimestampRolloverStream.discontinuity();
    	        }
    	      }
    	      if (videoTrack) {
    	        if (pipeline.videoSegmentStream) {
    	          pipeline.videoSegmentStream.gopCache_ = [];
    	        }
    	        videoTrack.timelineStartInfo.dts = undefined;
    	        videoTrack.timelineStartInfo.pts = undefined;
    	        trackDecodeInfo.clearDtsInfo(videoTrack);
    	        pipeline.captionStream.reset();
    	      }
    	      if (pipeline.timestampRolloverStream) {
    	        pipeline.timestampRolloverStream.discontinuity();
    	      }
    	    };
    	    this.setAudioAppendStart = function (timestamp) {
    	      if (audioTrack) {
    	        this.transmuxPipeline_.audioSegmentStream.setAudioAppendStart(timestamp);
    	      }
    	    };
    	    this.setRemux = function (val) {
    	      var pipeline = this.transmuxPipeline_;
    	      options.remux = val;
    	      if (pipeline && pipeline.coalesceStream) {
    	        pipeline.coalesceStream.setRemux(val);
    	      }
    	    };
    	    this.alignGopsWith = function (gopsToAlignWith) {
    	      if (videoTrack && this.transmuxPipeline_.videoSegmentStream) {
    	        this.transmuxPipeline_.videoSegmentStream.alignGopsWith(gopsToAlignWith);
    	      }
    	    };
    	    this.getLogTrigger_ = function (key) {
    	      var self = this;
    	      return function (event) {
    	        event.stream = key;
    	        self.trigger('log', event);
    	      };
    	    };
    	    // feed incoming data to the front of the parsing pipeline
    	    this.push = function (data) {
    	      if (hasFlushed) {
    	        var isAac = isLikelyAacData(data);
    	        if (isAac && this.transmuxPipeline_.type !== 'aac') {
    	          this.setupAacPipeline();
    	        } else if (!isAac && this.transmuxPipeline_.type !== 'ts') {
    	          this.setupTsPipeline();
    	        }
    	        hasFlushed = false;
    	      }
    	      this.transmuxPipeline_.headOfPipeline.push(data);
    	    };

    	    // flush any buffered data
    	    this.flush = function () {
    	      hasFlushed = true;
    	      // Start at the top of the pipeline and flush all pending work
    	      this.transmuxPipeline_.headOfPipeline.flush();
    	    };
    	    this.endTimeline = function () {
    	      this.transmuxPipeline_.headOfPipeline.endTimeline();
    	    };
    	    this.reset = function () {
    	      if (this.transmuxPipeline_.headOfPipeline) {
    	        this.transmuxPipeline_.headOfPipeline.reset();
    	      }
    	    };

    	    // Caption data has to be reset when seeking outside buffered range
    	    this.resetCaptions = function () {
    	      if (this.transmuxPipeline_.captionStream) {
    	        this.transmuxPipeline_.captionStream.reset();
    	      }
    	    };
    	  };
    	  _Transmuxer.prototype = new stream();
    	  var transmuxer = _Transmuxer;

    	  return transmuxer;

    	})); 
    } (mp4Transmuxer));

    var mp4TransmuxerExports = mp4Transmuxer.exports;
    var Transmuxer = /*@__PURE__*/getDefaultExportFromCjs(mp4TransmuxerExports);

    var aesJs = {exports: {}};

    /*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */

    (function (module, exports) {
    	(function(root) {

    	    function checkInt(value) {
    	        return (parseInt(value) === value);
    	    }

    	    function checkInts(arrayish) {
    	        if (!checkInt(arrayish.length)) { return false; }

    	        for (var i = 0; i < arrayish.length; i++) {
    	            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
    	                return false;
    	            }
    	        }

    	        return true;
    	    }

    	    function coerceArray(arg, copy) {

    	        // ArrayBuffer view
    	        if (arg.buffer && arg.name === 'Uint8Array') {

    	            if (copy) {
    	                if (arg.slice) {
    	                    arg = arg.slice();
    	                } else {
    	                    arg = Array.prototype.slice.call(arg);
    	                }
    	            }

    	            return arg;
    	        }

    	        // It's an array; check it is a valid representation of a byte
    	        if (Array.isArray(arg)) {
    	            if (!checkInts(arg)) {
    	                throw new Error('Array contains invalid value: ' + arg);
    	            }

    	            return new Uint8Array(arg);
    	        }

    	        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
    	        if (checkInt(arg.length) && checkInts(arg)) {
    	            return new Uint8Array(arg);
    	        }

    	        throw new Error('unsupported array-like object');
    	    }

    	    function createArray(length) {
    	        return new Uint8Array(length);
    	    }

    	    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
    	        if (sourceStart != null || sourceEnd != null) {
    	            if (sourceArray.slice) {
    	                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
    	            } else {
    	                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
    	            }
    	        }
    	        targetArray.set(sourceArray, targetStart);
    	    }



    	    var convertUtf8 = (function() {
    	        function toBytes(text) {
    	            var result = [], i = 0;
    	            text = encodeURI(text);
    	            while (i < text.length) {
    	                var c = text.charCodeAt(i++);

    	                // if it is a % sign, encode the following 2 bytes as a hex value
    	                if (c === 37) {
    	                    result.push(parseInt(text.substr(i, 2), 16));
    	                    i += 2;

    	                // otherwise, just the actual byte
    	                } else {
    	                    result.push(c);
    	                }
    	            }

    	            return coerceArray(result);
    	        }

    	        function fromBytes(bytes) {
    	            var result = [], i = 0;

    	            while (i < bytes.length) {
    	                var c = bytes[i];

    	                if (c < 128) {
    	                    result.push(String.fromCharCode(c));
    	                    i++;
    	                } else if (c > 191 && c < 224) {
    	                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
    	                    i += 2;
    	                } else {
    	                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
    	                    i += 3;
    	                }
    	            }

    	            return result.join('');
    	        }

    	        return {
    	            toBytes: toBytes,
    	            fromBytes: fromBytes,
    	        }
    	    })();

    	    var convertHex = (function() {
    	        function toBytes(text) {
    	            var result = [];
    	            for (var i = 0; i < text.length; i += 2) {
    	                result.push(parseInt(text.substr(i, 2), 16));
    	            }

    	            return result;
    	        }

    	        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
    	        var Hex = '0123456789abcdef';

    	        function fromBytes(bytes) {
    	                var result = [];
    	                for (var i = 0; i < bytes.length; i++) {
    	                    var v = bytes[i];
    	                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
    	                }
    	                return result.join('');
    	        }

    	        return {
    	            toBytes: toBytes,
    	            fromBytes: fromBytes,
    	        }
    	    })();


    	    // Number of rounds by keysize
    	    var numberOfRounds = {16: 10, 24: 12, 32: 14};

    	    // Round constant words
    	    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    	    // S-box and Inverse S-box (S is for Substitution)
    	    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    	    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    	    // Transformations for encryption
    	    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    	    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    	    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    	    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    	    // Transformations for decryption
    	    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    	    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    	    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    	    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    	    // Transformations for decryption key expansion
    	    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    	    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    	    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    	    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    	    function convertToInt32(bytes) {
    	        var result = [];
    	        for (var i = 0; i < bytes.length; i += 4) {
    	            result.push(
    	                (bytes[i    ] << 24) |
    	                (bytes[i + 1] << 16) |
    	                (bytes[i + 2] <<  8) |
    	                 bytes[i + 3]
    	            );
    	        }
    	        return result;
    	    }

    	    var AES = function(key) {
    	        if (!(this instanceof AES)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        Object.defineProperty(this, 'key', {
    	            value: coerceArray(key, true)
    	        });

    	        this._prepare();
    	    };


    	    AES.prototype._prepare = function() {

    	        var rounds = numberOfRounds[this.key.length];
    	        if (rounds == null) {
    	            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
    	        }

    	        // encryption round keys
    	        this._Ke = [];

    	        // decryption round keys
    	        this._Kd = [];

    	        for (var i = 0; i <= rounds; i++) {
    	            this._Ke.push([0, 0, 0, 0]);
    	            this._Kd.push([0, 0, 0, 0]);
    	        }

    	        var roundKeyCount = (rounds + 1) * 4;
    	        var KC = this.key.length / 4;

    	        // convert the key into ints
    	        var tk = convertToInt32(this.key);

    	        // copy values into round key arrays
    	        var index;
    	        for (var i = 0; i < KC; i++) {
    	            index = i >> 2;
    	            this._Ke[index][i % 4] = tk[i];
    	            this._Kd[rounds - index][i % 4] = tk[i];
    	        }

    	        // key expansion (fips-197 section 5.2)
    	        var rconpointer = 0;
    	        var t = KC, tt;
    	        while (t < roundKeyCount) {
    	            tt = tk[KC - 1];
    	            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
    	                      (S[(tt >>  8) & 0xFF] << 16) ^
    	                      (S[ tt        & 0xFF] <<  8) ^
    	                       S[(tt >> 24) & 0xFF]        ^
    	                      (rcon[rconpointer] << 24));
    	            rconpointer += 1;

    	            // key expansion (for non-256 bit)
    	            if (KC != 8) {
    	                for (var i = 1; i < KC; i++) {
    	                    tk[i] ^= tk[i - 1];
    	                }

    	            // key expansion for 256-bit keys is "slightly different" (fips-197)
    	            } else {
    	                for (var i = 1; i < (KC / 2); i++) {
    	                    tk[i] ^= tk[i - 1];
    	                }
    	                tt = tk[(KC / 2) - 1];

    	                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
    	                              (S[(tt >>  8) & 0xFF] <<  8) ^
    	                              (S[(tt >> 16) & 0xFF] << 16) ^
    	                              (S[(tt >> 24) & 0xFF] << 24));

    	                for (var i = (KC / 2) + 1; i < KC; i++) {
    	                    tk[i] ^= tk[i - 1];
    	                }
    	            }

    	            // copy values into round key arrays
    	            var i = 0, r, c;
    	            while (i < KC && t < roundKeyCount) {
    	                r = t >> 2;
    	                c = t % 4;
    	                this._Ke[r][c] = tk[i];
    	                this._Kd[rounds - r][c] = tk[i++];
    	                t++;
    	            }
    	        }

    	        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
    	        for (var r = 1; r < rounds; r++) {
    	            for (var c = 0; c < 4; c++) {
    	                tt = this._Kd[r][c];
    	                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
    	                                  U2[(tt >> 16) & 0xFF] ^
    	                                  U3[(tt >>  8) & 0xFF] ^
    	                                  U4[ tt        & 0xFF]);
    	            }
    	        }
    	    };

    	    AES.prototype.encrypt = function(plaintext) {
    	        if (plaintext.length != 16) {
    	            throw new Error('invalid plaintext size (must be 16 bytes)');
    	        }

    	        var rounds = this._Ke.length - 1;
    	        var a = [0, 0, 0, 0];

    	        // convert plaintext to (ints ^ key)
    	        var t = convertToInt32(plaintext);
    	        for (var i = 0; i < 4; i++) {
    	            t[i] ^= this._Ke[0][i];
    	        }

    	        // apply round transforms
    	        for (var r = 1; r < rounds; r++) {
    	            for (var i = 0; i < 4; i++) {
    	                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
    	                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
    	                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
    	                        T4[ t[(i + 3) % 4]        & 0xff] ^
    	                        this._Ke[r][i]);
    	            }
    	            t = a.slice();
    	        }

    	        // the last round is special
    	        var result = createArray(16), tt;
    	        for (var i = 0; i < 4; i++) {
    	            tt = this._Ke[rounds][i];
    	            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
    	            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
    	            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
    	            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
    	        }

    	        return result;
    	    };

    	    AES.prototype.decrypt = function(ciphertext) {
    	        if (ciphertext.length != 16) {
    	            throw new Error('invalid ciphertext size (must be 16 bytes)');
    	        }

    	        var rounds = this._Kd.length - 1;
    	        var a = [0, 0, 0, 0];

    	        // convert plaintext to (ints ^ key)
    	        var t = convertToInt32(ciphertext);
    	        for (var i = 0; i < 4; i++) {
    	            t[i] ^= this._Kd[0][i];
    	        }

    	        // apply round transforms
    	        for (var r = 1; r < rounds; r++) {
    	            for (var i = 0; i < 4; i++) {
    	                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
    	                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
    	                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
    	                        T8[ t[(i + 1) % 4]        & 0xff] ^
    	                        this._Kd[r][i]);
    	            }
    	            t = a.slice();
    	        }

    	        // the last round is special
    	        var result = createArray(16), tt;
    	        for (var i = 0; i < 4; i++) {
    	            tt = this._Kd[rounds][i];
    	            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
    	            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
    	            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
    	            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
    	        }

    	        return result;
    	    };


    	    /**
    	     *  Mode Of Operation - Electonic Codebook (ECB)
    	     */
    	    var ModeOfOperationECB = function(key) {
    	        if (!(this instanceof ModeOfOperationECB)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        this.description = "Electronic Code Block";
    	        this.name = "ecb";

    	        this._aes = new AES(key);
    	    };

    	    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
    	        plaintext = coerceArray(plaintext);

    	        if ((plaintext.length % 16) !== 0) {
    	            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
    	        }

    	        var ciphertext = createArray(plaintext.length);
    	        var block = createArray(16);

    	        for (var i = 0; i < plaintext.length; i += 16) {
    	            copyArray(plaintext, block, 0, i, i + 16);
    	            block = this._aes.encrypt(block);
    	            copyArray(block, ciphertext, i);
    	        }

    	        return ciphertext;
    	    };

    	    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
    	        ciphertext = coerceArray(ciphertext);

    	        if ((ciphertext.length % 16) !== 0) {
    	            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
    	        }

    	        var plaintext = createArray(ciphertext.length);
    	        var block = createArray(16);

    	        for (var i = 0; i < ciphertext.length; i += 16) {
    	            copyArray(ciphertext, block, 0, i, i + 16);
    	            block = this._aes.decrypt(block);
    	            copyArray(block, plaintext, i);
    	        }

    	        return plaintext;
    	    };


    	    /**
    	     *  Mode Of Operation - Cipher Block Chaining (CBC)
    	     */
    	    var ModeOfOperationCBC = function(key, iv) {
    	        if (!(this instanceof ModeOfOperationCBC)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        this.description = "Cipher Block Chaining";
    	        this.name = "cbc";

    	        if (!iv) {
    	            iv = createArray(16);

    	        } else if (iv.length != 16) {
    	            throw new Error('invalid initialation vector size (must be 16 bytes)');
    	        }

    	        this._lastCipherblock = coerceArray(iv, true);

    	        this._aes = new AES(key);
    	    };

    	    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
    	        plaintext = coerceArray(plaintext);

    	        if ((plaintext.length % 16) !== 0) {
    	            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
    	        }

    	        var ciphertext = createArray(plaintext.length);
    	        var block = createArray(16);

    	        for (var i = 0; i < plaintext.length; i += 16) {
    	            copyArray(plaintext, block, 0, i, i + 16);

    	            for (var j = 0; j < 16; j++) {
    	                block[j] ^= this._lastCipherblock[j];
    	            }

    	            this._lastCipherblock = this._aes.encrypt(block);
    	            copyArray(this._lastCipherblock, ciphertext, i);
    	        }

    	        return ciphertext;
    	    };

    	    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
    	        ciphertext = coerceArray(ciphertext);

    	        if ((ciphertext.length % 16) !== 0) {
    	            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
    	        }

    	        var plaintext = createArray(ciphertext.length);
    	        var block = createArray(16);

    	        for (var i = 0; i < ciphertext.length; i += 16) {
    	            copyArray(ciphertext, block, 0, i, i + 16);
    	            block = this._aes.decrypt(block);

    	            for (var j = 0; j < 16; j++) {
    	                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
    	            }

    	            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
    	        }

    	        return plaintext;
    	    };


    	    /**
    	     *  Mode Of Operation - Cipher Feedback (CFB)
    	     */
    	    var ModeOfOperationCFB = function(key, iv, segmentSize) {
    	        if (!(this instanceof ModeOfOperationCFB)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        this.description = "Cipher Feedback";
    	        this.name = "cfb";

    	        if (!iv) {
    	            iv = createArray(16);

    	        } else if (iv.length != 16) {
    	            throw new Error('invalid initialation vector size (must be 16 size)');
    	        }

    	        if (!segmentSize) { segmentSize = 1; }

    	        this.segmentSize = segmentSize;

    	        this._shiftRegister = coerceArray(iv, true);

    	        this._aes = new AES(key);
    	    };

    	    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
    	        if ((plaintext.length % this.segmentSize) != 0) {
    	            throw new Error('invalid plaintext size (must be segmentSize bytes)');
    	        }

    	        var encrypted = coerceArray(plaintext, true);

    	        var xorSegment;
    	        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
    	            xorSegment = this._aes.encrypt(this._shiftRegister);
    	            for (var j = 0; j < this.segmentSize; j++) {
    	                encrypted[i + j] ^= xorSegment[j];
    	            }

    	            // Shift the register
    	            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
    	            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
    	        }

    	        return encrypted;
    	    };

    	    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
    	        if ((ciphertext.length % this.segmentSize) != 0) {
    	            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
    	        }

    	        var plaintext = coerceArray(ciphertext, true);

    	        var xorSegment;
    	        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
    	            xorSegment = this._aes.encrypt(this._shiftRegister);

    	            for (var j = 0; j < this.segmentSize; j++) {
    	                plaintext[i + j] ^= xorSegment[j];
    	            }

    	            // Shift the register
    	            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
    	            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
    	        }

    	        return plaintext;
    	    };

    	    /**
    	     *  Mode Of Operation - Output Feedback (OFB)
    	     */
    	    var ModeOfOperationOFB = function(key, iv) {
    	        if (!(this instanceof ModeOfOperationOFB)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        this.description = "Output Feedback";
    	        this.name = "ofb";

    	        if (!iv) {
    	            iv = createArray(16);

    	        } else if (iv.length != 16) {
    	            throw new Error('invalid initialation vector size (must be 16 bytes)');
    	        }

    	        this._lastPrecipher = coerceArray(iv, true);
    	        this._lastPrecipherIndex = 16;

    	        this._aes = new AES(key);
    	    };

    	    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
    	        var encrypted = coerceArray(plaintext, true);

    	        for (var i = 0; i < encrypted.length; i++) {
    	            if (this._lastPrecipherIndex === 16) {
    	                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
    	                this._lastPrecipherIndex = 0;
    	            }
    	            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
    	        }

    	        return encrypted;
    	    };

    	    // Decryption is symetric
    	    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    	    /**
    	     *  Counter object for CTR common mode of operation
    	     */
    	    var Counter = function(initialValue) {
    	        if (!(this instanceof Counter)) {
    	            throw Error('Counter must be instanitated with `new`');
    	        }

    	        // We allow 0, but anything false-ish uses the default 1
    	        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

    	        if (typeof(initialValue) === 'number') {
    	            this._counter = createArray(16);
    	            this.setValue(initialValue);

    	        } else {
    	            this.setBytes(initialValue);
    	        }
    	    };

    	    Counter.prototype.setValue = function(value) {
    	        if (typeof(value) !== 'number' || parseInt(value) != value) {
    	            throw new Error('invalid counter value (must be an integer)');
    	        }

    	        // We cannot safely handle numbers beyond the safe range for integers
    	        if (value > Number.MAX_SAFE_INTEGER) {
    	            throw new Error('integer value out of safe range');
    	        }

    	        for (var index = 15; index >= 0; --index) {
    	            this._counter[index] = value % 256;
    	            value = parseInt(value / 256);
    	        }
    	    };

    	    Counter.prototype.setBytes = function(bytes) {
    	        bytes = coerceArray(bytes, true);

    	        if (bytes.length != 16) {
    	            throw new Error('invalid counter bytes size (must be 16 bytes)');
    	        }

    	        this._counter = bytes;
    	    };

    	    Counter.prototype.increment = function() {
    	        for (var i = 15; i >= 0; i--) {
    	            if (this._counter[i] === 255) {
    	                this._counter[i] = 0;
    	            } else {
    	                this._counter[i]++;
    	                break;
    	            }
    	        }
    	    };


    	    /**
    	     *  Mode Of Operation - Counter (CTR)
    	     */
    	    var ModeOfOperationCTR = function(key, counter) {
    	        if (!(this instanceof ModeOfOperationCTR)) {
    	            throw Error('AES must be instanitated with `new`');
    	        }

    	        this.description = "Counter";
    	        this.name = "ctr";

    	        if (!(counter instanceof Counter)) {
    	            counter = new Counter(counter);
    	        }

    	        this._counter = counter;

    	        this._remainingCounter = null;
    	        this._remainingCounterIndex = 16;

    	        this._aes = new AES(key);
    	    };

    	    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
    	        var encrypted = coerceArray(plaintext, true);

    	        for (var i = 0; i < encrypted.length; i++) {
    	            if (this._remainingCounterIndex === 16) {
    	                this._remainingCounter = this._aes.encrypt(this._counter._counter);
    	                this._remainingCounterIndex = 0;
    	                this._counter.increment();
    	            }
    	            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
    	        }

    	        return encrypted;
    	    };

    	    // Decryption is symetric
    	    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    	    ///////////////////////
    	    // Padding

    	    // See:https://tools.ietf.org/html/rfc2315
    	    function pkcs7pad(data) {
    	        data = coerceArray(data, true);
    	        var padder = 16 - (data.length % 16);
    	        var result = createArray(data.length + padder);
    	        copyArray(data, result);
    	        for (var i = data.length; i < result.length; i++) {
    	            result[i] = padder;
    	        }
    	        return result;
    	    }

    	    function pkcs7strip(data) {
    	        data = coerceArray(data, true);
    	        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

    	        var padder = data[data.length - 1];
    	        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

    	        var length = data.length - padder;
    	        for (var i = 0; i < padder; i++) {
    	            if (data[length + i] !== padder) {
    	                throw new Error('PKCS#7 invalid padding byte');
    	            }
    	        }

    	        var result = createArray(length);
    	        copyArray(data, result, 0, 0, length);
    	        return result;
    	    }

    	    ///////////////////////
    	    // Exporting


    	    // The block cipher
    	    var aesjs = {
    	        AES: AES,
    	        Counter: Counter,

    	        ModeOfOperation: {
    	            ecb: ModeOfOperationECB,
    	            cbc: ModeOfOperationCBC,
    	            cfb: ModeOfOperationCFB,
    	            ofb: ModeOfOperationOFB,
    	            ctr: ModeOfOperationCTR
    	        },

    	        utils: {
    	            hex: convertHex,
    	            utf8: convertUtf8
    	        },

    	        padding: {
    	            pkcs7: {
    	                pad: pkcs7pad,
    	                strip: pkcs7strip
    	            }
    	        },

    	        _arrayTest: {
    	            coerceArray: coerceArray,
    	            createArray: createArray,
    	            copyArray: copyArray,
    	        }
    	    };


    	    // node.js
    	    {
    	        module.exports = aesjs;

    	    // RequireJS/AMD
    	    // http://www.requirejs.org/docs/api.html
    	    // https://github.com/amdjs/amdjs-api/wiki/AMD
    	    }


    	})(); 
    } (aesJs));

    var aesJsExports = aesJs.exports;
    var aesjs = /*@__PURE__*/getDefaultExportFromCjs(aesJsExports);

    function fetchFile(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        return [2 /*return*/, new Uint8Array(arrayBuffer)];
                }
            });
        });
    }

    var TaskType;
    (function (TaskType) {
        TaskType[TaskType["parseM3u8"] = 0] = "parseM3u8";
        TaskType[TaskType["downloadTs"] = 1] = "downloadTs";
        TaskType[TaskType["mergeTs"] = 2] = "mergeTs";
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
    var mimeType = {
        mp4: 'video/mp4',
        ts: 'video/mp2t'
    };
    var Hls2Mp4 = /** @class */ (function () {
        function Hls2Mp4(_a, onProgress) {
            var _b = _a.maxRetry, maxRetry = _b === void 0 ? 3 : _b, _c = _a.tsDownloadConcurrency, tsDownloadConcurrency = _c === void 0 ? 10 : _c, _d = _a.outputType, outputType = _d === void 0 ? 'mp4' : _d;
            this.loadRetryTime = 0;
            this.totalSegments = 0;
            this.duration = 0;
            this.savedSegments = new Map();
            this.maxRetry = maxRetry;
            this.tsDownloadConcurrency = tsDownloadConcurrency;
            this.outputType = outputType;
            this.onProgress = onProgress;
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
        Hls2Mp4.prototype.hexToUint8Array = function (hex) {
            var matchedChars = hex.replace(/^0x/, '').match(/[\da-f]{2}/gi);
            if (matchedChars) {
                return new Uint8Array(matchedChars.map(function (hx) { return parseInt(hx, 16); }));
            }
            return new Uint8Array(0);
        };
        Hls2Mp4.prototype.aesDecrypt = function (buffer, keyBuffer, iv) {
            var ivData;
            if (iv) {
                ivData = iv.startsWith('0x') ? this.hexToUint8Array(iv) : aesjs.utils.utf8.toBytes(iv);
            }
            var aesCbc = new aesjs.ModeOfOperation.cbc(keyBuffer, ivData);
            return aesCbc.decrypt(buffer);
        };
        Hls2Mp4.parseM3u8File = function (url, customFetch) {
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
                        case 2: return [4 /*yield*/, fetchFile(url).then(function (data) { return aesjs.utils.utf8.fromBytes(data); })];
                        case 3:
                            playList = _a.sent();
                            _a.label = 4;
                        case 4:
                            matchedM3u8 = playList.match(createFileUrlRegExp('m3u8', 'i'));
                            if (matchedM3u8) {
                                parsedUrl = parseUrl(url, matchedM3u8[0]);
                                return [2 /*return*/, this.parseM3u8File(parsedUrl, customFetch)];
                            }
                            return [2 /*return*/, {
                                    url: url,
                                    content: playList
                                }];
                    }
                });
            });
        };
        Hls2Mp4.prototype.parseM3u8 = function (url) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var _c, done, data;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.parseM3u8, 0);
                            return [4 /*yield*/, this.loopLoadFile(function () { return Hls2Mp4.parseM3u8File(url); })];
                        case 1:
                            _c = _d.sent(), done = _c.done, data = _c.data;
                            if (done) {
                                (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.parseM3u8, 1);
                                return [2 /*return*/, data];
                            }
                            throw new Error('m3u8 load failed');
                    }
                });
            });
        };
        Hls2Mp4.prototype.downloadFile = function (url) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var _b, done, data, fileName;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.loopLoadFile(function () { return fetchFile(url); })];
                        case 1:
                            _b = _c.sent(), done = _b.done, data = _b.data;
                            if (done) {
                                return [2 /*return*/, data];
                            }
                            fileName = (_a = url.match(/\w+\.\w{2,3}$/i)) === null || _a === void 0 ? void 0 : _a[0];
                            throw new Error("load file ".concat(fileName, " error after retry ").concat(this.maxRetry, " times."));
                    }
                });
            });
        };
        Hls2Mp4.prototype.downloadSegments = function (segs, key, iv) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.all(segs.map(function (_a) {
                            var index = _a.index, url = _a.url;
                            return __awaiter(_this, void 0, void 0, function () {
                                var tsData, buffer;
                                var _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, this.downloadFile(url)];
                                        case 1:
                                            tsData = _c.sent();
                                            buffer = key ? this.aesDecrypt(tsData, key, iv) : this.transformBuffer(tsData);
                                            this.savedSegments.set(index, buffer);
                                            (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.downloadTs, this.savedSegments.size / this.totalSegments);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }))];
                });
            });
        };
        Hls2Mp4.prototype.computeTotalDuration = function (content) {
            var duration = 0;
            var tags = content.match(/#EXTINF:\d+(.\d+)?/gi);
            tags === null || tags === void 0 ? void 0 : tags.forEach(function (tag) {
                var dur = tag.match(/\d+(.\d+)?/);
                if (dur) {
                    duration += Number(dur[0]);
                }
            });
            return duration;
        };
        Hls2Mp4.prototype.downloadM3u8 = function (url) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var m3u8Parsed, _d, content, parsedUrl, keyMatchRegExp, keyTagMatchRegExp, matchReg, matches, segments, i, matched, matchedKey, matchedIV, batch, treatedSegments, segments_1, segments_1_1, group, total, keyBuffer, keyUrl, _loop_1, this_1, i, e_1_1;
                var e_1, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.parseM3u8(url)];
                        case 1:
                            m3u8Parsed = _f.sent();
                            _d = m3u8Parsed, content = _d.content, parsedUrl = _d.url;
                            keyMatchRegExp = createFileUrlRegExp('key', 'gi');
                            keyTagMatchRegExp = new RegExp('#EXT-X-KEY:METHOD=(AES-128|NONE)(,URI="' + keyMatchRegExp.source + '"(,IV=\\w+)?)?', 'gi');
                            matchReg = new RegExp(keyTagMatchRegExp.source + '|' + createFileUrlRegExp('ts', 'gi').source, 'g');
                            matches = content.match(matchReg);
                            if (!matches) {
                                throw new Error('Invalid m3u8 file, no ts file found');
                            }
                            this.duration = this.computeTotalDuration(content);
                            segments = [];
                            for (i = 0; i < matches.length; i++) {
                                matched = matches[i];
                                if (matched.match(/#EXT-X-KEY/)) {
                                    matchedKey = (_a = matched.match(keyMatchRegExp)) === null || _a === void 0 ? void 0 : _a[0];
                                    matchedIV = (_c = (_b = matched.match(/IV=\w+$/)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.replace(/^IV=/, '');
                                    segments.push({
                                        key: matchedKey,
                                        iv: matchedIV,
                                        segments: []
                                    });
                                }
                                else if (i === 0) {
                                    segments.push({
                                        segments: [matched]
                                    });
                                }
                                else {
                                    segments[segments.length - 1].segments.push(matched);
                                }
                            }
                            this.totalSegments = segments.reduce(function (prev, current) { return prev + current.segments.length; }, 0);
                            batch = this.tsDownloadConcurrency;
                            treatedSegments = 0;
                            _f.label = 2;
                        case 2:
                            _f.trys.push([2, 12, 13, 14]);
                            segments_1 = __values(segments), segments_1_1 = segments_1.next();
                            _f.label = 3;
                        case 3:
                            if (!!segments_1_1.done) return [3 /*break*/, 11];
                            group = segments_1_1.value;
                            total = group.segments.length;
                            keyBuffer = void 0;
                            if (!group.key) return [3 /*break*/, 5];
                            keyUrl = parseUrl(parsedUrl, group.key);
                            return [4 /*yield*/, this.downloadFile(keyUrl)];
                        case 4:
                            keyBuffer = _f.sent();
                            _f.label = 5;
                        case 5:
                            _loop_1 = function (i) {
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0: return [4 /*yield*/, this_1.downloadSegments(group.segments.slice(i * batch, Math.min(total, (i + 1) * batch)).map(function (seg, j) {
                                                var url = parseUrl(parsedUrl, seg);
                                                return {
                                                    index: treatedSegments + i * batch + j,
                                                    url: url
                                                };
                                            }), keyBuffer, group.iv)];
                                        case 1:
                                            _g.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            i = 0;
                            _f.label = 6;
                        case 6:
                            if (!(i <= Math.floor((total / batch)))) return [3 /*break*/, 9];
                            return [5 /*yield**/, _loop_1(i)];
                        case 7:
                            _f.sent();
                            _f.label = 8;
                        case 8:
                            i++;
                            return [3 /*break*/, 6];
                        case 9:
                            treatedSegments += total;
                            _f.label = 10;
                        case 10:
                            segments_1_1 = segments_1.next();
                            return [3 /*break*/, 3];
                        case 11: return [3 /*break*/, 14];
                        case 12:
                            e_1_1 = _f.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 14];
                        case 13:
                            try {
                                if (segments_1_1 && !segments_1_1.done && (_e = segments_1.return)) _e.call(segments_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
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
                                    data: undefined
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Hls2Mp4.prototype.mergeDataArray = function (data) {
            var e_2, _a;
            var totalByteLength = data.reduce(function (prev, current) { return prev + current.byteLength; }, 0);
            var dataArray = new Uint8Array(totalByteLength);
            var byteOffset = 0;
            try {
                for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var part = data_1_1.value;
                    dataArray.set(part, byteOffset);
                    byteOffset += part.byteLength;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return dataArray;
        };
        Hls2Mp4.prototype.loopSegments = function (transformer) {
            return __awaiter(this, void 0, void 0, function () {
                var chunks, i, chunk;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            chunks = [];
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.savedSegments.size)) return [3 /*break*/, 5];
                            chunk = this.savedSegments.get(i);
                            if (!chunk) return [3 /*break*/, 4];
                            if (!transformer) return [3 /*break*/, 3];
                            return [4 /*yield*/, transformer(chunk, i)];
                        case 2:
                            chunk = _a.sent();
                            _a.label = 3;
                        case 3:
                            chunks.push(chunk);
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, chunks];
                    }
                });
            });
        };
        Hls2Mp4.prototype.transmuxerSegments = function () {
            return __awaiter(this, void 0, void 0, function () {
                var transmuxer, transmuxerFirstSegment, transmuxerSegment, chunks;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transmuxer = new Transmuxer({
                                duration: this.duration
                            });
                            transmuxerFirstSegment = function (data) {
                                return new Promise(function (resolve) {
                                    transmuxer.on('data', function (segment) {
                                        var data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                                        data.set(segment.initSegment, 0);
                                        data.set(segment.data, segment.initSegment.byteLength);
                                        resolve(data);
                                    });
                                    transmuxer.push(data);
                                    transmuxer.flush();
                                });
                            };
                            transmuxerSegment = function (buffer) {
                                return new Promise(function (resolve) {
                                    transmuxer.off('data');
                                    transmuxer.on('data', function (segment) { return resolve(segment.data); });
                                    transmuxer.push(buffer);
                                    transmuxer.flush();
                                });
                            };
                            return [4 /*yield*/, this.loopSegments(function (chunk, index) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (index === 0) {
                                            return [2 /*return*/, transmuxerFirstSegment(chunk)];
                                        }
                                        else {
                                            return [2 /*return*/, transmuxerSegment(chunk)];
                                        }
                                    });
                                }); })];
                        case 1:
                            chunks = _a.sent();
                            return [2 /*return*/, this.mergeDataArray(chunks)];
                    }
                });
            });
        };
        Hls2Mp4.prototype.download = function (url) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var data, chunks;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.downloadM3u8(url)];
                        case 1:
                            _c.sent();
                            (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, TaskType.mergeTs, 0);
                            if (!(this.outputType === 'mp4')) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.transmuxerSegments()];
                        case 2:
                            data = _c.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.loopSegments()];
                        case 4:
                            chunks = _c.sent();
                            data = this.mergeDataArray(chunks);
                            _c.label = 5;
                        case 5:
                            (_b = this.onProgress) === null || _b === void 0 ? void 0 : _b.call(this, TaskType.mergeTs, 1);
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        Hls2Mp4.prototype.saveToFile = function (buffer, filename) {
            var type = mimeType[this.outputType];
            var objectUrl = URL.createObjectURL(new Blob([buffer], { type: type }));
            var anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = filename;
            anchor.click();
            setTimeout(function () { return URL.revokeObjectURL(objectUrl); }, 100);
        };
        Hls2Mp4.version = '2.0.5';
        Hls2Mp4.TaskType = TaskType;
        return Hls2Mp4;
    }());

    return Hls2Mp4;

})();
