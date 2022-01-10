import { IModuleManifestAuthor } from '@collboard/modules-sdk/types/50-systems/ModuleStore/interfaces/IModuleManifest';

export const Authors: Record<string, IModuleManifestAuthor> = {
    hejny: {
        name: 'Pavol Hejný',
        email: 'pavol.hejny@collboard.com',
        url: 'https://www.pavolhejny.com/',
    },
    rosecky: {
        /* @roseckyk Probbably change to what do you want */
        name: 'Jonáš Rosecký',
        email: 'jonas.rosecky@collboard.com',
        url: 'https://www.xrosecky.cz',
    },
    firchova: {
        name: 'Alena Firchová',
        email: 'me+alena@pavolhejny.com',
    },
};
