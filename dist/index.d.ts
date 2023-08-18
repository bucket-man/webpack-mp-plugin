import { Stats, Compiler } from 'webpack';

interface WabpackMpPluginOptions {
    isPreview: boolean;
    appid: string;
    key: string;
    ignores: string[];
    dir: string;
    output: string;
    page?: string;
    query?: string;
    scene?: number;
    version: string;
    desc: string;
}
interface CompilerExt extends Compiler {
    plugin: (name: string, fn: (state: Stats, cb: any) => void) => void;
}
declare class WabpackMpPlugin {
    config: WabpackMpPluginOptions;
    project: any;
    constructor(config: WabpackMpPluginOptions);
    apply(compiler: CompilerExt): void;
    pluginDoneFn(state: Stats, cb: any): void;
    mpciUpload(): Promise<void>;
    mpciPreview(): Promise<void>;
}

export { WabpackMpPlugin, WabpackMpPluginOptions };
