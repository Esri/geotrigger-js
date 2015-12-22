# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.0.2] - 2014-12-21
### Added
* proxies are now bypassed in CORS supported browsers (unless new option `ignoreCORS` is set to `true`)
* set up automated continuous integration testing
* release script to automate tagging releases on github/npm

### Fixed
* removed minified source from version control
* reformatted changelog
* tokens are now passed along in query parameters

## [1.0.1] - 2014-10-10
### Fixed
* Change token & device registration URLs to use load balancer ([#39](https://github.com/Esri/geotrigger-js/pull/39))

## [1.0.0] - 2014-2-21
### Added
* tracking headers for usage reporting

## [0.1.5] - 2013-12-31
### Added
* test config
* `authentication:restored` event

### Fixed
* Fixed a bug where a session created with `clientId` and a `refreshToken` would not properly reauthenticate with AGO if a session expired.

## [0.1.4] - 2013-11-20
### Fixed
* Fix bug where http errors without JSON responses would not be handled

## [0.1.3] - 2013-11-20
### Fixed
* Fix bug where http errors would not be handled

## [0.1.2] - 2013-11-19

First public release

## 0.1.0 - 2013-11-19
### Fixed
* Bump verion to prep for beta release of the Geotrigger Service


[Unreleased]: https://github.com/Esri/geotrigger-js/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/Esri/geotrigger-js/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Esri/geotrigger-js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Esri/geotrigger-js/compare/v0.1.5...v1.0.0
[0.1.5]: https://github.com/Esri/geotrigger-js/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/Esri/geotrigger-js/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/Esri/geotrigger-js/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Esri/geotrigger-js/compare/v0.1.0...v0.1.2

