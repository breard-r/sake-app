[//]: # (Copyright 2023 Rodolphe Bréard <rodolphe@breard.tf>)

[//]: # (Copying and distribution of this file, with or without modification,)
[//]: # (are permitted in any medium without royalty provided the copyright)
[//]: # (notice and this notice are preserved.  This file is offered as-is,)
[//]: # (without any warranty.)

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added
- Possibility to set a default account
- Dark mode
- Use the browser's preferred language if available

### Changed
- The style has been entirely reworked using Bootstrap instead of Bulma
- It is now impossible to include the separator in the dedicated name
- When adding a new account, error messages are displayed alongside each affected elements whenever possible
- By default, the new sub-address form reset button switches to the default account

## Fixed
- Invalid preferences are now automatically corrected
- It is now impossible to add the same account twice


## [0.3.0] - 2023-08-25

### Added
- The main view now includes a reset button
- An error message is now displayed if JavaScript is disabled

### Changed
- Secret keys are now restricted to 128 bits (16 bytes) or 256 bits (32 bytes)
- The local part cannot contain the separator
- The HTML lang attribute is now set to the appropriate language


## [0.2.0] - 2023-08-11

### Added
- The "About" page
- French translation

### Changed
- Account deletions has been moved to a dedicated page
- Error handling has been improved
- All Bulma components are included

### Fixed
- The QR code scanner now works with strict CSP


## [0.1.0] - 2023-08-01

### Added

- Initial application with a limited set of functionalities.
