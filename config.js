[
    {
        "input": "packages\\render\\index.ts",
        "output": [
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\render\\dist\\cjs\\index.js",
                "format": "cjs",
                "freeze": false,
                "sourcemap": true
            },
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\render\\dist\\esm\\index.js",
                "format": "esm",
                "freeze": false,
                "sourcemap": true
            }
        ],
        "external": [
            "pixi.js"
        ],
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            }
        ]
    },
    {
        "input": "packages\\render\\index.ts",
        "output": [
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\render\\dist\\cjs\\index.min.js",
                "format": "cjs",
                "freeze": false,
                "sourcemap": true
            },
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\render\\dist\\esm\\index.min.js",
                "format": "esm",
                "freeze": false,
                "sourcemap": true
            }
        ],
        "external": [
            "pixi.js"
        ],
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            },
            {
                "name": "terser"
            }
        ]
    },
    {
        "input": "packages\\render\\index.ts",
        "external": [
            "@anxi/render",
            "@anxi/core"
        ],
        "output": [
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */\nthis.ANXI = this.ANXI || {};",
                "file": "packages\\render\\dist\\browser\\index.js",
                "format": "iife",
                "freeze": false,
                "globals": {
                    "@anxi/render": "ANXI",
                    "@anxi/core": "ANXI"
                },
                "name": "_anxi_render",
                "footer": "Object.assign(this.ANXI, _anxi_render);",
                "sourcemap": true
            }
        ],
        "treeshake": false,
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            }
        ]
    },
    {
        "input": "packages\\render\\index.ts",
        "external": [
            "@anxi/render",
            "@anxi/core"
        ],
        "output": [
            {
                "banner": "/*!\n * @anxi/render - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/render is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */\nthis.ANXI = this.ANXI || {};",
                "file": "packages\\render\\dist\\browser\\index.min.js",
                "format": "iife",
                "freeze": false,
                "globals": {
                    "@anxi/render": "ANXI",
                    "@anxi/core": "ANXI"
                },
                "name": "_anxi_render",
                "footer": "Object.assign(this.ANXI, _anxi_render);",
                "sourcemap": true
            }
        ],
        "treeshake": false,
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            },
            {
                "name": "terser"
            }
        ]
    },
    {
        "input": "packages\\core\\index.ts",
        "output": [
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\core\\dist\\cjs\\index.js",
                "format": "cjs",
                "freeze": false,
                "sourcemap": true
            },
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\core\\dist\\esm\\index.js",
                "format": "esm",
                "freeze": false,
                "sourcemap": true
            }
        ],
        "external": [
            "@anxi/render"
        ],
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            }
        ]
    },
    {
        "input": "packages\\core\\index.ts",
        "output": [
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\core\\dist\\cjs\\index.min.js",
                "format": "cjs",
                "freeze": false,
                "sourcemap": true
            },
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */",
                "file": "packages\\core\\dist\\esm\\index.min.js",
                "format": "esm",
                "freeze": false,
                "sourcemap": true
            }
        ],
        "external": [
            "@anxi/render"
        ],
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            },
            {
                "name": "terser"
            }
        ]
    },
    {
        "input": "packages\\core\\index.ts",
        "external": [
            "@anxi/render",
            "@anxi/core"
        ],
        "output": [
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */\nthis.ANXI = this.ANXI || {};",
                "file": "packages\\core\\dist\\browser\\index.js",
                "format": "iife",
                "freeze": false,
                "globals": {
                    "@anxi/render": "ANXI",
                    "@anxi/core": "ANXI"
                },
                "name": "_anxi_core",
                "footer": "Object.assign(this.ANXI, _anxi_core);",
                "sourcemap": true
            }
        ],
        "treeshake": false,
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            }
        ]
    },
    {
        "input": "packages\\core\\index.ts",
        "external": [
            "@anxi/render",
            "@anxi/core"
        ],
        "output": [
            {
                "banner": "/*!\n * @anxi/core - v1.0.0\n * Compiled Thu, 25 Nov 2021 15:26:52 UTC\n *\n * @anxi/core is licensed under the MIT License.\n * http://www.opensource.org/licenses/mit-license\n */\nthis.ANXI = this.ANXI || {};",
                "file": "packages\\core\\dist\\browser\\index.min.js",
                "format": "iife",
                "freeze": false,
                "globals": {
                    "@anxi/render": "ANXI",
                    "@anxi/core": "ANXI"
                },
                "name": "_anxi_core",
                "footer": "Object.assign(this.ANXI, _anxi_core);",
                "sourcemap": true
            }
        ],
        "treeshake": false,
        "plugins": [
            {
                "name": "jscc"
            },
            {
                "name": "node-resolve"
            },
            {
                "name": "commonjs"
            },
            {
                "name": "json"
            },
            {
                "name": "rpt2"
            },
            {
                "name": "terser"
            }
        ]
    }
]