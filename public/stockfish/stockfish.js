function staticAlloc(e) {
    assert(!staticSealed);
    var r = STATICTOP;
    return STATICTOP = STATICTOP + e + 15 & -16, r
}

function dynamicAlloc(e) {
    assert(DYNAMICTOP_PTR);
    var r = HEAP32[DYNAMICTOP_PTR >> 2],
        t = r + e + 15 & -16;
    if (HEAP32[DYNAMICTOP_PTR >> 2] = t, t >= TOTAL_MEMORY) {
        if (!enlargeMemory()) return HEAP32[DYNAMICTOP_PTR >> 2] = r, 0
    }
    return r
}

function alignMemory(e, r) {
    return r || (r = STACK_ALIGN), e = Math.ceil(e / r) * r
}

function getNativeTypeSize(e) {
    switch (e) {
        case "i1":
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "i32":
            return 4;
        case "i64":
            return 8;
        case "float":
            return 4;
        case "double":
            return 8;
        default:
            if ("*" === e[e.length - 1]) return 4;
            if ("i" === e[0]) {
                var r = parseInt(e.substr(1));
                return assert(r % 8 == 0), r / 8
            }
            return 0
    }
}

function warnOnce(e) {
    warnOnce.shown || (warnOnce.shown = {}), warnOnce.shown[e] || (warnOnce.shown[e] = 1, Module.printErr(e))
}

function getFuncWrapper(e, r) {
    if (e) {
        assert(r), funcWrappers[r] || (funcWrappers[r] = {});
        var t = funcWrappers[r];
        return t[e] || (1 === r.length ? t[e] = function() {
            return dynCall(r, e)
        } : 2 === r.length ? t[e] = function(t) {
            return dynCall(r, e, [t])
        } : t[e] = function() {
            return dynCall(r, e, Array.prototype.slice.call(arguments))
        }), t[e]
    }
}

function dynCall(e, r, t) {
    return t && t.length ? Module["dynCall_" + e].apply(null, [r].concat(t)) : Module["dynCall_" + e].call(null, r)
}

function assert(e, r) {
    e || abort("Assertion failed: " + r)
}

function getCFunc(e) {
    var r = Module["_" + e];
    return assert(r, "Cannot call unknown function " + e + ", make sure it is exported"), r
}

function ccall(e, r, t, n, o) {
    var i = getCFunc(e),
        a = [],
        u = 0;
    if (n)
        for (var s = 0; s < n.length; s++) {
            var l = toC[t[s]];
            l ? (0 === u && (u = stackSave()), a[s] = l(n[s])) : a[s] = n[s]
        }
    var c = i.apply(null, a);
    return "string" === r && (c = Pointer_stringify(c)), 0 !== u && stackRestore(u), c
}

function setValue(e, r, t, n) {
    switch (t = t || "i8", "*" === t.charAt(t.length - 1) && (t = "i32"), t) {
        case "i1":
        case "i8":
            HEAP8[e >> 0] = r;
            break;
        case "i16":
            HEAP16[e >> 1] = r;
            break;
        case "i32":
            HEAP32[e >> 2] = r;
            break;
        case "i64":
            tempI64 = [r >>> 0, (tempDouble = r, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
            break;
        case "float":
            HEAPF32[e >> 2] = r;
            break;
        case "double":
            HEAPF64[e >> 3] = r;
            break;
        default:
            abort("invalid type for setValue: " + t)
    }
}

function allocate(e, r, t, n) {
    var o, i;
    "number" == typeof e ? (o = !0, i = e) : (o = !1, i = e.length);
    var a, u = "string" == typeof r ? r : null;
    if (a = t == ALLOC_NONE ? n : ["function" == typeof _malloc ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][void 0 === t ? ALLOC_STATIC : t](Math.max(i, u ? 1 : r.length)), o) {
        var s;
        for (n = a, assert(0 == (3 & a)), s = a + (-4 & i); n < s; n += 4) HEAP32[n >> 2] = 0;
        for (s = a + i; n < s;) HEAP8[n++ >> 0] = 0;
        return a
    }
    if ("i8" === u) return e.subarray || e.slice ? HEAPU8.set(e, a) : HEAPU8.set(new Uint8Array(e), a), a;
    for (var l, c, d, _ = 0; _ < i;) {
        var f = e[_];
        l = u || r[_], 0 !== l ? ("i64" == l && (l = "i32"), setValue(a + _, f, l), d !== l && (c = getNativeTypeSize(l), d = l), _ += c) : _++
    }
    return a
}

function Pointer_stringify(e, r) {
    if (0 === r || !e) return "";
    for (var t, n = 0, o = 0;;) {
        if (t = HEAPU8[e + o >> 0], n |= t, 0 == t && !r) break;
        if (o++, r && o == r) break
    }
    r || (r = o);
    var i = "";
    if (n < 128) {
        for (var a; r > 0;) a = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(r, 1024))), i = i ? i + a : a, e += 1024, r -= 1024;
        return i
    }
    return UTF8ToString(e)
}

function UTF8ArrayToString(e, r) {
    for (var t = r; e[t];) ++t;
    if (t - r > 16 && e.subarray && UTF8Decoder) return UTF8Decoder.decode(e.subarray(r, t));
    for (var n, o, i, a, u, s, l = "";;) {
        if (!(n = e[r++])) return l;
        if (128 & n)
            if (o = 63 & e[r++], 192 != (224 & n))
                if (i = 63 & e[r++], 224 == (240 & n) ? n = (15 & n) << 12 | o << 6 | i : (a = 63 & e[r++], 240 == (248 & n) ? n = (7 & n) << 18 | o << 12 | i << 6 | a : (u = 63 & e[r++], 248 == (252 & n) ? n = (3 & n) << 24 | o << 18 | i << 12 | a << 6 | u : (s = 63 & e[r++], n = (1 & n) << 30 | o << 24 | i << 18 | a << 12 | u << 6 | s))), n < 65536) l += String.fromCharCode(n);
                else {
                    var c = n - 65536;
                    l += String.fromCharCode(55296 | c >> 10, 56320 | 1023 & c)
                }
        else l += String.fromCharCode((31 & n) << 6 | o);
        else l += String.fromCharCode(n)
    }
}

function UTF8ToString(e) {
    return UTF8ArrayToString(HEAPU8, e)
}

function stringToUTF8Array(e, r, t, n) {
    if (!(n > 0)) return 0;
    for (var o = t, i = t + n - 1, a = 0; a < e.length; ++a) {
        var u = e.charCodeAt(a);
        if (u >= 55296 && u <= 57343 && (u = 65536 + ((1023 & u) << 10) | 1023 & e.charCodeAt(++a)), u <= 127) {
            if (t >= i) break;
            r[t++] = u
        } else if (u <= 2047) {
            if (t + 1 >= i) break;
            r[t++] = 192 | u >> 6, r[t++] = 128 | 63 & u
        } else if (u <= 65535) {
            if (t + 2 >= i) break;
            r[t++] = 224 | u >> 12, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | 63 & u
        } else if (u <= 2097151) {
            if (t + 3 >= i) break;
            r[t++] = 240 | u >> 18, r[t++] = 128 | u >> 12 & 63, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | 63 & u
        } else if (u <= 67108863) {
            if (t + 4 >= i) break;
            r[t++] = 248 | u >> 24, r[t++] = 128 | u >> 18 & 63, r[t++] = 128 | u >> 12 & 63, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | 63 & u
        } else {
            if (t + 5 >= i) break;
            r[t++] = 252 | u >> 30, r[t++] = 128 | u >> 24 & 63, r[t++] = 128 | u >> 18 & 63, r[t++] = 128 | u >> 12 & 63, r[t++] = 128 | u >> 6 & 63, r[t++] = 128 | 63 & u
        }
    }
    return r[t] = 0, t - o
}

function stringToUTF8(e, r, t) {
    return stringToUTF8Array(e, HEAPU8, r, t)
}

function lengthBytesUTF8(e) {
    for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++t)), n <= 127 ? ++r : r += n <= 2047 ? 2 : n <= 65535 ? 3 : n <= 2097151 ? 4 : n <= 67108863 ? 5 : 6
    }
    return r
}

function allocateUTF8(e) {
    var r = lengthBytesUTF8(e) + 1,
        t = _malloc(r);
    return t && stringToUTF8Array(e, HEAP8, t, r), t
}

function allocateUTF8OnStack(e) {
    var r = lengthBytesUTF8(e) + 1,
        t = stackAlloc(r);
    return stringToUTF8Array(e, HEAP8, t, r), t
}

function demangle(e) {
    return e
}

function demangleAll(e) {
    var r = /__Z[\w\d_]+/g;
    return e.replace(r, function(e) {
        var r = demangle(e);
        return e === r ? e : e + " [" + r + "]"
    })
}

function jsStackTrace() {
    var e = new Error;
    if (!e.stack) {
        try {
            throw new Error(0)
        } catch (r) {
            e = r
        }
        if (!e.stack) return "(no stack trace available)"
    }
    return e.stack.toString()
}

function stackTrace() {
    var e = jsStackTrace();
    return Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()), demangleAll(e)
}

function alignUp(e, r) {
    return e % r > 0 && (e += r - e % r), e
}

function updateGlobalBuffer(e) {
    Module.buffer = buffer = e
}

function updateGlobalBufferViews() {
    Module.HEAP8 = HEAP8 = new Int8Array(buffer), Module.HEAP16 = HEAP16 = new Int16Array(buffer), Module.HEAP32 = HEAP32 = new Int32Array(buffer), Module.HEAPU8 = HEAPU8 = new Uint8Array(buffer), Module.HEAPU16 = HEAPU16 = new Uint16Array(buffer), Module.HEAPU32 = HEAPU32 = new Uint32Array(buffer), Module.HEAPF32 = HEAPF32 = new Float32Array(buffer), Module.HEAPF64 = HEAPF64 = new Float64Array(buffer)
}

function abortOnCannotGrowMemory() {
    abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
}

function enlargeMemory() {
    abortOnCannotGrowMemory()
}

function getTotalMemory() {
    return TOTAL_MEMORY
}

function callRuntimeCallbacks(e) {
    for (; e.length > 0;) {
        var r = e.shift();
        if ("function" != typeof r) {
            var t = r.func;
            "number" == typeof t ? void 0 === r.arg ? Module.dynCall_v(t) : Module.dynCall_vi(t, r.arg) : t(void 0 === r.arg ? null : r.arg)
        } else r()
    }
}

function preRun() {
    if (Module.preRun)
        for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
    callRuntimeCallbacks(__ATPRERUN__)
}

function ensureInitRuntime() {
    runtimeInitialized || (runtimeInitialized = !0, callRuntimeCallbacks(__ATINIT__))
}

function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    callRuntimeCallbacks(__ATEXIT__), runtimeExited = !0
}

function postRun() {
    if (Module.postRun)
        for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(e) {
    __ATPRERUN__.unshift(e)
}

function addOnPostRun(e) {
    __ATPOSTRUN__.unshift(e)
}

function writeArrayToMemory(e, r) {
    HEAP8.set(e, r)
}

function writeAsciiToMemory(e, r, t) {
    for (var n = 0; n < e.length; ++n) HEAP8[r++ >> 0] = e.charCodeAt(n);
    t || (HEAP8[r >> 0] = 0)
}

function getUniqueRunDependency(e) {
    return e
}

function addRunDependency(e) {
    runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
}

function removeRunDependency(e) {
    if (runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
        var r = dependenciesFulfilled;
        dependenciesFulfilled = null, r()
    }
}

function isDataURI(e) {
    return String.prototype.startsWith ? e.startsWith(dataURIPrefix) : 0 === e.indexOf(dataURIPrefix)
}

function integrateWasmJS() {
    function e(e) {
        var r = Module.buffer;
        e.byteLength < r.byteLength && Module.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
        var t = new Int8Array(r);
        new Int8Array(e).set(t), updateGlobalBuffer(e), updateGlobalBufferViews()
    }

    function r(e) {
        return e
    }

    function t() {
        try {
            if (Module.wasmBinary) return new Uint8Array(Module.wasmBinary);
            if (Module.readBinary) return Module.readBinary(a);
            throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
        } catch (e) {
            abort(e)
        }
    }

    function n() {
        return Module.wasmBinary || !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER || "function" != typeof fetch ? new Promise(function(e, r) {
            e(t())
        }) : fetch(a, {
            credentials: "same-origin"
        }).then(function(e) {
            if (!e.ok) throw "failed to load wasm binary file at '" + a + "'";
            return e.arrayBuffer()
        }).catch(function() {
            return t()
        })
    }

    function o(r, t, o) {
        function i(r, t) {
            l = r.exports, l.memory && e(l.memory), Module.asm = l, Module.usingWasm = !0, removeRunDependency("wasm-instantiate")
        }

        function u(e) {
            i(e.instance, e.module)
        }

        function c(e) {
            n().then(function(e) {
                return WebAssembly.instantiate(e, s)
            }).then(e).catch(function(e) {
                Module.printErr("failed to asynchronously prepare wasm: " + e), abort(e)
            })
        }
        if ("object" != typeof WebAssembly) return Module.printErr("no native wasm support detected"), !1;
        if (!(Module.wasmMemory instanceof WebAssembly.Memory)) return Module.printErr("no native wasm Memory in use"), !1;
        if (t.memory = Module.wasmMemory, s.global = {
                NaN: NaN,
                Infinity: 1 / 0
            }, s["global.Math"] = Math, s.env = t, addRunDependency("wasm-instantiate"), Module.instantiateWasm) try {
            return Module.instantiateWasm(s, i)
        } catch (e) {
            return Module.printErr("Module.instantiateWasm callback failed with error: " + e), !1
        }
        return Module.wasmBinary || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(a) || "function" != typeof fetch ? c(u) : WebAssembly.instantiateStreaming(fetch(a, {
            credentials: "same-origin"
        }), s).then(u).catch(function(e) {
            Module.printErr("wasm streaming compile failed: " + e), Module.printErr("falling back to ArrayBuffer instantiation"), c(u)
        }), {}
    }
    var i = "stockfish.wast",
        a = "stockfish.wasm",
        u = "stockfish.temp.asm.js";
    "function" == typeof Module.locateFile && (isDataURI(i) || (i = Module.locateFile(i)), isDataURI(a) || (a = Module.locateFile(a)), isDataURI(u) || (u = Module.locateFile(u)));
    var s = {
            global: null,
            env: null,
            asm2wasm: {
                "f64-rem": function(e, r) {
                    return e % r
                },
                debugger: function() {}
            },
            parent: Module
        },
        l = null;
    Module.asmPreload = Module.asm;
    var c = Module.reallocBuffer,
        d = function(e) {
            e = alignUp(e, Module.usingWasm ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE);
            var r = Module.buffer,
                t = r.byteLength;
            if (Module.usingWasm) try {
                return -1 !== Module.wasmMemory.grow((e - t) / 65536) ? Module.buffer = Module.wasmMemory.buffer : null
            } catch (e) {
                return null
            }
        };
    Module.reallocBuffer = function(e) {
        return "asmjs" === _ ? c(e) : d(e)
    };
    var _ = "";
    Module.asm = function(e, t, n) {
        if (t = r(t), !t.table) {
            var i = Module.wasmTableSize;
            void 0 === i && (i = 1024);
            var a = Module.wasmMaxTableSize;
            "object" == typeof WebAssembly && "function" == typeof WebAssembly.Table ? t.table = void 0 !== a ? new WebAssembly.Table({
                initial: i,
                maximum: a,
                element: "anyfunc"
            }) : new WebAssembly.Table({
                initial: i,
                element: "anyfunc"
            }) : t.table = new Array(i), Module.wasmTable = t.table
        }
        t.memoryBase || (t.memoryBase = Module.STATIC_BASE), t.tableBase || (t.tableBase = 0);
        var u;
        return u = o(e, t, n), u || abort("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods"), u
    }
}

function __ZSt18uncaught_exceptionv() {
    return !!__ZSt18uncaught_exceptionv.uncaught_exception
}

function ___atomic_fetch_add_8(e, r, t, n) {
    var o = HEAP32[e >> 2],
        i = HEAP32[e + 4 >> 2];
    return HEAP32[e >> 2] = _i64Add(o, i, r, t), HEAP32[e + 4 >> 2] = getTempRet0(), 0 | (setTempRet0(i), o)
}

function ___atomic_load_8(e, r) {
    return 0 | (setTempRet0(HEAP32[e + 4 >> 2]), HEAP32[e >> 2])
}

function ___atomic_store_8(e, r, t, n) {
    HEAP32[e >> 2] = r, HEAP32[e + 4 >> 2] = t
}

function ___lock() {}

function ___setErrNo(e) {
    return Module.___errno_location && (HEAP32[Module.___errno_location() >> 2] = e), e
}

function ___map_file(e, r) {
    return ___setErrNo(ERRNO_CODES.EPERM), -1
}

function ___syscall140(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD(),
            n = (SYSCALLS.get(), SYSCALLS.get()),
            o = SYSCALLS.get(),
            i = SYSCALLS.get(),
            a = n;
        return FS.llseek(t, a, i), HEAP32[o >> 2] = t.position, t.getdents && 0 === a && 0 === i && (t.getdents = null), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall145(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD(),
            n = SYSCALLS.get(),
            o = SYSCALLS.get();
        return SYSCALLS.doReadv(t, n, o)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall146(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD(),
            n = SYSCALLS.get(),
            o = SYSCALLS.get();
        return SYSCALLS.doWritev(t, n, o)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall221(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD();
        switch (SYSCALLS.get()) {
            case 0:
                var n = SYSCALLS.get();
                if (n < 0) return -ERRNO_CODES.EINVAL;
                var o;
                return o = FS.open(t.path, t.flags, 0, n), o.fd;
            case 1:
            case 2:
                return 0;
            case 3:
                return t.flags;
            case 4:
                var n = SYSCALLS.get();
                return t.flags |= n, 0;
            case 12:
            case 12:
                var n = SYSCALLS.get();
                return HEAP16[n + 0 >> 1] = 2, 0;
            case 13:
            case 14:
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -ERRNO_CODES.EINVAL;
            case 9:
                return ___setErrNo(ERRNO_CODES.EINVAL), -1;
            default:
                return -ERRNO_CODES.EINVAL
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall5(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStr(),
            n = SYSCALLS.get(),
            o = SYSCALLS.get();
        return FS.open(t, n, o).fd
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall54(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD(),
            n = SYSCALLS.get();
        switch (n) {
            case 21509:
            case 21505:
                return t.tty ? 0 : -ERRNO_CODES.ENOTTY;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
                return t.tty ? 0 : -ERRNO_CODES.ENOTTY;
            case 21519:
                if (!t.tty) return -ERRNO_CODES.ENOTTY;
                var o = SYSCALLS.get();
                return HEAP32[o >> 2] = 0, 0;
            case 21520:
                return t.tty ? -ERRNO_CODES.EINVAL : -ERRNO_CODES.ENOTTY;
            case 21531:
                var o = SYSCALLS.get();
                return FS.ioctl(t, n, o);
            case 21523:
                return t.tty ? 0 : -ERRNO_CODES.ENOTTY;
            default:
                abort("bad ioctl syscall " + n)
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall6(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.getStreamFromFD();
        return FS.close(t), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___syscall91(e, r) {
    SYSCALLS.varargs = r;
    try {
        var t = SYSCALLS.get(),
            n = SYSCALLS.get(),
            o = SYSCALLS.mappings[t];
        if (!o) return 0;
        if (n === o.len) {
            var i = FS.getStream(o.fd);
            SYSCALLS.doMsync(t, i, n, o.flags), FS.munmap(i), SYSCALLS.mappings[t] = null, o.allocated && _free(o.malloc)
        }
        return 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___unlock() {}

function _abort() {
    Module.abort()
}

function _emscripten_get_now() {
    abort()
}

function _emscripten_get_now_is_monotonic() {
    return ENVIRONMENT_IS_NODE || "undefined" != typeof dateNow || (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self.performance && self.performance.now
}

function _clock_gettime(e, r) {
    var t;
    if (0 === e) t = Date.now();
    else {
        if (1 !== e || !_emscripten_get_now_is_monotonic()) return ___setErrNo(ERRNO_CODES.EINVAL), -1;
        t = _emscripten_get_now()
    }
    return HEAP32[r >> 2] = t / 1e3 | 0, HEAP32[r + 4 >> 2] = t % 1e3 * 1e3 * 1e3 | 0, 0
}

function _emscripten_set_main_loop_timing(e, r) {
    function t(e) {
        e.data !== o && e.data.target !== o || (e.stopPropagation(), n.shift()())
    }
    if (Browser.mainLoop.timingMode = e, Browser.mainLoop.timingValue = r, !Browser.mainLoop.func) return 1;
    if (0 == e) Browser.mainLoop.scheduler = function() {
        var e = 0 | Math.max(0, Browser.mainLoop.tickStartTime + r - _emscripten_get_now());
        setTimeout(Browser.mainLoop.runner, e)
    }, Browser.mainLoop.method = "timeout";
    else if (1 == e) Browser.mainLoop.scheduler = function() {
        Browser.requestAnimationFrame(Browser.mainLoop.runner)
    }, Browser.mainLoop.method = "rAF";
    else if (2 == e) {
        if ("undefined" == typeof setImmediate) {
            var n = [],
                o = "setimmediate";
            addEventListener("message", t, !0), setImmediate = function(e) {
                n.push(e), ENVIRONMENT_IS_WORKER ? (void 0 === Module.setImmediates && (Module.setImmediates = []), Module.setImmediates.push(e), postMessage({
                    target: o
                })) : postMessage(o, "*")
            }
        }
        Browser.mainLoop.scheduler = function() {
            setImmediate(Browser.mainLoop.runner)
        }, Browser.mainLoop.method = "immediate"
    }
    return 0
}

function _emscripten_set_main_loop(e, r, t, n, o) {
    Module.noExitRuntime = !0, assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."), Browser.mainLoop.func = e, Browser.mainLoop.arg = n;
    var i;
    i = void 0 !== n ? function() {
        Module.dynCall_vi(e, n)
    } : function() {
        Module.dynCall_v(e)
    };
    var a = Browser.mainLoop.currentlyRunningMainloop;
    if (Browser.mainLoop.runner = function() {
            if (!ABORT) {
                if (Browser.mainLoop.queue.length > 0) {
                    var e = Date.now(),
                        r = Browser.mainLoop.queue.shift();
                    if (r.func(r.arg), Browser.mainLoop.remainingBlockers) {
                        var t = Browser.mainLoop.remainingBlockers,
                            n = t % 1 == 0 ? t - 1 : Math.floor(t);
                        r.counted ? Browser.mainLoop.remainingBlockers = n : (n += .5, Browser.mainLoop.remainingBlockers = (8 * t + n) / 9)
                    }
                    if (console.log('main loop blocker "' + r.name + '" took ' + (Date.now() - e) + " ms"), Browser.mainLoop.updateStatus(), a < Browser.mainLoop.currentlyRunningMainloop) return;
                    return void setTimeout(Browser.mainLoop.runner, 0)
                }
                if (!(a < Browser.mainLoop.currentlyRunningMainloop)) {
                    if (Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) return void Browser.mainLoop.scheduler();
                    0 == Browser.mainLoop.timingMode && (Browser.mainLoop.tickStartTime = _emscripten_get_now()), "timeout" === Browser.mainLoop.method && Module.ctx && (Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"), Browser.mainLoop.method = ""), Browser.mainLoop.runIter(i), a < Browser.mainLoop.currentlyRunningMainloop || ("object" == typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler())
                }
            }
        }, o || (r && r > 0 ? _emscripten_set_main_loop_timing(0, 1e3 / r) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler()), t) throw "SimulateInfiniteLoop"
}

function _emscripten_async_call(e, r, t) {
    function n() {
        getFuncWrapper(e, "vi")(r)
    }
    Module.noExitRuntime = !0, t >= 0 ? Browser.safeSetTimeout(n, t) : Browser.safeRequestAnimationFrame(n)
}

function __exit(e) {
    Module.exit(e)
}

function _exit(e) {
    __exit(e)
}

function ___buildEnvironment(e) {
    var r, t;
    ___buildEnvironment.called ? (t = HEAP32[_environ >> 2], r = HEAP32[t >> 2]) : (___buildEnvironment.called = !0, ENV.USER = ENV.LOGNAME = "web_user", ENV.PATH = "/", ENV.PWD = "/", ENV.HOME = "/home/web_user", ENV.LANG = "C.UTF-8", ENV._ = Module.thisProgram, r = staticAlloc(1024), t = staticAlloc(256), HEAP32[t >> 2] = r, HEAP32[_environ >> 2] = t);
    var n = [],
        o = 0;
    for (var i in e)
        if ("string" == typeof e[i]) {
            var a = i + "=" + e[i];
            n.push(a), o += a.length
        } if (o > 1024) throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");
    for (var u = 0; u < n.length; u++) {
        var a = n[u];
        writeAsciiToMemory(a, r), HEAP32[t + 4 * u >> 2] = r, r += a.length + 1
    }
    HEAP32[t + 4 * n.length >> 2] = 0
}

function _getenv(e) {
    return 0 === e ? 0 : (e = Pointer_stringify(e), ENV.hasOwnProperty(e) ? (_getenv.ret && _free(_getenv.ret), _getenv.ret = allocateUTF8(ENV[e]), _getenv.ret) : 0)
}

function _emscripten_memcpy_big(e, r, t) {
    return HEAPU8.set(HEAPU8.subarray(r, r + t), e), e
}

function _pthread_attr_init(e) {
    return 0
}

function _pthread_attr_setstacksize() {}

function _pthread_cond_destroy() {
    return 0
}

function _pthread_cond_signal() {
    return 0
}

function _pthread_cond_wait() {
    return 0
}

function _pthread_create() {
    return 11
}

function _pthread_join() {}

function _pthread_mutex_destroy() {}

function __isLeapYear(e) {
    return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0)
}

function __arraySum(e, r) {
    for (var t = 0, n = 0; n <= r; t += e[n++]);
    return t
}

function __addDays(e, r) {
    for (var t = new Date(e.getTime()); r > 0;) {
        var n = __isLeapYear(t.getFullYear()),
            o = t.getMonth(),
            i = (n ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[o];
        if (!(r > i - t.getDate())) return t.setDate(t.getDate() + r), t;
        r -= i - t.getDate() + 1, t.setDate(1), o < 11 ? t.setMonth(o + 1) : (t.setMonth(0), t.setFullYear(t.getFullYear() + 1))
    }
    return t
}

function _strftime(e, r, t, n) {
    function o(e, r, t) {
        for (var n = "number" == typeof e ? e.toString() : e || ""; n.length < r;) n = t[0] + n;
        return n
    }

    function i(e, r) {
        return o(e, r, "0")
    }

    function a(e, r) {
        function t(e) {
            return e < 0 ? -1 : e > 0 ? 1 : 0
        }
        var n;
        return 0 === (n = t(e.getFullYear() - r.getFullYear())) && 0 === (n = t(e.getMonth() - r.getMonth())) && (n = t(e.getDate() - r.getDate())), n
    }

    function u(e) {
        switch (e.getDay()) {
            case 0:
                return new Date(e.getFullYear() - 1, 11, 29);
            case 1:
                return e;
            case 2:
                return new Date(e.getFullYear(), 0, 3);
            case 3:
                return new Date(e.getFullYear(), 0, 2);
            case 4:
                return new Date(e.getFullYear(), 0, 1);
            case 5:
                return new Date(e.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(e.getFullYear() - 1, 11, 30)
        }
    }

    function s(e) {
        var r = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
            t = new Date(r.getFullYear(), 0, 4),
            n = new Date(r.getFullYear() + 1, 0, 4),
            o = u(t),
            i = u(n);
        return a(o, r) <= 0 ? a(i, r) <= 0 ? r.getFullYear() + 1 : r.getFullYear() : r.getFullYear() - 1
    }
    var l = HEAP32[n + 40 >> 2],
        c = {
            tm_sec: HEAP32[n >> 2],
            tm_min: HEAP32[n + 4 >> 2],
            tm_hour: HEAP32[n + 8 >> 2],
            tm_mday: HEAP32[n + 12 >> 2],
            tm_mon: HEAP32[n + 16 >> 2],
            tm_year: HEAP32[n + 20 >> 2],
            tm_wday: HEAP32[n + 24 >> 2],
            tm_yday: HEAP32[n + 28 >> 2],
            tm_isdst: HEAP32[n + 32 >> 2],
            tm_gmtoff: HEAP32[n + 36 >> 2],
            tm_zone: l ? Pointer_stringify(l) : ""
        },
        d = Pointer_stringify(t),
        _ = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S"
        };
    for (var f in _) d = d.replace(new RegExp(f, "g"), _[f]);
    var E = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        p = {
            "%a": function(e) {
                return E[e.tm_wday].substring(0, 3)
            },
            "%A": function(e) {
                return E[e.tm_wday]
            },
            "%b": function(e) {
                return m[e.tm_mon].substring(0, 3)
            },
            "%B": function(e) {
                return m[e.tm_mon]
            },
            "%C": function(e) {
                return i((e.tm_year + 1900) / 100 | 0, 2)
            },
            "%d": function(e) {
                return i(e.tm_mday, 2)
            },
            "%e": function(e) {
                return o(e.tm_mday, 2, " ")
            },
            "%g": function(e) {
                return s(e).toString().substring(2)
            },
            "%G": function(e) {
                return s(e)
            },
            "%H": function(e) {
                return i(e.tm_hour, 2)
            },
            "%I": function(e) {
                var r = e.tm_hour;
                return 0 == r ? r = 12 : r > 12 && (r -= 12), i(r, 2)
            },
            "%j": function(e) {
                return i(e.tm_mday + __arraySum(__isLeapYear(e.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.tm_mon - 1), 3)
            },
            "%m": function(e) {
                return i(e.tm_mon + 1, 2)
            },
            "%M": function(e) {
                return i(e.tm_min, 2)
            },
            "%n": function() {
                return "\n"
            },
            "%p": function(e) {
                return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM"
            },
            "%S": function(e) {
                return i(e.tm_sec, 2)
            },
            "%t": function() {
                return "\t"
            },
            "%u": function(e) {
                return new Date(e.tm_year + 1900, e.tm_mon + 1, e.tm_mday, 0, 0, 0, 0).getDay() || 7
            },
            "%U": function(e) {
                var r = new Date(e.tm_year + 1900, 0, 1),
                    t = 0 === r.getDay() ? r : __addDays(r, 7 - r.getDay()),
                    n = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
                if (a(t, n) < 0) {
                    var o = __arraySum(__isLeapYear(n.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, n.getMonth() - 1) - 31,
                        u = 31 - t.getDate(),
                        s = u + o + n.getDate();
                    return i(Math.ceil(s / 7), 2)
                }
                return 0 === a(t, r) ? "01" : "00"
            },
            "%V": function(e) {
                var r = new Date(e.tm_year + 1900, 0, 4),
                    t = new Date(e.tm_year + 1901, 0, 4),
                    n = u(r),
                    o = u(t),
                    s = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
                if (a(s, n) < 0) return "53";
                if (a(o, s) <= 0) return "01";
                var l;
                return l = n.getFullYear() < e.tm_year + 1900 ? e.tm_yday + 32 - n.getDate() : e.tm_yday + 1 - n.getDate(), i(Math.ceil(l / 7), 2)
            },
            "%w": function(e) {
                return new Date(e.tm_year + 1900, e.tm_mon + 1, e.tm_mday, 0, 0, 0, 0).getDay()
            },
            "%W": function(e) {
                var r = new Date(e.tm_year, 0, 1),
                    t = 1 === r.getDay() ? r : __addDays(r, 0 === r.getDay() ? 1 : 7 - r.getDay() + 1),
                    n = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
                if (a(t, n) < 0) {
                    var o = __arraySum(__isLeapYear(n.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, n.getMonth() - 1) - 31,
                        u = 31 - t.getDate(),
                        s = u + o + n.getDate();
                    return i(Math.ceil(s / 7), 2)
                }
                return 0 === a(t, r) ? "01" : "00"
            },
            "%y": function(e) {
                return (e.tm_year + 1900).toString().substring(2)
            },
            "%Y": function(e) {
                return e.tm_year + 1900
            },
            "%z": function(e) {
                var r = e.tm_gmtoff,
                    t = r >= 0;
                return r = Math.abs(r) / 60, r = r / 60 * 100 + r % 60, (t ? "+" : "-") + String("0000" + r).slice(-4)
            },
            "%Z": function(e) {
                return e.tm_zone
            },
            "%%": function() {
                return "%"
            }
        };
    for (var f in p) d.indexOf(f) >= 0 && (d = d.replace(new RegExp(f, "g"), p[f](c)));
    var S = intArrayFromString(d, !1);
    return S.length > r ? 0 : (writeArrayToMemory(S, e), S.length - 1)
}

function _strftime_l(e, r, t, n) {
    return _strftime(e, r, t, n)
}

function intArrayFromString(e, r, t) {
    var n = t > 0 ? t : lengthBytesUTF8(e) + 1,
        o = new Array(n),
        i = stringToUTF8Array(e, o, 0, o.length);
    return r && (o.length = i), o
}

function ExitStatus(e) {
    this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
}

function run(e) {
    function r() {
        Module.calledRun || (Module.calledRun = !0, ABORT || (ensureInitRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Module._main && shouldRunNow && Module.callMain(e), postRun()))
    }
    e = e || Module.arguments, null === preloadStartTime && (preloadStartTime = Date.now()), runDependencies > 0 || (preRun(), runDependencies > 0 || Module.calledRun || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
            Module.setStatus("")
        }, 1), r()
    }, 1)) : r()))
}

function exit(e, r) {
    r && Module.noExitRuntime && 0 === e || (Module.noExitRuntime || (ABORT = !0, EXITSTATUS = e, STACKTOP = initialStackTop, exitRuntime(), Module.onExit && Module.onExit(e)), ENVIRONMENT_IS_NODE && process.exit(e), Module.quit(e, new ExitStatus(e)))
}

function abort(e) {
    throw Module.onAbort && Module.onAbort(e), void 0 !== e ? (Module.print(e), Module.printErr(e), e = JSON.stringify(e)) : e = "", ABORT = !0, EXITSTATUS = 1, "abort(" + e + "). Build with -s ASSERTIONS=1 for more info."
}
var Module = void 0 !== Module ? Module : {};
Module = function() {
    var e = [];
    return onmessage = function(r) {
        "quit" == r.data ? close() : null !== e ? e.push(r.data) : Module.ccall("uci_command", "number", ["string"], [r.data])
    }, {
        locateFile: function(e) {
            return e + "?v=e60effbb"
        },
        print: function(e) {
            postMessage(e)
        },
        postRun: function() {
            for (var r = 0; r < e.length; r++) Module.ccall("uci_command", "number", ["string"], [e[r]]);
            e = null
        }
    }
}();
var moduleOverrides = {},
    key;
for (key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
Module.arguments = [], Module.thisProgram = "./this.program", Module.quit = function(e, r) {
    throw r
}, Module.preRun = [], Module.postRun = [];
var ENVIRONMENT_IS_WEB = !1,
    ENVIRONMENT_IS_WORKER = !1,
    ENVIRONMENT_IS_NODE = !1,
    ENVIRONMENT_IS_SHELL = !1;
if (Module.ENVIRONMENT)
    if ("WEB" === Module.ENVIRONMENT) ENVIRONMENT_IS_WEB = !0;
    else if ("WORKER" === Module.ENVIRONMENT) ENVIRONMENT_IS_WORKER = !0;
else if ("NODE" === Module.ENVIRONMENT) ENVIRONMENT_IS_NODE = !0;
else {
    if ("SHELL" !== Module.ENVIRONMENT) throw new Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.");
    ENVIRONMENT_IS_SHELL = !0
} else ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER, ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
    var nodeFS, nodePath;
    Module.read = function(e, r) {
        var t;
        return nodeFS || (nodeFS = require("fs")), nodePath || (nodePath = require("path")), e = nodePath.normalize(e), t = nodeFS.readFileSync(e), r ? t : t.toString()
    }, Module.readBinary = function(e) {
        var r = Module.read(e, !0);
        return r.buffer || (r = new Uint8Array(r)), assert(r.buffer), r
    }, process.argv.length > 1 && (Module.thisProgram = process.argv[1].replace(/\\/g, "/")), Module.arguments = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function(e) {
        if (!(e instanceof ExitStatus)) throw e
    }), process.on("unhandledRejection", function(e, r) {
        process.exit(1)
    }), Module.inspect = function() {
        return "[Emscripten Module object]"
    }
} else ENVIRONMENT_IS_SHELL ? ("undefined" != typeof read && (Module.read = function(e) {
    return read(e)
}), Module.readBinary = function(e) {
    var r;
    return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (r = read(e, "binary"), assert("object" == typeof r), r)
}, "undefined" != typeof scriptArgs ? Module.arguments = scriptArgs : "undefined" != typeof arguments && (Module.arguments = arguments), "function" == typeof quit && (Module.quit = function(e, r) {
    quit(e)
})) : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (Module.read = function(e) {
    var r = new XMLHttpRequest;
    return r.open("GET", e, !1), r.send(null), r.responseText
}, ENVIRONMENT_IS_WORKER && (Module.readBinary = function(e) {
    var r = new XMLHttpRequest;
    return r.open("GET", e, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response)
}), Module.readAsync = function(e, r, t) {
    var n = new XMLHttpRequest;
    n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function() {
        if (200 == n.status || 0 == n.status && n.response) return void r(n.response);
        t()
    }, n.onerror = t, n.send(null)
}, "undefined" != typeof arguments && (Module.arguments = arguments), Module.setWindowTitle = function(e) {
    document.title = e
});
Module.print = "undefined" != typeof console ? console.log : "undefined" != typeof print ? print : null, Module.printErr = "undefined" != typeof printErr ? printErr : "undefined" != typeof console && console.warn || Module.print, Module.print = Module.print, Module.printErr = Module.printErr;
for (key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
moduleOverrides = void 0;
var STACK_ALIGN = 16,
    functionPointers = new Array(0),
    funcWrappers = {},
    GLOBAL_BASE = 1024,
    ABORT = 0,
    EXITSTATUS = 0,
    JSfuncs = {
        stackSave: function() {
            stackSave()
        },
        stackRestore: function() {
            stackRestore()
        },
        arrayToC: function(e) {
            var r = stackAlloc(e.length);
            return writeArrayToMemory(e, r), r
        },
        stringToC: function(e) {
            var r = 0;
            if (null !== e && void 0 !== e && 0 !== e) {
                var t = 1 + (e.length << 2);
                r = stackAlloc(t), stringToUTF8(e, r, t)
            }
            return r
        }
    },
    toC = {
        string: JSfuncs.stringToC,
        array: JSfuncs.arrayToC
    },
    ALLOC_STATIC = 2,
    ALLOC_NONE = 4,
    UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
    UTF16Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
    WASM_PAGE_SIZE = 65536,
    ASMJS_PAGE_SIZE = 16777216,
    buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE, STATICTOP, staticSealed, STACK_BASE, STACKTOP, STACK_MAX, DYNAMIC_BASE, DYNAMICTOP_PTR;
STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0, staticSealed = !1;
var TOTAL_STACK = Module.TOTAL_STACK || 5242880,
    TOTAL_MEMORY = Module.TOTAL_MEMORY || 33554432;
if (TOTAL_MEMORY < TOTAL_STACK && Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"), Module.buffer ? buffer = Module.buffer : ("object" == typeof WebAssembly && "function" == typeof WebAssembly.Memory ? (Module.wasmMemory = new WebAssembly.Memory({
        initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
        maximum: TOTAL_MEMORY / WASM_PAGE_SIZE
    }), buffer = Module.wasmMemory.buffer) : buffer = new ArrayBuffer(TOTAL_MEMORY), Module.buffer = buffer), updateGlobalBufferViews(), HEAP32[0] = 1668509029, HEAP16[1] = 25459, 115 !== HEAPU8[2] || 99 !== HEAPU8[3]) throw "Runtime error: expected the system to be little-endian!";
var __ATPRERUN__ = [],
    __ATINIT__ = [],
    __ATMAIN__ = [],
    __ATEXIT__ = [],
    __ATPOSTRUN__ = [],
    runtimeInitialized = !1,
    runtimeExited = !1,
    Math_abs = Math.abs,
    Math_cos = Math.cos,
    Math_sin = Math.sin,
    Math_tan = Math.tan,
    Math_acos = Math.acos,
    Math_asin = Math.asin,
    Math_atan = Math.atan,
    Math_atan2 = Math.atan2,
    Math_exp = Math.exp,
    Math_log = Math.log,
    Math_sqrt = Math.sqrt,
    Math_ceil = Math.ceil,
    Math_floor = Math.floor,
    Math_pow = Math.pow,
    Math_imul = Math.imul,
    Math_fround = Math.fround,
    Math_round = Math.round,
    Math_min = Math.min,
    Math_max = Math.max,
    Math_clz32 = Math.clz32,
    Math_trunc = Math.trunc,
    runDependencies = 0,
    runDependencyWatcher = null,
    dependenciesFulfilled = null;
Module.preloadedImages = {}, Module.preloadedAudios = {};
var dataURIPrefix = "data:application/octet-stream;base64,";
integrateWasmJS(), STATIC_BASE = GLOBAL_BASE, STATICTOP = STATIC_BASE + 1109216, __ATINIT__.push({
    func: function() {
        __GLOBAL__I_000101()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_position_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_iostream_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ucioption_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_uci_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_tt_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_timeman_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_thread_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_search_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_psqt_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_bitbase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_pawns_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_movepick_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_movegen_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_misc_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_material_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_main_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_evaluate_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_endgame_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_bitboard_cpp()
    }
});
var STATIC_BUMP = 1109216;
Module.STATIC_BASE = STATIC_BASE, Module.STATIC_BUMP = STATIC_BUMP, STATICTOP += 16;
var ERRNO_CODES = {
        EPERM: 1,
        ENOENT: 2,
        ESRCH: 3,
        EINTR: 4,
        EIO: 5,
        ENXIO: 6,
        E2BIG: 7,
        ENOEXEC: 8,
        EBADF: 9,
        ECHILD: 10,
        EAGAIN: 11,
        EWOULDBLOCK: 11,
        ENOMEM: 12,
        EACCES: 13,
        EFAULT: 14,
        ENOTBLK: 15,
        EBUSY: 16,
        EEXIST: 17,
        EXDEV: 18,
        ENODEV: 19,
        ENOTDIR: 20,
        EISDIR: 21,
        EINVAL: 22,
        ENFILE: 23,
        EMFILE: 24,
        ENOTTY: 25,
        ETXTBSY: 26,
        EFBIG: 27,
        ENOSPC: 28,
        ESPIPE: 29,
        EROFS: 30,
        EMLINK: 31,
        EPIPE: 32,
        EDOM: 33,
        ERANGE: 34,
        ENOMSG: 42,
        EIDRM: 43,
        ECHRNG: 44,
        EL2NSYNC: 45,
        EL3HLT: 46,
        EL3RST: 47,
        ELNRNG: 48,
        EUNATCH: 49,
        ENOCSI: 50,
        EL2HLT: 51,
        EDEADLK: 35,
        ENOLCK: 37,
        EBADE: 52,
        EBADR: 53,
        EXFULL: 54,
        ENOANO: 55,
        EBADRQC: 56,
        EBADSLT: 57,
        EDEADLOCK: 35,
        EBFONT: 59,
        ENOSTR: 60,
        ENODATA: 61,
        ETIME: 62,
        ENOSR: 63,
        ENONET: 64,
        ENOPKG: 65,
        EREMOTE: 66,
        ENOLINK: 67,
        EADV: 68,
        ESRMNT: 69,
        ECOMM: 70,
        EPROTO: 71,
        EMULTIHOP: 72,
        EDOTDOT: 73,
        EBADMSG: 74,
        ENOTUNIQ: 76,
        EBADFD: 77,
        EREMCHG: 78,
        ELIBACC: 79,
        ELIBBAD: 80,
        ELIBSCN: 81,
        ELIBMAX: 82,
        ELIBEXEC: 83,
        ENOSYS: 38,
        ENOTEMPTY: 39,
        ENAMETOOLONG: 36,
        ELOOP: 40,
        EOPNOTSUPP: 95,
        EPFNOSUPPORT: 96,
        ECONNRESET: 104,
        ENOBUFS: 105,
        EAFNOSUPPORT: 97,
        EPROTOTYPE: 91,
        ENOTSOCK: 88,
        ENOPROTOOPT: 92,
        ESHUTDOWN: 108,
        ECONNREFUSED: 111,
        EADDRINUSE: 98,
        ECONNABORTED: 103,
        ENETUNREACH: 101,
        ENETDOWN: 100,
        ETIMEDOUT: 110,
        EHOSTDOWN: 112,
        EHOSTUNREACH: 113,
        EINPROGRESS: 115,
        EALREADY: 114,
        EDESTADDRREQ: 89,
        EMSGSIZE: 90,
        EPROTONOSUPPORT: 93,
        ESOCKTNOSUPPORT: 94,
        EADDRNOTAVAIL: 99,
        ENETRESET: 102,
        EISCONN: 106,
        ENOTCONN: 107,
        ETOOMANYREFS: 109,
        EUSERS: 87,
        EDQUOT: 122,
        ESTALE: 116,
        ENOTSUP: 95,
        ENOMEDIUM: 123,
        EILSEQ: 84,
        EOVERFLOW: 75,
        ECANCELED: 125,
        ENOTRECOVERABLE: 131,
        EOWNERDEAD: 130,
        ESTRPIPE: 86
    },
    ERRNO_MESSAGES = {
        0: "Success",
        1: "Not super-user",
        2: "No such file or directory",
        3: "No such process",
        4: "Interrupted system call",
        5: "I/O error",
        6: "No such device or address",
        7: "Arg list too long",
        8: "Exec format error",
        9: "Bad file number",
        10: "No children",
        11: "No more processes",
        12: "Not enough core",
        13: "Permission denied",
        14: "Bad address",
        15: "Block device required",
        16: "Mount device busy",
        17: "File exists",
        18: "Cross-device link",
        19: "No such device",
        20: "Not a directory",
        21: "Is a directory",
        22: "Invalid argument",
        23: "Too many open files in system",
        24: "Too many open files",
        25: "Not a typewriter",
        26: "Text file busy",
        27: "File too large",
        28: "No space left on device",
        29: "Illegal seek",
        30: "Read only file system",
        31: "Too many links",
        32: "Broken pipe",
        33: "Math arg out of domain of func",
        34: "Math result not representable",
        35: "File locking deadlock error",
        36: "File or path name too long",
        37: "No record locks available",
        38: "Function not implemented",
        39: "Directory not empty",
        40: "Too many symbolic links",
        42: "No message of desired type",
        43: "Identifier removed",
        44: "Channel number out of range",
        45: "Level 2 not synchronized",
        46: "Level 3 halted",
        47: "Level 3 reset",
        48: "Link number out of range",
        49: "Protocol driver not attached",
        50: "No CSI structure available",
        51: "Level 2 halted",
        52: "Invalid exchange",
        53: "Invalid request descriptor",
        54: "Exchange full",
        55: "No anode",
        56: "Invalid request code",
        57: "Invalid slot",
        59: "Bad font file fmt",
        60: "Device not a stream",
        61: "No data (for no delay io)",
        62: "Timer expired",
        63: "Out of streams resources",
        64: "Machine is not on the network",
        65: "Package not installed",
        66: "The object is remote",
        67: "The link has been severed",
        68: "Advertise error",
        69: "Srmount error",
        70: "Communication error on send",
        71: "Protocol error",
        72: "Multihop attempted",
        73: "Cross mount point (not really error)",
        74: "Trying to read unreadable message",
        75: "Value too large for defined data type",
        76: "Given log. name not unique",
        77: "f.d. invalid for this operation",
        78: "Remote address changed",
        79: "Can   access a needed shared lib",
        80: "Accessing a corrupted shared lib",
        81: ".lib section in a.out corrupted",
        82: "Attempting to link in too many libs",
        83: "Attempting to exec a shared library",
        84: "Illegal byte sequence",
        86: "Streams pipe error",
        87: "Too many users",
        88: "Socket operation on non-socket",
        89: "Destination address required",
        90: "Message too long",
        91: "Protocol wrong type for socket",
        92: "Protocol not available",
        93: "Unknown protocol",
        94: "Socket type not supported",
        95: "Not supported",
        96: "Protocol family not supported",
        97: "Address family not supported by protocol family",
        98: "Address already in use",
        99: "Address not available",
        100: "Network interface is not configured",
        101: "Network is unreachable",
        102: "Connection reset by network",
        103: "Connection aborted",
        104: "Connection reset by peer",
        105: "No buffer space available",
        106: "Socket is already connected",
        107: "Socket is not connected",
        108: "Can't send after socket shutdown",
        109: "Too many references",
        110: "Connection timed out",
        111: "Connection refused",
        112: "Host is down",
        113: "Host is unreachable",
        114: "Socket already connected",
        115: "Connection already in progress",
        116: "Stale file handle",
        122: "Quota exceeded",
        123: "No medium (in tape drive)",
        125: "Operation canceled",
        130: "Previous owner died",
        131: "State not recoverable"
    },
    PATH = {
        splitPath: function(e) {
            return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1)
        },
        normalizeArray: function(e, r) {
            for (var t = 0, n = e.length - 1; n >= 0; n--) {
                var o = e[n];
                "." === o ? e.splice(n, 1) : ".." === o ? (e.splice(n, 1), t++) : t && (e.splice(n, 1), t--)
            }
            if (r)
                for (; t; t--) e.unshift("..");
            return e
        },
        normalize: function(e) {
            var r = "/" === e.charAt(0),
                t = "/" === e.substr(-1);
            return e = PATH.normalizeArray(e.split("/").filter(function(e) {
                return !!e
            }), !r).join("/"), e || r || (e = "."), e && t && (e += "/"), (r ? "/" : "") + e
        },
        dirname: function(e) {
            var r = PATH.splitPath(e),
                t = r[0],
                n = r[1];
            return t || n ? (n && (n = n.substr(0, n.length - 1)), t + n) : "."
        },
        basename: function(e) {
            if ("/" === e) return "/";
            var r = e.lastIndexOf("/");
            return -1 === r ? e : e.substr(r + 1)
        },
        extname: function(e) {
            return PATH.splitPath(e)[3]
        },
        join: function() {
            var e = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(e.join("/"))
        },
        join2: function(e, r) {
            return PATH.normalize(e + "/" + r)
        },
        resolve: function() {
            for (var e = "", r = !1, t = arguments.length - 1; t >= -1 && !r; t--) {
                var n = t >= 0 ? arguments[t] : FS.cwd();
                if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
                if (!n) return "";
                e = n + "/" + e, r = "/" === n.charAt(0)
            }
            return e = PATH.normalizeArray(e.split("/").filter(function(e) {
                return !!e
            }), !r).join("/"), (r ? "/" : "") + e || "."
        },
        relative: function(e, r) {
            function t(e) {
                for (var r = 0; r < e.length && "" === e[r]; r++);
                for (var t = e.length - 1; t >= 0 && "" === e[t]; t--);
                return r > t ? [] : e.slice(r, t - r + 1)
            }
            e = PATH.resolve(e).substr(1), r = PATH.resolve(r).substr(1);
            for (var n = t(e.split("/")), o = t(r.split("/")), i = Math.min(n.length, o.length), a = i, u = 0; u < i; u++)
                if (n[u] !== o[u]) {
                    a = u;
                    break
                } for (var s = [], u = a; u < n.length; u++) s.push("..");
            return s = s.concat(o.slice(a)), s.join("/")
        }
    },
    TTY = {
        ttys: [],
        init: function() {},
        shutdown: function() {},
        register: function(e, r) {
            TTY.ttys[e] = {
                input: [],
                output: [],
                ops: r
            }, FS.registerDevice(e, TTY.stream_ops)
        },
        stream_ops: {
            open: function(e) {
                var r = TTY.ttys[e.node.rdev];
                if (!r) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                e.tty = r, e.seekable = !1
            },
            close: function(e) {
                e.tty.ops.flush(e.tty)
            },
            flush: function(e) {
                e.tty.ops.flush(e.tty)
            },
            read: function(e, r, t, n, o) {
                if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                for (var i = 0, a = 0; a < n; a++) {
                    var u;
                    try {
                        u = e.tty.ops.get_char(e.tty)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    if (void 0 === u && 0 === i) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                    if (null === u || void 0 === u) break;
                    i++, r[t + a] = u
                }
                return i && (e.node.timestamp = Date.now()), i
            },
            write: function(e, r, t, n, o) {
                if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                for (var i = 0; i < n; i++) try {
                    e.tty.ops.put_char(e.tty, r[t + i])
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                return n && (e.node.timestamp = Date.now()), i
            }
        },
        default_tty_ops: {
            get_char: function(e) {
                if (!e.input.length) {
                    var r = null;
                    if (ENVIRONMENT_IS_NODE) {
                        var t = new Buffer(256),
                            n = 0,
                            o = "win32" != process.platform,
                            i = process.stdin.fd;
                        if (o) {
                            var a = !1;
                            try {
                                i = fs.openSync("/dev/stdin", "r"), a = !0
                            } catch (e) {}
                        }
                        try {
                            n = fs.readSync(i, t, 0, 256, null)
                        } catch (e) {
                            if (-1 == e.toString().indexOf("EOF")) throw e;
                            n = 0
                        }
                        a && fs.closeSync(i), r = n > 0 ? t.slice(0, n).toString("utf-8") : null
                    } else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (r = window.prompt("Input: ")) && (r += "\n") : "function" == typeof readline && null !== (r = readline()) && (r += "\n");
                    if (!r) return null;
                    e.input = intArrayFromString(r, !0)
                }
                return e.input.shift()
            },
            put_char: function(e, r) {
                null === r || 10 === r ? (Module.print(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
            },
            flush: function(e) {
                e.output && e.output.length > 0 && (Module.print(UTF8ArrayToString(e.output, 0)), e.output = [])
            }
        },
        default_tty1_ops: {
            put_char: function(e, r) {
                null === r || 10 === r ? (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
            },
            flush: function(e) {
                e.output && e.output.length > 0 && (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = [])
            }
        }
    },
    MEMFS = {
        ops_table: null,
        mount: function(e) {
            return MEMFS.createNode(null, "/", 16895, 0)
        },
        createNode: function(e, r, t, n) {
            if (FS.isBlkdev(t) || FS.isFIFO(t)) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            MEMFS.ops_table || (MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            });
            var o = FS.createNode(e, r, t, n);
            return FS.isDir(o.mode) ? (o.node_ops = MEMFS.ops_table.dir.node, o.stream_ops = MEMFS.ops_table.dir.stream, o.contents = {}) : FS.isFile(o.mode) ? (o.node_ops = MEMFS.ops_table.file.node, o.stream_ops = MEMFS.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : FS.isLink(o.mode) ? (o.node_ops = MEMFS.ops_table.link.node, o.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(o.mode) && (o.node_ops = MEMFS.ops_table.chrdev.node, o.stream_ops = MEMFS.ops_table.chrdev.stream), o.timestamp = Date.now(), e && (e.contents[r] = o), o
        },
        getFileDataAsRegularArray: function(e) {
            if (e.contents && e.contents.subarray) {
                for (var r = [], t = 0; t < e.usedBytes; ++t) r.push(e.contents[t]);
                return r
            }
            return e.contents
        },
        getFileDataAsTypedArray: function(e) {
            return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array
        },
        expandFileStorage: function(e, r) {
            if (e.contents && e.contents.subarray && r > e.contents.length && (e.contents = MEMFS.getFileDataAsRegularArray(e), e.usedBytes = e.contents.length), !e.contents || e.contents.subarray) {
                var t = e.contents ? e.contents.length : 0;
                if (t >= r) return;
                r = Math.max(r, t * (t < 1048576 ? 2 : 1.125) | 0), 0 != t && (r = Math.max(r, 256));
                var n = e.contents;
                return e.contents = new Uint8Array(r), void(e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0))
            }
            for (!e.contents && r > 0 && (e.contents = []); e.contents.length < r;) e.contents.push(0)
        },
        resizeFileStorage: function(e, r) {
            if (e.usedBytes != r) {
                if (0 == r) return e.contents = null, void(e.usedBytes = 0);
                if (!e.contents || e.contents.subarray) {
                    var t = e.contents;
                    return e.contents = new Uint8Array(new ArrayBuffer(r)), t && e.contents.set(t.subarray(0, Math.min(r, e.usedBytes))), void(e.usedBytes = r)
                }
                if (e.contents || (e.contents = []), e.contents.length > r) e.contents.length = r;
                else
                    for (; e.contents.length < r;) e.contents.push(0);
                e.usedBytes = r
            }
        },
        node_ops: {
            getattr: function(e) {
                var r = {};
                return r.dev = FS.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, FS.isDir(e.mode) ? r.size = 4096 : FS.isFile(e.mode) ? r.size = e.usedBytes : FS.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.timestamp), r.mtime = new Date(e.timestamp), r.ctime = new Date(e.timestamp), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r
            },
            setattr: function(e, r) {
                void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp), void 0 !== r.size && MEMFS.resizeFileStorage(e, r.size)
            },
            lookup: function(e, r) {
                throw FS.genericErrors[ERRNO_CODES.ENOENT]
            },
            mknod: function(e, r, t, n) {
                return MEMFS.createNode(e, r, t, n)
            },
            rename: function(e, r, t) {
                if (FS.isDir(e.mode)) {
                    var n;
                    try {
                        n = FS.lookupNode(r, t)
                    } catch (e) {}
                    if (n)
                        for (var o in n.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                }
                delete e.parent.contents[e.name], e.name = t, r.contents[t] = e, e.parent = r
            },
            unlink: function(e, r) {
                delete e.contents[r]
            },
            rmdir: function(e, r) {
                var t = FS.lookupNode(e, r);
                for (var n in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                delete e.contents[r]
            },
            readdir: function(e) {
                var r = [".", ".."];
                for (var t in e.contents) e.contents.hasOwnProperty(t) && r.push(t);
                return r
            },
            symlink: function(e, r, t) {
                var n = MEMFS.createNode(e, r, 41471, 0);
                return n.link = t, n
            },
            readlink: function(e) {
                if (!FS.isLink(e.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                return e.link
            }
        },
        stream_ops: {
            read: function(e, r, t, n, o) {
                var i = e.node.contents;
                if (o >= e.node.usedBytes) return 0;
                var a = Math.min(e.node.usedBytes - o, n);
                if (assert(a >= 0), a > 8 && i.subarray) r.set(i.subarray(o, o + a), t);
                else
                    for (var u = 0; u < a; u++) r[t + u] = i[o + u];
                return a
            },
            write: function(e, r, t, n, o, i) {
                if (!n) return 0;
                var a = e.node;
                if (a.timestamp = Date.now(), r.subarray && (!a.contents || a.contents.subarray)) {
                    if (i) return a.contents = r.subarray(t, t + n), a.usedBytes = n, n;
                    if (0 === a.usedBytes && 0 === o) return a.contents = new Uint8Array(r.subarray(t, t + n)), a.usedBytes = n, n;
                    if (o + n <= a.usedBytes) return a.contents.set(r.subarray(t, t + n), o), n
                }
                if (MEMFS.expandFileStorage(a, o + n), a.contents.subarray && r.subarray) a.contents.set(r.subarray(t, t + n), o);
                else
                    for (var u = 0; u < n; u++) a.contents[o + u] = r[t + u];
                return a.usedBytes = Math.max(a.usedBytes, o + n), n
            },
            llseek: function(e, r, t) {
                var n = r;
                if (1 === t ? n += e.position : 2 === t && FS.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                return n
            },
            allocate: function(e, r, t) {
                MEMFS.expandFileStorage(e.node, r + t), e.node.usedBytes = Math.max(e.node.usedBytes, r + t)
            },
            mmap: function(e, r, t, n, o, i, a) {
                if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                var u, s, l = e.node.contents;
                if (2 & a || l.buffer !== r && l.buffer !== r.buffer) {
                    if ((o > 0 || o + n < e.node.usedBytes) && (l = l.subarray ? l.subarray(o, o + n) : Array.prototype.slice.call(l, o, o + n)), s = !0, !(u = _malloc(n))) throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
                    r.set(l, u)
                } else s = !1, u = l.byteOffset;
                return {
                    ptr: u,
                    allocated: s
                }
            },
            msync: function(e, r, t, n, o) {
                if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                if (2 & o) return 0;
                MEMFS.stream_ops.write(e, r, 0, n, t, !1);
                return 0
            }
        }
    },
    IDBFS = {
        dbs: {},
        indexedDB: function() {
            if ("undefined" != typeof indexedDB) return indexedDB;
            var e = null;
            return "object" == typeof window && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), assert(e, "IDBFS used, but indexedDB not supported"), e
        },
        DB_VERSION: 21,
        DB_STORE_NAME: "FILE_DATA",
        mount: function(e) {
            return MEMFS.mount.apply(null, arguments)
        },
        syncfs: function(e, r, t) {
            IDBFS.getLocalSet(e, function(n, o) {
                if (n) return t(n);
                IDBFS.getRemoteSet(e, function(e, n) {
                    if (e) return t(e);
                    var i = r ? n : o,
                        a = r ? o : n;
                    IDBFS.reconcile(i, a, t)
                })
            })
        },
        getDB: function(e, r) {
            var t = IDBFS.dbs[e];
            if (t) return r(null, t);
            var n;
            try {
                n = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION)
            } catch (e) {
                return r(e)
            }
            if (!n) return r("Unable to connect to IndexedDB");
            n.onupgradeneeded = function(e) {
                var r, t = e.target.result,
                    n = e.target.transaction;
                r = t.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? n.objectStore(IDBFS.DB_STORE_NAME) : t.createObjectStore(IDBFS.DB_STORE_NAME), r.indexNames.contains("timestamp") || r.createIndex("timestamp", "timestamp", {
                    unique: !1
                })
            }, n.onsuccess = function() {
                t = n.result, IDBFS.dbs[e] = t, r(null, t)
            }, n.onerror = function(e) {
                r(this.error), e.preventDefault()
            }
        },
        getLocalSet: function(e, r) {
            function t(e) {
                return "." !== e && ".." !== e
            }

            function n(e) {
                return function(r) {
                    return PATH.join2(e, r)
                }
            }
            for (var o = {}, i = FS.readdir(e.mountpoint).filter(t).map(n(e.mountpoint)); i.length;) {
                var a, u = i.pop();
                try {
                    a = FS.stat(u)
                } catch (e) {
                    return r(e)
                }
                FS.isDir(a.mode) && i.push.apply(i, FS.readdir(u).filter(t).map(n(u))), o[u] = {
                    timestamp: a.mtime
                }
            }
            return r(null, {
                type: "local",
                entries: o
            })
        },
        getRemoteSet: function(e, r) {
            var t = {};
            IDBFS.getDB(e.mountpoint, function(e, n) {
                if (e) return r(e);
                try {
                    var o = n.transaction([IDBFS.DB_STORE_NAME], "readonly");
                    o.onerror = function(e) {
                        r(this.error), e.preventDefault()
                    };
                    o.objectStore(IDBFS.DB_STORE_NAME).index("timestamp").openKeyCursor().onsuccess = function(e) {
                        var o = e.target.result;
                        if (!o) return r(null, {
                            type: "remote",
                            db: n,
                            entries: t
                        });
                        t[o.primaryKey] = {
                            timestamp: o.key
                        }, o.continue()
                    }
                } catch (e) {
                    return r(e)
                }
            })
        },
        loadLocalEntry: function(e, r) {
            var t, n;
            try {
                n = FS.lookupPath(e).node, t = FS.stat(e)
            } catch (e) {
                return r(e)
            }
            return FS.isDir(t.mode) ? r(null, {
                timestamp: t.mtime,
                mode: t.mode
            }) : FS.isFile(t.mode) ? (n.contents = MEMFS.getFileDataAsTypedArray(n), r(null, {
                timestamp: t.mtime,
                mode: t.mode,
                contents: n.contents
            })) : r(new Error("node type not supported"))
        },
        storeLocalEntry: function(e, r, t) {
            try {
                if (FS.isDir(r.mode)) FS.mkdir(e, r.mode);
                else {
                    if (!FS.isFile(r.mode)) return t(new Error("node type not supported"));
                    FS.writeFile(e, r.contents, {
                        canOwn: !0
                    })
                }
                FS.chmod(e, r.mode), FS.utime(e, r.timestamp, r.timestamp)
            } catch (e) {
                return t(e)
            }
            t(null)
        },
        removeLocalEntry: function(e, r) {
            try {
                var t = (FS.lookupPath(e), FS.stat(e));
                FS.isDir(t.mode) ? FS.rmdir(e) : FS.isFile(t.mode) && FS.unlink(e)
            } catch (e) {
                return r(e)
            }
            r(null)
        },
        loadRemoteEntry: function(e, r, t) {
            var n = e.get(r);
            n.onsuccess = function(e) {
                t(null, e.target.result)
            }, n.onerror = function(e) {
                t(this.error), e.preventDefault()
            }
        },
        storeRemoteEntry: function(e, r, t, n) {
            var o = e.put(t, r);
            o.onsuccess = function() {
                n(null)
            }, o.onerror = function(e) {
                n(this.error), e.preventDefault()
            }
        },
        removeRemoteEntry: function(e, r, t) {
            var n = e.delete(r);
            n.onsuccess = function() {
                t(null)
            }, n.onerror = function(e) {
                t(this.error), e.preventDefault()
            }
        },
        reconcile: function(e, r, t) {
            function n(e) {
                if (e) {
                    if (!n.errored) return n.errored = !0, t(e)
                } else if (++u >= o) return t(null)
            }
            var o = 0,
                i = [];
            Object.keys(e.entries).forEach(function(t) {
                var n = e.entries[t],
                    a = r.entries[t];
                (!a || n.timestamp > a.timestamp) && (i.push(t), o++)
            });
            var a = [];
            if (Object.keys(r.entries).forEach(function(t) {
                    r.entries[t];
                    e.entries[t] || (a.push(t), o++)
                }), !o) return t(null);
            var u = 0,
                s = "remote" === e.type ? e.db : r.db,
                l = s.transaction([IDBFS.DB_STORE_NAME], "readwrite"),
                c = l.objectStore(IDBFS.DB_STORE_NAME);
            l.onerror = function(e) {
                n(this.error), e.preventDefault()
            }, i.sort().forEach(function(e) {
                "local" === r.type ? IDBFS.loadRemoteEntry(c, e, function(r, t) {
                    if (r) return n(r);
                    IDBFS.storeLocalEntry(e, t, n)
                }) : IDBFS.loadLocalEntry(e, function(r, t) {
                    if (r) return n(r);
                    IDBFS.storeRemoteEntry(c, e, t, n)
                })
            }), a.sort().reverse().forEach(function(e) {
                "local" === r.type ? IDBFS.removeLocalEntry(e, n) : IDBFS.removeRemoteEntry(c, e, n)
            })
        }
    },
    NODEFS = {
        isWindows: !1,
        staticInit: function() {
            NODEFS.isWindows = !!process.platform.match(/^win/);
            var e = process.binding("constants");
            e.fs && (e = e.fs), NODEFS.flagsForNodeMap = {
                1024: e.O_APPEND,
                64: e.O_CREAT,
                128: e.O_EXCL,
                0: e.O_RDONLY,
                2: e.O_RDWR,
                4096: e.O_SYNC,
                512: e.O_TRUNC,
                1: e.O_WRONLY
            }
        },
        bufferFrom: function(e) {
            return Buffer.alloc ? Buffer.from(e) : new Buffer(e)
        },
        mount: function(e) {
            return assert(ENVIRONMENT_IS_NODE), NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0)
        },
        createNode: function(e, r, t, n) {
            if (!FS.isDir(t) && !FS.isFile(t) && !FS.isLink(t)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var o = FS.createNode(e, r, t);
            return o.node_ops = NODEFS.node_ops, o.stream_ops = NODEFS.stream_ops, o
        },
        getMode: function(e) {
            var r;
            try {
                r = fs.lstatSync(e), NODEFS.isWindows && (r.mode = r.mode | (292 & r.mode) >> 2)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            return r.mode
        },
        realPath: function(e) {
            for (var r = []; e.parent !== e;) r.push(e.name), e = e.parent;
            return r.push(e.mount.opts.root), r.reverse(), PATH.join.apply(null, r)
        },
        flagsForNode: function(e) {
            e &= -2097153, e &= -2049, e &= -32769, e &= -524289;
            var r = 0;
            for (var t in NODEFS.flagsForNodeMap) e & t && (r |= NODEFS.flagsForNodeMap[t], e ^= t);
            if (e) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            return r
        },
        node_ops: {
            getattr: function(e) {
                var r, t = NODEFS.realPath(e);
                try {
                    r = fs.lstatSync(t)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                return NODEFS.isWindows && !r.blksize && (r.blksize = 4096), NODEFS.isWindows && !r.blocks && (r.blocks = (r.size + r.blksize - 1) / r.blksize | 0), {
                    dev: r.dev,
                    ino: r.ino,
                    mode: r.mode,
                    nlink: r.nlink,
                    uid: r.uid,
                    gid: r.gid,
                    rdev: r.rdev,
                    size: r.size,
                    atime: r.atime,
                    mtime: r.mtime,
                    ctime: r.ctime,
                    blksize: r.blksize,
                    blocks: r.blocks
                }
            },
            setattr: function(e, r) {
                var t = NODEFS.realPath(e);
                try {
                    if (void 0 !== r.mode && (fs.chmodSync(t, r.mode), e.mode = r.mode), void 0 !== r.timestamp) {
                        var n = new Date(r.timestamp);
                        fs.utimesSync(t, n, n)
                    }
                    void 0 !== r.size && fs.truncateSync(t, r.size)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            lookup: function(e, r) {
                var t = PATH.join2(NODEFS.realPath(e), r),
                    n = NODEFS.getMode(t);
                return NODEFS.createNode(e, r, n)
            },
            mknod: function(e, r, t, n) {
                var o = NODEFS.createNode(e, r, t, n),
                    i = NODEFS.realPath(o);
                try {
                    FS.isDir(o.mode) ? fs.mkdirSync(i, o.mode) : fs.writeFileSync(i, "", {
                        mode: o.mode
                    })
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                return o
            },
            rename: function(e, r, t) {
                var n = NODEFS.realPath(e),
                    o = PATH.join2(NODEFS.realPath(r), t);
                try {
                    fs.renameSync(n, o)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            unlink: function(e, r) {
                var t = PATH.join2(NODEFS.realPath(e), r);
                try {
                    fs.unlinkSync(t)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            rmdir: function(e, r) {
                var t = PATH.join2(NODEFS.realPath(e), r);
                try {
                    fs.rmdirSync(t)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            readdir: function(e) {
                var r = NODEFS.realPath(e);
                try {
                    return fs.readdirSync(r)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            symlink: function(e, r, t) {
                var n = PATH.join2(NODEFS.realPath(e), r);
                try {
                    fs.symlinkSync(t, n)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            readlink: function(e) {
                var r = NODEFS.realPath(e);
                try {
                    return r = fs.readlinkSync(r), r = NODEJS_PATH.relative(NODEJS_PATH.resolve(e.mount.opts.root), r)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            }
        },
        stream_ops: {
            open: function(e) {
                var r = NODEFS.realPath(e.node);
                try {
                    FS.isFile(e.node.mode) && (e.nfd = fs.openSync(r, NODEFS.flagsForNode(e.flags)))
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            close: function(e) {
                try {
                    FS.isFile(e.node.mode) && e.nfd && fs.closeSync(e.nfd)
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            read: function(e, r, t, n, o) {
                if (0 === n) return 0;
                try {
                    return fs.readSync(e.nfd, NODEFS.bufferFrom(r.buffer), t, n, o)
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            write: function(e, r, t, n, o) {
                try {
                    return fs.writeSync(e.nfd, NODEFS.bufferFrom(r.buffer), t, n, o)
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
            },
            llseek: function(e, r, t) {
                var n = r;
                if (1 === t) n += e.position;
                else if (2 === t && FS.isFile(e.node.mode)) try {
                    var o = fs.fstatSync(e.nfd);
                    n += o.size
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                if (n < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                return n
            }
        }
    },
    WORKERFS = {
        DIR_MODE: 16895,
        FILE_MODE: 33279,
        reader: null,
        mount: function(e) {
            function r(e) {
                for (var r = e.split("/"), t = n, i = 0; i < r.length - 1; i++) {
                    var a = r.slice(0, i + 1).join("/");
                    o[a] || (o[a] = WORKERFS.createNode(t, r[i], WORKERFS.DIR_MODE, 0)), t = o[a]
                }
                return t
            }

            function t(e) {
                var r = e.split("/");
                return r[r.length - 1]
            }
            assert(ENVIRONMENT_IS_WORKER), WORKERFS.reader || (WORKERFS.reader = new FileReaderSync);
            var n = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0),
                o = {};
            return Array.prototype.forEach.call(e.opts.files || [], function(e) {
                WORKERFS.createNode(r(e.name), t(e.name), WORKERFS.FILE_MODE, 0, e, e.lastModifiedDate)
            }), (e.opts.blobs || []).forEach(function(e) {
                WORKERFS.createNode(r(e.name), t(e.name), WORKERFS.FILE_MODE, 0, e.data)
            }), (e.opts.packages || []).forEach(function(e) {
                e.metadata.files.forEach(function(n) {
                    var o = n.filename.substr(1);
                    WORKERFS.createNode(r(o), t(o), WORKERFS.FILE_MODE, 0, e.blob.slice(n.start, n.end))
                })
            }), n
        },
        createNode: function(e, r, t, n, o, i) {
            var a = FS.createNode(e, r, t);
            return a.mode = t, a.node_ops = WORKERFS.node_ops, a.stream_ops = WORKERFS.stream_ops, a.timestamp = (i || new Date).getTime(), assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE), t === WORKERFS.FILE_MODE ? (a.size = o.size, a.contents = o) : (a.size = 4096, a.contents = {}), e && (e.contents[r] = a), a
        },
        node_ops: {
            getattr: function(e) {
                return {
                    dev: 1,
                    ino: void 0,
                    mode: e.mode,
                    nlink: 1,
                    uid: 0,
                    gid: 0,
                    rdev: void 0,
                    size: e.size,
                    atime: new Date(e.timestamp),
                    mtime: new Date(e.timestamp),
                    ctime: new Date(e.timestamp),
                    blksize: 4096,
                    blocks: Math.ceil(e.size / 4096)
                }
            },
            setattr: function(e, r) {
                void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp)
            },
            lookup: function(e, r) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
            },
            mknod: function(e, r, t, n) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            },
            rename: function(e, r, t) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            },
            unlink: function(e, r) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            },
            rmdir: function(e, r) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            },
            readdir: function(e) {
                var r = [".", ".."];
                for (var t in e.contents) e.contents.hasOwnProperty(t) && r.push(t);
                return r
            },
            symlink: function(e, r, t) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            },
            readlink: function(e) {
                throw new FS.ErrnoError(ERRNO_CODES.EPERM)
            }
        },
        stream_ops: {
            read: function(e, r, t, n, o) {
                if (o >= e.node.size) return 0;
                var i = e.node.contents.slice(o, o + n),
                    a = WORKERFS.reader.readAsArrayBuffer(i);
                return r.set(new Uint8Array(a), t), i.size
            },
            write: function(e, r, t, n, o) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            },
            llseek: function(e, r, t) {
                var n = r;
                if (1 === t ? n += e.position : 2 === t && FS.isFile(e.node.mode) && (n += e.node.size), n < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                return n
            }
        }
    };
STATICTOP += 16, STATICTOP += 16, STATICTOP += 16;
var FS = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: !1,
        ignorePermissions: !0,
        trackingDelegate: {},
        tracking: {
            openFlags: {
                READ: 1,
                WRITE: 2
            }
        },
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        handleFSError: function(e) {
            if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
            return ___setErrNo(e.errno)
        },
        lookupPath: function(e, r) {
            if (e = PATH.resolve(FS.cwd(), e), r = r || {}, !e) return {
                path: "",
                node: null
            };
            var t = {
                follow_mount: !0,
                recurse_count: 0
            };
            for (var n in t) void 0 === r[n] && (r[n] = t[n]);
            if (r.recurse_count > 8) throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
            for (var o = PATH.normalizeArray(e.split("/").filter(function(e) {
                    return !!e
                }), !1), i = FS.root, a = "/", u = 0; u < o.length; u++) {
                var s = u === o.length - 1;
                if (s && r.parent) break;
                if (i = FS.lookupNode(i, o[u]), a = PATH.join2(a, o[u]), FS.isMountpoint(i) && (!s || s && r.follow_mount) && (i = i.mounted.root), !s || r.follow)
                    for (var l = 0; FS.isLink(i.mode);) {
                        var c = FS.readlink(a);
                        a = PATH.resolve(PATH.dirname(a), c);
                        var d = FS.lookupPath(a, {
                            recurse_count: r.recurse_count
                        });
                        if (i = d.node, l++ > 40) throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                    }
            }
            return {
                path: a,
                node: i
            }
        },
        getPath: function(e) {
            for (var r;;) {
                if (FS.isRoot(e)) {
                    var t = e.mount.mountpoint;
                    return r ? "/" !== t[t.length - 1] ? t + "/" + r : t + r : t
                }
                r = r ? e.name + "/" + r : e.name, e = e.parent
            }
        },
        hashName: function(e, r) {
            for (var t = 0, n = 0; n < r.length; n++) t = (t << 5) - t + r.charCodeAt(n) | 0;
            return (e + t >>> 0) % FS.nameTable.length
        },
        hashAddNode: function(e) {
            var r = FS.hashName(e.parent.id, e.name);
            e.name_next = FS.nameTable[r], FS.nameTable[r] = e
        },
        hashRemoveNode: function(e) {
            var r = FS.hashName(e.parent.id, e.name);
            if (FS.nameTable[r] === e) FS.nameTable[r] = e.name_next;
            else
                for (var t = FS.nameTable[r]; t;) {
                    if (t.name_next === e) {
                        t.name_next = e.name_next;
                        break
                    }
                    t = t.name_next
                }
        },
        lookupNode: function(e, r) {
            var t = FS.mayLookup(e);
            if (t) throw new FS.ErrnoError(t, e);
            for (var n = FS.hashName(e.id, r), o = FS.nameTable[n]; o; o = o.name_next) {
                var i = o.name;
                if (o.parent.id === e.id && i === r) return o
            }
            return FS.lookup(e, r)
        },
        createNode: function(e, r, t, n) {
            if (!FS.FSNode) {
                FS.FSNode = function(e, r, t, n) {
                    e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = r, this.mode = t, this.node_ops = {}, this.stream_ops = {}, this.rdev = n
                }, FS.FSNode.prototype = {};
                Object.defineProperties(FS.FSNode.prototype, {
                    read: {
                        get: function() {
                            return 365 == (365 & this.mode)
                        },
                        set: function(e) {
                            e ? this.mode |= 365 : this.mode &= -366
                        }
                    },
                    write: {
                        get: function() {
                            return 146 == (146 & this.mode)
                        },
                        set: function(e) {
                            e ? this.mode |= 146 : this.mode &= -147
                        }
                    },
                    isFolder: {
                        get: function() {
                            return FS.isDir(this.mode)
                        }
                    },
                    isDevice: {
                        get: function() {
                            return FS.isChrdev(this.mode)
                        }
                    }
                })
            }
            var o = new FS.FSNode(e, r, t, n);
            return FS.hashAddNode(o), o
        },
        destroyNode: function(e) {
            FS.hashRemoveNode(e)
        },
        isRoot: function(e) {
            return e === e.parent
        },
        isMountpoint: function(e) {
            return !!e.mounted
        },
        isFile: function(e) {
            return 32768 == (61440 & e)
        },
        isDir: function(e) {
            return 16384 == (61440 & e)
        },
        isLink: function(e) {
            return 40960 == (61440 & e)
        },
        isChrdev: function(e) {
            return 8192 == (61440 & e)
        },
        isBlkdev: function(e) {
            return 24576 == (61440 & e)
        },
        isFIFO: function(e) {
            return 4096 == (61440 & e)
        },
        isSocket: function(e) {
            return 49152 == (49152 & e)
        },
        flagModes: {
            r: 0,
            rs: 1052672,
            "r+": 2,
            w: 577,
            wx: 705,
            xw: 705,
            "w+": 578,
            "wx+": 706,
            "xw+": 706,
            a: 1089,
            ax: 1217,
            xa: 1217,
            "a+": 1090,
            "ax+": 1218,
            "xa+": 1218
        },
        modeStringToFlags: function(e) {
            var r = FS.flagModes[e];
            if (void 0 === r) throw new Error("Unknown file open mode: " + e);
            return r
        },
        flagsToPermissionString: function(e) {
            var r = ["r", "w", "rw"][3 & e];
            return 512 & e && (r += "w"), r
        },
        nodePermissions: function(e, r) {
            return FS.ignorePermissions ? 0 : (-1 === r.indexOf("r") || 292 & e.mode) && (-1 === r.indexOf("w") || 146 & e.mode) && (-1 === r.indexOf("x") || 73 & e.mode) ? 0 : ERRNO_CODES.EACCES
        },
        mayLookup: function(e) {
            var r = FS.nodePermissions(e, "x");
            return r || (e.node_ops.lookup ? 0 : ERRNO_CODES.EACCES)
        },
        mayCreate: function(e, r) {
            try {
                FS.lookupNode(e, r);
                return ERRNO_CODES.EEXIST
            } catch (e) {}
            return FS.nodePermissions(e, "wx")
        },
        mayDelete: function(e, r, t) {
            var n;
            try {
                n = FS.lookupNode(e, r)
            } catch (e) {
                return e.errno
            }
            var o = FS.nodePermissions(e, "wx");
            if (o) return o;
            if (t) {
                if (!FS.isDir(n.mode)) return ERRNO_CODES.ENOTDIR;
                if (FS.isRoot(n) || FS.getPath(n) === FS.cwd()) return ERRNO_CODES.EBUSY
            } else if (FS.isDir(n.mode)) return ERRNO_CODES.EISDIR;
            return 0
        },
        mayOpen: function(e, r) {
            return e ? FS.isLink(e.mode) ? ERRNO_CODES.ELOOP : FS.isDir(e.mode) && ("r" !== FS.flagsToPermissionString(r) || 512 & r) ? ERRNO_CODES.EISDIR : FS.nodePermissions(e, FS.flagsToPermissionString(r)) : ERRNO_CODES.ENOENT
        },
        MAX_OPEN_FDS: 4096,
        nextfd: function(e, r) {
            e = e || 0, r = r || FS.MAX_OPEN_FDS;
            for (var t = e; t <= r; t++)
                if (!FS.streams[t]) return t;
            throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
        },
        getStream: function(e) {
            return FS.streams[e]
        },
        createStream: function(e, r, t) {
            FS.FSStream || (FS.FSStream = function() {}, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(e) {
                        this.node = e
                    }
                },
                isRead: {
                    get: function() {
                        return 1 != (2097155 & this.flags)
                    }
                },
                isWrite: {
                    get: function() {
                        return 0 != (2097155 & this.flags)
                    }
                },
                isAppend: {
                    get: function() {
                        return 1024 & this.flags
                    }
                }
            }));
            var n = new FS.FSStream;
            for (var o in e) n[o] = e[o];
            e = n;
            var i = FS.nextfd(r, t);
            return e.fd = i, FS.streams[i] = e, e
        },
        closeStream: function(e) {
            FS.streams[e] = null
        },
        chrdev_stream_ops: {
            open: function(e) {
                var r = FS.getDevice(e.node.rdev);
                e.stream_ops = r.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
            },
            llseek: function() {
                throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
            }
        },
        major: function(e) {
            return e >> 8
        },
        minor: function(e) {
            return 255 & e
        },
        makedev: function(e, r) {
            return e << 8 | r
        },
        registerDevice: function(e, r) {
            FS.devices[e] = {
                stream_ops: r
            }
        },
        getDevice: function(e) {
            return FS.devices[e]
        },
        getMounts: function(e) {
            for (var r = [], t = [e]; t.length;) {
                var n = t.pop();
                r.push(n), t.push.apply(t, n.mounts)
            }
            return r
        },
        syncfs: function(e, r) {
            function t(e) {
                return assert(FS.syncFSRequests > 0), FS.syncFSRequests--, r(e)
            }

            function n(e) {
                if (e) {
                    if (!n.errored) return n.errored = !0, t(e)
                } else ++i >= o.length && t(null)
            }
            "function" == typeof e && (r = e, e = !1),
                ++FS.syncFSRequests > 1 && console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
            var o = FS.getMounts(FS.root.mount),
                i = 0;
            o.forEach(function(r) {
                if (!r.type.syncfs) return n(null);
                r.type.syncfs(r, e, n)
            })
        },
        mount: function(e, r, t) {
            var n, o = "/" === t,
                i = !t;
            if (o && FS.root) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
            if (!o && !i) {
                var a = FS.lookupPath(t, {
                    follow_mount: !1
                });
                if (t = a.path, n = a.node, FS.isMountpoint(n)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                if (!FS.isDir(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
            }
            var u = {
                    type: e,
                    opts: r,
                    mountpoint: t,
                    mounts: []
                },
                s = e.mount(u);
            return s.mount = u, u.root = s, o ? FS.root = s : n && (n.mounted = u, n.mount && n.mount.mounts.push(u)), s
        },
        unmount: function(e) {
            var r = FS.lookupPath(e, {
                follow_mount: !1
            });
            if (!FS.isMountpoint(r.node)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var t = r.node,
                n = t.mounted,
                o = FS.getMounts(n);
            Object.keys(FS.nameTable).forEach(function(e) {
                for (var r = FS.nameTable[e]; r;) {
                    var t = r.name_next; - 1 !== o.indexOf(r.mount) && FS.destroyNode(r), r = t
                }
            }), t.mounted = null;
            var i = t.mount.mounts.indexOf(n);
            assert(-1 !== i), t.mount.mounts.splice(i, 1)
        },
        lookup: function(e, r) {
            return e.node_ops.lookup(e, r)
        },
        mknod: function(e, r, t) {
            var n = FS.lookupPath(e, {
                    parent: !0
                }),
                o = n.node,
                i = PATH.basename(e);
            if (!i || "." === i || ".." === i) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var a = FS.mayCreate(o, i);
            if (a) throw new FS.ErrnoError(a);
            if (!o.node_ops.mknod) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            return o.node_ops.mknod(o, i, r, t)
        },
        create: function(e, r) {
            return r = void 0 !== r ? r : 438, r &= 4095, r |= 32768, FS.mknod(e, r, 0)
        },
        mkdir: function(e, r) {
            return r = void 0 !== r ? r : 511, r &= 1023, r |= 16384, FS.mknod(e, r, 0)
        },
        mkdirTree: function(e, r) {
            for (var t = e.split("/"), n = "", o = 0; o < t.length; ++o)
                if (t[o]) {
                    n += "/" + t[o];
                    try {
                        FS.mkdir(n, r)
                    } catch (e) {
                        if (e.errno != ERRNO_CODES.EEXIST) throw e
                    }
                }
        },
        mkdev: function(e, r, t) {
            return void 0 === t && (t = r, r = 438), r |= 8192, FS.mknod(e, r, t)
        },
        symlink: function(e, r) {
            if (!PATH.resolve(e)) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            var t = FS.lookupPath(r, {
                    parent: !0
                }),
                n = t.node;
            if (!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            var o = PATH.basename(r),
                i = FS.mayCreate(n, o);
            if (i) throw new FS.ErrnoError(i);
            if (!n.node_ops.symlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            return n.node_ops.symlink(n, o, e)
        },
        rename: function(e, r) {
            var t, n, o, i = PATH.dirname(e),
                a = PATH.dirname(r),
                u = PATH.basename(e),
                s = PATH.basename(r);
            try {
                t = FS.lookupPath(e, {
                    parent: !0
                }), n = t.node, t = FS.lookupPath(r, {
                    parent: !0
                }), o = t.node
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
            }
            if (!n || !o) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            if (n.mount !== o.mount) throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
            var l = FS.lookupNode(n, u),
                c = PATH.relative(e, a);
            if ("." !== c.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            if (c = PATH.relative(r, i), "." !== c.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
            var d;
            try {
                d = FS.lookupNode(o, s)
            } catch (e) {}
            if (l !== d) {
                var _ = FS.isDir(l.mode),
                    f = FS.mayDelete(n, u, _);
                if (f) throw new FS.ErrnoError(f);
                if (f = d ? FS.mayDelete(o, s, _) : FS.mayCreate(o, s)) throw new FS.ErrnoError(f);
                if (!n.node_ops.rename) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                if (FS.isMountpoint(l) || d && FS.isMountpoint(d)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                if (o !== n && (f = FS.nodePermissions(n, "w"))) throw new FS.ErrnoError(f);
                try {
                    FS.trackingDelegate.willMovePath && FS.trackingDelegate.willMovePath(e, r)
                } catch (t) {
                    console.log("FS.trackingDelegate['willMovePath']('" + e + "', '" + r + "') threw an exception: " + t.message)
                }
                FS.hashRemoveNode(l);
                try {
                    n.node_ops.rename(l, o, s)
                } catch (e) {
                    throw e
                } finally {
                    FS.hashAddNode(l)
                }
                try {
                    FS.trackingDelegate.onMovePath && FS.trackingDelegate.onMovePath(e, r)
                } catch (t) {
                    console.log("FS.trackingDelegate['onMovePath']('" + e + "', '" + r + "') threw an exception: " + t.message)
                }
            }
        },
        rmdir: function(e) {
            var r = FS.lookupPath(e, {
                    parent: !0
                }),
                t = r.node,
                n = PATH.basename(e),
                o = FS.lookupNode(t, n),
                i = FS.mayDelete(t, n, !0);
            if (i) throw new FS.ErrnoError(i);
            if (!t.node_ops.rmdir) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            if (FS.isMountpoint(o)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
            try {
                FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
            } catch (r) {
                console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + r.message)
            }
            t.node_ops.rmdir(t, n), FS.destroyNode(o);
            try {
                FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
            } catch (r) {
                console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + r.message)
            }
        },
        readdir: function(e) {
            var r = FS.lookupPath(e, {
                    follow: !0
                }),
                t = r.node;
            if (!t.node_ops.readdir) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
            return t.node_ops.readdir(t)
        },
        unlink: function(e) {
            var r = FS.lookupPath(e, {
                    parent: !0
                }),
                t = r.node,
                n = PATH.basename(e),
                o = FS.lookupNode(t, n),
                i = FS.mayDelete(t, n, !1);
            if (i) throw new FS.ErrnoError(i);
            if (!t.node_ops.unlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            if (FS.isMountpoint(o)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
            try {
                FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
            } catch (r) {
                console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + r.message)
            }
            t.node_ops.unlink(t, n), FS.destroyNode(o);
            try {
                FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
            } catch (r) {
                console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + r.message)
            }
        },
        readlink: function(e) {
            var r = FS.lookupPath(e),
                t = r.node;
            if (!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            if (!t.node_ops.readlink) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            return PATH.resolve(FS.getPath(t.parent), t.node_ops.readlink(t))
        },
        stat: function(e, r) {
            var t = FS.lookupPath(e, {
                    follow: !r
                }),
                n = t.node;
            if (!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            if (!n.node_ops.getattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            return n.node_ops.getattr(n)
        },
        lstat: function(e) {
            return FS.stat(e, !0)
        },
        chmod: function(e, r, t) {
            var n;
            if ("string" == typeof e) {
                n = FS.lookupPath(e, {
                    follow: !t
                }).node
            } else n = e;
            if (!n.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            n.node_ops.setattr(n, {
                mode: 4095 & r | -4096 & n.mode,
                timestamp: Date.now()
            })
        },
        lchmod: function(e, r) {
            FS.chmod(e, r, !0)
        },
        fchmod: function(e, r) {
            var t = FS.getStream(e);
            if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            FS.chmod(t.node, r)
        },
        chown: function(e, r, t, n) {
            var o;
            if ("string" == typeof e) {
                o = FS.lookupPath(e, {
                    follow: !n
                }).node
            } else o = e;
            if (!o.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            o.node_ops.setattr(o, {
                timestamp: Date.now()
            })
        },
        lchown: function(e, r, t) {
            FS.chown(e, r, t, !0)
        },
        fchown: function(e, r, t) {
            var n = FS.getStream(e);
            if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            FS.chown(n.node, r, t)
        },
        truncate: function(e, r) {
            if (r < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var t;
            if ("string" == typeof e) {
                t = FS.lookupPath(e, {
                    follow: !0
                }).node
            } else t = e;
            if (!t.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
            if (FS.isDir(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
            if (!FS.isFile(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var n = FS.nodePermissions(t, "w");
            if (n) throw new FS.ErrnoError(n);
            t.node_ops.setattr(t, {
                size: r,
                timestamp: Date.now()
            })
        },
        ftruncate: function(e, r) {
            var t = FS.getStream(e);
            if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            if (0 == (2097155 & t.flags)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            FS.truncate(t.node, r)
        },
        utime: function(e, r, t) {
            var n = FS.lookupPath(e, {
                    follow: !0
                }),
                o = n.node;
            o.node_ops.setattr(o, {
                timestamp: Math.max(r, t)
            })
        },
        open: function(e, r, t, n, o) {
            if ("" === e) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            r = "string" == typeof r ? FS.modeStringToFlags(r) : r, t = void 0 === t ? 438 : t, t = 64 & r ? 4095 & t | 32768 : 0;
            var i;
            if ("object" == typeof e) i = e;
            else {
                e = PATH.normalize(e);
                try {
                    i = FS.lookupPath(e, {
                        follow: !(131072 & r)
                    }).node
                } catch (e) {}
            }
            var a = !1;
            if (64 & r)
                if (i) {
                    if (128 & r) throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                } else i = FS.mknod(e, t, 0), a = !0;
            if (!i) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            if (FS.isChrdev(i.mode) && (r &= -513), 65536 & r && !FS.isDir(i.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
            if (!a) {
                var u = FS.mayOpen(i, r);
                if (u) throw new FS.ErrnoError(u)
            }
            512 & r && FS.truncate(i, 0), r &= -641;
            var s = FS.createStream({
                node: i,
                path: FS.getPath(i),
                flags: r,
                seekable: !0,
                position: 0,
                stream_ops: i.stream_ops,
                ungotten: [],
                error: !1
            }, n, o);
            s.stream_ops.open && s.stream_ops.open(s), !Module.logReadFiles || 1 & r || (FS.readFiles || (FS.readFiles = {}), e in FS.readFiles || (FS.readFiles[e] = 1, Module.printErr("read file: " + e)));
            try {
                if (FS.trackingDelegate.onOpenFile) {
                    var l = 0;
                    1 != (2097155 & r) && (l |= FS.tracking.openFlags.READ), 0 != (2097155 & r) && (l |= FS.tracking.openFlags.WRITE), FS.trackingDelegate.onOpenFile(e, l)
                }
            } catch (r) {
                console.log("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + r.message)
            }
            return s
        },
        close: function(e) {
            e.getdents && (e.getdents = null);
            try {
                e.stream_ops.close && e.stream_ops.close(e)
            } catch (e) {
                throw e
            } finally {
                FS.closeStream(e.fd)
            }
        },
        llseek: function(e, r, t) {
            if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
            return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position
        },
        read: function(e, r, t, n, o) {
            if (n < 0 || o < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
            if (!e.stream_ops.read) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            var i = void 0 !== o;
            if (i) {
                if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
            } else o = e.position;
            var a = e.stream_ops.read(e, r, t, n, o);
            return i || (e.position += a), a
        },
        write: function(e, r, t, n, o, i) {
            if (n < 0 || o < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
            if (!e.stream_ops.write) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            1024 & e.flags && FS.llseek(e, 0, 2);
            var a = void 0 !== o;
            if (a) {
                if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
            } else o = e.position;
            var u = e.stream_ops.write(e, r, t, n, o, i);
            a || (e.position += u);
            try {
                e.path && FS.trackingDelegate.onWriteToFile && FS.trackingDelegate.onWriteToFile(e.path)
            } catch (e) {
                console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
            }
            return u
        },
        allocate: function(e, r, t) {
            if (r < 0 || t <= 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
            if (!e.stream_ops.allocate) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
            e.stream_ops.allocate(e, r, t)
        },
        mmap: function(e, r, t, n, o, i, a) {
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EACCES);
            if (!e.stream_ops.mmap) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
            return e.stream_ops.mmap(e, r, t, n, o, i, a)
        },
        msync: function(e, r, t, n, o) {
            return e && e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, o) : 0
        },
        munmap: function(e) {
            return 0
        },
        ioctl: function(e, r, t) {
            if (!e.stream_ops.ioctl) throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
            return e.stream_ops.ioctl(e, r, t)
        },
        readFile: function(e, r) {
            if (r = r || {}, r.flags = r.flags || "r", r.encoding = r.encoding || "binary", "utf8" !== r.encoding && "binary" !== r.encoding) throw new Error('Invalid encoding type "' + r.encoding + '"');
            var t, n = FS.open(e, r.flags),
                o = FS.stat(e),
                i = o.size,
                a = new Uint8Array(i);
            return FS.read(n, a, 0, i, 0), "utf8" === r.encoding ? t = UTF8ArrayToString(a, 0) : "binary" === r.encoding && (t = a), FS.close(n), t
        },
        writeFile: function(e, r, t) {
            t = t || {}, t.flags = t.flags || "w";
            var n = FS.open(e, t.flags, t.mode);
            if ("string" == typeof r) {
                var o = new Uint8Array(lengthBytesUTF8(r) + 1),
                    i = stringToUTF8Array(r, o, 0, o.length);
                FS.write(n, o, 0, i, void 0, t.canOwn)
            } else {
                if (!ArrayBuffer.isView(r)) throw new Error("Unsupported data type");
                FS.write(n, r, 0, r.byteLength, void 0, t.canOwn)
            }
            FS.close(n)
        },
        cwd: function() {
            return FS.currentPath
        },
        chdir: function(e) {
            var r = FS.lookupPath(e, {
                follow: !0
            });
            if (null === r.node) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
            if (!FS.isDir(r.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
            var t = FS.nodePermissions(r.node, "x");
            if (t) throw new FS.ErrnoError(t);
            FS.currentPath = r.path
        },
        createDefaultDirectories: function() {
            FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
        },
        createDefaultDevices: function() {
            FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
                read: function() {
                    return 0
                },
                write: function(e, r, t, n, o) {
                    return n
                }
            }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var e;
            if ("undefined" != typeof crypto) {
                var r = new Uint8Array(1);
                e = function() {
                    return crypto.getRandomValues(r), r[0]
                }
            } else e = ENVIRONMENT_IS_NODE ? function() {
                return require("crypto").randomBytes(1)[0]
            } : function() {
                return 256 * Math.random() | 0
            };
            FS.createDevice("/dev", "random", e), FS.createDevice("/dev", "urandom", e), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
        },
        createSpecialDirectories: function() {
            FS.mkdir("/proc"), FS.mkdir("/proc/self"), FS.mkdir("/proc/self/fd"), FS.mount({
                mount: function() {
                    var e = FS.createNode("/proc/self", "fd", 16895, 73);
                    return e.node_ops = {
                        lookup: function(e, r) {
                            var t = +r,
                                n = FS.getStream(t);
                            if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                            var o = {
                                parent: null,
                                mount: {
                                    mountpoint: "fake"
                                },
                                node_ops: {
                                    readlink: function() {
                                        return n.path
                                    }
                                }
                            };
                            return o.parent = o, o
                        }
                    }, e
                }
            }, {}, "/proc/self/fd")
        },
        createStandardStreams: function() {
            Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin"), Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout"), Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
            var e = FS.open("/dev/stdin", "r");
            assert(0 === e.fd, "invalid handle for stdin (" + e.fd + ")");
            var r = FS.open("/dev/stdout", "w");
            assert(1 === r.fd, "invalid handle for stdout (" + r.fd + ")");
            var t = FS.open("/dev/stderr", "w");
            assert(2 === t.fd, "invalid handle for stderr (" + t.fd + ")")
        },
        ensureErrnoError: function() {
            FS.ErrnoError || (FS.ErrnoError = function(e, r) {
                this.node = r, this.setErrno = function(e) {
                    this.errno = e;
                    for (var r in ERRNO_CODES)
                        if (ERRNO_CODES[r] === e) {
                            this.code = r;
                            break
                        }
                }, this.setErrno(e), this.message = ERRNO_MESSAGES[e], this.stack && Object.defineProperty(this, "stack", {
                    value: (new Error).stack,
                    writable: !0
                })
            }, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [ERRNO_CODES.ENOENT].forEach(function(e) {
                FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
            }))
        },
        staticInit: function() {
            FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
                MEMFS: MEMFS,
                IDBFS: IDBFS,
                NODEFS: NODEFS,
                WORKERFS: WORKERFS
            }
        },
        init: function(e, r, t) {
            assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), FS.init.initialized = !0, FS.ensureErrnoError(), Module.stdin = e || Module.stdin, Module.stdout = r || Module.stdout, Module.stderr = t || Module.stderr, FS.createStandardStreams()
        },
        quit: function() {
            FS.init.initialized = !1;
            var e = Module._fflush;
            e && e(0);
            for (var r = 0; r < FS.streams.length; r++) {
                var t = FS.streams[r];
                t && FS.close(t)
            }
        },
        getMode: function(e, r) {
            var t = 0;
            return e && (t |= 365), r && (t |= 146), t
        },
        joinPath: function(e, r) {
            var t = PATH.join.apply(null, e);
            return r && "/" == t[0] && (t = t.substr(1)), t
        },
        absolutePath: function(e, r) {
            return PATH.resolve(r, e)
        },
        standardizePath: function(e) {
            return PATH.normalize(e)
        },
        findObject: function(e, r) {
            var t = FS.analyzePath(e, r);
            return t.exists ? t.object : (___setErrNo(t.error), null)
        },
        analyzePath: function(e, r) {
            try {
                var t = FS.lookupPath(e, {
                    follow: !r
                });
                e = t.path
            } catch (e) {}
            var n = {
                isRoot: !1,
                exists: !1,
                error: 0,
                name: null,
                path: null,
                object: null,
                parentExists: !1,
                parentPath: null,
                parentObject: null
            };
            try {
                var t = FS.lookupPath(e, {
                    parent: !0
                });
                n.parentExists = !0, n.parentPath = t.path, n.parentObject = t.node, n.name = PATH.basename(e), t = FS.lookupPath(e, {
                    follow: !r
                }), n.exists = !0, n.path = t.path, n.object = t.node, n.name = t.node.name, n.isRoot = "/" === t.path
            } catch (e) {
                n.error = e.errno
            }
            return n
        },
        createFolder: function(e, r, t, n) {
            var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                i = FS.getMode(t, n);
            return FS.mkdir(o, i)
        },
        createPath: function(e, r, t, n) {
            e = "string" == typeof e ? e : FS.getPath(e);
            for (var o = r.split("/").reverse(); o.length;) {
                var i = o.pop();
                if (i) {
                    var a = PATH.join2(e, i);
                    try {
                        FS.mkdir(a)
                    } catch (e) {}
                    e = a
                }
            }
            return a
        },
        createFile: function(e, r, t, n, o) {
            var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                a = FS.getMode(n, o);
            return FS.create(i, a)
        },
        createDataFile: function(e, r, t, n, o, i) {
            var a = r ? PATH.join2("string" == typeof e ? e : FS.getPath(e), r) : e,
                u = FS.getMode(n, o),
                s = FS.create(a, u);
            if (t) {
                if ("string" == typeof t) {
                    for (var l = new Array(t.length), c = 0, d = t.length; c < d; ++c) l[c] = t.charCodeAt(c);
                    t = l
                }
                FS.chmod(s, 146 | u);
                var _ = FS.open(s, "w");
                FS.write(_, t, 0, t.length, 0, i), FS.close(_), FS.chmod(s, u)
            }
            return s
        },
        createDevice: function(e, r, t, n) {
            var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                i = FS.getMode(!!t, !!n);
            FS.createDevice.major || (FS.createDevice.major = 64);
            var a = FS.makedev(FS.createDevice.major++, 0);
            return FS.registerDevice(a, {
                open: function(e) {
                    e.seekable = !1
                },
                close: function(e) {
                    n && n.buffer && n.buffer.length && n(10)
                },
                read: function(e, r, n, o, i) {
                    for (var a = 0, u = 0; u < o; u++) {
                        var s;
                        try {
                            s = t()
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        if (void 0 === s && 0 === a) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                        if (null === s || void 0 === s) break;
                        a++, r[n + u] = s
                    }
                    return a && (e.node.timestamp = Date.now()), a
                },
                write: function(e, r, t, o, i) {
                    for (var a = 0; a < o; a++) try {
                        n(r[t + a])
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    return o && (e.node.timestamp = Date.now()), a
                }
            }), FS.mkdev(o, i, a)
        },
        createLink: function(e, r, t, n, o) {
            var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r);
            return FS.symlink(t, i)
        },
        forceLoadFile: function(e) {
            if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
            var r = !0;
            if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            if (!Module.read) throw new Error("Cannot load without read() or XMLHttpRequest.");
            try {
                e.contents = intArrayFromString(Module.read(e.url), !0), e.usedBytes = e.contents.length
            } catch (e) {
                r = !1
            }
            return r || ___setErrNo(ERRNO_CODES.EIO), r
        },
        createLazyFile: function(e, r, t, n, o) {
            function i() {
                this.lengthKnown = !1, this.chunks = []
            }
            if (i.prototype.get = function(e) {
                    if (!(e > this.length - 1 || e < 0)) {
                        var r = e % this.chunkSize,
                            t = e / this.chunkSize | 0;
                        return this.getter(t)[r]
                    }
                }, i.prototype.setDataGetter = function(e) {
                    this.getter = e
                }, i.prototype.cacheLength = function() {
                    var e = new XMLHttpRequest;
                    if (e.open("HEAD", t, !1), e.send(null), !(e.status >= 200 && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + t + ". Status: " + e.status);
                    var r, n = Number(e.getResponseHeader("Content-length")),
                        o = (r = e.getResponseHeader("Accept-Ranges")) && "bytes" === r,
                        i = (r = e.getResponseHeader("Content-Encoding")) && "gzip" === r,
                        a = 1048576;
                    o || (a = n);
                    var u = function(e, r) {
                            if (e > r) throw new Error("invalid range (" + e + ", " + r + ") or no bytes requested!");
                            if (r > n - 1) throw new Error("only " + n + " bytes available! programmer error!");
                            var o = new XMLHttpRequest;
                            if (o.open("GET", t, !1), n !== a && o.setRequestHeader("Range", "bytes=" + e + "-" + r), "undefined" != typeof Uint8Array && (o.responseType = "arraybuffer"), o.overrideMimeType && o.overrideMimeType("text/plain; charset=x-user-defined"), o.send(null), !(o.status >= 200 && o.status < 300 || 304 === o.status)) throw new Error("Couldn't load " + t + ". Status: " + o.status);
                            return void 0 !== o.response ? new Uint8Array(o.response || []) : intArrayFromString(o.responseText || "", !0)
                        },
                        s = this;
                    s.setDataGetter(function(e) {
                        var r = e * a,
                            t = (e + 1) * a - 1;
                        if (t = Math.min(t, n - 1), void 0 === s.chunks[e] && (s.chunks[e] = u(r, t)), void 0 === s.chunks[e]) throw new Error("doXHR failed!");
                        return s.chunks[e]
                    }), !i && n || (a = n = 1, n = this.getter(0).length, a = n, console.log("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = n, this._chunkSize = a, this.lengthKnown = !0
                }, "undefined" != typeof XMLHttpRequest) {
                if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                var a = new i;
                Object.defineProperties(a, {
                    length: {
                        get: function() {
                            return this.lengthKnown || this.cacheLength(), this._length
                        }
                    },
                    chunkSize: {
                        get: function() {
                            return this.lengthKnown || this.cacheLength(), this._chunkSize
                        }
                    }
                });
                var u = {
                    isDevice: !1,
                    contents: a
                }
            } else var u = {
                isDevice: !1,
                url: t
            };
            var s = FS.createFile(e, r, u, n, o);
            u.contents ? s.contents = u.contents : u.url && (s.contents = null, s.url = u.url), Object.defineProperties(s, {
                usedBytes: {
                    get: function() {
                        return this.contents.length
                    }
                }
            });
            var l = {};
            return Object.keys(s.stream_ops).forEach(function(e) {
                var r = s.stream_ops[e];
                l[e] = function() {
                    if (!FS.forceLoadFile(s)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                    return r.apply(null, arguments)
                }
            }), l.read = function(e, r, t, n, o) {
                if (!FS.forceLoadFile(s)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                var i = e.node.contents;
                if (o >= i.length) return 0;
                var a = Math.min(i.length - o, n);
                if (assert(a >= 0), i.slice)
                    for (var u = 0; u < a; u++) r[t + u] = i[o + u];
                else
                    for (var u = 0; u < a; u++) r[t + u] = i.get(o + u);
                return a
            }, s.stream_ops = l, s
        },
        createPreloadedFile: function(e, r, t, n, o, i, a, u, s, l) {
            function c(t) {
                function c(t) {
                    l && l(), u || FS.createDataFile(e, r, t, n, o, s), i && i(), removeRunDependency(_)
                }
                var f = !1;
                Module.preloadPlugins.forEach(function(e) {
                    f || e.canHandle(d) && (e.handle(t, d, c, function() {
                        a && a(), removeRunDependency(_)
                    }), f = !0)
                }), f || c(t)
            }
            Browser.init();
            var d = r ? PATH.resolve(PATH.join2(e, r)) : e,
                _ = getUniqueRunDependency("cp " + d);
            addRunDependency(_), "string" == typeof t ? Browser.asyncLoad(t, function(e) {
                c(e)
            }, a) : c(t)
        },
        indexedDB: function() {
            return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        },
        DB_NAME: function() {
            return "EM_FS_" + window.location.pathname
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: function(e, r, t) {
            r = r || function() {}, t = t || function() {};
            var n = FS.indexedDB();
            try {
                var o = n.open(FS.DB_NAME(), FS.DB_VERSION)
            } catch (e) {
                return t(e)
            }
            o.onupgradeneeded = function() {
                console.log("creating db"), o.result.createObjectStore(FS.DB_STORE_NAME)
            }, o.onsuccess = function() {
                function n() {
                    0 == l ? r() : t()
                }
                var i = o.result,
                    a = i.transaction([FS.DB_STORE_NAME], "readwrite"),
                    u = a.objectStore(FS.DB_STORE_NAME),
                    s = 0,
                    l = 0,
                    c = e.length;
                e.forEach(function(e) {
                    var r = u.put(FS.analyzePath(e).object.contents, e);
                    r.onsuccess = function() {
                        ++s + l == c && n()
                    }, r.onerror = function() {
                        l++, s + l == c && n()
                    }
                }), a.onerror = t
            }, o.onerror = t
        },
        loadFilesFromDB: function(e, r, t) {
            r = r || function() {}, t = t || function() {};
            var n = FS.indexedDB();
            try {
                var o = n.open(FS.DB_NAME(), FS.DB_VERSION)
            } catch (e) {
                return t(e)
            }
            o.onupgradeneeded = t, o.onsuccess = function() {
                function n() {
                    0 == l ? r() : t()
                }
                var i = o.result;
                try {
                    var a = i.transaction([FS.DB_STORE_NAME], "readonly")
                } catch (e) {
                    return void t(e)
                }
                var u = a.objectStore(FS.DB_STORE_NAME),
                    s = 0,
                    l = 0,
                    c = e.length;
                e.forEach(function(e) {
                    var r = u.get(e);
                    r.onsuccess = function() {
                        FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), r.result, !0, !0, !0), ++s + l == c && n()
                    }, r.onerror = function() {
                        l++, s + l == c && n()
                    }
                }), a.onerror = t
            }, o.onerror = t
        }
    },
    SYSCALLS = {
        DEFAULT_POLLMASK: 5,
        mappings: {},
        umask: 511,
        calculateAt: function(e, r) {
            if ("/" !== r[0]) {
                var t;
                if (-100 === e) t = FS.cwd();
                else {
                    var n = FS.getStream(e);
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    t = n.path
                }
                r = PATH.join2(t, r)
            }
            return r
        },
        doStat: function(e, r, t) {
            try {
                var n = e(r)
            } catch (e) {
                if (e && e.node && PATH.normalize(r) !== PATH.normalize(FS.getPath(e.node))) return -ERRNO_CODES.ENOTDIR;
                throw e
            }
            return HEAP32[t >> 2] = n.dev, HEAP32[t + 4 >> 2] = 0, HEAP32[t + 8 >> 2] = n.ino, HEAP32[t + 12 >> 2] = n.mode, HEAP32[t + 16 >> 2] = n.nlink, HEAP32[t + 20 >> 2] = n.uid, HEAP32[t + 24 >> 2] = n.gid, HEAP32[t + 28 >> 2] = n.rdev, HEAP32[t + 32 >> 2] = 0, HEAP32[t + 36 >> 2] = n.size, HEAP32[t + 40 >> 2] = 4096, HEAP32[t + 44 >> 2] = n.blocks, HEAP32[t + 48 >> 2] = n.atime.getTime() / 1e3 | 0, HEAP32[t + 52 >> 2] = 0, HEAP32[t + 56 >> 2] = n.mtime.getTime() / 1e3 | 0, HEAP32[t + 60 >> 2] = 0, HEAP32[t + 64 >> 2] = n.ctime.getTime() / 1e3 | 0, HEAP32[t + 68 >> 2] = 0, HEAP32[t + 72 >> 2] = n.ino, 0
        },
        doMsync: function(e, r, t, n) {
            var o = new Uint8Array(HEAPU8.subarray(e, e + t));
            FS.msync(r, o, 0, t, n)
        },
        doMkdir: function(e, r) {
            return e = PATH.normalize(e), "/" === e[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, r, 0), 0
        },
        doMknod: function(e, r, t) {
            switch (61440 & r) {
                case 32768:
                case 8192:
                case 24576:
                case 4096:
                case 49152:
                    break;
                default:
                    return -ERRNO_CODES.EINVAL
            }
            return FS.mknod(e, r, t), 0
        },
        doReadlink: function(e, r, t) {
            if (t <= 0) return -ERRNO_CODES.EINVAL;
            var n = FS.readlink(e),
                o = Math.min(t, lengthBytesUTF8(n)),
                i = HEAP8[r + o];
            return stringToUTF8(n, r, t + 1), HEAP8[r + o] = i, o
        },
        doAccess: function(e, r) {
            if (-8 & r) return -ERRNO_CODES.EINVAL;
            var t;
            t = FS.lookupPath(e, {
                follow: !0
            }).node;
            var n = "";
            return 4 & r && (n += "r"), 2 & r && (n += "w"), 1 & r && (n += "x"), n && FS.nodePermissions(t, n) ? -ERRNO_CODES.EACCES : 0
        },
        doDup: function(e, r, t) {
            var n = FS.getStream(t);
            return n && FS.close(n), FS.open(e, r, 0, t, t).fd
        },
        doReadv: function(e, r, t, n) {
            for (var o = 0, i = 0; i < t; i++) {
                var a = HEAP32[r + 8 * i >> 2],
                    u = HEAP32[r + (8 * i + 4) >> 2],
                    s = FS.read(e, HEAP8, a, u, n);
                if (s < 0) return -1;
                if (o += s, s < u) break
            }
            return o
        },
        doWritev: function(e, r, t, n) {
            for (var o = 0, i = 0; i < t; i++) {
                var a = HEAP32[r + 8 * i >> 2],
                    u = HEAP32[r + (8 * i + 4) >> 2],
                    s = FS.write(e, HEAP8, a, u, n);
                if (s < 0) return -1;
                o += s
            }
            return o
        },
        varargs: 0,
        get: function(e) {
            return SYSCALLS.varargs += 4, HEAP32[SYSCALLS.varargs - 4 >> 2]
        },
        getStr: function() {
            return Pointer_stringify(SYSCALLS.get())
        },
        getStreamFromFD: function() {
            var e = FS.getStream(SYSCALLS.get());
            if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            return e
        },
        getSocketFromFD: function() {
            var e = SOCKFS.getSocket(SYSCALLS.get());
            if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            return e
        },
        getSocketAddress: function(e) {
            var r = SYSCALLS.get(),
                t = SYSCALLS.get();
            if (e && 0 === r) return null;
            var n = __read_sockaddr(r, t);
            if (n.errno) throw new FS.ErrnoError(n.errno);
            return n.addr = DNS.lookup_addr(n.addr) || n.addr, n
        },
        get64: function() {
            var e = SYSCALLS.get(),
                r = SYSCALLS.get();
            return assert(e >= 0 ? 0 === r : -1 === r), e
        },
        getZero: function() {
            assert(0 === SYSCALLS.get())
        }
    },
    Browser = {
        mainLoop: {
            scheduler: null,
            method: "",
            currentlyRunningMainloop: 0,
            func: null,
            arg: 0,
            timingMode: 0,
            timingValue: 0,
            currentFrameNumber: 0,
            queue: [],
            pause: function() {
                Browser.mainLoop.scheduler = null, Browser.mainLoop.currentlyRunningMainloop++
            },
            resume: function() {
                Browser.mainLoop.currentlyRunningMainloop++;
                var e = Browser.mainLoop.timingMode,
                    r = Browser.mainLoop.timingValue,
                    t = Browser.mainLoop.func;
                Browser.mainLoop.func = null, _emscripten_set_main_loop(t, 0, !1, Browser.mainLoop.arg, !0), _emscripten_set_main_loop_timing(e, r), Browser.mainLoop.scheduler()
            },
            updateStatus: function() {
                if (Module.setStatus) {
                    var e = Module.statusMessage || "Please wait...",
                        r = Browser.mainLoop.remainingBlockers,
                        t = Browser.mainLoop.expectedBlockers;
                    r ? r < t ? Module.setStatus(e + " (" + (t - r) + "/" + t + ")") : Module.setStatus(e) : Module.setStatus("")
                }
            },
            runIter: function(e) {
                if (!ABORT) {
                    if (Module.preMainLoop) {
                        if (!1 === Module.preMainLoop()) return
                    }
                    try {
                        e()
                    } catch (e) {
                        if (e instanceof ExitStatus) return;
                        throw e && "object" == typeof e && e.stack && Module.printErr("exception thrown: " + [e, e.stack]), e
                    }
                    Module.postMainLoop && Module.postMainLoop()
                }
            }
        },
        isFullscreen: !1,
        pointerLock: !1,
        moduleContextCreatedCallbacks: [],
        workers: [],
        init: function() {
            function e() {
                Browser.pointerLock = document.pointerLockElement === Module.canvas || document.mozPointerLockElement === Module.canvas || document.webkitPointerLockElement === Module.canvas || document.msPointerLockElement === Module.canvas
            }
            if (Module.preloadPlugins || (Module.preloadPlugins = []), !Browser.initted) {
                Browser.initted = !0;
                try {
                    new Blob, Browser.hasBlobConstructor = !0
                } catch (e) {
                    Browser.hasBlobConstructor = !1, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                }
                Browser.BlobBuilder = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Browser.hasBlobConstructor ? null : console.log("warning: no BlobBuilder"), Browser.URLObject = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : void 0, Module.noImageDecoding || void 0 !== Browser.URLObject || (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), Module.noImageDecoding = !0);
                var r = {};
                r.canHandle = function(e) {
                    return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
                }, r.handle = function(e, r, t, n) {
                    var o = null;
                    if (Browser.hasBlobConstructor) try {
                        o = new Blob([e], {
                            type: Browser.getMimetype(r)
                        }), o.size !== e.length && (o = new Blob([new Uint8Array(e).buffer], {
                            type: Browser.getMimetype(r)
                        }))
                    } catch (e) {
                        warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                    }
                    if (!o) {
                        var i = new Browser.BlobBuilder;
                        i.append(new Uint8Array(e).buffer), o = i.getBlob()
                    }
                    var a = Browser.URLObject.createObjectURL(o),
                        u = new Image;
                    u.onload = function() {
                        assert(u.complete, "Image " + r + " could not be decoded");
                        var n = document.createElement("canvas");
                        n.width = u.width, n.height = u.height, n.getContext("2d").drawImage(u, 0, 0), Module.preloadedImages[r] = n, Browser.URLObject.revokeObjectURL(a), t && t(e)
                    }, u.onerror = function(e) {
                        console.log("Image " + a + " could not be decoded"), n && n()
                    }, u.src = a
                }, Module.preloadPlugins.push(r);
                var t = {};
                t.canHandle = function(e) {
                    return !Module.noAudioDecoding && e.substr(-4) in {
                        ".ogg": 1,
                        ".wav": 1,
                        ".mp3": 1
                    }
                }, t.handle = function(e, r, t, n) {
                    function o(n) {
                        a || (a = !0, Module.preloadedAudios[r] = n, t && t(e))
                    }

                    function i() {
                        a || (a = !0, Module.preloadedAudios[r] = new Audio, n && n())
                    }
                    var a = !1;
                    if (!Browser.hasBlobConstructor) return i();
                    try {
                        var u = new Blob([e], {
                            type: Browser.getMimetype(r)
                        })
                    } catch (e) {
                        return i()
                    }
                    var s = Browser.URLObject.createObjectURL(u),
                        l = new Audio;
                    l.addEventListener("canplaythrough", function() {
                        o(l)
                    }, !1), l.onerror = function(t) {
                        a || (console.log("warning: browser could not fully decode audio " + r + ", trying slower base64 approach"), l.src = "data:audio/x-" + r.substr(-3) + ";base64," + function(e) {
                            for (var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = "", n = 0, o = 0, i = 0; i < e.length; i++)
                                for (n = n << 8 | e[i], o += 8; o >= 6;) {
                                    var a = n >> o - 6 & 63;
                                    o -= 6, t += r[a]
                                }
                            return 2 == o ? (t += r[(3 & n) << 4], t += "==") : 4 == o && (t += r[(15 & n) << 2], t += "="), t
                        }(e), o(l))
                    }, l.src = s, Browser.safeSetTimeout(function() {
                        o(l)
                    }, 1e4)
                }, Module.preloadPlugins.push(t);
                var n = Module.canvas;
                n && (n.requestPointerLock = n.requestPointerLock || n.mozRequestPointerLock || n.webkitRequestPointerLock || n.msRequestPointerLock || function() {}, n.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || function() {}, n.exitPointerLock = n.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", e, !1), document.addEventListener("mozpointerlockchange", e, !1), document.addEventListener("webkitpointerlockchange", e, !1), document.addEventListener("mspointerlockchange", e, !1), Module.elementPointerLock && n.addEventListener("click", function(e) {
                    !Browser.pointerLock && Module.canvas.requestPointerLock && (Module.canvas.requestPointerLock(), e.preventDefault())
                }, !1))
            }
        },
        createContext: function(e, r, t, n) {
            if (r && Module.ctx && e == Module.canvas) return Module.ctx;
            var o, i;
            if (r) {
                var a = {
                    antialias: !1,
                    alpha: !1
                };
                if (n)
                    for (var u in n) a[u] = n[u];
                i = GL.createContext(e, a), i && (o = GL.getContext(i).GLctx)
            } else o = e.getContext("2d");
            return o ? (t && (r || assert("undefined" == typeof GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = o, r && GL.makeContextCurrent(i), Module.useWebGL = r, Browser.moduleContextCreatedCallbacks.forEach(function(e) {
                e()
            }), Browser.init()), o) : null
        },
        destroyContext: function(e, r, t) {},
        fullscreenHandlersInstalled: !1,
        lockPointer: void 0,
        resizeCanvas: void 0,
        requestFullscreen: function(e, r, t) {
            function n() {
                Browser.isFullscreen = !1;
                var e = o.parentNode;
                (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === e ? (o.exitFullscreen = document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitCancelFullScreen || function() {}, o.exitFullscreen = o.exitFullscreen.bind(document), Browser.lockPointer && o.requestPointerLock(), Browser.isFullscreen = !0, Browser.resizeCanvas && Browser.setFullscreenCanvasSize()) : (e.parentNode.insertBefore(o, e), e.parentNode.removeChild(e), Browser.resizeCanvas && Browser.setWindowedCanvasSize()), Module.onFullScreen && Module.onFullScreen(Browser.isFullscreen), Module.onFullscreen && Module.onFullscreen(Browser.isFullscreen), Browser.updateCanvasDimensions(o)
            }
            Browser.lockPointer = e, Browser.resizeCanvas = r, Browser.vrDevice = t, void 0 === Browser.lockPointer && (Browser.lockPointer = !0), void 0 === Browser.resizeCanvas && (Browser.resizeCanvas = !1), void 0 === Browser.vrDevice && (Browser.vrDevice = null);
            var o = Module.canvas;
            Browser.fullscreenHandlersInstalled || (Browser.fullscreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", n, !1), document.addEventListener("mozfullscreenchange", n, !1), document.addEventListener("webkitfullscreenchange", n, !1), document.addEventListener("MSFullscreenChange", n, !1));
            var i = document.createElement("div");
            o.parentNode.insertBefore(i, o), i.appendChild(o), i.requestFullscreen = i.requestFullscreen || i.mozRequestFullScreen || i.msRequestFullscreen || (i.webkitRequestFullscreen ? function() {
                i.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            } : null) || (i.webkitRequestFullScreen ? function() {
                i.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            } : null), t ? i.requestFullscreen({
                vrDisplay: t
            }) : i.requestFullscreen()
        },
        requestFullScreen: function(e, r, t) {
            return Module.printErr("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead."), Browser.requestFullScreen = function(e, r, t) {
                return Browser.requestFullscreen(e, r, t)
            }, Browser.requestFullscreen(e, r, t)
        },
        nextRAF: 0,
        fakeRequestAnimationFrame: function(e) {
            var r = Date.now();
            if (0 === Browser.nextRAF) Browser.nextRAF = r + 1e3 / 60;
            else
                for (; r + 2 >= Browser.nextRAF;) Browser.nextRAF += 1e3 / 60;
            var t = Math.max(Browser.nextRAF - r, 0);
            setTimeout(e, t)
        },
        requestAnimationFrame: function(e) {
            "undefined" == typeof window ? Browser.fakeRequestAnimationFrame(e) : (window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || Browser.fakeRequestAnimationFrame), window.requestAnimationFrame(e))
        },
        safeCallback: function(e) {
            return function() {
                if (!ABORT) return e.apply(null, arguments)
            }
        },
        allowAsyncCallbacks: !0,
        queuedAsyncCallbacks: [],
        pauseAsyncCallbacks: function() {
            Browser.allowAsyncCallbacks = !1
        },
        resumeAsyncCallbacks: function() {
            if (Browser.allowAsyncCallbacks = !0, Browser.queuedAsyncCallbacks.length > 0) {
                var e = Browser.queuedAsyncCallbacks;
                Browser.queuedAsyncCallbacks = [], e.forEach(function(e) {
                    e()
                })
            }
        },
        safeRequestAnimationFrame: function(e) {
            return Browser.requestAnimationFrame(function() {
                ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
            })
        },
        safeSetTimeout: function(e, r) {
            return Module.noExitRuntime = !0, setTimeout(function() {
                ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
            }, r)
        },
        safeSetInterval: function(e, r) {
            return Module.noExitRuntime = !0, setInterval(function() {
                ABORT || Browser.allowAsyncCallbacks && e()
            }, r)
        },
        getMimetype: function(e) {
            return {
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                bmp: "image/bmp",
                ogg: "audio/ogg",
                wav: "audio/wav",
                mp3: "audio/mpeg"
            } [e.substr(e.lastIndexOf(".") + 1)]
        },
        getUserMedia: function(e) {
            window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia), window.getUserMedia(e)
        },
        getMovementX: function(e) {
            return e.movementX || e.mozMovementX || e.webkitMovementX || 0
        },
        getMovementY: function(e) {
            return e.movementY || e.mozMovementY || e.webkitMovementY || 0
        },
        getMouseWheelDelta: function(e) {
            var r = 0;
            switch (e.type) {
                case "DOMMouseScroll":
                    r = e.detail;
                    break;
                case "mousewheel":
                    r = e.wheelDelta;
                    break;
                case "wheel":
                    r = e.deltaY;
                    break;
                default:
                    throw "unrecognized mouse wheel event: " + e.type
            }
            return r
        },
        mouseX: 0,
        mouseY: 0,
        mouseMovementX: 0,
        mouseMovementY: 0,
        touches: {},
        lastTouches: {},
        calculateMouseEvent: function(e) {
            if (Browser.pointerLock) "mousemove" != e.type && "mozMovementX" in e ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(e), Browser.mouseMovementY = Browser.getMovementY(e)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
            else {
                var r = Module.canvas.getBoundingClientRect(),
                    t = Module.canvas.width,
                    n = Module.canvas.height,
                    o = void 0 !== window.scrollX ? window.scrollX : window.pageXOffset,
                    i = void 0 !== window.scrollY ? window.scrollY : window.pageYOffset;
                if ("touchstart" === e.type || "touchend" === e.type || "touchmove" === e.type) {
                    var a = e.touch;
                    if (void 0 === a) return;
                    var u = a.pageX - (o + r.left),
                        s = a.pageY - (i + r.top);
                    u *= t / r.width, s *= n / r.height;
                    var l = {
                        x: u,
                        y: s
                    };
                    if ("touchstart" === e.type) Browser.lastTouches[a.identifier] = l, Browser.touches[a.identifier] = l;
                    else if ("touchend" === e.type || "touchmove" === e.type) {
                        var c = Browser.touches[a.identifier];
                        c || (c = l), Browser.lastTouches[a.identifier] = c, Browser.touches[a.identifier] = l
                    }
                    return
                }
                var d = e.pageX - (o + r.left),
                    _ = e.pageY - (i + r.top);
                d *= t / r.width, _ *= n / r.height, Browser.mouseMovementX = d - Browser.mouseX, Browser.mouseMovementY = _ - Browser.mouseY, Browser.mouseX = d, Browser.mouseY = _
            }
        },
        asyncLoad: function(e, r, t, n) {
            var o = n ? "" : getUniqueRunDependency("al " + e);
            Module.readAsync(e, function(t) {
                assert(t, 'Loading data file "' + e + '" failed (no arrayBuffer).'), r(new Uint8Array(t)), o && removeRunDependency(o)
            }, function(r) {
                if (!t) throw 'Loading data file "' + e + '" failed.';
                t()
            }), o && addRunDependency(o)
        },
        resizeListeners: [],
        updateResizeListeners: function() {
            var e = Module.canvas;
            Browser.resizeListeners.forEach(function(r) {
                r(e.width, e.height)
            })
        },
        setCanvasSize: function(e, r, t) {
            var n = Module.canvas;
            Browser.updateCanvasDimensions(n, e, r), t || Browser.updateResizeListeners()
        },
        windowedWidth: 0,
        windowedHeight: 0,
        setFullscreenCanvasSize: function() {
            if ("undefined" != typeof SDL) {
                var e = HEAPU32[SDL.screen >> 2];
                e |= 8388608, HEAP32[SDL.screen >> 2] = e
            }
            Browser.updateResizeListeners()
        },
        setWindowedCanvasSize: function() {
            if ("undefined" != typeof SDL) {
                var e = HEAPU32[SDL.screen >> 2];
                e &= -8388609, HEAP32[SDL.screen >> 2] = e
            }
            Browser.updateResizeListeners()
        },
        updateCanvasDimensions: function(e, r, t) {
            r && t ? (e.widthNative = r, e.heightNative = t) : (r = e.widthNative, t = e.heightNative);
            var n = r,
                o = t;
            if (Module.forcedAspectRatio && Module.forcedAspectRatio > 0 && (n / o < Module.forcedAspectRatio ? n = Math.round(o * Module.forcedAspectRatio) : o = Math.round(n / Module.forcedAspectRatio)), (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === e.parentNode && "undefined" != typeof screen) {
                var i = Math.min(screen.width / n, screen.height / o);
                n = Math.round(n * i), o = Math.round(o * i)
            }
            Browser.resizeCanvas ? (e.width != n && (e.width = n), e.height != o && (e.height = o), void 0 !== e.style && (e.style.removeProperty("width"), e.style.removeProperty("height"))) : (e.width != r && (e.width = r), e.height != t && (e.height = t), void 0 !== e.style && (n != r || o != t ? (e.style.setProperty("width", n + "px", "important"), e.style.setProperty("height", o + "px", "important")) : (e.style.removeProperty("width"), e.style.removeProperty("height"))))
        },
        wgetRequests: {},
        nextWgetRequestHandle: 0,
        getNextWgetRequestHandle: function() {
            var e = Browser.nextWgetRequestHandle;
            return Browser.nextWgetRequestHandle++, e
        }
    },
    _environ = STATICTOP;
STATICTOP += 16;
var ENV = {},
    cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_STATIC),
    __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
if (FS.staticInit(), __ATINIT__.unshift(function() {
        Module.noFSInit || FS.init.initialized || FS.init()
    }), __ATMAIN__.push(function() {
        FS.ignorePermissions = !1
    }), __ATEXIT__.push(function() {
        FS.quit()
    }), __ATINIT__.unshift(function() {
        TTY.init()
    }), __ATEXIT__.push(function() {
        TTY.shutdown()
    }), ENVIRONMENT_IS_NODE) {
    var fs = require("fs"),
        NODEJS_PATH = require("path");
    NODEFS.staticInit()
}
_emscripten_get_now = ENVIRONMENT_IS_NODE ? function() {
    var e = process.hrtime();
    return 1e3 * e[0] + e[1] / 1e6
} : "undefined" != typeof dateNow ? dateNow : "object" == typeof self && self.performance && "function" == typeof self.performance.now ? function() {
    return self.performance.now()
} : "object" == typeof performance && "function" == typeof performance.now ? function() {
    return performance.now()
} : Date.now, Module.requestFullScreen = function(e, r, t) {
    Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."), Module.requestFullScreen = Module.requestFullscreen, Browser.requestFullScreen(e, r, t)
}, Module.requestFullscreen = function(e, r, t) {
    Browser.requestFullscreen(e, r, t)
}, Module.requestAnimationFrame = function(e) {
    Browser.requestAnimationFrame(e)
}, Module.setCanvasSize = function(e, r, t) {
    Browser.setCanvasSize(e, r, t)
}, Module.pauseMainLoop = function() {
    Browser.mainLoop.pause()
}, Module.resumeMainLoop = function() {
    Browser.mainLoop.resume()
}, Module.getUserMedia = function() {
    Browser.getUserMedia()
}, Module.createContext = function(e, r, t, n) {
    return Browser.createContext(e, r, t, n)
}, ___buildEnvironment(ENV), DYNAMICTOP_PTR = staticAlloc(4), STACK_BASE = STACKTOP = alignMemory(STATICTOP), STACK_MAX = STACK_BASE + TOTAL_STACK, DYNAMIC_BASE = alignMemory(STACK_MAX), HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE, staticSealed = !0, Module.wasmTableSize = 730, Module.wasmMaxTableSize = 730, Module.asmGlobalArg = {}, Module.asmLibraryArg = {
    abort: abort,
    enlargeMemory: enlargeMemory,
    getTotalMemory: getTotalMemory,
    abortOnCannotGrowMemory: abortOnCannotGrowMemory,
    __ZSt18uncaught_exceptionv: __ZSt18uncaught_exceptionv,
    ___atomic_fetch_add_8: ___atomic_fetch_add_8,
    ___atomic_load_8: ___atomic_load_8,
    ___atomic_store_8: ___atomic_store_8,
    ___lock: ___lock,
    ___map_file: ___map_file,
    ___setErrNo: ___setErrNo,
    ___syscall140: ___syscall140,
    ___syscall145: ___syscall145,
    ___syscall146: ___syscall146,
    ___syscall221: ___syscall221,
    ___syscall5: ___syscall5,
    ___syscall54: ___syscall54,
    ___syscall6: ___syscall6,
    ___syscall91: ___syscall91,
    ___unlock: ___unlock,
    _abort: _abort,
    _clock_gettime: _clock_gettime,
    _emscripten_async_call: _emscripten_async_call,
    _emscripten_memcpy_big: _emscripten_memcpy_big,
    _exit: _exit,
    _getenv: _getenv,
    _pthread_attr_init: _pthread_attr_init,
    _pthread_attr_setstacksize: _pthread_attr_setstacksize,
    _pthread_cond_destroy: _pthread_cond_destroy,
    _pthread_cond_signal: _pthread_cond_signal,
    _pthread_cond_wait: _pthread_cond_wait,
    _pthread_create: _pthread_create,
    _pthread_join: _pthread_join,
    _pthread_mutex_destroy: _pthread_mutex_destroy,
    _strftime_l: _strftime_l,
    DYNAMICTOP_PTR: DYNAMICTOP_PTR,
    STACKTOP: STACKTOP
};
var asm = Module.asm(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
Module.asm = asm;
var __GLOBAL__I_000101 = Module.__GLOBAL__I_000101 = function() {
        return Module.asm.__GLOBAL__I_000101.apply(null, arguments)
    },
    __GLOBAL__sub_I_bitbase_cpp = Module.__GLOBAL__sub_I_bitbase_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_bitbase_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_bitboard_cpp = Module.__GLOBAL__sub_I_bitboard_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_bitboard_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_endgame_cpp = Module.__GLOBAL__sub_I_endgame_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_endgame_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_evaluate_cpp = Module.__GLOBAL__sub_I_evaluate_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_evaluate_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_iostream_cpp = Module.__GLOBAL__sub_I_iostream_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_iostream_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_main_cpp = Module.__GLOBAL__sub_I_main_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_main_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_material_cpp = Module.__GLOBAL__sub_I_material_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_material_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_misc_cpp = Module.__GLOBAL__sub_I_misc_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_misc_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_movegen_cpp = Module.__GLOBAL__sub_I_movegen_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_movegen_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_movepick_cpp = Module.__GLOBAL__sub_I_movepick_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_movepick_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_pawns_cpp = Module.__GLOBAL__sub_I_pawns_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_pawns_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_position_cpp = Module.__GLOBAL__sub_I_position_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_position_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_psqt_cpp = Module.__GLOBAL__sub_I_psqt_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_psqt_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_search_cpp = Module.__GLOBAL__sub_I_search_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_search_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_thread_cpp = Module.__GLOBAL__sub_I_thread_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_thread_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_timeman_cpp = Module.__GLOBAL__sub_I_timeman_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_timeman_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_tt_cpp = Module.__GLOBAL__sub_I_tt_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_tt_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_uci_cpp = Module.__GLOBAL__sub_I_uci_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_uci_cpp.apply(null, arguments)
    },
    __GLOBAL__sub_I_ucioption_cpp = Module.__GLOBAL__sub_I_ucioption_cpp = function() {
        return Module.asm.__GLOBAL__sub_I_ucioption_cpp.apply(null, arguments)
    },
    ___errno_location = Module.___errno_location = function() {
        return Module.asm.___errno_location.apply(null, arguments)
    },
    _free = Module._free = function() {
        return Module.asm._free.apply(null, arguments)
    },
    _i64Add = Module._i64Add = function() {
        return Module.asm._i64Add.apply(null, arguments)
    },
    _main = Module._main = function() {
        return Module.asm._main.apply(null, arguments)
    },
    _malloc = Module._malloc = function() {
        return Module.asm._malloc.apply(null, arguments)
    },
    _uci_command = Module._uci_command = function() {
        return Module.asm._uci_command.apply(null, arguments)
    },
    getTempRet0 = Module.getTempRet0 = function() {
        return Module.asm.getTempRet0.apply(null, arguments)
    },
    setTempRet0 = Module.setTempRet0 = function() {
        return Module.asm.setTempRet0.apply(null, arguments)
    },
    stackAlloc = Module.stackAlloc = function() {
        return Module.asm.stackAlloc.apply(null, arguments)
    },
    stackRestore = Module.stackRestore = function() {
        return Module.asm.stackRestore.apply(null, arguments)
    },
    stackSave = Module.stackSave = function() {
        return Module.asm.stackSave.apply(null, arguments)
    },
    dynCall_ii = Module.dynCall_ii = function() {
        return Module.asm.dynCall_ii.apply(null, arguments)
    },
    dynCall_iii = Module.dynCall_iii = function() {
        return Module.asm.dynCall_iii.apply(null, arguments)
    },
    dynCall_iiii = Module.dynCall_iiii = function() {
        return Module.asm.dynCall_iiii.apply(null, arguments)
    },
    dynCall_iiiii = Module.dynCall_iiiii = function() {
        return Module.asm.dynCall_iiiii.apply(null, arguments)
    },
    dynCall_iiiiid = Module.dynCall_iiiiid = function() {
        return Module.asm.dynCall_iiiiid.apply(null, arguments)
    },
    dynCall_iiiiii = Module.dynCall_iiiiii = function() {
        return Module.asm.dynCall_iiiiii.apply(null, arguments)
    },
    dynCall_iiiiiid = Module.dynCall_iiiiiid = function() {
        return Module.asm.dynCall_iiiiiid.apply(null, arguments)
    },
    dynCall_iiiiiii = Module.dynCall_iiiiiii = function() {
        return Module.asm.dynCall_iiiiiii.apply(null, arguments)
    },
    dynCall_iiiiiiii = Module.dynCall_iiiiiiii = function() {
        return Module.asm.dynCall_iiiiiiii.apply(null, arguments)
    },
    dynCall_iiiiiiiii = Module.dynCall_iiiiiiiii = function() {
        return Module.asm.dynCall_iiiiiiiii.apply(null, arguments)
    },
    dynCall_iiiiij = Module.dynCall_iiiiij = function() {
        return Module.asm.dynCall_iiiiij.apply(null, arguments)
    },
    dynCall_v = Module.dynCall_v = function() {
        return Module.asm.dynCall_v.apply(null, arguments)
    },
    dynCall_vi = Module.dynCall_vi = function() {
        return Module.asm.dynCall_vi.apply(null, arguments)
    },
    dynCall_vii = Module.dynCall_vii = function() {
        return Module.asm.dynCall_vii.apply(null, arguments)
    },
    dynCall_viii = Module.dynCall_viii = function() {
        return Module.asm.dynCall_viii.apply(null, arguments)
    },
    dynCall_viiii = Module.dynCall_viiii = function() {
        return Module.asm.dynCall_viiii.apply(null, arguments)
    },
    dynCall_viiiii = Module.dynCall_viiiii = function() {
        return Module.asm.dynCall_viiiii.apply(null, arguments)
    },
    dynCall_viiiiii = Module.dynCall_viiiiii = function() {
        return Module.asm.dynCall_viiiiii.apply(null, arguments)
    },
    dynCall_viijii = Module.dynCall_viijii = function() {
        return Module.asm.dynCall_viijii.apply(null, arguments)
    };
Module.asm = asm, Module.ccall = ccall, ExitStatus.prototype = new Error, ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop, preloadStartTime = null,
    calledMain = !1;
if (dependenciesFulfilled = function e() {
        Module.calledRun || run(), Module.calledRun || (dependenciesFulfilled = e)
    }, Module.callMain = function(e) {
        e = e || [], ensureInitRuntime();
        var r = e.length + 1,
            t = stackAlloc(4 * (r + 1));
        HEAP32[t >> 2] = allocateUTF8OnStack(Module.thisProgram);
        for (var n = 1; n < r; n++) HEAP32[(t >> 2) + n] = allocateUTF8OnStack(e[n - 1]);
        HEAP32[(t >> 2) + r] = 0;
        try {
            exit(Module._main(r, t, 0), !0)
        } catch (e) {
            if (e instanceof ExitStatus) return;
            if ("SimulateInfiniteLoop" == e) return void(Module.noExitRuntime = !0);
            var o = e;
            e && "object" == typeof e && e.stack && (o = [e, e.stack]), Module.printErr("exception thrown: " + o), Module.quit(1, e)
        } finally {
            calledMain = !0
        }
    }, Module.run = run, Module.exit = exit, Module.abort = abort, Module.preInit)
    for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1), Module.noExitRuntime = !0, run();