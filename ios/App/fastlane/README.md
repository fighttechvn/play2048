fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios register_app

```sh
[bundle exec] fastlane ios register_app
```

Create the App ID + App Store Connect app record (one-time)

### ios build_ipa

```sh
[bundle exec] fastlane ios build_ipa
```

Archive + export a signed App Store .ipa (automatic signing)

### ios testflight_upload

```sh
[bundle exec] fastlane ios testflight_upload
```

Upload the built .ipa to TestFlight

### ios release_listing

```sh
[bundle exec] fastlane ios release_listing
```

Upload App Store listing (metadata + screenshots), no binary

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
