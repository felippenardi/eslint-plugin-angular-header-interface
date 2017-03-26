# eslint-plugin-angular-header-interface

Enforce angular components to have a strict interface definition on the top.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-angular-header-interface`:

```
$ npm install eslint-plugin-angular-header-interface --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-angular-header-interface` globally.

## Usage

Add `angular-header-interface` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "angular-header-interface"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "angular-header-interface/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





