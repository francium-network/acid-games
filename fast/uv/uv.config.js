self.__uv$config = {
    prefix: 'theserviceworkerscriptscope/uv/service/',
    bare: 'thebareservernodeurl',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: 'theserviceworkerscriptscope/uv/uv.handler.js',
    bundle: 'theserviceworkerscriptscope/uv/uv.bundle.js',
    config: 'theserviceworkerscriptscope/uv/uv.config.js',
    sw: 'theserviceworkerscriptscope/uv/uv.sw.js',
};
