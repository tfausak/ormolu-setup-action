# ormolu-setup-action

This action installs the `ormolu` executable from the [Ormolu][] project,
which can be used to format Haskell modules (`*.hs` files).

[Ormolu]: https://github.com/tweag/ormolu

## Usage

Basic usage:

``` yaml
jobs:
  ormolu:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: tfausak/ormolu-setup-action@v1
      - run: ormolu --mode check Example.hs
```

Specifying a version:

``` yaml
jobs:
  ormolu:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: tfausak/ormolu-setup-action@v1
        with:
          version: 0.8.0.1
      - run: ormolu --mode check Example.hs
```

## Inputs

- `token`: Optional, defaults to `${{ github.token }}`. The token to use when
  communicating with GitHub's API to get the latest release of Ormolu. If this
  is unset, the API request will be unauthenticated and may be rate limited.

- `version`: Optional, defaults to `latest`. The version of Ormolu to use. Find
  versions on [the releases page][].

[the releases page]: https://github.com/tweag/ormolu/releases
