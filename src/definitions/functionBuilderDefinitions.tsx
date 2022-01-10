// TODOimport { translate } from '../../../50-systems/TranslationsSystem/translate';
import { FunctionBuilderDefinition } from '../interfaces/FunctionBuilderFunction';

export const functionBuilderDefinitions: { [key: string]: FunctionBuilderDefinition } = {
    // TODO: Split in multiple pieces
    x: {
        title: 'x',
        variables: {},
        func: (x, _args) => {
            return x;
        },
    },
    c1: {
        title: '1',
        constant: 1,
    },
    pi: {
        title: 'π',
        constant: Math.PI,
    },
    e: {
        title: 'e',
        constant: Math.E,
    },
    phi: {
        title: 'φ',
        constant: 1.6180339887,
    },
    add: {
        title: '$a + $b',
        variables: {
            a: {
                title: 'a',
            },
            b: {
                title: 'b',
            },
        },
        func: (_x, { a, b }) => {
            return a + b;
        },
    },
    subtract: {
        title: '$a - $b',
        variables: {
            a: {
                title: 'a',
            },
            b: {
                title: 'b',
            },
        },
        func: (_x, { a, b }) => {
            return a - b;
        },
    },
    multiply: {
        title: '$a * $b',
        variables: {
            a: {
                title: 'a',
            },
            b: {
                title: 'b',
            },
        },
        func: (_x, { a, b }) => {
            return a * b;
        },
    },
    fract: {
        title: '$a / $b',
        variables: {
            a: {
                title: 'a',
            },
            b: {
                title: 'b',
            },
        },
        func: (_x, { a, b }) => {
            return a / b;
        },
    },

    pow: {
        title: '$a<sup>$base</sup>',
        variables: {
            base: {
                // TODO: Differ shortcut vs full
                title: 'b', // TODO:,translate(`FunctionBuilder / pow / base`, 'exponent'),
            },
            a: {
                title: 'a',
            },
        },
        func: (_x, { a, base }) => {
            return Math.pow(a, base);
        },
    },

    log: {
        title: 'log(  $base , $a )',
        variables: {
            base: {
                title: 'b', // TODO:translate(`FunctionBuilder / log / base`, 'základ'),
            },
            a: {
                title: 'a',
            },
        },
        func: (_x, { a, base }) => {
            return Math.log(a) / Math.log(base);
        },
    },

    wop: {
        title: '<sup>$base</sup>√( $a )',
        variables: {
            base: {
                title: 'b', // TODO:translate(`FunctionBuilder / wop / base`, 'základ'),
            },
            a: {
                title: 'a',
            },
        },
        func: (_x, { a, base }) => {
            return Math.pow(a, 1 / base);
        },
    },
    // Misc common

    abs: {
        title: 'abs($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.abs(a);
        },
    },
    round: {
        title: 'round($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.round(a);
        },
    },

    // Goniometric
    sin: {
        title: 'sin($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.sin(a);
        },
    },
    cos: {
        title: 'cos($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.cos(a);
        },
    },
    tan: {
        title: 'tan($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.tan(a);
        },
    },
    cotg: {
        title: 'cotg($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.tan(1 / a);
        },
    },
    // Hyperbolic
    sinh: {
        title: 'sinh($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.sinh(a);
        },
    },
    cosh: {
        title: 'cosh($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.cosh(a);
        },
    },
    tanh: {
        title: 'tanh($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.tanh(a);
        },
    },
    cotgh: {
        title: 'cotgh($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.tanh(1 / a);
        },
    },
    // Cyklometric (Inverse Goniometric)
    asin: {
        title: 'sin<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.asin(a);
        },
    },
    acos: {
        title: 'cos<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.acos(a);
        },
    },
    atan: {
        title: 'tan<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.atan(a);
        },
    },
    // Inverse Hyperbolic
    asinh: {
        title: 'sinh<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.asinh(a);
        },
    },
    acosh: {
        title: 'cosh<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.acosh(a);
        },
    },
    atanh: {
        title: 'tanh<sup>-1</sup>($a)',
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            return Math.atanh(a);
        },
    },

    //------------------------------------------------------

    // *TODO: How to do constants?
    // *TODO: constant+a/b
    // ?TODO: Logistic
    // *TODO: Magic triangle - log, power,...
    // ?TODO: cotg
    // *TODO: sinh, cosh,...
    // *TODO: sin<sup>-1</sup>

    /*
    Note: big nice to have

    derivative: {
        title: `∂($a)`,
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            // TODO: Previous values
            // TODO:
            return 0;
        },
    },

    integral: {
        title: `∫($a)`,
        variables: {
            a: {
                title: 'a',
            },
        },
        func: (_x, { a }) => {
            // TODO: Previous values
            // TODO:
            return 0;
        },
    },
    */
};
